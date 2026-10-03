# Distributed Remote Code Execution Engine

A scalable, sandboxed code runner backend designed to securely evaluate and execute untrusted user code in C++, Python, and Java.

## System Architecture Overview
- **API Ingestion:** Accepts source payload, target compiler, and runtime constraints via REST endpoints.
- **Sandboxed Execution:** Dispatches isolated sub-processes with pre-configured CPU time and memory boundaries.
- **Defensive Timeout Interceptors:** Automatically intercepts runaway recursion and infinite loops (enforcing 3000ms threshold).
- **Automated Lifecycle Cleanup:** Cleans up intermediate binary and script artifacts post-execution.

## Tech Stack
- **Runtime:** Node.js & Express.js
- **Execution & Sandboxing:** Child Process / Container isolation
- **Supported Compilers:** GCC (G++ for C++), Python 3

## API Specification

### Endpoint
`POST /execute`

### Request Payload
```json
{
  "language": "python",
  "code": "print('Hello World from Sandboxed Runner!')"
}
