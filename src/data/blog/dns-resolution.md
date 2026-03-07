---
title: "How DNS Resolution Works"
description: "A comprehensive walkthrough of the DNS resolution process, from recursive resolvers to root servers, TLD servers, authoritative servers, caching, and TTL behavior."
pubDate: 2020-03-15
tags: ["networking", "infrastructure"]
externalUrl: "https://nancy-chauhan.medium.com/"
---

Every time you type a URL in your browser or your application makes an API call, a DNS resolution happens behind the scenes. DNS (Domain Name System) translates human-readable domain names like `example.com` into IP addresses like `93.184.216.34` that computers use to route traffic. Despite being one of the most fundamental pieces of internet infrastructure, DNS is often treated as a black box. In this post, I want to open that box and explain exactly what happens during a DNS resolution.

## The Big Picture

When your browser needs to resolve `www.example.com`, the query passes through several layers:

1. **Browser cache** — Has the browser resolved this domain recently?
2. **Operating system cache** — Has any application on this machine resolved it?
3. **Recursive resolver** — Usually provided by your ISP or a public resolver like Google (8.8.8.8) or Cloudflare (1.1.1.1)
4. **Root name servers** — The starting point for resolving any domain
5. **TLD name servers** — Responsible for top-level domains (.com, .org, .io)
6. **Authoritative name servers** — The definitive source for a specific domain's records

Each layer can short-circuit the process if it has a cached answer. In practice, most DNS queries are answered from cache within the first few layers. But let us trace a full resolution from scratch.

## Step-by-Step Resolution

Imagine you are visiting `blog.example.com` for the first time, and no cache exists anywhere in the chain.

### Step 1: The Stub Resolver

Your application calls a system function like `getaddrinfo()`, which delegates to the operating system's stub resolver. The stub resolver is a lightweight client that does not resolve names itself — it forwards the query to a configured recursive resolver.

On Linux, the recursive resolver address is configured in `/etc/resolv.conf`:
```
nameserver 1.1.1.1
nameserver 8.8.8.8
```

On macOS, it is configured in System Preferences under Network, and managed by `mDNSResponder`.

### Step 2: The Recursive Resolver

The recursive resolver (also called a caching resolver) does the heavy lifting. It receives your query for `blog.example.com` and resolves it by iterating through the DNS hierarchy.

First, it checks its own cache. If it has a recent answer, it returns it immediately. If not, it starts the iterative resolution process.

### Step 3: Root Name Servers

The recursive resolver sends a query to one of the 13 root name server clusters (labeled a.root-servers.net through m.root-servers.net). Despite there being only 13 logical root servers, anycast routing means there are hundreds of physical servers distributed globally.

The root server does not know the IP address of `blog.example.com`. What it does know is which servers are authoritative for the `.com` TLD. It responds with a referral:

```
;; AUTHORITY SECTION:
com.    172800  IN  NS  a.gtld-servers.net.
com.    172800  IN  NS  b.gtld-servers.net.
...

;; ADDITIONAL SECTION:
a.gtld-servers.net.  172800  IN  A  192.5.6.30
```

### Step 4: TLD Name Servers

The recursive resolver now queries the `.com` TLD server (e.g., `a.gtld-servers.net`). The TLD server knows which name servers are authoritative for `example.com` and responds with another referral:

```
;; AUTHORITY SECTION:
example.com.    172800  IN  NS  ns1.example.com.
example.com.    172800  IN  NS  ns2.example.com.

;; ADDITIONAL SECTION:
ns1.example.com.  172800  IN  A  198.51.100.1
ns2.example.com.  172800  IN  A  198.51.100.2
```

### Step 5: Authoritative Name Servers

Finally, the recursive resolver queries the authoritative name server for `example.com` (e.g., `ns1.example.com`). This server has the actual DNS records for the domain and responds with the answer:

```
;; ANSWER SECTION:
blog.example.com.  300  IN  A  203.0.113.50
```

The recursive resolver caches this result and returns it to the stub resolver, which returns it to your application. The entire process typically takes 20-120 milliseconds for an uncached query.

## DNS Record Types

While we focused on A records (IPv4 addresses) above, DNS supports many record types:

- **A** — Maps a name to an IPv4 address
- **AAAA** — Maps a name to an IPv6 address
- **CNAME** — Creates an alias from one name to another. `www.example.com CNAME example.com` means `www.example.com` is an alias for `example.com`
- **MX** — Specifies mail servers for the domain
- **TXT** — Arbitrary text, commonly used for SPF, DKIM, domain verification
- **NS** — Delegates a zone to specific name servers
- **SOA** — Start of Authority, contains zone metadata (serial number, refresh intervals)
- **SRV** — Service location records, used by some protocols for service discovery
- **PTR** — Reverse DNS, maps IP addresses back to names

## Caching and TTL

DNS caching is what makes the system performant. Without caching, every DNS query would require traversing the full hierarchy, adding significant latency.

Every DNS record has a **TTL (Time To Live)** value expressed in seconds. When a resolver caches a record, it respects the TTL:

```
blog.example.com.  300  IN  A  203.0.113.50
```

The `300` here means this record can be cached for 300 seconds (5 minutes). After that, the resolver must query the authoritative server again to get a fresh answer.

### TTL Trade-offs

- **Short TTL (60-300 seconds):** Changes propagate quickly. Useful during migrations or when using DNS-based failover. Increases query volume to authoritative servers.
- **Long TTL (3600-86400 seconds):** Reduces load on authoritative servers and speeds up resolution. Changes take longer to propagate. Good for stable records that rarely change.
- **Very low TTL (1-10 seconds):** Used by some CDNs and load balancers for real-time traffic steering. Puts significant load on the DNS infrastructure.

A common pattern is to lower TTL before a planned migration (say, from 86400 to 300) and wait for the old TTL to expire before making the change. After the migration is complete and verified, raise the TTL back up.

### Negative Caching

DNS also caches negative results. If a domain does not exist (NXDOMAIN), the resolver caches that fact according to the SOA record's minimum TTL field. This prevents repeated queries for nonexistent domains.

## DNS Tools

Several command-line tools help you inspect and troubleshoot DNS:

**dig** is the most comprehensive tool:
```bash
# Full resolution trace
dig +trace blog.example.com

# Query a specific resolver
dig @1.1.1.1 blog.example.com

# Query for specific record type
dig MX example.com

# Short output
dig +short example.com
```

**nslookup** is simpler but available on all platforms:
```bash
nslookup blog.example.com
nslookup -type=MX example.com
```

**host** provides clean output:
```bash
host blog.example.com
host -t AAAA example.com
```

## Common DNS Issues

**Propagation delays:** When you update a DNS record, the change is not instant. Cached copies of the old record persist until their TTL expires. "DNS propagation" is really just cache expiration across the world's resolvers.

**CNAME at zone apex:** You cannot create a CNAME record at the zone apex (`example.com` without a subdomain). This is a limitation of the DNS specification because CNAME records conflict with other record types (SOA, NS) that must exist at the apex. Some DNS providers offer workarounds (Cloudflare's CNAME flattening, Route 53's alias records).

**DNS over HTTPS/TLS:** Traditional DNS queries are unencrypted, meaning anyone on the network path can see what domains you are resolving. DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt these queries. Major browsers and operating systems now support these protocols.

**DNS rebinding attacks:** An attacker sets up a domain with a very short TTL. The first resolution returns the attacker's server IP, and after the client has passed CORS checks, the TTL expires and the next resolution returns an internal IP address (like 192.168.1.1). Browsers and resolvers have mitigations, but it is good to be aware of this attack vector.

Understanding DNS is fundamental to operating any internet-facing system. The next time something breaks and someone says "it is always DNS," you will be equipped to investigate and confirm (or refute) that claim.
