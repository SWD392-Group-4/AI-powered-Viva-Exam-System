# AIVES RESTful API Design Guidelines

## 1. Mục Tiêu & Nguyên Tắc Cốt Lõi
Tài liệu này xác lập quy chuẩn thiết kế API cho toàn bộ hệ thống AIVES (Backend Spring Boot, Frontend React Web Portal, Mobile App Flutter/React Native).
Tất cả các dịch vụ và hợp đồng API phải tuân thủ nghiêm ngặt các nguyên tắc sau:
- **Tính nhất quán (Consistency)**: Mọi endpoint sử dụng cùng định dạng phản hồi (envelope), chuẩn mã lỗi và quy tắc đặt tên.
- **Tính tự mô tả (Self-descriptive)**: Tên tài nguyên rõ ràng, phản ánh chính xác nghiệp vụ trong hệ thống Viva Exam.
- **An toàn bảo mật (Security-by-Design)**: Không lộ thông tin nhạy cảm (mật khẩu, khóa giải mã, secret key) trong URL hoặc response; luôn kiểm soát quyền theo RBAC.

---

## 2. Quy Tắc Định Tuyến & Đặt Tên (Routing & Naming Conventions)

### 2.1. Cấu Trúc URI Chuẩn
- **API Versioning**: Toàn bộ endpoint chính thức sử dụng prefix phiên bản: `/api/v1/{resource}`.
- **Tương thích ngược**: Hệ thống hỗ trợ định tuyến kép (dual routing), cho phép các client phiên bản cũ gọi `/api/{resource}` tương đương với `/api/v1/{resource}`.
- **Định dạng danh từ số nhiều (Plural Nouns)**:
  - Chuẩn: `/api/v1/exam-sessions`, `/api/v1/users`, `/api/v1/questions`
  - Tránh: `/api/v1/getExamSession`, `/api/v1/create-user`
- **Chữ thường và gạch nối (kebab-case)**:
  - Chuẩn: `/api/v1/exam-sessions/{sessionId}/viva-attempts`
  - Tránh: `/api/v1/examSessions`, `/api/v1/exam_sessions`
- **Resource lồng nhau (Sub-resources)**: Thể hiện quan hệ phụ thuộc:
  - `/api/v1/exam-sessions/{sessionId}/attempts/{attemptId}/interview`

### 2.2. Phương Thức HTTP (HTTP Verbs)
| Method | Ý nghĩa nghiệp vụ | Idempotent | Body Request |
| :--- | :--- | :--- | :--- |
| `GET` | Truy xuất dữ liệu tài nguyên (danh sách hoặc chi tiết) | Có | Không |
| `POST` | Tạo mới tài nguyên hoặc kích hoạt tác vụ nghiệp vụ | Không | Có |
| `PUT` | Cập nhật toàn bộ tài nguyên (hoặc thay thế) | Có | Có |
| `PATCH` | Cập nhật một phần trường dữ liệu | Không | Có |
| `DELETE` | Xóa hoặc vô hiệu hóa tài nguyên | Có | Không |

---

## 3. Định Dạng Phản Hồi Chuẩn (Standard Envelope Structure)

Tất cả các phản hồi JSON từ Backend đều được bọc trong cấu trúc phong bì chuẩn (`ApiResponse<T>`).

### 3.1. Phản Hồi Thành Công (Success Response)
```json
{
  "success": true,
  "code": "OK",
  "message": "Thao tác thành công",
  "data": {
    "id": "US000001",
    "email": "user@fpt.edu.vn"
  }
}
```

### 3.2. Phản Hồi Lỗi Chuẩn (Error Response)
Định dạng lỗi bắt buộc bao gồm `success`, `code`, `message`, `timestamp` và `details`:
```json
{
  "success": false,
  "code": "AUTH_INVALID_CREDENTIALS",
  "message": "Email hoặc mật khẩu không đúng",
  "timestamp": "2026-10-24T06:40:00Z",
  "details": {
    "field": "password",
    "reason": "Mật khẩu không khớp"
  }
}
```

### 3.3. Phản Hồi Phân Trang (Paginated Response)
```json
{
  "success": true,
  "code": "OK",
  "message": "Lấy danh sách thành công",
  "data": {
    "items": [],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "last": false
  }
}
```

---

## 4. Mã Trạng Thái HTTP & Mã Lỗi Nghiệp Vụ (Status Codes & Error Codes)

| HTTP Status | Mã Lỗi Tiêu Biểu | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- |
| `200 OK` | `OK` | Yêu cầu xử lý thành công, trả về kết quả |
| `201 Created` | `CREATED` | Tài nguyên mới được khởi tạo thành công |
| `400 Bad Request` | `VALIDATION_ERROR`, `BAD_REQUEST`, `MOBILE_EXAM_NOT_ALLOWED` | Dữ liệu đầu vào sai cú pháp hoặc vi phạm validation |
| `401 Unauthorized` | `UNAUTHENTICATED`, `INVALID_CREDENTIALS`, `TOKEN_EXPIRED` | Chưa xác thực hoặc Access Token không hợp lệ / hết hạn |
| `403 Forbidden` | `ACCESS_DENIED`, `ACCOUNT_DISABLED`, `PASSWORD_CHANGE_REQUIRED` | Đã đăng nhập nhưng không đủ quyền hạn truy cập |
| `404 Not Found` | `USER_NOT_FOUND`, `EXAM_SESSION_NOT_FOUND`, `NOT_FOUND` | Không tìm thấy tài nguyên theo định danh yêu cầu |
| `409 Conflict` | `DATA_CONFLICT`, `EMAIL_ALREADY_EXISTS`, `EXAM_SESSION_ENDED` | Xung đột trạng thái dữ liệu hiện tại |
| `429 Too Many Requests`| `EXAM_JOIN_LOCKED`, `OTP_MAX_ATTEMPTS_EXCEEDED`, `OTP_RATE_LIMITED` | Vượt ngưỡng giới hạn tần suất yêu cầu |
| `500 Internal Server Error` | `INTERNAL_ERROR` | Lỗi máy chủ chưa được kiểm soát |
| `502 Bad Gateway` | `AI_REQUEST_FAILED`, `MAIL_SEND_FAILED`, `SPEECH_REQUEST_FAILED` | Lỗi kết nối dịch vụ tích hợp bên thứ ba |
| `503 Service Unavailable` | `AI_UNAVAILABLE`, `SPEECH_UNAVAILABLE` | Tính năng chưa được cấu hình hoặc tạm thời tắt |

---

## 5. Quy Chuẩn Xác Thực & Phân Quyền (Authentication & RBAC)

1. **JWT Header**: Client truyền token trong header:
   ```http
   Authorization: Bearer <access_token>
   ```
2. **Refresh Token Flow**:
   - Client gọi `POST /api/v1/auth/refresh` kèm `refreshToken` trong request body hoặc secure HttpOnly cookie.
   - Hệ thống xác thực tính hợp lệ của Refresh Token trong kho lưu trữ, kiểm tra thu hồi và cấp Access Token mới.
3. **Phân quyền dựa trên Role & Context**:
   - `ADMIN`: Toàn quyền hệ thống người dùng và cấu hình.
   - `LECTURER`: Quản trị ngân hàng đề thi, bài học và duyệt điểm các kỳ thi được phân công (`EXAM_EXAMINER`).
   - `STUDENT`: Chỉ được truy cập phòng thi và kết quả của chính mình sau khi công bố.
