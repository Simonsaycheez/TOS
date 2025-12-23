# Common Type Schema Reference
## **Purpose of Common Types**

  

This section defines the **core internal data structures** used across all OAP envelopes.

These common fields exist inside every request and response message body, regardless of category (execution, lifecycle, provenance, policy, SIA, etc.).

  

This chapter intentionally excludes all HTTP header definitions and focuses solely on the content **inside the JSON envelope**.

  

## **1. Base Envelope Structure Model**

  

All envelopes share the same foundational shape:
```
{
  "jsonrpc": "2.0",
  "id": "string",
  "envelope_type": "string",
  "_meta": { ... },
  ...
}
```
The fields defined below represent **guaranteed cross-category fields**.

## **2. Required Common Fields**

### **2.1 jsonrpc**

```
jsonrpc: "2.0"
```
Identifies the JSON-RPC version used to frame the envelope.

### **2.2 id**
```
id: string
```
A unique identifier that maps one request to one response.

This value is always present for both:

- request envelopes
    
- response envelopes

### **2.3 envelope_type**
```
envelope_type: string
```
Declares the semantic identity of the envelope.

  

Examples:

- "exec.invoke"
    
- "policy.evaluate"
    
- "sia.infer"
    

  

This field determines how the envelope payload is interpreted.
## **3. Common Request Body Format**

  

All request envelopes extend the following structure:
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

- params MUST exist, even if empty
    
- _meta is optional
    

No business definition exists inside this chapter — categories define their own params.

## **4. Common Success Response Format**

  

All successful responses share this structure:
```
{
  "jsonrpc": "2.0",
  "id": string,
  "envelope_type": string,
  "result": object,
  "_meta"?: object
}
```

Where:

- result MUST exist if the envelope is a success
    
- _meta is optional
## **5. Common Error Response Format**

  

Error envelopes follow the same structural base:
```
{
  "jsonrpc": "2.0",
  "id": string,
  "envelope_type": string,
  "error": {
    "code": string,
    "message": string
  },
  "_meta"?: object
}
```
Where:

- error MUST exist
    
- result MUST NOT appear
## **6. Common Error Object**

  

The error block inside an error envelope has a fixed, category-agnostic shape:
```
{
  "code": "string",
  "message": "string",
  "details"?: object
}

```
Purpose:

- allows all categories to report failure consistently
    
- avoids category-specific interpretation at the base protocol layer
## **7. Common Metadata Object (_meta)**

  

The _meta object carries cross-cutting optional metadata:

```
{
  "timestamp"?: string,
  "labels"?: { [key: string]: string },
  "client_version"?: string,
  "locale"?: string
}
```
Rules:

- _meta is OPTIONAL
    
- _meta NEVER changes envelope meaning
    
- _meta is available in both requests and responses

## **8. Envelope Field Rules**

  

### **8.1 Exclusivity Rule**

  

A response envelope MUST contain either:

- result (success), or
    
- error (failure)
    

  
### **8.2 Structural Uniformity Rule**

  

Every envelope must contain:

- jsonrpc
    
- id
    
- envelope_type
    


## **9. Summary**

  

The Common Envelope Type Schema:

- establishes the universal internal JSON structure
    
- enables cross-category compatibility
    
- guarantees request/response uniformity
    
- provides a extensible metadata surface
    
- defines error response behavior consistently
    

Every envelope in the protocol MUST be built by extending these shared field definitions.

