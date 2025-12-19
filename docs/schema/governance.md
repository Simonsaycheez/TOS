# Governance Type Schema Reference

This section defines the shared JSON structures and HTTP header semantics for **policy evaluation, governance decisions, constraint enforcement, HITL integration, authorization outcomes, and risk metadata**.

These types extend the Common Types without redefining envelope structure or transport behavior.

Governance types apply to all envelopes that require policy involvement, including:

- policy.evaluate
- policy.explain
- exec.invoke (post-policy)
- hitl.\*
- lifecycle.\* (approval stage)
- Any request requiring safety, ethics, authorization, or risk gating

---

## **4.1 Governance HTTP Header Types**

The following headers MAY appear in responses of any governance-controlled operation. They MUST NOT be modified inside the JSON envelope body.

### **4.1.1 Orch-Policy-Binding**

```

Orch-Policy-Binding: string
```

Represents a versioned policy bundle identifier applied to the request.

Stable reference for replay, reproduction, and forensic analysis.

---

### **4.1.2 Orch-Decision**

```
Orch-Decision: "ALLOW" |
                "PARTIAL_ALLOW" |
                "DENY" |
                "HITL_REQUIRED" |
                "ESCALATION_REQUIRED"
```

High-level outcome of the policy evaluation.

#### Semantics:

| **Value**           | **Meaning**                              |
| ------------------- | ---------------------------------------- |
| ALLOW               | Operation permitted without restrictions |
| PARTIAL_ALLOW       | Operation allowed with constraints       |
| DENY                | Operation blocked                        |
| HITL_REQUIRED       | Requires human approval step             |
| ESCALATION_REQUIRED | Must escalate to higher authority        |

---

### **4.1.3 Orch-Risk-Level**

```
Orch-Risk-Level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
```

Residual impact classification after applying governance evaluation.

---

### **4.1.4 Orch-HITL-Required (optional)**

```
Orch-HITL-Required: boolean
```

Indicates whether human-in-the-loop must occur before final execution.

---

# **4.2 Governance Envelope Payload Structures**

Governance envelopes extend the base envelope structure via params and result.

The following schema definitions reference **Common Types** and do not redefine id, jsonrpc, or \_meta.

---

## **4.2.1 Policy Evaluation Request**

Envelope Type: policy.evaluate

```
interface PolicyEvaluateParams {
  action: string;
  // semantic name of requested operation (e.g., "exec.invoke.rag.search")

  context: PolicyContext;
  // environment and subject metadata

  payload?: object;
  // optional raw data used for decision, not executed

  dry_run?: boolean;
  // if true, only evaluate policy without enforcement
}
```

---

## **4.2.2 Policy Evaluation Response**

```
interface PolicyEvaluateResult {
  decision: PolicyDecision;
  constraints?: PolicyConstraint[];
  requires_hitl?: boolean;
  residual_risk?: RiskLevel;
  policy_binding_id: string;
}
```

---

# **4.3 Core Governance Model Types**

## **4.3.1 PolicyDecision**

```
type PolicyDecision =
  "ALLOW" |
  "PARTIAL_ALLOW" |
  "DENY" |
  "HITL_REQUIRED" |
  "ESCALATE";
```

---

## **4.3.2 RiskLevel**

```
type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
```

---

## **4.3.3 PolicyConstraint**

Constraints restrict how execution may occur after an ALLOW or PARTIAL_ALLOW decision.

```
interface PolicyConstraint {
  code: string;
  // machine-readable key, e.g. "RESULTS_READONLY"

  scope: "request" | "session" | "action" | "output";

  args?: object;
  // free-structure configuration

  reason?: string;
  // optional human-readable justification
}
```

**Notes**

- Constraints MUST NOT be silently ignored by executors.
- Violating constraints SHOULD produce a DENY error at runtime.

---

## **4.3.4 PolicyContext**

```
interface PolicyContext {
  tenant?: string;
  caller?: string;
  session_id?: OrchSessionId;
  trace_id?: OrchTraceId;

  data_sensitivity?:
    "public" | "internal" | "restricted" | "health" | "classified";

  request_purpose?: string; // e.g. "clinical_support"

  claims?: PolicyClaim[];
  // informational signals to the policy engine

  attributes?: Record<string, string | number | boolean>;
}
```

Policy context enables dynamic evaluation:

- per-case
- per-session
- per-user
- per-domain

---

## **4.3.5 PolicyClaim**

```
interface PolicyClaim {
  message: string;
  severity?: "info" | "warning" | "error";
}
```

Claims communicate non-binding machine reasoning outcomes.

They are NOT equivalent to result or explanation.

---

# **4.4 HITL (Human Governance) Model Types**

Human governance enables dual-control and accountability.

---

## **4.4.1 HITL Request Envelope**

Envelope Type: hitl.request

```
interface HitlRequestParams {
  reason: string;
  required_role: string;
  payload: object;
  proposed_action: string;
  risk: RiskLevel;
}
```

---

## **4.4.2 HITL Decision Envelope**

Envelope Type: hitl.decision.submit

```
interface HitlDecisionParams {
  approve: boolean;
  reviewer: string;
  comments?: string;
  override_reason?: string;
}
```

---

# **4.5 Policy Explanation Types**

Used by policy.explain.

```
interface PolicyExplainParams {
  policy_binding_id: string;
}

interface PolicyExplainResult {
  explanation: string;
  rules_fired?: string[];
  constraints?: PolicyConstraint[];
  evidence?: object;
}
```

---

# **4.6 Default Governance Error Types**

Governance-related errors extend the common error model but add structured semantics.

```
interface GovernanceError extends OrchError {
  decision?: PolicyDecision;
  policy_binding_id?: string;
  risk?: RiskLevel;
  hitl_required?: boolean;
}
```

---

# **4.7 Execution-Time Governance Validation Result**

Used by exec.invoke responses when runtime constraint enforcement applies:

```
interface ExecutionGovernanceState {
  policy_binding_id: string;
  allowed_actions: string[];
  removed_actions?: string[];
  requires_hitl_for?: string[];
}
```

---

# **4.8 Required Governance Rules (Summary)**

All orchestrated requests MUST:

1. Pass through policy evaluation before execution.
2. Attach policy-binding and decision metadata to results.
3. Record decision state into provenance (event hash).
4. Fail closed: missing policy = DENY state.
5. Allow constraints to override module free behavior.
6. Defend HITL boundaries: cannot skip human approval stage.

---

# **4.9 Governance Category Design Principles**

These are not code, but define rationale:

- **Governance precedes execution**
  No action may be invoked before policy evaluation.
- **Constraints are first-class technical entities**
  Not documentation, but enforceable machine rules.
- **HITL is not optional**
  REQUIRED where indicated by decision logic or risk.
- **Policy identity must be versioned**
  All enforcement must be reproducible and traceable.
