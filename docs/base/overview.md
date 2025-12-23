# Overview

## **1. Purpose and Scope**

The OAP Base Protocol defines the **minimal transport and message format** required for orchestrated intelligence modules to communicate reliably over HTTP using JSON-RPC envelopes.

It is intentionally governance-agnostic and provenance-agnostic.

This document describes only:

- how requests are transported
    
- how responses are returned
    
- how envelopes are structured
    
- how IDs and sessions are correlated
    

All behavioral semantics and orchestration rules are layered above this foundation.


## **2. Architectural Positioning**

The Base Protocol:

- defines a **transport and envelope contract**, not execution semantics
    
- enables interoperable module communication
    
- is suitable for both orchestrated intelligence systems and general RPC routing
    
- does not assume any AI-specific implementation details
    

  
The OAP Base Protocol is only **one possible transport model** for orchestrated intelligence or MCP-compatible systems.

Systems MAY choose alternative HTTP conventions, WebSockets, gRPC, or non-RPC event buses depending on their architecture.


## **3. Design Principles (Minimal Form)**

The Base Protocol:

1. Uses HTTP as a universal communication substrate.
    
2. Uses JSON-RPC 2.0 as a neutral request/response envelope.
    
3. Separates transport metadata from business payloads.
    
4. Keeps envelope typing flexible for different orchestration modules.
    

Everything beyond that belongs to layered specifications.


## **4. Transport Layer**

### **4.1 HTTP Method**

All requests MUST be made using:

```
POST /orchestrate HTTP/1.x
```

Other endpoints MAY be used, but /orchestrate represents the canonical routing path.


### **4.2 Request Headers (Minimal Required)**
| **Header**      | **Purpose**                                            |
| --------------- | ------------------------------------------------------ |
| Orch-Id         | Identifies a single request–response event             |
| Orch-Caller     | Identifies caller identity (module or external client) |
| Orch-Module-Id  | Identifies module sending the request                  |
| Orch-Session-Id | Identifies a conversation or workflow session          |
These are **transport correlation identifiers only.**

The Base Protocol does not prescribe policy, signatures, or cryptographic binding semantics for headers.

Additional headers may be introduced at higher layers.


## **5. Media Type and Versioning**

The base media type used for envelopes is:
```
application/vnd.orch-envelope+json; version=oap.v1
```
This identifies the payload as an OAP JSON envelope, without implying anything about governance or provenance.

Future versions may evolve independently.


## **6. Request Envelope Structure**

The protocol adopts JSON-RPC 2.0 as a neutral framing mechanism.
```
{
  "jsonrpc": "2.0",
  "id": "string",
  "envelope_type": "string",
  "params": {},
  "_meta": {}
}
```
Field meaning:

| **Field**     | **Purpose**                                  |
| ------------- | -------------------------------------------- |
| jsonrpc       | Identifies framing format                    |
| id            | Correlates request and response              |
| envelope_type | Semantic identifier for action or intent     |
| params        | Request payload                              |
| _meta         | Optional metadata for routing or observation |



## **7. Response Envelope Structure (Minimal)**

### **7.1 Success Response**

```
{
  "jsonrpc": "2.0",
  "id": "string",
  "envelope_type": "string",
  "result": {},
  "_meta": {}
}
```
### **7.2 Error Response**

```
{
  "jsonrpc": "2.0",
  "id": "string",
  "envelope_type": "string",
  "error": {},
  "_meta": {}
}
```

The base protocol does not interpret what error means — error classification belongs to higher layers.

## **8. Protocol Responsibilities**

The base protocol guarantees:
- message framing
    
- correlation IDs
    
- routing identifiers
    
- minimal envelope typing
    
- deterministic request–response mapping
    

## **9. Non-Exclusivity Clause**


The OAP Base Protocol is **not the only transport mechanism capable of enabling orchestration**.


Systems can use:

- HTTP + JSON-RPC (this spec)
    
- HTTP + REST schema
    
- WebSockets
    
- gRPC streams
    
- message buses (Kafka, NATS)
    
- or MCP native channels
    


This format is a design choice that prioritizes:

- clarity
    
- modularity
    
- lightweight framing
    
- interoperability
    

## **11. Summary**

  
The OAP Base Protocol provides the simplest possible transport definition for orchestrated communication:

- HTTP request/response
    
- JSON-RPC envelope
    
- standard correlation headers
    
- neutral metadata container
    

  

All orchestration guarantees such as:

- governance
    
- policy enforcement
    
- provenance anchoring
    
- execution planning
    
- HITL
    
- lifecycle control
    
are intentionally excluded from the base layer and defined as separate protocol classes layered above it.