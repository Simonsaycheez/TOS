# Architecture
This section defines a three-layer architecture for implementing OAP-based orchestrated intelligence. The layering is an implementation model (one valid approach) that separates **registration and change control**, **runtime execution and mediation**, and **audit and assurance** concerns.

![Sequence diagram – Page 11](Sequence%20diagram%20-%20Page%2011.png)
![Sequence diagram – Page 10](Sequence%20diagram%20-%20Page%2010.png)


The three layers are:

1. **Registration & Lifecycle Layer**
    
2. **Execution & Mediation Layer**
    
3. **Audit & Assurance Layer**


Each layer is defined by its responsibilities, primary components, and the OAP envelope categories it commonly uses.

## **1. Registration & Lifecycle Layer**

  

### **Purpose**

  

Establish and maintain a governed catalog of capabilities and artifacts, and manage controlled evolution of knowledge and operational assets (models, rules, policies, prompts, ontologies, documentation).

  

### **Primary Responsibilities**

- Capability discovery and module onboarding
    
- Artifact registration, retrieval, and lifecycle state transitions
    
- Knowledge change workflows (propose/validate/simulate/approve/apply/rollback)
    
- Versioning, reproducibility metadata, and stable identifiers
    
- Preparing inputs required for safe runtime mediation (schemas, constraints hints, compatibility info)
    

  

### **Typical Components**

- **Capability Registry Service**
    
- **Artifact Registry Service**
    
- **Knowledge Change Manager**
    
- **Schema / Contract Store** (input/output schemas, compatibility metadata)
    
- **Release / Promotion Controller** (moving artifacts between lifecycle stages)

### **Outputs Produced by This Layer**

- A consistent, versioned capability catalog
    
- A versioned artifact inventory and lifecycle state map
    
- Approved change records with stable identifiers
    
- References that execution can rely on (artifact versions, schema pointers)

## **2. Execution & Mediation Layer**

  

### **Purpose**

  

Perform runtime orchestration by invoking capabilities and subsymbolic engines, while applying mediation patterns such as validation, composition, constraint-aware execution, and interaction routing.

  

This layer is responsible for turning “an intent to act” into an executed outcome using modular, replaceable components.

  

### **Primary Responsibilities**

- Single-step execution and multi-step plan execution
    
- Orchestration routing to modules and tools
    
- Runtime mediation between symbolic and subsymbolic modules
    
- Execution state management (sync/async, status, cancellation)
    
- Explaining runtime outcomes and linking evidence where needed
    
- Optional HITL routing where configured (without defining policy logic here)
    

  

### **Typical Components**

- **Orchestration Gateway** (entrypoint router)
    
- **Execution Coordinator** (sync/async, invocation IDs, status)
    
- **Planner / Plan Executor** (DAG execution for exec.plan.*)
    
- **Mediator / Validator Layer** (schema validation, semantic checks, guardrails)
    
- **SIA Adapter(s)** (LLM inference, embeddings, vector search, scoring)
    
- **Explanation Generator** (structured explanation output)
    
- **Evidence Resolver / Evidence Manager**


### **Outputs Produced by This Layer**

- Invocation results (sync) or handles (async)
    
- Plans and plan execution traces
    
- Explanations and evidence references (when requested/available)
    
- Structured execution errors and status transitions


## **3. Audit & Assurance Layer**

  

### **Purpose**

  

Provide verifiable accountability for orchestration behavior by recording immutable traces, capturing incidents, supporting audits, and enabling assurance functions such as replay, review, and compliance reporting.

  

This layer is focused on “how we prove what happened” and “how we demonstrate conformance,” rather than performing execution itself.

  

### **Primary Responsibilities**

- Recording provenance events and maintaining event chaining
    
- Ledger anchoring and queryability of audit metadata
    
- Incident capture and forensic separation of anomalies
    
- Assurance reporting (coverage, exceptions, conformance signals)
    
- Evidence retention and integrity support (where implemented)
    
- Supporting replay, investigation, and audit workflows
    

  

### **Typical Components**

- **Provenance Event Store**
    
- **Provenance Ledger / Anchor Service**
    
- **Incident Ledger / Incident Manager**
    
- **Audit Query API**
    
- **Assurance Reporter** (conformance dashboards, audit packages)
    
- **Retention / Access Control Layer** (for audit records)

### **Outputs Produced by This Layer**

- Ledger metadata and event-chain references
    
- Incident records and remediation references
    
- Audit-ready reports and verification artifacts

## **Cross-Layer Boundary Notes**

- **Registration & Lifecycle** produces stable references (capability and artifact versions) consumed by **Execution & Mediation**.
    
- **Execution & Mediation** produces runtime outcomes and structured traces consumed by **Audit & Assurance**.
    
- **Audit & Assurance** provides verification interfaces that can be queried by other layers, but it should not be required to run the execution path synchronously.

## **Layer Summary Table**

|**Layer**|**Primary Role**|**Main Concern**|
|---|---|---|
|Registration & Lifecycle|Define what exists and how it changes|Catalogs, versions, approvals|
|Execution & Mediation|Execute and coordinate runtime behavior|Invocation, mediation, planning|
|Audit & Assurance|Prove what happened and support auditing|Provenance, incidents, assurance|

## **Layer Relation Diagram**
![Orchestration relation diagram](Sequence%20diagram%20-%20Orchestration%20relation%20diagram.png)

