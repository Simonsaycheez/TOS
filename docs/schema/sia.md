# SIA Type Schema Reference
The SIA (Subsymbolic Intelligence Agent) category defines envelope schemas for invoking subsymbolic or statistical intelligence capabilities.

  

SIA envelopes are **execution-specialized envelopes** that extend the execution model while introducing subsymbolic-specific input and output structures.

  

This section defines:

- optional SIA-related headers
    
- SIA envelope skeleton
    
- subsymbolic execution schemas (infer, embed, search, score, validate)
    

  

It does **not** define governance rules, provenance mechanics, or symbolic reasoning behavior.



## **0 Optional SIA HTTP Headers**

  

The following headers MAY appear on SIA-related requests or responses.

They are optional and informational only.

| **Header**               | **Purpose**                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| Orch-SIA-Operation       | Indicates subsymbolic operation type (INFER, EMBED, SEARCH, etc.) |
| Orch-Model-Id            | Logical identifier of the model being invoked                     |
| Orch-Model-Version       | Version or revision of the model                                  |
| Orch-Model-Format        | Model format hint (LLM, EMBEDDING_MODEL, etc.)                    |
| Orch-Uncertainty-Enabled | Indicates whether uncertainty output is requested                 |
| Orch-SIA-Latency-Ms      | Optional surfaced model execution latency                         |

If present, these headers MUST be consistent with envelope payload values.

## **1 SIA Envelope Skeleton**

  

All SIA envelopes follow the common execution envelope structure.

  

### **Request**

```
{
  jsonrpc: "2.0",
  id: OrchId,
  envelope_type: "sia.*",
  params: object,
  _meta?: OrchMeta
}
```

### **Response**

```
{
  jsonrpc: "2.0",
  id: OrchId,
  envelope_type: "sia.*",
  result?: object,
  error?: OrchError,
  _meta?: OrchMeta
}
```

## **2 Core Enumerations**

  

### **2.1 SIAOperationType**

```
type SIAOperationType =
  | "INFER"
  | "EMBED"
  | "SEARCH"
  | "SCORE"
  | "VALIDATE";
```


### **2.2 ModelFormat**

```
type ModelFormat =
  | "LLM"
  | "EMBEDDING_MODEL"
  | "VECTOR_INDEX"
  | "CLASSIFIER"
  | "UNKNOWN";
```

### **2.3 EmbeddingMode**

```
type EmbeddingMode =
  | "SINGLE"
  | "BATCH";
```

### **2.4 SearchReturnFormat**

```
type SearchReturnFormat =
  | "DOCUMENT"
  | "CHUNK"
  | "VECTOR"
  | "CUSTOM";
```

### **2.5 UncertaintyOutputStyle**

```
type UncertaintyOutputStyle =
  | "SCORE"
  | "FLAGS"
  | "CONFIDENCE_INTERVAL";
```

## **3 SIA Target Definition**

```
interface SIATarget {
  module_id: string;
  model_id: string;
  format: ModelFormat;
  version?: string;
}
```

This structure identifies the subsymbolic model endpoint to be invoked.

## **4 sia.infer**

  

### **Envelope Type**

  

sia.infer

  

Used for subsymbolic inference such as text generation, classification, or transformation.

  

### **4.1 Request Params**

```
interface SIAInferParams {
  target: SIATarget;

  input: {
    prompt: string;
    context?: object;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    stop?: string[];
  };

  uncertainty?: {
    enabled: boolean;
    style?: UncertaintyOutputStyle;
  };

  mode?: ExecutionMode;
}
```


### **4.2 Result**

```
interface SIAInferResult {
  invocation_id: string;
  output: string;

  tokens_generated?: number;
  model_latency_ms?: number;

  uncertainty_score?: number;
  confidence_interval?: [number, number];
  hallucination_flags?: string[];

  provenance?: object;
}
```

## **5 sia.embed**

  

### **Envelope Type**

  

sia.embed

  

Generates embedding vectors for text or other modalities.

  

### **5.1 Request Params**

```
interface SIAEmbedParams {
  target: SIATarget;
  input: EmbeddingInput;
  mode?: ExecutionMode;
}
```

```
interface EmbeddingInput {
  text?: string | string[];
  image_ref?: object;
  audio_ref?: object;
  mode?: EmbeddingMode;
}
```

### **5.2 Result**

```
interface SIAEmbedResult {
  invocation_id: string;
  vectors: number[][];
  dimension: number;
  model_latency_ms?: number;
}
```

## **6 sia.search**

  

### **Envelope Type**

  

sia.search

  

Performs vector or model-backed retrieval.

  

### **6.1 Request Params**

```
interface SIASearchParams {
  target: SIATarget;
  query: number[] | string;
  top_k: number;

  return_format?: SearchReturnFormat;
  include_vectors?: boolean;
  include_scores?: boolean;

  mode?: ExecutionMode;
}
```

### **6.2 Result**

```
interface SIASearchResult {
  invocation_id: string;
  results: SIAHit[];
  model_latency_ms?: number;
}
```

```
interface SIAHit {
  document_id?: string;
  chunk_ref?: object;
  vector?: number[];
  score?: number;
  metadata?: object;
}
```

## **7 sia.score**

  

### **Envelope Type**

  

sia.score

  

Performs numeric scoring or prediction.

  

### **7.1 Request Params**

```
interface SIAScoreParams {
  target: SIATarget;
  input: object;
  return_distribution?: boolean;
  mode?: ExecutionMode;
}
```

### **7.2 Result**

```
interface SIAScoreResult {
  invocation_id: string;
  value: number;
  distribution?: number[];
  model_latency_ms?: number;
}
```

## **8 sia.validate**

  

### **Envelope Type**

  

sia.validate

  

Requests subsymbolic validation or uncertainty analysis.

  

### **8.1 Request Params**

```
interface SIAValidateParams {
  target: SIATarget;
  reference?: object;
  sample?: object;
  compute_uncertainty?: boolean;
  mode?: ExecutionMode;
}
```

### **8.2 Result**

```
interface SIAValidateResult {
  invocation_id: string;

  is_valid?: boolean;
  score?: number;
  uncertainty_score?: number;
  hallucination_detected?: boolean;

  model_latency_ms?: number;
}
```

## **9 SIA Error Type**

```
interface SIAErrorInfo extends ExecutionErrorInfo {
  model_stack_trace?: string;
  model_retry_suggested?: boolean;
}
```

This error type extends execution errors with model-specific diagnostics.

## **10 SIA Envelope Summary Table**

|**Envelope**|**Purpose**|
|---|---|
|sia.infer|Subsymbolic inference|
|sia.embed|Embedding generation|
|sia.search|Vector / model-backed retrieval|
|sia.score|Numeric scoring / prediction|
|sia.validate|Output validation / uncertainty analysis|