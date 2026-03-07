---
title: "Introduction to Message Queues"
description: "An overview of message queuing patterns including pub/sub and point-to-point, with a comparison of RabbitMQ and Apache Kafka and guidance on choosing the right tool."
pubDate: 2020-05-20
tags: ["distributed-systems", "messaging"]
externalUrl: "https://nancy-chauhan.medium.com/"
---

Message queues are one of the most important building blocks in distributed systems. They decouple services, absorb traffic spikes, and enable asynchronous processing. If you have ever wondered why companies like LinkedIn, Netflix, and Uber rely so heavily on messaging infrastructure, this post is for you.

I want to cover the foundational concepts of message queuing, walk through the two primary messaging patterns, compare two of the most popular systems (RabbitMQ and Apache Kafka), and help you decide which one fits your use case.

## Why Message Queues?

Consider a simple e-commerce system. When a user places an order, the system needs to:

1. Save the order to the database
2. Send a confirmation email
3. Update inventory
4. Notify the shipping service
5. Update analytics

Without a message queue, the order service would need to call each of these downstream services synchronously. This creates several problems:

- **Tight coupling:** The order service needs to know about every downstream service.
- **Cascading failures:** If the email service is down, the entire order placement fails.
- **Latency accumulation:** The user waits while all downstream operations complete.
- **No buffering:** If the shipping service is slow, it directly slows down order placement.

A message queue solves all of these problems. The order service publishes an "order placed" event to the queue and returns immediately. Each downstream service consumes the event independently and at its own pace.

## Messaging Patterns

### Point-to-Point (Queue)

In the point-to-point pattern, a message is sent to a queue and consumed by exactly one consumer. If multiple consumers are listening on the same queue, the messages are distributed among them (competing consumers). Once a message is consumed and acknowledged, it is removed from the queue.

```
Producer → [Queue] → Consumer A
                   → Consumer B  (each message goes to only one consumer)
                   → Consumer C
```

**Use cases:**
- Task distribution (worker queues)
- Request-reply patterns
- Job processing where each job should execute exactly once

This pattern is natural for work distribution. For example, if you have a queue of image processing jobs, you want each image processed by exactly one worker.

### Publish/Subscribe (Pub/Sub)

In the pub/sub pattern, a message is published to a topic and delivered to all subscribers. Each subscriber receives a copy of every message.

```
Publisher → [Topic] → Subscriber A (gets all messages)
                   → Subscriber B (gets all messages)
                   → Subscriber C (gets all messages)
```

**Use cases:**
- Event broadcasting
- Fan-out scenarios (one event triggers multiple independent actions)
- Real-time notifications
- Event sourcing

Going back to our e-commerce example, when an order is placed, the email service, inventory service, and shipping service all need to know about it. Pub/sub lets each service independently subscribe to order events.

## RabbitMQ

RabbitMQ is a traditional message broker that implements the AMQP (Advanced Message Queuing Protocol). It is one of the most widely deployed message brokers and supports both point-to-point and pub/sub patterns.

### Core Concepts

- **Producer:** Sends messages to an exchange
- **Exchange:** Routes messages to queues based on rules (bindings)
- **Queue:** Stores messages until consumed
- **Consumer:** Receives messages from a queue
- **Binding:** Rules that determine how exchanges route messages to queues

### Exchange Types

RabbitMQ's exchange types provide flexible routing:

- **Direct exchange:** Routes messages to queues whose binding key matches the message's routing key exactly.
- **Fanout exchange:** Routes messages to all bound queues, ignoring routing keys. This is pure pub/sub.
- **Topic exchange:** Routes messages based on pattern matching between the routing key and the binding pattern. Supports wildcards (`*` for one word, `#` for zero or more words).
- **Headers exchange:** Routes based on message header attributes rather than routing keys.

### Strengths

- Mature and battle-tested with excellent documentation
- Rich routing capabilities through exchange types
- Supports message acknowledgments and delivery guarantees
- Built-in support for message priorities and TTL
- Plugin ecosystem (management UI, MQTT adapter, STOMP support)
- Good fit for complex routing scenarios

## Apache Kafka

Kafka is a distributed event streaming platform originally built at LinkedIn. While often called a "message queue," it is architecturally quite different from traditional brokers.

### Core Concepts

- **Producer:** Publishes records to topics
- **Topic:** A category or feed name to which records are published
- **Partition:** Topics are divided into partitions for parallelism and ordering
- **Consumer Group:** A group of consumers that collectively consume a topic, with each partition assigned to one consumer in the group
- **Offset:** A sequential ID that identifies each record within a partition
- **Broker:** A Kafka server that stores data and serves clients

### How Kafka Differs

The fundamental difference is that Kafka is a **distributed log**. Messages are appended to an immutable, ordered log and retained for a configurable period (hours, days, or indefinitely). Consumers track their position (offset) in the log and can rewind to re-process old messages.

This design has profound implications:

1. **Replay capability:** New consumers can start from the beginning and process the entire history. This is impossible with traditional queues where messages are deleted after consumption.
2. **Multiple consumer groups:** Each consumer group maintains its own offset, so multiple applications can independently consume the same topic without interfering with each other.
3. **Ordering guarantees:** Messages within a partition are strictly ordered. By using keys to determine partition assignment, you can ensure that all events for a given entity are processed in order.
4. **High throughput:** Kafka achieves very high throughput through sequential disk I/O, zero-copy transfers, and batching.

### Strengths

- Extremely high throughput (millions of messages per second)
- Durable message retention with replay capability
- Strong ordering guarantees within partitions
- Built-in support for stream processing (Kafka Streams, ksqlDB)
- Excellent for event sourcing and CQRS patterns
- Scales horizontally by adding partitions and brokers

## RabbitMQ vs Kafka: When to Use Each

| Criteria | RabbitMQ | Kafka |
|----------|----------|-------|
| Throughput | Moderate (tens of thousands/sec) | Very high (millions/sec) |
| Message retention | Until consumed | Configurable (time or size based) |
| Ordering | Per queue | Per partition |
| Routing | Flexible (exchanges) | Topic-based only |
| Replay | Not supported | Supported |
| Protocol | AMQP, MQTT, STOMP | Custom binary protocol |
| Complexity | Moderate | Higher operational complexity |

### Choose RabbitMQ when:

- You need complex routing logic (routing keys, headers, priorities)
- You want traditional task queues with competing consumers
- Your messages should be consumed once and discarded
- You need request-reply patterns
- You want a lower operational overhead for smaller deployments
- You need protocol flexibility (AMQP, MQTT for IoT)

### Choose Kafka when:

- You need very high throughput
- You want to replay messages or maintain an event log
- You are building event-driven architectures or event sourcing
- Multiple independent applications need to consume the same events
- You need strong ordering guarantees for related messages
- You want to build stream processing pipelines

## Other Options Worth Knowing

**Amazon SQS** is a fully managed queue service. It removes all operational burden but offers limited features compared to RabbitMQ or Kafka. Great for simple queue use cases in AWS.

**Amazon SNS + SQS** together provide a managed pub/sub plus queue combination that covers many use cases without managing brokers.

**NATS** is a lightweight, high-performance messaging system popular in cloud native environments. NATS JetStream adds persistence and streaming capabilities.

**Redis Streams** provide a Kafka-like log data structure in Redis. Good for lighter streaming use cases where you already have Redis in your stack.

## Practical Advice

1. **Start simple.** If you just need a task queue, even a Redis list with LPUSH/BRPOP might be enough. Do not reach for Kafka if a simple queue will do.

2. **Think about failure modes.** What happens when a consumer crashes mid-processing? Both RabbitMQ and Kafka support acknowledgment mechanisms, but they work differently. Understand them before going to production.

3. **Consider ordering requirements carefully.** If order matters, you need to understand how your chosen system handles it. In Kafka, ordering is per-partition. In RabbitMQ, ordering is per-queue but only with a single consumer.

4. **Monitor your queues.** Queue depth is one of the most important metrics in a distributed system. A growing queue means consumers cannot keep up, and you need to investigate.

5. **Plan for schema evolution.** Messages will change over time. Use a schema registry (like Confluent Schema Registry for Kafka) or version your message formats to handle evolution gracefully.

Message queues are foundational infrastructure, and understanding them well will make you a better distributed systems engineer.
