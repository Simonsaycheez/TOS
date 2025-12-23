# Control-Plane, Explannation and Evidence Type Schema Reference
The control-plane defines orchestration-level structures that enable modules to communicate coordination, capability metadata, explainability outputs, and evidence references.

  

These schema types are **transport-agnostic JSON structures** extending the common envelope model.

  
This section introduces:

- optional control-plane headers
    
- control-plane envelope schemas
    
- explanation generator schemas
    
- evidence reference schemas
    


# **0. Optional Control-Plane Headers**

  

The following HTTP headers MAY appear on control-plane requests and responses when relevant:
|**Header**|**Purpose**|
|---|---|
|Orch-Control-Intent|Optional hint describing the control-plane action (e.g. “capability-sync”)|
|Orch-Control-Scope|Defines the scope of the action (e.g. “module”, “session”, “global”)|

These headers are optional and only apply when the control-plane needs request-level routing hints.

They do not override the envelope schema.

  
# **1. Control-Plane Envelope Structure**

Control envelopes extend the **common envelope shape**, using:

```
  {
  "jsonrpc": "2.0",
  "id": string,
  "envelope_type": string,
  "params": object,
  "_meta"?: object
}
```
Where:

- envelope_type MUST always begin with control.
    
- params defines the control action payload
    
- _meta MAY contain timestamps, labels, or optional routing metadata
    

  

Response envelopes follow the common result/error envelope structure.

# **2. control.ping Envelope**

  

### **Purpose**

  

Lightweight envelope used for connectivity testing or module discovery.

  

### **Envelope Type**

  

control.ping

  

### **Request Params**
```
interface ControlPingParams {
  message?: string;           // optional arbitrary echo text
}
```
### **Result**
```
interface ControlPingResult {
  received: string;          // echoed message or identifier
  timestamp: string;         // generated server-side
}
```
# **3. Capability Registry Types**

  

Control-plane maintains dynamic knowledge of available module capabilities.
## **3.1 capability.register**

  

### **Envelope Type**

  

control.capability.register

  

#### **Params**
```
interface CapabilityRegisterParams {
  module_id: string;
  capabilities: CapabilityDescriptor[];
}
```
#### **Result**
```
interface CapabilityRegisterResult {
  registered: CapabilityDescriptor[];
}
```
## **3.2 capability.query**

  

### **Envelope Type**

  

control.capability.query

  

#### **Params**
```
interface CapabilityQueryParams {
  module_id?: string;
  name?: string;
  type?: string;
}
```
#### **Result**
```
interface CapabilityQueryResult {
  capabilities: CapabilityDescriptor[];
}
```

# **4. Control-Plane Session Types**

  

Sessions define optional orchestration grouping contexts for multi-step control interactions
## **4.1 session.open**

  

### **Envelope Type**

  

control.session.open

  

#### **Params**
```
interface ControlSessionOpenParams {
  session_id: OrchSessionId;
  caller: string;
  purpose?: string;
  attributes?: Record<string, string>;
}
```
#### **Result**
```
interface ControlSessionOpenResult {
  session_id: OrchSessionId;
  started_at: string;
}
```
## **4.2 session.close**

  

### **Envelope Type**

  

control.session.close

  

#### **Params**
```
interface ControlSessionCloseParams {
  session_id: OrchSessionId;
  reason?: string;
}
```
#### **Result**
```
interface ControlSessionCloseResult {
  session_id: OrchSessionId;
  closed_at: string;
}
```
# **5. Explanation Generator Types**

  

Explanation envelopes support semantic reasoning output that allows modules or interfaces to produce interpretable justification.

  

These envelopes do not assign governance meaning to the explanation; they only describe structure.
## **5.1 explain.generate**

  

### **Envelope Type**

  

explain.generate

  

#### **Params**
interface ExplanationGenerateParams {
  target: ExplanationTarget;
  context?: object;
  detail_level?: ExplanationDetailLevel;
  audience?: ExplanationAudience;
}
#### **Result**
interface ExplanationGenerateResult {
  explanation: ExplanationBlock[];
  uncertainty?: number;
  evidence_links?: EvidenceLink[];
}
# **6. Evidence Resolve Types**

  

Evidence references support traceability and lineage verification at the application layer.

  

These structures do not imply provenance hashing by themselves.
## **6.1 evidence.resolve**

  

### **Envelope Type**

  

evidence.resolve

  

#### **Params**
interface EvidenceResolveParams {
  evidence_ids: string[];
}
#### **Result**
interface EvidenceResolveResult {
  items: EvidenceResolvedItem[];
}
# **7. Control-Plane Envelope Summary Table**
| **Envelope Type**           | **Category** | **Purpose**                    |
| --------------------------- | ------------ | ------------------------------ |
| control.ping                | control      | connectivity confirmation      |
| control.capability.register | control      | module capability publishing   |
| control.capability.query    | control      | capability lookup              |
| control.session.open        | control      | optional control session start |
| control.session.close       | control      | optional control session end   |
| explain.generate            | explain      | produce structured reasoning   |
| evidence.resolve            | evidence     | retrieve referenced data       |
