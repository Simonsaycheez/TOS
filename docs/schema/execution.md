# Execution Type Schema Reference
This section defines the schemas used for runtime invocation of capabilities through the orchestration control-plane.

  

Execution envelopes include:

- direct invocation (exec.invoke)
    
- plan submission and application (exec.plan.*)
    
- status retrieval (exec.status.get)
    
- cancellation (exec.cancel)
    

  

This chapter defines **execution payload schemas only**. It does not prescribe governance ordering, provenance requirements, or lifecycle rules.


## **0 Optional Execution HTTP Headers**

  

The following headers MAY appear on execution requests and/or responses. They are optional and do not alter the meaning of envelope body fields.

| **Header**             | **Purpose**                                              |
| ---------------------- | -------------------------------------------------------- |
| Orch-Invocation-Id     | Convenience handle for correlation with async operations |
| Orch-Execution-Mode    | Optional hint indicating SYNC/ASYNC at transport layer   |
| Orch-Timeout-Ms        | Optional timeout hint for gateways/executors             |
| Orch-Target-Module     | Optional routing hint for target module                  |
| Orch-Target-Capability | Optional routing hint for capability name                |
| Orch-Execution-State   | Optional surfaced state for async workflows              |


If present, these headers MUST be consistent with the envelope body.


## **1 Execution Envelope Skeleton**

  

Execution envelopes follow the common envelope structure.

  

### **Request**

```
{
  jsonrpc: "2.0",
  id: OrchId,
  envelope_type: "exec.*",
  params: object,
  _meta?: OrchMeta
}
```

### **Success Response**
```
{
  jsonrpc: "2.0",
  id: OrchId,
  envelope_type: "exec.*",
  result: object,
  _meta?: OrchMeta
}
```

### **Error Response**
```
{
  jsonrpc: "2.0",
  id: OrchId,
  envelope_type: "exec.*",
  error: OrchError,
  _meta?: OrchMeta
}
```

## **2 Core Enumerations**

  

### **2.1 ExecutionMode**
```
type ExecutionMode = "SYNC" | "ASYNC";
```

### **2.2 ExecutionState**

```
type ExecutionState =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "TIMED_OUT";
```

### **2.3 ExecutionFailureReason**
```
type ExecutionFailureReason =
  | "RUNTIME_ERROR"
  | "VALIDATION_ERROR"
  | "POLICY_DENIED"
  | "CONSTRAINT_VIOLATION"
  | "DEPENDENCY_FAILURE"
  | "UPSTREAM_UNAVAILABLE"
  | "UNKNOWN";
```

## **3 Targets and Actions**

  

### **3.1 ExecTarget**

```
interface ExecTarget {
  module_id: string;
  capability: string;
  version?: string;
}
```

### **3.2 ActionDescriptor (optional helper)**

```
interface ActionDescriptor {
  name: string;
  label?: string;
  description?: string;
}
```

## **4 exec.invoke**

  

### **Envelope Type**

  

exec.invoke

  

### **4.1 Request Params**
```
interface ExecInvokeParams<TInput = unknown> {
  target: ExecTarget;
  action?: ActionDescriptor;

  input: TInput;

  mode?: ExecutionMode;     
  timeout_ms?: number;      

  governance?: ExecutionGovernanceState;
}
```

### **4.2 Result (SYNC mode)**

```
interface ExecInvokeResultSync<TOutput = unknown> {
  invocation_id: string;
  state: ExecutionState;          
  output?: TOutput;              
  error?: ExecutionErrorInfo;     
  governance?: ExecutionGovernanceState;
}
```

### **4.3 Result (ASYNC mode)**

```
interface ExecInvokeResultAsync {
  invocation_id: string;
  state: ExecutionState;          
  governance?: ExecutionGovernanceState;
}
```

### **4.4 Result Union**
```
type ExecInvokeResult<TOutput = unknown> =
  | ExecInvokeResultSync<TOutput>
  | ExecInvokeResultAsync;
```

### **4.5 ExecutionErrorInfo**
```
interface ExecutionErrorInfo {
  reason: ExecutionFailureReason;
  message: string;
  details?: object;
  underlying_error?: OrchError;
}
```

## **5 exec.status.get**

  

### **Envelope Type**

  

exec.status.get

  

### **5.1 Request Params**
```
interface ExecStatusGetParams {
  invocation_id: string;
}
```

### **5.2 Result**
```
interface ExecStatusGetResult<TOutput = unknown> {
  invocation_id: string;
  state: ExecutionState;

  output?: TOutput;
  error?: ExecutionErrorInfo;

  target?: ExecTarget;
  started_at?: string;
  completed_at?: string;

  governance?: ExecutionGovernanceState;
}
```

## **6 exec.cancel**

  

### **Envelope Type**

  

exec.cancel

  

### **6.1 Request Params**
```
interface ExecCancelParams {
  invocation_id: string;
  reason?: string;
}
```

### **6.2 Result**
```
interface ExecCancelResult {
  invocation_id: string;
  previous_state: ExecutionState;
  new_state: ExecutionState;
}
```

## **7 Execution Plans**

  

Execution plans represent multi-step orchestrated workflows and are exchanged via plan envelopes.

  

### **7.1 ExecutionPlan**
```
interface ExecutionPlan {
  plan_id: string;

  label?: string;
  description?: string;

  steps: PlanStep[];
  edges?: PlanEdge[];

  created_by: string;
  created_at: string;
  metadata?: object;
}
```

### **7.2 PlanStep**
```
interface PlanStep {
  step_id: string;

  target: ExecTarget;
  action?: ActionDescriptor;

  input_template?: object;
  depends_on?: string[];

  optional?: boolean;
  retry_policy?: RetryPolicy;
}
```

### **7.3 PlanEdge (optional)**
```
interface PlanEdge {
  from: string;
  to: string;
  condition?: object;
}
```

### **7.4 RetryPolicy**
```
interface RetryPolicy {
  max_attempts: number;
  backoff_ms?: number;
  backoff_strategy?: "CONSTANT" | "LINEAR" | "EXPONENTIAL";
}
```


## **8 exec.plan.submit**

  

### **Envelope Type**

  

exec.plan.submit

  

### **8.1 Request Params**

```
interface ExecPlanSubmitParams {
  plan: ExecutionPlan;
  governance_hint?: object;
}
```

### **8.2 Result**
```
interface ExecPlanSubmitResult {
  plan_id: string;
  status: "PENDING_REVIEW" | "REJECTED" | "READY_FOR_EXECUTION";
  governance?: ExecutionGovernanceState;
}
```

## **9 exec.plan.apply**

  

### **Envelope Type**

  

exec.plan.apply

  

### **9.1 Request Params**

```
interface ExecPlanApplyParams {
  plan_id: string;
  mode?: ExecutionMode;
}
```

### **9.2 Result**
```
interface ExecPlanApplyResult {
  plan_id: string;
  invocation_id: string;
  state: ExecutionState;
}
```

## **10 exec.plan.status.get (optional)**

  

### **Envelope Type**

  

exec.plan.status.get

  

### **10.1 Request Params**

```
interface ExecPlanStatusGetParams {
  invocation_id: string;
}
```

### **10.2 Result**
```
interface ExecPlanStatusGetResult {
  invocation_id: string;
  state: ExecutionState;
  step_states: PlanStepState[];
}
```

```
interface PlanStepState {
  step_id: string;
  state: ExecutionState;
  started_at?: string;
  completed_at?: string;
  error?: ExecutionErrorInfo;
}
```

## **11 Execution Envelope Summary Table**
|**Envelope**|**Purpose**|
|---|---|
|exec.invoke|Invoke a single capability|
|exec.status.get|Retrieve status for an invocation|
|exec.cancel|Cancel a pending/running invocation|
|exec.plan.submit|Submit a multi-step plan|
|exec.plan.apply|Apply/execute a submitted plan|
|exec.plan.status.get|Retrieve step-level plan status|