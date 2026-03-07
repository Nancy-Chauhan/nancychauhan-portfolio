---
title: "Designing Idempotent APIs"
description: "How to design APIs that are safe to retry, covering idempotency keys, HTTP method semantics, database strategies, and real-world patterns for building reliable distributed systems."
pubDate: 2021-06-20
tags: ["api-design", "distributed-systems"]
image: "/blog/idempotent-apis.webp"
externalUrl: "https://levelup.gitconnected.com/idempotency-in-api-design-bc4ea812a881"
---

In distributed systems, failures are not exceptional — they are expected. Networks drop packets, servers restart, and clients time out. When a client sends a request and does not receive a response, it faces a fundamental question: did the server process my request or not? The answer to this question determines whether retrying is safe or dangerous. This is where idempotency becomes critical.

An operation is idempotent if performing it multiple times produces the same result as performing it once. In the context of APIs, an idempotent endpoint ensures that even if a client sends the same request twice (intentionally or accidentally), the system ends up in the same state as if the request had been sent only once.

## HTTP Methods and Idempotency

The HTTP specification provides guidance on which methods should be idempotent:

| Method | Idempotent | Safe |
|--------|-----------|------|
| GET    | Yes       | Yes  |
| HEAD   | Yes       | Yes  |
| PUT    | Yes       | No   |
| DELETE | Yes       | No   |
| POST   | No        | No   |
| PATCH  | No        | No   |

**GET** and **HEAD** are both safe (they should not modify state) and idempotent. Fetching the same resource multiple times should always return the same result (assuming no concurrent modifications).

**PUT** is idempotent by design because it replaces the entire resource. Sending `PUT /users/123 {"name": "Nancy"}` twice leaves the resource in the same state as sending it once. The key insight is that PUT sets state absolutely rather than modifying it relatively.

**DELETE** is idempotent because deleting a resource that is already deleted should not produce an error — it should simply acknowledge that the resource does not exist. Returning 404 on subsequent deletes is acceptable and idempotent.

**POST** is the tricky one. It is used for creating resources and triggering actions, and by default it is not idempotent. Sending `POST /payments` twice could create two payments. This is where idempotency keys come in.

## Idempotency Keys

An idempotency key is a unique identifier that the client generates and sends with each request. The server uses this key to detect duplicate requests and return the same response without re-executing the operation.

Here is how it typically works:

1. The client generates a unique key (usually a UUID) and includes it in the request header:
   ```
   POST /api/payments
   Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
   Content-Type: application/json

   {"amount": 100, "currency": "USD", "recipient": "user_456"}
   ```

2. The server checks if it has already processed a request with this key.

3. If the key is new, the server processes the request and stores the result alongside the key.

4. If the key has been seen before, the server returns the stored result without re-processing.

### Implementation Considerations

**Storage:** You need a persistent store for idempotency keys and their associated responses. A relational database works well because you can use unique constraints to prevent race conditions:

```sql
CREATE TABLE idempotency_keys (
    key VARCHAR(255) PRIMARY KEY,
    request_path VARCHAR(255) NOT NULL,
    request_body TEXT,
    response_status INTEGER,
    response_body TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Expiration:** Idempotency keys should not live forever. A TTL of 24 to 48 hours is common. After that period, the same key can be used again (though generating a new one is better practice). You can clean up expired keys with a background job or use a database feature like PostgreSQL's `pg_cron`.

**Scope:** An idempotency key should be scoped to a specific user or API key. Two different users sending the same idempotency key should not interfere with each other.

**Fingerprinting:** Some implementations also store a hash of the request body alongside the idempotency key. If a client sends the same key with a different body, the server returns an error. This catches bugs where idempotency keys are accidentally reused.

## Handling Race Conditions

What happens if two requests with the same idempotency key arrive simultaneously? This is a real concern in systems with retry logic. The database unique constraint on the key handles this at the storage level, but you need to think about the application flow:

```
Request A (key=abc) → Starts processing
Request B (key=abc) → Arrives while A is still processing
```

There are two common approaches:

1. **Lock and wait:** Request B acquires a lock (or waits for one) and then checks the result once Request A completes. This is simpler but adds latency.

2. **Return 409 Conflict:** Request B immediately returns a conflict response, and the client retries after a short delay. This is more complex for clients but avoids holding connections open.

A practical approach is to use a database row lock:

```sql
INSERT INTO idempotency_keys (key, request_path, status)
VALUES ('abc', '/payments', 'processing')
ON CONFLICT (key) DO NOTHING;
```

If the insert succeeds, you own the key and can proceed. If it fails (conflict), you check the status of the existing record and either return the cached response or tell the client to retry.

## Making Non-Idempotent Operations Idempotent

Beyond idempotency keys, there are design patterns that make operations naturally idempotent:

### Use Absolute Values Instead of Relative Ones

Instead of:
```json
POST /accounts/123/adjust
{"amount": +50}
```

Use:
```json
PUT /accounts/123/balance
{"balance": 150}
```

The first approach is dangerous to retry — each retry adds another 50. The second is idempotent because it sets an absolute value.

### Use Unique Constraints

For create operations, you can use natural unique constraints to prevent duplicates:

```sql
INSERT INTO orders (order_reference, user_id, amount)
VALUES ('ORD-2021-001', 123, 99.99)
ON CONFLICT (order_reference) DO NOTHING;
```

If the client retries and the order already exists, the insert is silently ignored.

### State Machine Transitions

For operations that transition a resource through states (e.g., pending → processing → completed), make each transition idempotent by checking the current state:

```python
def complete_order(order_id):
    order = db.get(order_id)
    if order.status == 'completed':
        return order  # Already done, return current state
    if order.status != 'processing':
        raise InvalidStateError(f"Cannot complete order in {order.status} state")
    order.status = 'completed'
    db.save(order)
    return order
```

Calling `complete_order` twice on a processing order results in the same state as calling it once.

## Real-World Examples

**Stripe** is perhaps the best-known example of idempotency key support. Their API accepts an `Idempotency-Key` header on POST requests and caches results for 24 hours. They also store a fingerprint of the request body and return an error if the same key is used with different parameters.

**AWS** uses a `ClientToken` parameter in many of their APIs (EC2, S3, Step Functions) that serves the same purpose. This is critical because AWS API calls can fail due to network issues, and you need safe retries when launching instances or creating resources.

**Google Cloud** APIs use request IDs for idempotency, and their client libraries automatically generate and manage these IDs for retry-safe operations.

## Retry Strategies

Idempotent APIs go hand-in-hand with retry strategies. Once you know an operation is safe to retry, you still need to retry intelligently:

- **Exponential backoff:** Wait 1s, 2s, 4s, 8s between retries. This prevents overwhelming a struggling server.
- **Jitter:** Add randomness to backoff intervals to prevent thundering herd problems when many clients retry simultaneously.
- **Maximum retries:** Set a cap (typically 3-5 retries) to prevent infinite loops.
- **Retry only on transient errors:** Retry on 500, 502, 503, 504, and network timeouts. Do not retry on 400, 401, 403, or 422 — those indicate client errors that retrying will not fix.

## Conclusion

Designing idempotent APIs is not optional in distributed systems — it is a requirement for building reliable software. The investment in implementing idempotency keys and designing operations to be naturally idempotent pays dividends in reduced support tickets, fewer duplicate transactions, and happier users. Start by identifying the operations in your system where duplicate execution would cause harm, and work outward from there.
