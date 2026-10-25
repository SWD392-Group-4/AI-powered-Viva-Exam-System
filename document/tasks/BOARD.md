# Project Task Board

This board represents the central state of all work orders organized by **Flows (Vertical Slices)**. The autonomous software development squad operates on this board, delivering end-to-end functionality to the **Client** (Stakeholder).

---

## 1. Flow Pipeline Overview

| Flow Identifier | Flow Name | Total Tasks | Completed | Active Step | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`FLOW-02-QUESTION-BANK`** | Course Rubric, Chapter RAG & Shared Question Bank | 5 | 4 / 5 | Step 5 (QA Verification & UAT) | **CRITICAL / URGENT** | IN_PROGRESS |
| **`FLOW-01-MVP`** | Authentication & RBAC Core | 4 | 1 / 4 | Step 2 (Backend) | HIGH | QUEUED |
| **`FLOW-AUDIT`** | Codebase Gap Analysis & Backlog Mapping | 1 | 0 / 1 | Step 1 (Audit) | MEDIUM | QUEUED |

---

## 2. Active Flow: `FLOW-02-QUESTION-BANK` Board (Priority 1)

### Backlog (Pending Dependency)
- None

### Ready / In Progress (Active Subagents)
- **[TASK-014: QA Verification & UAT Testing](backlog/FLOW-02-QUESTION-BANK/TASK-014-qa-verification.md)**
  - Assignee: `qa-engineer`
  - Reviewer: `product-owner`
  - Status: **READY TO EXECUTE (Step 5 - QA Verification)**

### In Review (Awaiting Review & Sign-Off)
- None

### Done (Signed-Off Deliverables)
- **[TASK-010: Define OpenAPI Schemas and Domain Contracts](done/FLOW-02-QUESTION-BANK/TASK-010-contracts-specs.md)** (Assignee: `tech-lead`, Sign-off: `software-architect`)
- **[TASK-011: Database Migrations for Course Hierarchy & MongoDB Setup](done/FLOW-02-QUESTION-BANK/TASK-011-db-migration.md)** (Assignee: `backend-dev`, Sign-off: `tech-lead`)
- **[TASK-012: Implement Course Rubric, RAG & Shared Bank Services](done/FLOW-02-QUESTION-BANK/TASK-012-backend-services.md)** (Assignee: `backend-dev`, Sign-off: `tech-lead`)
- **[TASK-013: Frontend UI for Course Rubric & Question Bank](done/FLOW-02-QUESTION-BANK/TASK-013-frontend-ui.md)** (Assignee: `frontend-dev`, Sign-off: `tech-lead`)

---

## 3. Pending Client Decisions

| Decision ID | Target Flow | Topic | PO/BA Recommendation | Client Status |
| :--- | :--- | :--- | :--- | :--- |
| `ALIGN-002` | `FLOW-02-QUESTION-BANK` | Course single rubric, easy/med/hard, shared bank, no AI rubric gen | Implemented in Docs, DB Migration, Backend Services & Frontend UI | **ALIGNED / CLOSED** |

---

## 4. Autonomous Squad Responsibility Directory

- **Client (User)**: Primary stakeholder. Communicates feedback directly to BA; reviews high-level proposals when desired.
- **Business Analyst (`business-analyst`)**: Directly interfaces with Client, logs meeting minutes in [CLIENT_BA_ALIGNMENT.md](CLIENT_BA_ALIGNMENT.md), updates use cases, and briefs PM on task adjustments.
- **Product Owner (`product-owner`)**: Holds full decision-making authority in the squad to prevent delays; enforces invariants and business rules.
- **Project Manager (`project-manager`)**: Flow orchestration, task assignment, status updates across ticket folders and this board.
- **Tech Lead (`tech-lead`)**: Directs implementation in code files (`src/`), audits codebase to prevent duplicates, reviews code quality.
- **Backend Developer (`backend-dev`)**: Production implementation directly in backend source files.
- **Frontend Developer (`frontend-dev`)**: Production implementation directly in frontend source files.
- **QA Engineer (`qa-engineer`)**: Verifies working code against acceptance criteria.
