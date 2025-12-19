# Overview

## **1. Purpose and Design Goals**

The Orchestration Application Protocol (OAP) defines a **governed interaction protocol** for orchestrated intelligence systems.

Its primary goal is to enable **policy-enforced, auditable, and semantically controlled** interactions between AI modules, human operators, legacy system, and governance services.

Unlike traditional API protocols that focus solely on data exchange, OAP is designed to:

- Enforce **machine-readable governance** at runtime
- Preserve **semantic meaning, provenance, and risk context** across module boundaries
- Support **human governance and override** for high-impact actions
- Provide a **cryptographically traceable execution lineage**
- Remain **interoperable with existing AI orchestration ecosystems**, including MCP-based services

---

## **2. Architectural Positioning**

OAP operates as the **Control-Plane communication protocol** of the orchestration ecosystem.

It governs interactions among:

- AI capability modules (LLMs, RAG, tools, symbolic reasoners)
- Policy & Governance Engines
- Provenance, audit, and lifecycle services
- Human-in-the-loop (HITL) interfaces
- External MCP-compatible services

The protocol does **not** define model internals or business logic.
Instead, it defines **how actions are requested, evaluated, constrained, executed, explained, and anchored**.

This directly implements:

- **Criterion 0 — Control-Plane**
- **Criterion 2 — Policy-Enforced Operation**
- **Criterion 9 — Immutable Provenance**
- **Criterion 10 — Lifecycle Accountability**

---

## **3. Transport and Interoperability Strategy**

### **3.1 HTTP as the Transport Layer**

OAP is built on top of **HTTP/1.1 or HTTP/2** for the following reasons:

- Compatibility with existing infrastructure (gateways, proxies, zero-trust networks)
- Explicit request–response boundaries for auditing
- Mature tooling for observability and security

HTTP headers are deliberately used to carry **governance-critical metadata**, separating control signals from payload semantics.

---

### **3.2 JSON-RPC 2.0 as the Message Envelope**

To enable potential **integration with MCP and existing AI toolchains**, OAP adopts **JSON-RPC 2.0** as its message framing layer.

This choice provides:

- A standardized request–response model (id, result, error)
- Clear separation between **transport**, **envelope**, and **payload**
- Compatibility with existing JSON-RPC-based orchestration systems
- Extensibility without breaking backward compatibility

JSON-RPC is used **as an envelope**, not as a business logic protocol.

---

## **4. Media Type and Versioning**

OAP defines a dedicated media type:
`application/vnd.orch-envelope+json; version=oap.v1`

This ensures:

- Explicit protocol negotiation
- Forward compatibility across protocol versions
- Clear separation from generic JSON APIs

---

## **5. Base Request Structure**

### **5.1 HTTP Request**

`POST /orchestrate HTTP/1.1`
`Host: example.com`
`Accept: application/vnd.orch-envelope+json`
`Content-Type: application/vnd.orch-envelope+json; version=oap.v1`
`Orch-Id: string`
`Orch-Caller: string`
`Orch-Module-Id: string`
`Orch-Session-Id: string`

#### **Header Semantics**

| **Header**      | **Purpose**                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Orch-Id         | Orch-Id represents the unique identifier of a single orchestrated exchange (one request–response event).                |
| Orch-Caller     | Authenticated caller identity module                                                                                    |
| Orch-Module-Id  | Logical module identity within the orchestration fabric                                                                 |
| Orch-Session-id | Orch-Session-Id represents the persistent identifier for an entire orchestration session that spans multiple envelopes. |

These headers directly support:

- Criterion 1 — Human Governance
- Criterion 9 — Immutable Provenance
- Criterion 10 — Lifecycle Accountability

---

### **5.2 JSON-RPC Envelope (Request)**

`{`
`"jsonrpc": "2.0",`
`"id": "string",`
`"envelope_type": "string",`
`"params": {},`
`"_meta": {}`
`}`

#### **Field Semantics**

| **Field**                   | **Description**                                                      |
| --------------------------- | -------------------------------------------------------------------- |
| jsonrpc                     | JSON-RPC protocol version                                            |
| id                          | Correlates request and response                                      |
| [[envelope_type_reference]] | Declares the semantic intent of the envelope                         |
| params                      | Payload specific to the declared envelope                            |
| \_meta                      | Structured metadata for governance, risk, uncertainty, and reasoning |

The explicit envelope_type enables:

- Semantic validation
- Policy matching
- Ontology-grounded interpretation

This directly implements:

- **Criterion 4 — Semantic Communication Integrity**
- **Criterion 6 — Epistemic Prudence**

---

## **6. Base Response Structure**

### **6.1 HTTP Response (Success)**

`HTTP/1.1 200 OK`
`Content-Type: application/vnd.orch-envelope+json; version=oap.v1`
`Cache-Control: no-store`
`Orch-Id: string`
`Orch-Policy-Decision: string`
`Orch-Risk-Level: string`
`Orch-Ledger-Anchor: string`
`Orch-Session-Id: string`

#### **Governance Headers**

| **Header**           | **Meaning**                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Orch-Policy-Decision | Governance decision (ALLOW, PARTIAL, DENY, HITL_REQUIRED)                                                               |
| Orch-Risk-Level      | Residual risk classification                                                                                            |
| Orch-Ledger-Anchor   | External or internal ledger reference                                                                                   |
| Orch-Id              | Orch-Id represents the unique identifier of a single orchestrated exchange (one request–response event).                |
| Orch-Session-Id      | Orch-Session-Id represents the persistent identifier for an entire orchestration session that spans multiple envelopes. |

These headers externalize governance outcomes, ensuring **policy decisions are never implicit**.

---

### **6.2 JSON-RPC Envelope (Result)**

`{`
`"jsonrpc": "2.0",`
`"id": "string",`
`"envelope_type": "string",`
`"result": {},`
`"_meta": {}`
`}`

The response envelope may include:

- Structured rationale
- Evidence references
- Uncertainty markers
- HITL requirements

This implements:

- **Criterion 8 — Transparency & Explainability**
- **Criterion 5 — Symbolic–Subsymbolic Integration**

---

## **7. Error Response Semantics**

### **7.1 HTTP Error (Example: Policy Denial)**

`HTTP/1.1 403 Forbidden`
`Content-Type: application/vnd.orch-envelope+json; version=oap.v1`
`Orch-Id: string`
`Orch-Policy-Decision: DENY`
`Orch-Ledger-Anchor: string`
`Orch-Session-Id: string`

### **7.2 JSON-RPC Error Envelope**

`{`
`"jsonrpc": "2.0",`
`"id": "string",`
`"envelope_type": "string",`
`"error": {},`
`"_meta": {}`
`}`

Errors are **governed outcomes**, not transport failures.

Every denial or restriction is:

- Policy-bound
- Provenance-anchored
- Traceable and explainable

This enforces:

- **Criterion 2 — Policy-Enforced Operation**
- **Criterion 1 — Human Governance**

---

## **8. Conceptual Alignment with the Ten Criteria**

| **Protocol Aspect**                           | **Criteria** |
| --------------------------------------------- | ------------ |
| Explicit headers for policy, risk, provenance | C1, C2, C9   |
| JSON-RPC semantic envelope                    | C3, C4       |
| \_meta for uncertainty and rationale          | C6, C8       |
| Ledger anchoring                              | C9           |
| Versioned media type                          | C7, C10      |
| Central orchestration endpoint                | C0           |

---

## **9. Summary**

The OAP Base Protocol establishes a **machine-enforceable governance fabric** for orchestrated intelligence systems.

By combining:

- HTTP transport
- JSON-RPC envelopes
- Semantic envelope typing
- Explicit governance headers
- Cryptographic provenance hooks

the protocol operationalizes the **Ten Criteria for Trustworthy Orchestration**, transforming them from abstract principles into **runtime-enforced technical guarantees**.

This protocol is intentionally minimal at the base layer, providing a stable foundation upon which higher-level envelopes, policies, and orchestration patterns can evolve in a governed, auditable, and interoperable manner.
