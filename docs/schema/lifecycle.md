# Lifecycle and knowledge manegement Type Schema Reference
This section defines schemas used to manage the lifecycle of artifacts and the incremental evolution of knowledge within an orchestration system.

  

Lifecycle schemas extend the **Common Envelope Types** and do not redefine transport, governance, or provenance behavior.

  

This section introduces:

- optional lifecycle-related headers
    
- artifact metadata schemas
    
- lifecycle envelope definitions
    
- knowledge change envelope definitions
    


## **0 Optional Lifecycle HTTP Headers**

  

The following headers MAY appear on lifecycle- or knowledge-related requests and responses.

| **Header**               | **Purpose**                                                 |
| ------------------------ | ----------------------------------------------------------- |
| Orch-Artifact-Id         | Identifies the artifact affected by the lifecycle operation |
| Orch-Artifact-Version    | Indicates the artifact version being referenced             |
| Orch-Lifecycle-Stage     | Optional surfaced lifecycle stage (e.g. ACTIVE, DEPRECATED) |
| Orch-Knowledge-Change-Id | Identifies a knowledge change transaction                   |
| Orch-Change-Status       | Optional surfaced change status                             |


These headers are informational only and MUST remain consistent with envelope payloads if present.


## **1 Lifecycle Envelope Skeleton**

  

All lifecycle and knowledge envelopes follow the common envelope structure.

  

### **Request**
```
{
  jsonrpc: "2.0",
  id: OrchId,
  envelope_type: "lifecycle.*" | "knowledge.*",
  params: object,
  _meta?: OrchMeta
}
```

### **Response**
```
{
  jsonrpc: "2.0",
  id: OrchId,
  envelope_type: "lifecycle.*" | "knowledge.*",
  result?: object,
  error?: OrchError,
  _meta?: OrchMeta
}
```

## **2 Core Enumerations**

  

### **2.1 ArtifactType**
```
type ArtifactType =
  | "MODEL"
  | "RULESET"
  | "POLICY"
  | "PROMPT"
  | "ONTOLOGY"
  | "KNOWLEDGE_BASE"
  | "DOCUMENTATION";
```

### **2.2 LifecycleStage**
```
type LifecycleStage =
  | "DRAFT"
  | "VALIDATED"
  | "APPROVED"
  | "ACTIVE"
  | "DEPRECATED"
  | "RETIRED";
```

### **2.3 KnowledgeChangeStatus**

```
type KnowledgeChangeStatus =
  | "PROPOSED"
  | "VALIDATED"
  | "SIMULATED"
  | "APPROVED"
  | "APPLIED"
  | "ROLLED_BACK"
  | "REJECTED";
```

## **3 Artifact Metadata Model**
```
interface ArtifactMetadata {
  artifact_id: string;
  type: ArtifactType;
  name: string;
  version: string;
  previous_version?: string;

  lifecycle_stage: LifecycleStage;

  created_at: string;
  created_by: string;

  description?: string;
  checksum: string;
  labels?: Record<string, string>;
}
```

This model is reused across all lifecycle and knowledge envelopes.

## **4 Artifact Lifecycle Envelopes**
### **4.1 lifecycle.artifact.register**

  

#### **Params**
```
interface ArtifactRegisterParams {
  metadata: ArtifactMetadata;
  payload_ref?: object;
}
```

#### **Result**
```
interface ArtifactRegisterResult {
  metadata: ArtifactMetadata;
}
```

### **4.2 lifecycle.artifact.deprecate**

  

#### **Params**
```
interface ArtifactDeprecateParams {
  artifact_id: string;
  version: string;
  reason?: string;
}
```

#### **Result**
```
interface ArtifactDeprecateResult {
  artifact_id: string;
  version: string;
  new_lifecycle_stage: LifecycleStage;
}
```

### **4.3 lifecycle.artifact.retire**

  

#### **Params**
```
interface ArtifactRetireParams {
  artifact_id: string;
  version: string;
  reason?: string;
}
```

#### **Result**
```
interface ArtifactRetireResult {
  artifact_id: string;
  version: string;
  new_lifecycle_stage: LifecycleStage;
}
```

### **4.4 lifecycle.artifact.get**

  

#### **Params**
```
interface ArtifactGetParams {
  artifact_id: string;
  version?: string;
}
```

#### **Result**
```
interface ArtifactGetResult {
  metadata: ArtifactMetadata;
  payload_ref?: object;
}
```

## **5 Knowledge Change Model**
```
interface KnowledgeChange {
  change_id: string;
  artifact_id: string;

  version_before: string;
  version_after?: string;

  status: KnowledgeChangeStatus;
  requested_stage?: LifecycleStage;

  proposer: string;
  proposed_at: string;

  proposal: object;
  rationale?: string;

  reviewers?: string[];

  validated_at?: string;
  validated_by?: string;

  simulation_result?: object;
  simulated_at?: string;

  approved_at?: string;
  approved_by?: string;

  applied_at?: string;
  applied_by?: string;

  rollback_reason?: string;
  rolled_back_at?: string;
  rolled_back_by?: string;

  event_hash?: string;
  labels?: Record<string, string>;
}
```

## **6 Knowledge Evolution Envelopes**
### **6.1 knowledge.change.propose**
```
interface KnowledgeChangeProposeParams {
  artifact_id: string;
  version_before: string;
  proposal: object;
  rationale?: string;
  requested_stage?: LifecycleStage;
}

interface KnowledgeChangeProposeResult {
  change: KnowledgeChange;
}
```

### **6.2 knowledge.change.validate**
```
interface KnowledgeChangeValidateParams {
  change_id: string;
  validator: string;
  notes?: string;
  passed: boolean;
}

interface KnowledgeChangeValidateResult {
  change: KnowledgeChange;
}
```

### **6.3 knowledge.change.simulate**
```
interface KnowledgeChangeSimulateParams {
  change_id: string;
  simulation_config?: object;
}

interface KnowledgeChangeSimulateResult {
  change: KnowledgeChange;
}
```

### **6.4 knowledge.change.approve**
```
interface KnowledgeChangeApproveParams {
  change_id: string;
  approver: string;
  approval_reason?: string;
}

interface KnowledgeChangeApproveResult {
  change: KnowledgeChange;
}
```

### **6.5 knowledge.change.apply**
```
interface KnowledgeChangeApplyParams {
  change_id: string;
  applied_by: string;
}

interface KnowledgeChangeApplyResult {
  change: KnowledgeChange;
  artifact: ArtifactMetadata;
}
```

### **6.6 knowledge.change.rollback**

```
interface KnowledgeChangeRollbackParams {
  change_id: string;
  rolled_back_by: string;
  reason?: string;
}

interface KnowledgeChangeRollbackResult {
  change: KnowledgeChange;
  artifact?: ArtifactMetadata;
}
```

### **6.7 knowledge.change.get / knowledge.change.query**
```
interface KnowledgeChangeGetParams {
  change_id: string;
}

interface KnowledgeChangeGetResult {
  change: KnowledgeChange;
}
```

```
interface KnowledgeChangeQueryParams {
  artifact_id?: string;
  status?: KnowledgeChangeStatus;
  lifecycle_stage?: LifecycleStage;
  page?: OrchPageRequest;
}

interface KnowledgeChangeQueryResult {
  changes: KnowledgeChange[];
  page?: OrchPageResponse<KnowledgeChange>;
}
```

## **7 Lifecycle Envelope Summary Table**
|**Envelope**|**Purpose**|
|---|---|
|lifecycle.artifact.register|Register a new artifact|
|lifecycle.artifact.deprecate|Mark artifact as deprecated|
|lifecycle.artifact.retire|Retire artifact|
|lifecycle.artifact.get|Retrieve artifact metadata/content|
|knowledge.change.propose|Propose a knowledge change|
|knowledge.change.validate|Validate a change|
|knowledge.change.simulate|Simulate a change|
|knowledge.change.approve|Approve a change|
|knowledge.change.apply|Apply a change|
|knowledge.change.rollback|Roll back a change|
|knowledge.change.get|Retrieve a change|
|knowledge.change.query|Query changes|
