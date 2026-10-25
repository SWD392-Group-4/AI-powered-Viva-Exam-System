# Project Task Board

This board represents the central state of all work orders organized by **Flows (Vertical Slices)**. The autonomous software development squad operates on this board, delivering end-to-end functionality to the **Client** (Stakeholder).

---

## 1. Flow Pipeline Overview

| Flow Identifier | Flow Name | Total Tasks | Completed | Active Step | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`FLOW-AUDIT`** | Codebase Gap Analysis & Backlog Mapping | 1 | 1 / 1 | Step 1 (Audit) | DONE |
| **`FLOW-02-QUESTION-BANK`** | Course Rubric, Question Bank & Exam Lifecycle (Client Top Priority) | 9 | 7 / 9 | Step 8 (TASK-017) | IN_PROGRESS |
| **`FLOW-01-MVP`** | Authentication & Session Continuity | 4 | 1 / 4 | Step 2 (Backend Implementation) | READY |
| **`FLOW-02-AUDIT`** | System Audit Logging Vertical Slice | 3 | 0 / 3 | Step 1 (Backend Implementation) | BACKLOG |
| **`FLOW-03-ADMIN`** | User Directory Search, Filtering & Pagination | 3 | 0 / 3 | Step 1 (Backend Implementation) | BACKLOG |

---

## 2. Active Flow: `FLOW-02-QUESTION-BANK` Board (CLIENT TOP PRIORITY)

### Backlog (Pending Execution)
- [TASK-018: End-to-End QA Verification for Question Publishing, Exam Session, and Score Delivery Flow](backlog/FLOW-02-QUESTION-BANK/TASK-018-e2e-qa-verification.md) (Assignee: `qa-engineer`)

### In Progress (Active Subagents)
- [TASK-017: Connect Student Viva Attempt Answers to Course Rubric AI Grading & Score Calculation](in-progress/FLOW-02-QUESTION-BANK/TASK-017-grading-course-rubric.md) (Assignee: `backend-dev`)

### In Review (Awaiting Review & Sign-Off)
- None

### Done (Signed-Off Deliverables)
- [TASK-010: Define OpenAPI Schemas and Domain Contracts for Course Rubric & Question Bank](done/FLOW-02-QUESTION-BANK/TASK-010-contracts-specs.md) (Assignee: `tech-lead`, Sign-off: 2026-10-24)
- [TASK-011: Database Migrations for Course Hierarchy, Shared Questions, and MongoDB Audit Log Setup](done/FLOW-02-QUESTION-BANK/TASK-011-db-migration.md) (Assignee: `backend-dev`, Sign-off: 2026-10-25)
- [TASK-012: Implement Course Rubric, RAG Question Generation, Shared Bank & Audit Logging Services](done/FLOW-02-QUESTION-BANK/TASK-012-backend-services.md) (Assignee: `backend-dev`, Sign-off: 2026-10-25)
- [TASK-013: Frontend UI for Course Rubrics, Materials, Question Bank, and RAG Question Generation](done/FLOW-02-QUESTION-BANK/TASK-013-frontend-ui.md) (Assignee: `frontend-dev`, Sign-off: 2026-10-25)
- [TASK-014: Verification & UAT Testing for Course Rubric, Question Bank & Audit Logging](done/FLOW-02-QUESTION-BANK/TASK-014-qa-verification.md) (Assignee: `qa-engineer`, Sign-off: 2026-10-25)
- [TASK-015: Fix Question Publishing Flow and Lecturer Question Bank UI according to Documentation](done/FLOW-02-QUESTION-BANK/TASK-015-fix-question-posting-flow.md) (Assignee: `frontend-dev`, Sign-off: 2026-10-25)
- [TASK-016: Integrate Course & Chapter Question Bank into Exam Scheduling & Student Viva Session](done/FLOW-02-QUESTION-BANK/TASK-016-exam-session-course-questions.md) (Assignee: `backend-dev`, Sign-off: 2026-10-25)

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
