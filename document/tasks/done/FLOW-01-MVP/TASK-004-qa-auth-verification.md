---
id: TASK-004
title: Validate End-to-End Authentication and Token Refresh
flow: FLOW-01-MVP
step_in_flow: Step 4 of 4 (Verification & Sign-Off)
assigned_to: qa-engineer
reviewer: product-owner
status: DONE
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/tasks/backlog/FLOW-01-MVP/TASK-002-backend-auth-refresh.md
  - docs/tasks/backlog/FLOW-01-MVP/TASK-003-frontend-token-refresh.md
outputs:
  - aives-backend/src/test/java/com/aives/modules/auth/AuthApiTest.java
dependencies:
  - docs/tasks/backlog/FLOW-01-MVP/TASK-002-backend-auth-refresh.md
  - docs/tasks/backlog/FLOW-01-MVP/TASK-003-frontend-token-refresh.md
---

# Task: [TASK-004] Validate End-to-End Authentication and Token Refresh

## 1. Flow Context
- **Target Flow**: [FLOW-01-MVP](file:///docs/tasks/BOARD.md#2-active-flow-flow-01-mvp-board)
- **Position in Flow**: Step 4 of 4.
- **Previous Steps**: [TASK-002](file:///docs/tasks/backlog/FLOW-01-MVP/TASK-002-backend-auth-refresh.md), [TASK-003](file:///docs/tasks/backlog/FLOW-01-MVP/TASK-003-frontend-token-refresh.md).
- **Next Step Triggered**: Complete Flow -> Handover to `FLOW-02-AUDIT`.

## 2. Acceptance Criteria (Product Owner)
- [x] Integration test covers `POST /api/v1/auth/login` returning valid access and refresh tokens.
- [x] Integration test covers `POST /api/v1/auth/refresh` successfully renewing tokens.
- [x] Integration test covers negative cases: expired refresh token, invalid token signature, revoked token after logout.
- [x] Frontend build and backend compilation pass cleanly.

## 3. Technical Constraints (Tech Lead)
- Add automated tests extending `ApiTestSupport` in `aives-backend/src/test/java/com/aives/modules/auth/`.
- Verify build using `mvn test-compile` and `npm run build`.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None

## 5. Work Execution Checklist (Assignee: qa-engineer)
- [x] Write integration test cases for login and token refresh endpoints.
- [x] Verify both `/api/v1/auth/*` and `/api/auth/*` route compatibility.
- [x] Execute test verification (`AuthApiTest` 5/5 passed, `mvn test-compile` and `npm run build` 100% clean).
- [x] Hand over to Product Owner for flow closure.

## 6. Review & Sign-Off (Reviewer: product-owner)
- [x] Acceptance criteria 100% satisfied.
- [x] Mark Flow FLOW-01-MVP as COMPLETED on BOARD.md.
