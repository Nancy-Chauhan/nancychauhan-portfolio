---
title: "Monitoring Java Web Applications with Prometheus"
description: "A practical guide to monitoring Java web applications using Prometheus, covering JMX metrics, Micrometer integration, custom metrics, alerting rules, and dashboard best practices."
pubDate: 2020-02-10
tags: ["observability", "java", "monitoring"]
---

Java web applications have a rich ecosystem of monitoring tools, but integrating them with modern observability platforms like Prometheus requires some thought. The JVM provides a wealth of metrics through JMX, frameworks like Spring Boot have built-in actuator endpoints, and Micrometer provides a vendor-neutral metrics facade. In this post, I will walk through how to tie these pieces together to build comprehensive monitoring for your Java applications.

## JVM Metrics via JMX

The Java Virtual Machine exposes a set of management interfaces through JMX (Java Management Extensions). These cover:

- **Memory:** Heap and non-heap memory usage, garbage collection statistics
- **Threads:** Thread counts, deadlock detection
- **Class loading:** Number of loaded and unloaded classes
- **CPU:** Process CPU time and system load
- **Garbage Collection:** Collection counts, durations, and memory pool sizes

Traditionally, JMX metrics are accessed through tools like JConsole or VisualVM. To expose them to Prometheus, you have two main options:

### JMX Exporter (Agent)

The Prometheus JMX Exporter is a Java agent that runs alongside your application and exposes JMX beans as Prometheus metrics:

```bash
java -javaagent:jmx_prometheus_javaagent.jar=9191:config.yaml -jar myapp.jar
```

The configuration file maps JMX beans to Prometheus metrics:

```yaml
# config.yaml
startDelaySeconds: 0
lowercaseOutputName: true
lowercaseOutputLabelNames: true

rules:
  # Standard JVM metrics
  - pattern: 'java.lang<type=Memory><HeapMemoryUsage>(\w+)'
    name: jvm_memory_heap_$1_bytes
    type: GAUGE

  - pattern: 'java.lang<type=GarbageCollector, name=(.+)><>CollectionCount'
    name: jvm_gc_collection_count_total
    labels:
      gc: '$1'
    type: COUNTER

  - pattern: 'java.lang<type=Threading><>ThreadCount'
    name: jvm_threads_current
    type: GAUGE

  # Application-specific MBeans
  - pattern: 'com.example<type=ConnectionPool, name=(.+)><>ActiveConnections'
    name: app_connection_pool_active
    labels:
      pool: '$1'
    type: GAUGE
```

The JMX Exporter is useful when you cannot modify the application code — for example, monitoring a third-party application or a legacy system.

### Micrometer (In-Application)

For applications you control, Micrometer is the better choice. Micrometer is a metrics instrumentation library for JVM-based applications that acts as a facade — you write your instrumentation code once, and Micrometer can export to Prometheus, Datadog, CloudWatch, or any other supported backend.

Spring Boot 2.x and later include Micrometer by default through the Actuator module.

## Setting Up Spring Boot with Prometheus

Add the dependencies to your `build.gradle`:

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'io.micrometer:micrometer-registry-prometheus'
}
```

Configure the actuator in `application.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, prometheus, metrics
  metrics:
    tags:
      application: ${spring.application.name}
    export:
      prometheus:
        enabled: true
  endpoint:
    prometheus:
      enabled: true
```

Now, hitting `/actuator/prometheus` returns all metrics in Prometheus exposition format. Out of the box, you get:

- JVM memory and GC metrics
- Thread pool metrics
- HTTP request metrics (count, duration, error rate)
- Database connection pool metrics (if using HikariCP)
- Logback metrics (log events by level)
- Tomcat/Jetty server metrics

## Custom Application Metrics

Beyond the built-in metrics, you should instrument your application's business logic. Micrometer makes this straightforward.

### Counters

Track events that only increase:

```java
@Service
public class OrderService {

    private final Counter ordersPlaced;
    private final Counter ordersFailed;

    public OrderService(MeterRegistry registry) {
        this.ordersPlaced = Counter.builder("orders.placed.total")
            .description("Total number of orders placed")
            .tag("type", "standard")
            .register(registry);

        this.ordersFailed = Counter.builder("orders.failed.total")
            .description("Total number of failed orders")
            .register(registry);
    }

    public Order placeOrder(OrderRequest request) {
        try {
            Order order = processOrder(request);
            ordersPlaced.increment();
            return order;
        } catch (Exception e) {
            ordersFailed.increment();
            throw e;
        }
    }
}
```

### Timers

Measure duration and count of operations:

```java
@Service
public class PaymentService {

    private final Timer paymentTimer;

    public PaymentService(MeterRegistry registry) {
        this.paymentTimer = Timer.builder("payment.processing.duration")
            .description("Payment processing time")
            .publishPercentiles(0.5, 0.95, 0.99)
            .publishPercentileHistogram()
            .register(registry);
    }

    public PaymentResult processPayment(PaymentRequest request) {
        return paymentTimer.record(() -> {
            // actual payment processing logic
            return gateway.charge(request);
        });
    }
}
```

### Gauges

Track values that can go up and down:

```java
@Component
public class QueueMetrics {

    public QueueMetrics(MeterRegistry registry, TaskQueue taskQueue) {
        Gauge.builder("task.queue.size", taskQueue, TaskQueue::size)
            .description("Current number of tasks in the queue")
            .register(registry);

        Gauge.builder("task.queue.workers.active", taskQueue, TaskQueue::activeWorkers)
            .description("Number of active workers processing tasks")
            .register(registry);
    }
}
```

### Using @Timed Annotation

For simpler cases, the `@Timed` annotation provides automatic timing:

```java
@RestController
public class UserController {

    @Timed(value = "users.search.duration", description = "User search time")
    @GetMapping("/api/users/search")
    public List<User> searchUsers(@RequestParam String query) {
        return userService.search(query);
    }
}
```

Note: You need to register a `TimedAspect` bean for `@Timed` to work outside of Spring MVC handlers:

```java
@Bean
public TimedAspect timedAspect(MeterRegistry registry) {
    return new TimedAspect(registry);
}
```

## Prometheus Configuration

Add your application as a scrape target:

```yaml
scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: /actuator/prometheus
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:8080']
```

In Kubernetes, you can use annotations for automatic discovery:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/actuator/prometheus"
```

## Essential Alerting Rules

Once metrics are flowing, set up alerts for critical conditions:

```yaml
groups:
  - name: java-application
    rules:
      # High error rate
      - alert: HighHttpErrorRate
        expr: |
          sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
          / sum(rate(http_server_requests_seconds_count[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High HTTP error rate (> 5%)"

      # High response latency
      - alert: HighResponseLatency
        expr: |
          histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95th percentile response time > 2 seconds"

      # JVM heap pressure
      - alert: HighHeapUsage
        expr: |
          jvm_memory_used_bytes{area="heap"}
          / jvm_memory_max_bytes{area="heap"} > 0.85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "JVM heap usage above 85% for 10 minutes"

      # Frequent GC
      - alert: HighGCPause
        expr: |
          rate(jvm_gc_pause_seconds_sum[5m])
          / rate(jvm_gc_pause_seconds_count[5m]) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Average GC pause time above 500ms"

      # Connection pool exhaustion
      - alert: ConnectionPoolExhaustion
        expr: |
          hikaricp_connections_active
          / hikaricp_connections_max > 0.9
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool > 90% utilized"
```

## Dashboard Best Practices

A well-organized Grafana dashboard for a Java application should have these sections:

**Request metrics (RED method):**
- Request rate: `rate(http_server_requests_seconds_count[5m])`
- Error rate: `rate(http_server_requests_seconds_count{status=~"5.."}[5m])`
- Duration: `histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))`

**JVM metrics:**
- Heap used vs max
- Non-heap memory
- GC pause frequency and duration
- Thread count (daemon vs non-daemon)

**Infrastructure metrics:**
- Database connection pool (active, idle, pending)
- HTTP client connection pool
- Cache hit/miss ratios

**Business metrics:**
- Orders processed per minute
- Payment success/failure rates
- Active users

The key principle is to organize dashboards from high-level health indicators at the top to detailed debugging information at the bottom. A developer responding to an alert should be able to start at the top and drill down to identify the root cause.

Monitoring is not a one-time setup but an ongoing practice. As your application evolves, your metrics and alerts should evolve with it. Start with the essentials, and expand your coverage as you learn what matters most for your system's reliability.
