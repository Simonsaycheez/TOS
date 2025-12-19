# Common Type Schema Reference

This section defines the **common identifiers, headers, and envelope structures** reused across all Orchestration Application Protocol (OAP) messages, regardless of their functional category (governance, provenance, SIA, etc.).

These types are **transport- and category-agnostic** and SHOULD be used consistently across all request and response schemas.

## **3.1 Type Conventions**

In this document, types are expressed using a TypeScript-like notation for readability:

- string, number, boolean, object, array`<T>`
- T? denotes an optional field
- Readonly`<T>` indicates values SHOULD NOT be modified after creation
- Comments starting with // describe semantics rather than implementation details

## **3.2 Identifier Types**

### **3.2.1** **OrchId**

```
type OrchId = string;
```

#### **Definition**

A unique identifier for a **single orchestrated exchange** (one request–response event).

#### **Usage**

- Correlates a **JSON-RPC request** with its corresponding response (maps to JSON-RPC id)
- Used as the primary key for event-level provenance entries
- May be transported both:
  - As an HTTP header: Orch-Id
  - Inside the JSON body: id (JSON-RPC field)

---

### **3.2.2** **OrchSessionId**

```
type OrchSessionId = string;
```

#### **Definition**

A persistent identifier for an **entire orchestration session** that may span multiple events / envelopes.

#### **Usage**

- Groups multiple OrchId events into a single **session context**
- Enables long-running conversations and end-to-end governance analysis
- Transported as:
  - HTTP header: Orch-Session-Id
  - Optionally echoed in \_meta.session_id

---

### **3.2.3** **OrchModuleId**

```
type OrchModuleId = string;
```

#### **Definition**

Logical identifier of the module participating in the orchestration fabric.

#### **Usage**

- Transported as HTTP header: Orch-Module-Id
- Used for:
  - capability registry
  - policy scoping
  - governance / audit attribution

---

### **3.2.4** **OrchCaller**

```
type OrchCaller = string;
```

#### **Definition**

The authenticated caller identity (human user, service principal, or agent).

#### **Usage**

- Transported as HTTP header: Orch-Caller
- Optionally echoed in \_meta.caller
- Used for human governance, access control, and audit.

---

## **3.3 Common HTTP Headers**

The following headers are **common to all OAP HTTP requests and responses**, unless explicitly stated otherwise.

```
Orch-Id: string                // event-level identifier
Orch-Session-Id: string        // session-level identifier
Orch-Caller: string            // logical caller identity
Orch-Module-Id: string         // logical module identity
Orch-Prev-Event-Hash: string   // (provenance; see provenance section)
```

For responses, additional governance / provenance headers (e.g. Orch-Policy-Binding, Orch-Event-Hash, Orch-Ledger-Anchor) are defined in their respective sections.

In this **Common Types** section, they are treated as opaque strings.

---

## **3.4 Base JSON-RPC Envelope Types**

All OAP messages use **JSON-RPC 2.0** as the base envelope format.

### **3.4.1**  **OrchEnvelopeBase**

```
interface OrchEnvelopeBase {
  jsonrpc: "2.0";
  id: OrchId;                      // event ID (mirrors Orch-Id)
  envelope_type: string;           // e.g. "oap.policy.evaluate"
  _meta?: OrchMeta;                // shared metadata
}
```

#### **Notes**

- envelope_type determines the semantic contract of params / result / error.
- \_meta carries cross-cutting metadata used across categories.

---

### **3.4.2 Request Envelope**

```
interface OrchRequestEnvelope<TParams = unknown> extends OrchEnvelopeBase {
  // For a request, `params` SHOULD be present even if empty.
  params: TParams;
  // For purely control-plane pings, params MAY be `{}`.
}
```

#### **Usage**

All concrete request types (policy, exec, SIA, provenance, etc.) MUST extend this base structure and define their own params schema.

---

### **3.4.3 Success Response Envelope**

```
interface OrchSuccessEnvelope<TResult = unknown> extends OrchEnvelopeBase {
  result: TResult;
  // When `result` is present, `error` MUST NOT be present.
}
```

#### **Usage**

- Used for HTTP 2xx responses where the operation is considered successful at the envelope level.
- Governance may still indicate partial allow / constraints via headers or result contents.

---

### **3.4.4 Error Response Envelope**

```
interface OrchErrorEnvelope<TError = OrchError> extends OrchEnvelopeBase {
  error: TError;
  // When `error` is present, `result` MUST NOT be present.
}
```

#### **Usage**

- Used with HTTP error codes (e.g. 403, 422, 500) or policy-denied cases.
- error structure is a **common type** (see below), extended by governance- or domain-specific fields where needed.

---

## **3.5 Common Error Type**

### **3.5.1**  **OrchError**

```
interface OrchError {
  code: string;              // machine-readable error code (e.g. "POLICY_DENIED", "INVALID_PARAMS")
  message: string;           // short human-readable summary
  details?: object;          // arbitrary structured data for debugging / UI
  retryable?: boolean;       // hint whether retry is meaningful
  cause?: string;            // optional root-cause category or upstream reference
}
```

#### **Notes**

- code SHOULD be stable and versioned at protocol level.
- details MAY include governance or provenance identifiers but SHOULD NOT be relied on for policy logic (those are defined in policy / provenance sections).

---

## **3.6 Common Metadata Type**

### **3.6.1** **OrchMeta**

```
interface OrchMeta {
  timestamp?: string;              // ISO 8601 UTC time when the envelope was created
  session_id?: OrchSessionId;      // optional echo of Orch-Session-Id
  trace_id?: OrchTraceId;          // optional echo of Orch-Trace-Id
  locale?: string;                 // e.g. "en-US", "zh-CN"
  channel?: string;                // e.g. "web-ui", "cli", "batch-job"
  client_version?: string;         // e.g. "orch-gateway/1.0.3"
  labels?: Record<string, string>; // arbitrary key–value tags for routing/analytics
  correlation_ids?: string[];      // other system-specific correlation IDs
  // future extensions MAY add governance/provenance hints,
  // but category-specific semantics belong in dedicated sections.
}
```

#### **Usage**

- \_meta is optional but RECOMMENDED for:
  - observability
  - debugging
  - analytics and routing
- When timestamp is absent, the server MAY derive it from server receive-time.

---

## **3.7 Common Pagination Types (Optional but Reusable)**

For envelopes that return lists (e.g. search, query, history), the following pagination types SHOULD be reused.

### **3.7.1** **OrchPageRequest**

```
  interface OrchPageRequest {
  cursor?: string;        // opaque cursor token for the next page
  limit?: number;         // max number of items to return
}
```

### **3.7.2**  **OrchPageResponse`<TItem>`**

```
interface OrchPageResponse<TItem> {
  items: TItem[];
  next_cursor?: string;   // present if more items can be fetched
  total_estimate?: number;// optional approximate total count
}
```

---

## **3.8 Summary**

The **Common Types** defined in this section provide:

- A **uniform structure** for all envelopes (OrchEnvelopeBase, OrchRequestEnvelope, OrchSuccessEnvelope, OrchErrorEnvelope)
- A consistent set of **identifiers** (OrchId, OrchSessionId, OrchTraceId, OrchModuleId, OrchCaller)
- Reusable **metadata and error** types (OrchMeta, OrchError)
- Shared **pagination** primitives (OrchPageRequest, OrchPageResponse)

All category-specific schemas (governance, provenance, SIA, lifecycle, etc.) MUST be defined **by extending these common types**, rather than re-inventing identifiers or envelope structures.
