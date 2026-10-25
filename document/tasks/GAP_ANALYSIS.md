# BÁO CÁO PHÂN TÍCH KHOẢNG TRỐNG MÃ NGUỒN & HỆ THỐNG
## System Codebase Audit & Gap Analysis Report (AIVES)

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Ngày thực hiện kiểm toán**: 2026-10-25  
> **Phạm vi kiểm toán**:
> - Tài liệu đặc tả: `docs/` (`AI-powered-Viva-Exam-System/document`)
> - Mã nguồn Backend: `aives-backend/src` (Spring Boot 3, Java 17, JPA, Vertex AI, Google STT/TTS)
> - Mã nguồn Frontend: `aives-frontend/src` (React 19, TypeScript, Vite, TailwindCSS)
> - Mã nguồn Mobile: `aives-mobile/app` (React Native, Expo Router)
> **Trọng tài nghiệp vụ**: `docs/01-business-rule/`, `docs/core-workflows.md`, `docs/features-checklist.md`, `docs/Software_Architecture_Design_Report.md`.

---

## 1. TỔNG QUAN KIỂM TOÁN HỆ THỐNG (EXECUTIVE SUMMARY)

Đội ngũ Autonomous Squad đã tiến hành đợt kiểm toán toàn diện mã nguồn đối soát với 15 phân hệ chức năng và 5 chu trình nghiệp vụ cốt lõi của hệ thống AIVES.

### 1.1. Tình trạng sức khỏe mã nguồn cơ sở (Baseline Verification)
- **Frontend Web (`aives-frontend`)**: Đã hoàn thiện cấu trúc trang, component, layout và client services. Build Vite thành công sạch sẽ (`vite build` hoàn tất 136 modules trong 1.79s, không phát sinh lỗi biên dịch).
- **Backend Monolith (`aives-backend`)**: Cấu trúc module rõ ràng theo DDD/Modular Monolith (`auth`, `content`, `exam`, `grading`, `system`, `vivaroom`, `integration`). Sử dụng Spring Boot 3 và Java 17.
- **Tài liệu & Đặc tả (`docs`)**: Đầy đủ 15 danh mục tính năng, các luồng Sequence Diagrams (Live Adaptive Viva, HITL Review), Physical ERD (18 bảng), và Business Rules (`BR-AUTH`, `BR-BANK`, `BR-VIVA`, `BR-GRADE`).
- **Nghiệm thu trước đó**: `FLOW-01-MVP / TASK-001` đã nghiệm thu hoàn thành đặc tả hợp đồng OpenAPI 3.0 (`docs/05-api-specs/openapi-spec.yaml`) và giao diện định danh miền xác thực (`docs/04-domains/auth/interface_auth.md`).

---

## 2. MA TRẬN ĐỐI SOÁT 15 PHÂN HỆ CHỨC NĂNG (SUBSYSTEM AUDIT MATRIX)

| STT | Phân hệ chức năng | Trạng thái Backend | Trạng thái Frontend | Đánh giá khoảng trống (Gap Assessment) | Mức độ ưu tiên |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **01** | **Xác thực & Phân quyền (Auth & RBAC)** | Đạt 90% | Đạt 90% | Backend thiếu endpoint `/api/v1/auth/refresh` và mapping `/api/v1/*` theo chuẩn OpenAPI. Chưa có cơ chế Single Active Session khi thi. | **CAO (P1)** |
| **02** | **Quản trị hệ thống (Admin Management)** | Đạt 85% | Đạt 95% | `AdminUserController.getAllUsers()` chưa hỗ trợ phân trang/tìm kiếm. Nghiêm trọng: `AuditService.log()` chưa được gắn vào các tác vụ nhạy cảm. | **CAO (P1)** |
| **03** | **Quản lý học liệu (Curriculum Management)** | Đạt 80% | Đạt 90% | Đã có CRUD Lessons, Topics. Chưa có thực thể và CRUD độc lập cho danh mục thuật ngữ chuyên môn (`domain_keywords`). | **TRUNG BÌNH (P2)** |
| **04** | **Ngân hàng câu hỏi & RAG (Question Bank)** | Đạt 95% | Đạt 95% | Đã có upload GCS, RAG index, sinh câu hỏi Bloom, duyệt trạng thái DRAFT $\rightarrow$ APPROVED, trích xuất hình ảnh câu hỏi. | **HOÀN THIỆN** |
| **05** | **Tiêu chí đánh giá (Rubric Management)** | Đạt 95% | Đạt 95% | Đã có CRUD Rubric, ràng buộc tổng trọng số 100%, trích xuất tiêu chí AI từ tài liệu. | **HOÀN THIỆN** |
| **06** | **Thiết lập ca thi (Exam Scheduling)** | Đạt 95% | Đạt 95% | Đã có CRUD ca thi, sinh `session_code`, `access_code`, regenerate passcode, hủy an toàn, cờ `allow_mobile_exam`. | **HOÀN THIỆN** |
| **07** | **Giám sát trực tiếp ca thi (Live Monitor)** | Đạt 90% | Đạt 90% | Đã có endpoint `GET /api/exam-sessions/{id}/monitor` tổng hợp thí sinh, tiến độ câu hỏi, lượt hỏi xoáy. | **HOÀN THIỆN** |
| **08** | **Check-in & Thiết bị (Check-in & Diagnostics)** | Đạt 90% | Đạt 90% | Đã có rate limit 5 lần thử, kiểm tra mở/đóng ca, chặn mobile khi không cho phép, mic check, resume attempt. | **HOÀN THIỆN** |
| **09** | **Phòng thi vấn đáp AI (Live Voice Viva)** | Đạt 90% | Đạt 85% | Đã có TTS đọc câu hỏi, STT bóc băng, nộp câu trả lời, skip, hẹn giờ. Khoảng trống: Audio binary câu trả lời chưa lưu trữ Cloud Storage. | **TRUNG BÌNH (P2)** |
| **10** | **Hỏi xoáy thích ứng (Adaptive Follow-up)** | Đạt 95% | Đạt 95% | Đã có `FollowUpDecisionService`, phát hiện INCOMPLETE/AMBIGUOUS/CONTRADICTORY, giới hạn $\le 40$ từ, trần follow-up. | **HOÀN THIỆN** |
| **11** | **Chấm điểm ngầm AI (Background Scoring)** | Đạt 90% | Đạt 95% | Đã có `AttemptGradingService`, `AnswerGrader`, Gemini 1.5 Flash JSON schema, criteria grades, trích dẫn transcript, trạng thái `AI_DRAFT`. | **HOÀN THIỆN** |
| **12** | **Thẩm định điểm HITL (Lecturer Review)** | Đạt 90% | Đạt 90% | Đã có duyệt điểm AI, ghi đè điểm (bắt buộc note nếu lệch $>2.0$), công bố `PUBLISHED`. Chưa có audio player do chưa lưu audio binary. | **TRUNG BÌNH (P2)** |
| **13** | **Kết quả & Phúc khảo (Results & Appeals)** | Đạt 95% | Đạt 95% | Đã có xem kết quả chi tiết khi PUBLISHED, gửi đơn phúc khảo, Giảng viên duyệt/từ chối kèm giải trình và cập nhật điểm. | **HOÀN THIỆN** |
| **14** | **Ứng dụng di động (AIVES Mobile)** | Đạt 80% | Đạt 80% | Đã scaffold đủ màn hình Auth, Check-in, Device check, Exam room, Results, Appeals qua Expo Router. Cần đồng bộ API client. | **TRUNG BÌNH (P3)** |
| **15** | **Cổng chung & Tiện ích (Public Portal)** | Đạt 100% | Đạt 100% | Landing page, Privacy Policy, Terms of Service, NotFound 404, i18n (Việt/Anh) đã hoàn thiện. | **HOÀN THIỆN** |

---

## 3. CÁC KHOẢNG TRỐNG KIẾN TRÚC & MÃ NGUỒN CẦN GIẢI QUYẾT (CRITICAL GAPS)

### GAP-01: Lệch chuẩn hợp đồng API Versioning & Thiếu Endpoint Refresh Token (`FLOW-01-MVP`)
- **Mô tả**: Hợp đồng OpenAPI trong `docs/05-api-specs/openapi-spec.yaml` (nhiệm vụ `TASK-001`) quy định các endpoint phiên bản `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`, `/api/v1/auth/me`. Hiện tại `AuthController` trong backend chỉ ánh xạ `@RequestMapping("/api/auth")` và **chưa có** logic refresh token (cấp mới JWT Access Token bằng Refresh Token hợp lệ).
- **Hệ quả**: Khi access token hết hạn, người dùng bị đẩy về trang đăng nhập đột ngột mà không có cơ chế gia hạn âm thầm (silent token refresh), gây rủi ro đứt quãng phiên thi vấn đáp.
- **Giải pháp**:
  - Hỗ trợ Dual Route (`/api/v1/auth/*` chuẩn RESTful và `/api/auth/*` tương thích ngược).
  - Triển khai endpoint `POST /api/v1/auth/refresh` và `POST /api/auth/refresh`.
  - Cập nhật Axios/Fetch interceptor trong Frontend (`apiClient.ts`) để tự động quay vòng refresh token.

### GAP-02: Cơ chế Ghi nhận Nhật Ký Kiểm Toán (Audit Logging) Chưa Được Kích Hoạt (`FLOW-02-AUDIT`)
- **Mô tả**: Các thành phần hạ tầng `AuditLog`, `AuditLogRepository`, `AuditService`, `AdminAuditLogController` đã có sẵn, nhưng không có bất kỳ service nghiệp vụ nào gọi `auditService.log(...)` khi thực hiện các thao tác thay đổi trạng thái nhạy cảm.
- **Hệ quả**: Bảng `audit_logs` luôn rỗng; Quản trị viên không thể tra cứu ai đã thay đổi quyền hạn người dùng, ai đã ghi đè điểm số, hoặc ai đã công bố kết quả thi, vi phạm nghiêm trọng yêu cầu `UC11` và báo cáo kiến trúc.
- **Giải pháp**: Tích hợp ghi vết audit log có cấu trúc (`actorId`, `action`, `entityName`, `entityId`, `oldValue`, `newValue`) vào `AdminUserController`, `AdminSettingsController`, `GradingService`, và `AppealService`.

### GAP-03: Thiếu Phân Trang & Tìm Kiếm Danh Sách Người Dùng Phía Backend (`FLOW-03-ADMIN`)
- **Mô tả**: `AdminUserController.getAllUsers()` hiện trả về toàn bộ danh sách `List<UserResponse>` không có tham số `page`, `size`, `search`, hay `role`.
- **Hệ quả**: Khi số lượng sinh viên và giảng viên tăng lên hàng nghìn bản ghi, API sẽ bị nghẽn băng thông và giảm hiệu năng nghiêm trọng.
- **Giải pháp**: Chuyển đổi sang `PageResponse<UserResponse>` sử dụng Spring Data `Pageable` kết hợp JPA `Specification` lọc theo vai trò, trạng thái và từ khóa tìm kiếm.

### GAP-04: Quản lý Thuật Ngữ Chuyên Môn (`domain_keywords`) cho Nhận Diện Giọng Nói STT (`FLOW-04-CURRICULUM`)
- **Mô tả**: `domain_keywords` đang được lưu dưới dạng chuỗi thô trong `viva_exams`, chưa có danh mục quản lý tập trung ở cấp môn học/bài học để tái sử dụng giữa các ca thi.
- **Giải pháp**: Xây dựng thực thể `DomainKeyword` và bộ API CRUD để giảng viên chuẩn hóa thuật ngữ chuyên ngành tiếng Việt cho Google STT.

### GAP-05: Lưu Trữ Tệp Âm Thanh Gốc vào Google Cloud Storage (`FLOW-05-MEDIA`)
- **Mô tả**: Thí sinh gửi giọng nói trả lời qua `POST /answer-audio`, backend giải mã và gửi stream sang Google STT rồi hủy tệp tạm. Bảng `interview_exchanges` chỉ lưu `transcript_text` mà không lưu URL tệp âm thanh.
- **Hệ quả**: Giảng viên trong màn hình thẩm định HITL (`LecturerReviewPage`) chỉ đọc được chữ, không thể bấm nghe lại giọng nói thực tế của sinh viên để đối chiếu độ chân thực.
- **Giải pháp**: Lưu tệp âm thanh câu trả lời vào Google Cloud Storage (hoặc local storage cấu hình được), ghi nhận `audio_url` vào `interview_exchanges` và bổ sung trình phát audio trên giao diện Review.

---

## 4. KẾ HOẠCH BỐ TRÍ BACKLOG TICKET THEO VERTICAL SLICE

Dựa trên kết quả phân tích khoảng trống, toàn bộ các hạng mục công việc được chia thành các Vertical Slice Tickets theo mẫu chuẩn `docs/tasks/templates/TASK_TEMPLATE.md`, đảm bảo tính độc lập, khả năng kiểm thử và thứ tự phụ thuộc chặt chẽ:

### Chu trình Active: `FLOW-01-MVP` (Authentication & Session Continuity)
- **`TASK-001`**: *(ĐÃ XONG)* Define OpenAPI Schemas and Domain Parent Interface.
- **`TASK-002`**: *(SẴN SÀNG THỰC THI)* Backend: Implement Dual Route `/api/v1/auth/*` and Refresh Token Endpoint.
- **`TASK-003`**: Frontend: Integrate Refresh Token Rotation & Interceptor in `apiClient.ts` / `tokenStorage.js`.
- **`TASK-004`**: QA: Validate End-to-End Authentication & Token Rotation against OpenAPI Spec.

### Chu trình Tiếp theo: `FLOW-02-AUDIT` (System Audit Logging Vertical Slice)
- **`TASK-005`**: Backend: Instrument Audit Event Triggers across Sensitive Mutation Operations.
- **`TASK-006`**: Frontend: Enhance Audit Log Viewer with Old/New Value Diff Inspection.
- **`TASK-007`**: QA: Validate Audit Log Persistence and Querying APIs.

### Chu trình Tiếp theo: `FLOW-03-ADMIN` (User Directory Search & Pagination)
- **`TASK-008`**: Backend: Implement Paginated & Filtered User Query API with JPA Specifications.
- **`TASK-009`**: Frontend: Connect Admin Users Directory to Server-side Pagination & Filtering.
- **`TASK-010`**: QA: Validate User Directory Performance & Boundary Filter Conditions.

---

## 5. KẾT LUẬN & CHUYỂN TIẾP GIAI ĐOẠN

Báo cáo Gap Analysis này xác nhận hệ sinh thái AIVES đã hoàn thành phần lớn khung kiến trúc cốt lõi và các tính năng trọng yếu. Giai đoạn 1 (Gap Analysis Gate) hoàn tất. Hệ thống sẵn sàng chuyển sang Giai đoạn 2 (Single Ticket Execution Gate) với nhiệm vụ đầu tiên là **`TASK-002`** thuộc `FLOW-01-MVP`.
