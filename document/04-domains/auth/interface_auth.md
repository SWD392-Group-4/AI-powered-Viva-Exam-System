# Domain Interface: Authentication & Authorization (AUTH)

## 1. Domain Overview and Responsibilities
The Authentication and Authorization domain governs identity issuance, credential verification, session lifecycle management, RBAC enforcement, and Single Sign-On (Google SSO).

### Invariants:
1. All network communication must originate through validated OpenAPI contracts under `/api/v1/auth` (with backward compatibility for `/api/auth`).
2. Access tokens are stateless, short-lived JWTs (default: 60 minutes).
3. Refresh tokens are cryptographically secure random UUID strings stored in persistent storage with rotation on every refresh event.
4. Logging out immediately places the access token JTI into `TokenBlacklist` until the token expiration timestamp.
5. Error responses must strictly conform to the standardized `ErrorResponse` schema containing `code`, `message`, `timestamp`, and `details`.

---

## 2. Implementations and Child Specifications
- Child Specification: `docs/04-domains/auth/auth_login_refresh.md`
- Data Persistence Dictionary: `docs/ERD/03-physical-erd.md`
- API Specification: `docs/05-api-specs/openapi-spec.yaml`
- API Guidelines: `docs/05-api-specs/api-guidelines.md`
- Backend Implementation:
  - Controller: `com.aives.modules.auth.controller.AuthController`
  - Service: `com.aives.modules.auth.service.AuthService`
  - Security Provider: `com.aives.common.security.JwtTokenProvider`
- Frontend Implementation:
  - Generated Client: `aives-frontend/src/generated/api/endpoints/auth.ts`
  - Custom Instance: `aives-frontend/src/core/api/custom-instance.ts`
  - Token Storage: `aives-frontend/src/services/tokenStorage.ts`

---

## 3. Token Lifecycle and State Machine

### 3.1 Token Lifecycle Enums

#### Enum: `RoleName`
Maps directly to database column `roles.name` and primary key prefix:
- `ADMIN`: System administrator (ID prefix: `AD`). Full configuration, account management, audit inspection.
- `LECTURER`: Examiner / Lecturer (ID prefix: `LE`). Question bank management, rubric setup, viva evaluation review.
- `STUDENT`: Candidate (ID prefix: `ST`). Viva examination session execution, results inspection, appeals submission.

#### Enum: `TokenType`
- `Bearer`: RFC 6750 HTTP Authorization scheme token type.

#### Enum: `TokenLifecycleStatus`
Tracks token validity in the verification pipeline:
- `ACTIVE`: Token is valid, signature is verified, expiration timestamp is in the future, and token JTI is not in the blacklist.
- `EXPIRED`: Token lifetime has elapsed past `exp` claim.
- `REVOKED`: Token was explicitly terminated before natural expiry via logout or revocation event.
- `ROTATED`: Refresh token has been exchanged for a new pair and can no longer be used. Reuse triggers fraud alerts and invalidates descendant tokens.
- `INVALID`: Signature mismatch, malformed payload, or unknown issuer.

#### Enum: `OtpType`
- `REGISTRATION`: Email ownership verification during candidate account registration.
- `PASSWORD_RESET`: Verification code for forgotten password reset flow.

### 3.2 State Machine Diagram

```text
 [Credentials Submitted]
           |
           v
     +-----------+         Invalid Credentials / Inactive
     |  Pending  | -------------------------------------> [Rejected (401/403)]
     +-----------+
           |
           | Valid Credentials
           v
     +-----------+        AccessToken Expired
     |  ACTIVE   | -------------------------------------> [EXPIRED]
     +-----------+                                           |
       |       |                                             |
       |       | Explicit Logout                             | POST /api/v1/auth/refresh
       |       +--------------------> [REVOKED (Blacklist)]  |
       |                                                     v
       | Refresh Token Exchange                        +-----------+
       +---------------------------------------------> |  ROTATED  |
                                                       +-----------+
                                                             |
                                                             v
                                                    [New Token Issued]
```

---

## 4. Shared Models and DTO Specifications

### 4.1 LoginRequest
- `email` (string, required, format: email): User email address.
- `password` (string, required, minLength: 6, maxLength: 72): User plaintext password.

### 4.2 RefreshTokenRequest
- `refreshToken` (string, required): Opaque refresh token string issued during login or last refresh.

### 4.3 TokenRefreshResponse
- `accessToken` (string, required): Signed JWT bearer token.
- `refreshToken` (string, required): New opaque refresh token replacing the submitted token.
- `tokenType` (string, required, default: "Bearer"): Authorization scheme.
- `expiresIn` (integer, required): Access token validity in seconds (e.g. 3600).
- `refreshExpiresIn` (integer, required): Refresh token validity in seconds (e.g. 604800).

### 4.4 UserResponse
- `id` (string, required, pattern: `^[A-Z]{2}[0-9]{6}$`): Primary user identifier.
- `email` (string, required, format: email): Primary user email address.
- `fullName` (string, required): User display name.
- `role` (RoleName, required): Role assigned to user (`ADMIN`, `LECTURER`, `STUDENT`).
- `active` (boolean, required): Account activation status flag.
- `mustChangePassword` (boolean, required): Flag indicating temporary password requiring mandatory update.
- `studentCode` (string, nullable): Student code for `STUDENT` role (maps to `id`), null for other roles.
- `createdAt` (string, required, format: date-time): ISO-8601 creation timestamp.

### 4.5 LoginResponse
Composed of `TokenRefreshResponse` fields plus user profile:
- `accessToken` (string, required)
- `refreshToken` (string, required)
- `tokenType` (string, required, default: "Bearer")
- `expiresIn` (integer, required)
- `refreshExpiresIn` (integer, required)
- `user` (UserResponse, required)

### 4.6 Standardized ErrorResponse
- `success` (boolean, required, fixed: false): Status flag for client interceptors.
- `code` (string, required): Canonical business error code matching `ErrorCode` enum.
- `message` (string, required): Human-readable error description in Vietnamese.
- `timestamp` (string, required, format: date-time): ISO-8601 UTC timestamp of occurrence.
- `details` (object, optional): Key-value dictionary containing field validation failures or diagnostic metadata.

---

## 5. Domain Service Contracts

```java
public interface IAuthService {
    LoginResponse login(LoginRequest request);
    TokenRefreshResponse refresh(RefreshTokenRequest request);
    void logout(String authorizationHeader);
    UserResponse register(RegisterRequest request);
    LoginResponse loginWithGoogle(GoogleLoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
```
