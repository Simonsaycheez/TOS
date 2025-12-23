# Envelope Type Reference
## A. Control Plane Base Classes (Required)

1. **control.ping**
    - For connectivity/health checks (only needed for cross-module communication).
2. **control.capability.register**
    - Module registers capabilities with Control-Plane (prerequisite for Criterion 3 replaceable modules).
3. **control.capability.query**
    - Query module/global capability catalog, versions, input/output schemas, constraints, etc.
4. **control.session.open / control.session.close**
    - Explicitly establish/close a "governed session" (facilitates policy binding, audit scope, data sensitivity level binding).
5. **explain.generate**
    - Explanation envelopes support semantic reasoning output that allows modules or interfaces to produce interpretable justification.
6. **evidence.resolve**
    - Evidence references support traceability and lineage verification at the application layer.

## B. Policy Governance Classes (Required for Policy/Decision)

1. **policy.evaluate**
    - PEP → Policy Engine: Evaluate policy for "a proposed action/request" (returns decision/constraints/HITL, etc.).
2. **policy.explain**
    - Request "why this decision was made" (policy rationale) for C8 transparent explanation (to humans or other modules).
3. **hitl.request**
    - Request human approval
4. **hitl.decision.submit**
    - Submit a human approval outcome

## C. Execution Coordination Classes (Only needed for actual execution)

1. **exec.invoke**
    - Control-Plane/PEP → capability module: Execute an action under "already decided/constrained" conditions (tool calls, RAG queries, model inference, etc.).
2. **exec.status.get**
    - Retrieves the current execution status of a previously submitted invocation, particularly useful for asynchronous operations.
3. **exec.cancel**
    - Requests cancellation of a pending or running execution, subject to system and governance constraints.
4. **exec.plan.submit**
    - Submit a "plan/workflow draft" (possibly from LLM planner), awaiting policy gate/human gate.
5. **exec.plan.apply**
    - Apply plan after approval (convert "draft" to executable steps), typically with HITL/dual-control review.
6. **exec.plan.status.get**
    - Retrieves the execution status of a multi-step plan, including per-step progress and outcomes.

## D. Human Governance Classes (Required for HITL/Dual-control)

1. **hitl.request**
    - System initiates human review/dual-control request (including points needing human confirmation, risks, recommended action scope).
2. **hitl.decision.submit**
    - Human submits approval/rejection/modified constraints/alternative selection.
3. **hitl.override**
    - Authorized person performs override (requires strong audit: who/why/what).

## E. Transparent Explanation and Evidence Classes (Highly Recommended)

1. **rationale.emit**
    - Module outputs structured rationale (claims/evidence/uncertainty/policy_context) — used for cross-module sharing or persistence.
2. **evidence.reference.resolve**
    - Resolve evidence references (e.g., document ID, fragment hash, retrieval result signature) to ensure traceability and verification.

## F. Provenance and Ledger Classes (Required for Provenance/Ledger)

1. **provenance.ledger.query**
    - Retrieves provenance ledger entries or metadata describing recorded orchestration events.
2. **provenance.incident.query**
    - Retrieves records of incidents, anomalies, or violations detected during system operation.
3. **provenance.artifact.register**
    - Registers a new versioned artifact in the provenance system, such as a model, policy, or ruleset.
4. **provenance.artifact.get**
    - Retrieves metadata or references for a previously registered artifact version.
5. **provenance.knowledge.change.query**
    - Queries historical records of knowledge or artifact changes over time.

## G. Lifecycle and Knowledge Evolution Classes (C7/C10 "only when transmission needed")

1. **lifecycle.artifact.register**
    - Register artifacts like models/rules/policies/ontologies/prompts (version, source, signature).
2. **lifecycle.artifact.deprecate**
    - Marks an artifact version as deprecated, indicating it should no longer be used for new operations.
3. **lifecycle.artifact.retire**
    - Fully retires an artifact version, indicating it is no longer active or supported.
4. **lifecycle.artifact.get**
    - Retrieves metadata and content references for a specific artifact version.
5. **knowledge.change.propose**
    - Proposes a change to an artifact or knowledge item as the first step in a governed evolution process.
6. **knowledge.change.validate**
    - Performs validation checks on a proposed change to assess correctness or compliance.
7. **knowledge.change.simulate**
    - Simulates the impact of a proposed change without applying it, often using test data or scenarios.
8. **knowledge.change.approve / knowledge.change.apply**
    - Approves and applies a validated change, transitioning it into an active state.
9. **knowledge.change.rollback**
    - Reverts a previously applied change, restoring the system to a prior known state.
10. **knowledge.change.get**
    - Retrieves details of a specific knowledge change record.
11. **knowledge.change.query**
    - Queries multiple knowledge change records based on filters such as artifact or status.
## H. SIA Classes

1. **sia.infer**
    - Execute a subsymbolic inference request (e.g., LLM generation, scoring, classification).
2. **sia.embed**
    - Request embedding generation for text, documents, image vectors, audio, or mixed modalities.
3. **sia.search**
    - Perform retrieval against model-backed knowledge stores or vector indices
4. **sia.score**
    - Statistical scoring or numeric prediction tasks (e.g., regression, ranking, classification confidence).
5. **sia.validate**
    - Request subsymbolic self-assessment, confidence calibration, or hallucination detection.
    
