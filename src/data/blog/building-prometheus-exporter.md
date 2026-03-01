---
title: "Building a Custom Prometheus Exporter in Go"
description: "A step-by-step guide to building a custom Prometheus exporter in Go, covering metric types, the collector interface, exposing metrics via HTTP, and creating Grafana dashboards."
pubDate: 2020-08-15
tags: ["observability", "prometheus", "go"]
---

Prometheus is the de facto standard for metrics collection in cloud native environments. While there are exporters for most common systems — node_exporter for host metrics, mysqld_exporter for MySQL, and so on — there are times when you need to expose custom metrics from your own applications or infrastructure. Building a custom Prometheus exporter in Go is surprisingly straightforward, and in this post I will walk through the entire process from understanding metric types to visualizing the results in Grafana.

## Prometheus Metric Types

Before writing code, you need to understand the four metric types that Prometheus supports:

### Counter

A counter is a monotonically increasing value. It only goes up (or resets to zero on restart). Use counters for things like total requests served, total errors, and total bytes processed.

```
http_requests_total{method="GET", path="/api/users"} 1542
http_requests_total{method="POST", path="/api/users"} 87
```

You should never use a counter for something that can go down, like current queue length or active connections.

### Gauge

A gauge is a value that can go up or down. Use gauges for things like current temperature, memory usage, active connections, and queue depth.

```
node_memory_available_bytes 4294967296
active_connections 42
```

### Histogram

A histogram samples observations (usually durations or sizes) and counts them in configurable buckets. It also provides a sum of all observed values and a total count. Histograms are ideal for measuring request latencies and response sizes.

```
http_request_duration_seconds_bucket{le="0.01"} 500
http_request_duration_seconds_bucket{le="0.05"} 900
http_request_duration_seconds_bucket{le="0.1"} 980
http_request_duration_seconds_bucket{le="+Inf"} 1000
http_request_duration_seconds_sum 45.2
http_request_duration_seconds_count 1000
```

### Summary

A summary is similar to a histogram but calculates streaming quantiles (e.g., p50, p95, p99) on the client side. Summaries are less commonly used because their quantiles cannot be aggregated across instances. Prefer histograms unless you have a specific reason to use summaries.

## Setting Up the Project

Let us build an exporter that collects metrics from a hypothetical service — say, a job queue system that we want to monitor.

```bash
mkdir job-queue-exporter && cd job-queue-exporter
go mod init github.com/nancychauhan/job-queue-exporter
go get github.com/prometheus/client_golang/prometheus
go get github.com/prometheus/client_golang/prometheus/promhttp
```

## The Simple Approach: Direct Instrumentation

The simplest way to expose metrics is to register them directly and update them in your application:

```go
package main

import (
    "net/http"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    jobsProcessed = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "job_queue_jobs_processed_total",
            Help: "Total number of jobs processed",
        },
        []string{"status", "queue"},
    )

    jobDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "job_queue_job_duration_seconds",
            Help:    "Duration of job processing in seconds",
            Buckets: prometheus.ExponentialBuckets(0.01, 2, 10),
        },
        []string{"queue"},
    )

    queueDepth = prometheus.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "job_queue_depth",
            Help: "Current number of jobs waiting in the queue",
        },
        []string{"queue"},
    )
)

func init() {
    prometheus.MustRegister(jobsProcessed)
    prometheus.MustRegister(jobDuration)
    prometheus.MustRegister(queueDepth)
}

func main() {
    http.Handle("/metrics", promhttp.Handler())
    http.ListenAndServe(":9090", nil)
}
```

This works well for instrumenting your own application code. You call `jobsProcessed.WithLabelValues("success", "default").Inc()` in your processing logic, and the metrics are exposed at `/metrics`.

## The Collector Interface

For a standalone exporter that pulls metrics from an external system, the collector interface gives you more control. It allows you to fetch data on demand — only when Prometheus scrapes — rather than continuously updating metrics.

```go
package main

import (
    "log"
    "net/http"

    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

// JobQueueCollector implements the prometheus.Collector interface
type JobQueueCollector struct {
    queueDepth    *prometheus.Desc
    jobsProcessed *prometheus.Desc
    jobDuration   *prometheus.Desc
    workerCount   *prometheus.Desc
}

func NewJobQueueCollector() *JobQueueCollector {
    return &JobQueueCollector{
        queueDepth: prometheus.NewDesc(
            "job_queue_depth",
            "Current number of jobs waiting in the queue",
            []string{"queue_name"},
            nil,
        ),
        jobsProcessed: prometheus.NewDesc(
            "job_queue_jobs_processed_total",
            "Total number of jobs processed",
            []string{"queue_name", "status"},
            nil,
        ),
        jobDuration: prometheus.NewDesc(
            "job_queue_job_duration_seconds",
            "Time spent processing jobs",
            []string{"queue_name"},
            nil,
        ),
        workerCount: prometheus.NewDesc(
            "job_queue_worker_count",
            "Number of active workers",
            []string{"queue_name"},
            nil,
        ),
    }
}

// Describe sends the descriptors of each metric to the provided channel
func (c *JobQueueCollector) Describe(ch chan<- *prometheus.Desc) {
    ch <- c.queueDepth
    ch <- c.jobsProcessed
    ch <- c.jobDuration
    ch <- c.workerCount
}

// Collect fetches metrics from the job queue system and sends them
func (c *JobQueueCollector) Collect(ch chan<- prometheus.Metric) {
    // In a real exporter, you would query your external system here
    queues := fetchQueueStats()

    for _, q := range queues {
        ch <- prometheus.MustNewConstMetric(
            c.queueDepth,
            prometheus.GaugeValue,
            float64(q.Depth),
            q.Name,
        )
        ch <- prometheus.MustNewConstMetric(
            c.jobsProcessed,
            prometheus.CounterValue,
            float64(q.Processed),
            q.Name, "success",
        )
        ch <- prometheus.MustNewConstMetric(
            c.jobsProcessed,
            prometheus.CounterValue,
            float64(q.Failed),
            q.Name, "failed",
        )
        ch <- prometheus.MustNewConstMetric(
            c.workerCount,
            prometheus.GaugeValue,
            float64(q.Workers),
            q.Name,
        )
    }
}

type QueueStats struct {
    Name      string
    Depth     int
    Processed int
    Failed    int
    Workers   int
}

func fetchQueueStats() []QueueStats {
    // Replace with actual API calls to your queue system
    return []QueueStats{
        {Name: "default", Depth: 42, Processed: 15234, Failed: 12, Workers: 5},
        {Name: "priority", Depth: 3, Processed: 892, Failed: 1, Workers: 2},
    }
}

func main() {
    collector := NewJobQueueCollector()
    prometheus.MustRegister(collector)

    http.Handle("/metrics", promhttp.Handler())
    log.Println("Starting exporter on :9191")
    log.Fatal(http.ListenAndServe(":9191", nil))
}
```

The key difference with the collector interface is that `Collect()` is called on every scrape. This means you can fetch fresh data from your external system each time Prometheus pulls metrics, rather than maintaining state continuously.

## Error Handling

A production exporter needs to handle errors gracefully. If the external system is unreachable, you should not crash the exporter. Instead, expose a metric indicating collection success or failure:

```go
var (
    scrapeSuccess = prometheus.NewDesc(
        "job_queue_scrape_success",
        "Whether the last scrape was successful (1 = success, 0 = failure)",
        nil, nil,
    )
)

func (c *JobQueueCollector) Collect(ch chan<- prometheus.Metric) {
    queues, err := fetchQueueStats()
    if err != nil {
        log.Printf("Error fetching queue stats: %v", err)
        ch <- prometheus.MustNewConstMetric(scrapeSuccess, prometheus.GaugeValue, 0)
        return
    }

    ch <- prometheus.MustNewConstMetric(scrapeSuccess, prometheus.GaugeValue, 1)
    // ... emit metrics as before
}
```

This pattern lets you set up an alert in Prometheus for when scrapes start failing.

## Configuring Prometheus

Add your exporter as a scrape target in `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'job-queue'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:9191']
        labels:
          environment: 'production'
```

For Kubernetes environments, you can use annotations-based service discovery instead of static configs, which makes your exporter automatically discoverable.

## Grafana Dashboard

Once metrics are flowing into Prometheus, you can build a Grafana dashboard. Here are some useful panels for our job queue exporter:

**Queue depth over time:**
```promql
job_queue_depth{queue_name="default"}
```

**Job processing rate (per second):**
```promql
rate(job_queue_jobs_processed_total{status="success"}[5m])
```

**Error rate percentage:**
```promql
rate(job_queue_jobs_processed_total{status="failed"}[5m])
/ rate(job_queue_jobs_processed_total[5m]) * 100
```

**Worker utilization:**
```promql
job_queue_worker_count / on(queue_name) group_left job_queue_max_workers * 100
```

Each of these queries can be added as a panel in Grafana with appropriate visualization — time series for rates, gauge panels for current values, and stat panels for summaries.

## Best Practices

1. **Follow the naming conventions.** Metrics should use snake_case, include the subsystem as a prefix, and end with the unit (`_seconds`, `_bytes`, `_total`).

2. **Keep cardinality under control.** Every unique combination of label values creates a new time series. Avoid labels with high cardinality (user IDs, request IDs, email addresses).

3. **Use `_total` suffix for counters.** This is a Prometheus convention that makes it clear the metric is a counter.

4. **Set appropriate scrape intervals.** 15 to 30 seconds is typical. More frequent scraping increases load on both the exporter and Prometheus.

5. **Add a `/health` endpoint** alongside `/metrics` for liveness probes in Kubernetes.

Building custom exporters is one of the most practical skills in the observability toolkit. Once you have the pattern down, you can expose metrics from virtually any system and gain visibility into parts of your infrastructure that were previously opaque.
