---
id: TASK-005
title: Instrument Audit Event Triggers across Sensitive Mutation Operations
flow: FLOW-02-AUDIT
step_in_flow: Step 1 of 3 (Backend Implementation)
assigned_to: backend-dev
reviewer: tech-lead
status: TODO
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/01-business-rule/br-auth-rbac.md
  - docs/Software_Architecture_Design_Report.md
outputs:
  - aives-backend/src/main/java/com/aives/modules/system/service/AuditService.java
  - aives-backend/src/main/java/com/aives/modules/auth/service/impl/UserServiceImpl.java
  - aives-backend/src/main/java/com/aives/modules/system/service/impl/SystemSettingServiceImpl.java
  - aives-backend/src/main/java/com/aives/modules/grading/service/impl/GradingServiceImpl.java
  - aives-backend/src/main/java/com/aives/modules/grading/service/impl/AppealServiceImpl.java
dependencies:
  - docs/tasks/backlog/FLOW-01-MVP/TASK-004-qa-auth-verification.md
---

# Task: [TASK-005] Instrument Audit Event Triggers across Sensitive Mutation Operations

## 1. Flow Context
- **Target Flow**: [FLOW-02-AUDIT](file:///docs/tasks/BOARD.md#flow-02-audit)
- **Position in Flow**: Step 1 of 3.
- **Previous Step**: Handover from completed `FLOW-01-MVP`.
- **Next Step Triggered**: [TASK-006](file:///docs/tasks/backlog/FLOW-02-AUDIT/TASK-006-frontend-audit-diff-viewer.md).

## 2. Acceptance Criteria (Product Owner)
- [ ] Every user status change (`ACTIVE` / `INACTIVE`) and user deletion must record an audit entry into `audit_logs` capturing `actorId`, `action`, `entityName = USER`, `entityId`, `oldValue`, and `newValue`.
- [ ] Updating system settings in `SystemSettingServiceImpl` must record audit log entries with the previous and updated configuration values.
- [ ] In `GradingServiceImpl`, manual score override (`saveQuestionGrade`) and publishing of results (`publishAttempt`) must log audit entries recording the teacher ID, student attempt ID, and score changes.
- [ ] In `AppealServiceImpl`, resolving a grade appeal must record whether the appeal was accepted/rejected, the previous score, and the adjusted score.
- [ ] Audit log insertion must be resilient (wrapped in transaction or asynchronous/non-blocking so core mutations succeed even if audit logging encounters non-fatal errors).

## 3. Technical Constraints (Tech Lead)
- Inject `AuditService` cleanly into the relevant service classes.
- Store `oldValue` and `newValue` as JSON or formatted string representation.
- Verify with `mvn test-compile`.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None

## 5. Work Execution Checklist (Assignee: backend-dev)
- [ ] Verify `AuditService.log(...)` method signature.
- [ ] Wire `AuditService` into `UserServiceImpl`, `SystemSettingServiceImpl`, `GradingServiceImpl`, and `AppealServiceImpl`.
- [ ] Format diff payloads safely without exposing passwords or sensitive tokens.
- [ ] Verify compilation with `mvn test-compile`.
- [ ] Move ticket to review and notify `tech-lead`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [ ] No performance regression on critical paths.
- [ ] Security rules followed: no credentials in audit payloads.
- [ ] Move ticket to `docs/tasks/done/` and unblock TASK-006.
