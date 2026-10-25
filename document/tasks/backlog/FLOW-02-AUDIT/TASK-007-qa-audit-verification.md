---
id: TASK-007
title: Validate Audit Logging Event Capture and Querying End-to-End
flow: FLOW-02-AUDIT
step_in_flow: Step 3 of 3 (Verification & Sign-Off)
assigned_to: qa-engineer
reviewer: product-owner
status: TODO
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/tasks/backlog/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md
  - docs/tasks/backlog/FLOW-02-AUDIT/TASK-006-frontend-audit-diff-viewer.md
outputs:
  - aives-backend/src/test/java/com/aives/modules/system/SystemAndDashboardApiTest.java
dependencies:
  - docs/tasks/backlog/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md
  - docs/tasks/backlog/FLOW-02-AUDIT/TASK-006-frontend-audit-diff-viewer.md
---

# Task: [TASK-007] Validate Audit Logging Event Capture and Querying End-to-End

## 1. Flow Context
- **Target Flow**: [FLOW-02-AUDIT](file:///docs/tasks/BOARD.md#flow-02-audit)
- **Position in Flow**: Step 3 of 3.
- **Previous Steps**: [TASK-005](file:///docs/tasks/backlog/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md), [TASK-006](file:///docs/tasks/backlog/FLOW-02-AUDIT/TASK-006-frontend-audit-diff-viewer.md).
- **Next Step Triggered**: Complete Flow -> Handover to `FLOW-03-ADMIN`.

## 2. Acceptance Criteria (Product Owner)
- [ ] Automated integration test asserts that performing a status change triggers an audit entry in DB.
- [ ] Automated integration test asserts that `GET /api/admin/audit-logs` returns recorded entries filtered by entity name and action.
- [ ] Both `mvn test-compile` and `npm run build` pass cleanly.

## 3. Technical Constraints (Tech Lead)
- Add test methods into `SystemAndDashboardApiTest.java`.
- Follow standard test runner protocols.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None

## 5. Work Execution Checklist (Assignee: qa-engineer)
- [ ] Write integration test assertions for audit logging triggers.
- [ ] Verify frontend build.
- [ ] Sign off with Product Owner.

## 6. Review & Sign-Off (Reviewer: product-owner)
- [ ] Flow FLOW-02-AUDIT closed and signed off.
