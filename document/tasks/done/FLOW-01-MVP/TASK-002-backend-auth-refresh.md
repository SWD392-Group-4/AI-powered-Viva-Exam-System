---
id: TASK-002
title: Implement Dual Route Auth Endpoints and Refresh Token Lifecycle
flow: FLOW-01-MVP
step_in_flow: Step 2 of 4 (Backend Implementation)
assigned_to: backend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/04-domains/auth/interface_auth.md
  - docs/05-api-specs/openapi-spec.yaml
outputs:
  - aives-backend/src/main/java/com/aives/modules/auth/controller/AuthController.java
  - aives-backend/src/main/java/com/aives/modules/auth/service/AuthService.java
  - aives-backend/src/main/java/com/aives/modules/auth/service/impl/AuthServiceImpl.java
  - aives-backend/src/main/java/com/aives/common/security/JwtTokenProvider.java
  - aives-backend/src/test/java/com/aives/modules/auth/AuthLifecycleAndRefreshTokenTest.java
dependencies:
  - docs/tasks/done/FLOW-01-MVP/TASK-001-api-contracts.md
---

# Task: [TASK-002] Implement Dual Route Auth Endpoints and Refresh Token Lifecycle

## 1. Flow Context
- **Target Flow**: [FLOW-01-MVP](file:///docs/tasks/BOARD.md#2-active-flow-flow-01-mvp-board)
- **Position in Flow**: Step 2 of 4.
- **Previous Step**: [TASK-001](file:///docs/tasks/done/FLOW-01-MVP/TASK-001-api-contracts.md) (Done).
- **Next Step Triggered**: [TASK-003](file:///docs/tasks/backlog/FLOW-01-MVP/TASK-003-frontend-token-refresh.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Expose dual route support: `@RequestMapping({"/api/v1/auth", "/api/auth"})` on `AuthController` to fully satisfy OpenAPI contract while maintaining backward compatibility.
- [x] Implement `POST /refresh` and `POST /api/v1/auth/refresh` taking a valid refresh token and returning a fresh access token (and rotated refresh token).
- [x] Issue both `accessToken` (short-lived, 15-60 min) and `refreshToken` (long-lived, 7 days) upon successful login (`POST /login`).
- [x] Invalidate refresh tokens upon logout (`POST /logout`).
- [x] Reject expired, tampered, or blacklisted refresh tokens with HTTP 401 and standardized error code `AUTH_INVALID_TOKEN`.

## 3. Technical Constraints (Tech Lead)
- Implement directly in production source files under `aives-backend/src/main/java/com/aives/modules/auth/`.
- Maintain complete documentation integrity; preserve existing comments, exception handling, and audit timestamps.
- Validate with `mvn test-compile` before marking work complete.
- Never write placeholder, mock, or hollow code.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None
- PO/BA Preliminary Decision: Option A (Dual Route with Refresh Token) approved.
- Client Decision Link: None

## 5. Work Execution Checklist (Assignee: backend-dev)
- [x] Extend `JwtTokenProvider` to support generation and validation of refresh tokens with dedicated claims.
- [x] Add `RefreshTokenRequest` and `TokenRefreshResponse` DTOs conforming to `docs/05-api-specs/openapi-spec.yaml`.
- [x] Implement `refreshToken(RefreshTokenRequest request)` in `AuthService` and `AuthServiceImpl`.
- [x] Update `AuthController` with dual route mapping (`{"/api/v1/auth", "/api/auth"}`) and expose `@PostMapping("/refresh")`.
- [x] Verify compilation with `mvn test-compile` and automated integration tests in `AuthLifecycleAndRefreshTokenTest`.
- [x] Move ticket to review and notify `tech-lead`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [x] Code follows production security standards (no secrets exposed in logs, token signature validated).
- [x] Verification gate passes without regression (7/7 tests passed in `AuthLifecycleAndRefreshTokenTest`, 23/23 tests passed in regression suites).
- [x] Move ticket to `docs/tasks/done/` and unblock TASK-003.
