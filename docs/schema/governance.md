# Governance Type Schema Reference

This section defines governance-related structures for **policy evaluation and authorization envelopes**, along with the **optional HTTP headers** used to expose governance outcomes at response time.

  

Governance schemas apply only to envelopes that explicitly require policy evaluation.

They do **not** modify the common envelope format, nor enforce execution semantics.

# **0. Optional Governance HTTP Headers**

  

The following headers MAY appear on responses from envelopes that undergo governance evaluation.

These headers are optional and MUST NOT be assumed in the base protocol.
|**Header**|**Purpose**|
|---|---|
|Orch-Policy-Binding|Identifier for the policy set used to evaluate the request|
|Orch-Decision|High-level decision result (ALLOW / PARTIAL_ALLOW / DENY / HITL_REQUIRED / ESCALATION_REQUIRED)|
|Orch-Risk-Level|Optional textual indication of evaluated residual risk|
|Orch-HITL-Required|Indicates whether human approval is needed before execution|


These headers:

- apply to policy-related responses only
    
- MUST NOT affect envelope schema field meanings
    
- may be omitted if governance is disabled

# **1 Governance Envelope Structure**

  

All governance envelopes follow the shared envelope definition from Common Types:
```
{
  "jsonrpc": "2.0",
  "id": "...",
  "envelope_type": "policy.*",
  "params": {},
  "_meta": {}
}
```
Response envelopes follow the same common response form:
```
{
  "jsonrpc": "2.0",
  "id": "...",
  "envelope_type": "policy.*",
  "result"?: {},
  "error"?: {}
}
```
# **2 Policy Evaluation Envelope**

  

### **Envelope Type**

  

policy.evaluate

  

Used to request a governance decision over a proposed operation.

  

### **Request Params**
```
interface PolicyEvaluateParams {
  action: string;            // semantic name, e.g. "exec.invoke"
  context: PolicyContext;    // attributes describing caller and session
  payload?: object;          // optional domain data for evaluation
  dry_run?: boolean;         // evaluate without enforcement
}
```

### **Response Result**
```
interface PolicyEvaluateResult {
  decision: PolicyDecision;
  constraints?: PolicyConstraint[];
  requires_hitl?: boolean;
  residual_risk?: RiskLevel;
  policy_binding_id: string;
}
```
# **3 Policy Explanation Envelope**

  

### **Envelope Type**

  

policy.explain

  

Used to retrieve explanation associated with a previous policy evaluation.

  

### **Request Params**
```
interface PolicyExplainParams {
  policy_binding_id: string;
}
```

### **Response Result**
```
interface PolicyExplainResult {
  explanation: string;
  rules_fired?: string[];
  constraints?: PolicyConstraint[];
  evidence?: object;
}
```
# **4 Policy Model Types**

  

These types are reused across governance envelopes.

They do not modify base envelope structure.
## **4.1 PolicyDecision**
```
type PolicyDecision =
  "ALLOW" |
  "PARTIAL_ALLOW" |
  "DENY" |
  "HITL_REQUIRED" |
  "ESCALATE";
```
  ## **4.2 RiskLevel**
```
  type RiskLevel =
  "LOW" |
  "MEDIUM" |
  "HIGH" |
  "CRITICAL";
```
## **4.3 PolicyConstraint**
```
interface PolicyConstraint {
  code: string;
  scope: "request" | "session" | "action" | "output";
  args?: object;
  reason?: string;
}
```

## **4.4 PolicyContext**
```
interface PolicyContext {
  tenant?: string;
  caller?: string;
  session_id?: OrchSessionId;
  trace_id?: OrchTraceId;

  data_sensitivity?:
    "public" | "internal" | "restricted" | "health" | "classified";

  request_purpose?: string;
  claims?: PolicyClaim[];

  attributes?: Record<string, string | number | boolean>;
}
```

## **4.5 PolicyClaim**
```
interface PolicyClaim {
  message: string;
  severity?: "info" | "warning" | "error";
}
```

# **5 HITL Envelope Types**

  

Human governance envelopes exist only if HITL enforcement is implemented.
## **5.1 hitl.request**

  

### **Envelope Type**

  

hitl.request
```
interface HitlRequestParams {
  reason: string;
  required_role: string;
  payload: object;
  proposed_action: string;
  risk?: RiskLevel;
}
```
## **5.2 hitl.decision.submit**

  

### **Envelope Type**

  

hitl.decision.submit
```
interface HitlDecisionParams {
  approve: boolean;
  reviewer: string;
  comments?: string;
  override_reason?: string;
}
```
# **6 Governance Error Payload**

  

Governance envelopes MAY return structured error bodies.
```
interface GovernanceError extends OrchError {
  decision?: PolicyDecision;
  policy_binding_id?: string;
  risk?: RiskLevel;
  hitl_required?: boolean;
}
```
# **7 Envelope Summary Table**
| **Envelope**         | **Purpose**                               |
| -------------------- | ----------------------------------------- |
| policy.evaluate      | Request decision result over an operation |
| policy.explain       | Retrieve human-readable policy reasoning  |
| hitl.request         | Request human approval                    |
| hitl.decision.submit | Submit a human approval outcome           |
