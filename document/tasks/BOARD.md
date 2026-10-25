# Project Task Board

This board represents the central state of all work orders organized by **Flows (Vertical Slices)**. The autonomous software development squad operates on this board, delivering end-to-end functionality to the **Client** (Stakeholder).

---

## 1. Flow Pipeline Overview

| Flow Identifier | Flow Name | Total Tasks | Completed | Active Step | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`FLOW-AUDIT`** | Codebase Gap Analysis & Backlog Mapping | 1 | 1 / 1 | Step 1 (Audit) | DONE |
| **`FLOW-01-MVP`** | Authentication & Session Continuity | 4 | 1 / 4 | Step 2 (Backend Implementation) | READY |
| **`FLOW-02-AUDIT`** | System Audit Logging Vertical Slice | 3 | 0 / 3 | Step 1 (Backend Implementation) | BACKLOG |
| **`FLOW-03-ADMIN`** | User Directory Search, Filtering & Pagination | 3 | 0 / 3 | Step 1 (Backend Implementation) | BACKLOG |

---

## 2. Active Flow: `FLOW-01-MVP` Board

### Backlog (Pending Execution)
- [TASK-002: Implement Dual Route Auth Endpoints and Refresh Token Lifecycle](backlog/FLOW-01-MVP/TASK-002-backend-auth-refresh.md) (Assignee: `backend-dev`)
- [TASK-003: Integrate Refresh Token Rotation and Silent Refresh Interceptor](backlog/FLOW-01-MVP/TASK-003-frontend-token-refresh.md) (Assignee: `frontend-dev`)
- [TASK-004: Validate End-to-End Authentication and Token Refresh](backlog/FLOW-01-MVP/TASK-004-qa-auth-verification.md) (Assignee: `qa-engineer`)

### In Progress (Active Subagents)
- None

### In Review (Awaiting Review & Sign-Off)
- None

### Done (Signed-Off Deliverables)
- [TASK-001: Define OpenAPI Schemas and Domain Parent Interface](done/FLOW-01-MVP/TASK-001-api-contracts.md) (Assignee: `tech-lead`, Sign-off: 2026-10-24)

---

## 3. Pending Client Decisions

Items requiring high-level business direction or approval from the **Client** are consolidated by the PO/BA into [CLIENT_QUESTIONS.md](CLIENT_QUESTIONS.md).

| Decision ID | Target Flow | Topic | PO/BA Recommendation | Client Status |
| :--- | :--- | :--- | :--- | :--- |
| - | - | No active blockers pending client | - | CLEAR |

---

## 4. Autonomous Squad Responsibility Directory

- **Client (User)**: Primary stakeholder. Communicates feedback directly to BA; reviews high-level proposals when desired.
- **Business Analyst (`business-analyst`)**: Directly interfaces with Client, logs meeting minutes in [CLIENT_BA_ALIGNMENT.md](CLIENT_BA_ALIGNMENT.md), updates use cases, and briefs PM on task adjustments.
- **Product Owner (`product-owner`)**: Holds full decision-making authority in the squad to prevent delays; enforces invariants and business rules.
- **Project Manager (`project-manager`)**: Flow orchestration, task assignment, status updates across ticket folders and this board.
- **Tech Lead (`tech-lead`)**: Directs implementation in code files (`src/`), audits codebase to prevent duplicates, reviews code quality. No code definition in markdown.
- **Backend Developer (`backend-dev`)**: Production implementation directly in backend source files.
- **Frontend Developer (`frontend-dev`)**: Production implementation directly in frontend source files.
- **QA Engineer (`qa-engineer`)**: Verifies working code against acceptance criteria.
