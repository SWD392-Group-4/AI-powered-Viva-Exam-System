---
id: TASK-003
title: Integrate Refresh Token Rotation and Silent Refresh Interceptor
flow: FLOW-01-MVP
step_in_flow: Step 3 of 4 (Frontend Integration)
assigned_to: frontend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/05-api-specs/openapi-spec.yaml
  - docs/tasks/backlog/FLOW-01-MVP/TASK-002-backend-auth-refresh.md
outputs:
  - aives-frontend/src/services/tokenStorage.js
  - aives-frontend/src/services/apiClient.ts
  - aives-frontend/src/services/authService.js
dependencies:
  - docs/tasks/backlog/FLOW-01-MVP/TASK-002-backend-auth-refresh.md
---

# Task: [TASK-003] Integrate Refresh Token Rotation and Silent Refresh Interceptor

## 1. Flow Context
- **Target Flow**: [FLOW-01-MVP](file:///docs/tasks/BOARD.md#2-active-flow-flow-01-mvp-board)
- **Position in Flow**: Step 3 of 4.
- **Previous Step**: [TASK-002](file:///docs/tasks/backlog/FLOW-01-MVP/TASK-002-backend-auth-refresh.md).
- **Next Step Triggered**: [TASK-004](file:///docs/tasks/backlog/FLOW-01-MVP/TASK-004-qa-auth-verification.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Save both `accessToken` and `refreshToken` securely upon successful login/registration in `tokenStorage.js`.
- [x] Implement silent token refresh interceptor in `apiClient.ts`: When an API request returns HTTP 401 (excluding login/register endpoints), attempt a single refresh call to `/auth/refresh` or `/api/v1/auth/refresh`.
- [x] If refresh succeeds: Store new access token, update Authorization header, and transparently retry the failed request.
- [x] If refresh fails or returns 401: Clear session, dispatch `auth:unauthorized` event, and redirect user to `/login`.
- [x] Clear both tokens on user logout (`authService.logout()`).

## 3. Technical Constraints (Tech Lead)
- Avoid infinite refresh loops (guard with `_retry` flag or queue mechanism for concurrent requests).
- Verify build with `npm run build` in `aives-frontend` without errors.
- Never write placeholder code; produce fully functional state management.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None
- PO/BA Preliminary Decision: Option A approved.

## 5. Work Execution Checklist (Assignee: frontend-dev)
- [x] Update `tokenStorage.js` with `getRefreshToken()`, `setRefreshToken()`, and `clearSession()`.
- [x] Add `refreshAccessToken()` helper in `authService.js`.
- [x] Implement 401 retry queue interceptor in `apiClient.ts`.
- [x] Test frontend build with `npm run build`.
- [x] Move ticket to review and notify `tech-lead`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [x] No regression in existing authentication flows.
- [x] Verification gate passes with zero build/lint errors.
- [x] Move ticket to `docs/tasks/done/` and unblock TASK-004.
