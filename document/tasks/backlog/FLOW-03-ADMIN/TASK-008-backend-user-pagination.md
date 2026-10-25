---
id: TASK-008
title: Implement Paginated and Filtered User Directory in Backend
flow: FLOW-03-ADMIN
step_in_flow: Step 1 of 3 (Backend Implementation)
assigned_to: backend-dev
reviewer: tech-lead
status: TODO
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/01-business-rule/br-auth-rbac.md
  - docs/05-crud-demo/README.md
outputs:
  - aives-backend/src/main/java/com/aives/modules/auth/controller/AdminUserController.java
  - aives-backend/src/main/java/com/aives/modules/auth/service/UserService.java
  - aives-backend/src/main/java/com/aives/modules/auth/service/impl/UserServiceImpl.java
dependencies:
  - docs/tasks/backlog/FLOW-02-AUDIT/TASK-007-qa-audit-verification.md
---

# Task: [TASK-008] Implement Paginated and Filtered User Directory in Backend

## 1. Flow Context
- **Target Flow**: [FLOW-03-ADMIN](file:///docs/tasks/BOARD.md#flow-03-admin)
- **Position in Flow**: Step 1 of 3.
- **Previous Step**: Handover from `FLOW-02-AUDIT`.
- **Next Step Triggered**: [TASK-009](file:///docs/tasks/backlog/FLOW-03-ADMIN/TASK-009-frontend-user-pagination.md).

## 2. Acceptance Criteria (Product Owner)
- [ ] `GET /api/admin/users` supports pagination query parameters: `page` (0-indexed, default 0), `size` (default 20, max 100), `search` (case-insensitive search across fullName, email, and id), `role` (`STUDENT`, `LECTURER`, `ADMIN`), and `active` (boolean).
- [ ] Return standard `PageResponse<UserResponse>` containing `content`, `page`, `size`, `totalElements`, and `totalPages`.
- [ ] Retain existing unpaginated behavior or backward compatibility if parameters are omitted.
- [ ] Ensure DB indexes on `users(email)`, `users(full_name)`, and `users(role_id)` are utilized.

## 3. Technical Constraints (Tech Lead)
- Use Spring Data JPA `Pageable` and `Specification` or query repository.
- Verify with `mvn test-compile`.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None

## 5. Work Execution Checklist (Assignee: backend-dev)
- [ ] Add query method / specification in `UserRepository`.
- [ ] Update `UserService` and `UserServiceImpl` to return `PageResponse<UserResponse>`.
- [ ] Update `AdminUserController` endpoint signature.
- [ ] Verify with `mvn test-compile`.
- [ ] Move ticket to review and notify `tech-lead`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [ ] Clean JPA specifications without N+1 query problems.
- [ ] Unblock TASK-009.
