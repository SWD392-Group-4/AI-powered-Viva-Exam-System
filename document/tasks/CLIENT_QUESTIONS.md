# Client Questions & Decision Registry

This document serves as the communication bridge between the autonomous software development squad and the **Client** (Human Stakeholder). 

Whenever business decisions or requirement trade-offs require Client confirmation, the **Product Owner / Business Analyst (PO/BA)** logs the item here with preliminary analysis and a recommended option. The Client reviews this document and inputs answers or approves recommendations.

---

## 1. Pending Decisions (Awaiting Client Response)

### [DECISION-001] API Routing Hierarchy and Refresh Token Storage Strategy
- **Date Raised**: 2026-10-24
- **Target Flow / Task**: FLOW-01-MVP / TASK-001
- **Context & Impact**:
  - Hiện tại hệ thống đang sử dụng endpoint gốc `/api/auth/*` (trong mã nguồn Spring Boot và React Orval). Ticket FLOW-01-MVP đặt ra chuẩn RESTful API versioning `/api/v1/auth/*` và bổ sung endpoint làm mới phiên (`/refresh`). Cần chốt phương án định tuyến và phương thức lưu trữ refresh token bảo mật.
- **BA Proposals & Options**:
  - [x] **Option A (Recommended)**: Hỗ trợ Dual Route (`/api/v1/auth/*` làm chuẩn chính thức, giữ alias `/api/auth/*` để đảm bảo 100% tương thích ngược). Refresh Token được lưu trữ trong HttpOnly Secure Cookie để chống tấn công XSS; Access Token truyền qua Authorization Header.
  - [ ] **Option B**: Chuyển đổi cứng sang `/api/v1/*` (yêu cầu cập nhật đồng thời Frontend & Mobile). Refresh Token truyền trực tiếp trong JSON body (client tự quản lý trong Storage).
- **Client Decision**: [Chờ ý kiến phản hồi hoặc phê duyệt Option A từ Client]
- **Status**: PENDING_CLIENT_RESPONSE

<!-- Template for new entries:
### [DECISION-001] Short Decision Title
- **Date Raised**: YYYY-MM-DD
- **Target Flow / Task**: FLOW-01-MVP / TASK-001
- **Context & Impact**: Why this decision is needed and what systems it affects.
- **BA Proposals & Options**:
  - [x] **Option A (Recommended)**: Detailed description of recommended approach with rationale.
  - [ ] **Option B**: Alternative approach with trade-offs.
  - [ ] **Option C**: Alternative approach.
- **Client Decision**: [Client types answer or signs off on Option A here]
- **Status**: PENDING_CLIENT_RESPONSE
-->

---

## 2. Resolved Decisions (Signed Off by Client)

| Decision ID | Topic | Selected Decision | Sign-off Date | Status |
| :--- | :--- | :--- | :--- | :--- |
| `DECISION-000` | Squad Operating Model | Autonomous Squad with User as Client/Stakeholder | 2026-10-24 | RESOLVED |
