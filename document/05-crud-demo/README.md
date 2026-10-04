# Hướng dẫn Kiểm thử & Demo các tính năng CRUD - AIVES

> **Mục tiêu**: Hướng dẫn chi tiết từng bước kiểm thử và thuyết trình (Demo) các tính năng CRUD hoàn chỉnh trên hệ thống AIVES, bao gồm giao diện người dùng (Frontend), API tương tác (Backend) và dữ liệu thực tế (Database).  
> **Các tính năng CRUD chính**:
> 1. **CRUD Phiên thi Vấn đáp (Exam Sessions CRUD)**
> 2. **CRUD Quản lý Tài khoản (User Management CRUD)**
> 3. **Xác thực & Hồ sơ Cá nhân (Authentication & Profile)**

---

## 1. Môi trường & Tài khoản Kiểm thử (Demo Accounts)

Hệ thống đã có sẵn dữ liệu mẫu (Seeded Data) trong CSDL:

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn kiểm thử |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin@aives.edu.vn` | `Password123` | Toàn quyền quản trị tài khoản, phiên thi và cấu hình |
| **Giảng viên (LECTURER)** | `gv.an@aives.edu.vn` | `Password123` | Tạo/sửa/huỷ phiên thi, quản lý ngân hàng đề & rubric |
| **Sinh viên (STUDENT)** | `sv.binh@aives.edu.vn` | `Password123` | Nhập mã vào thi, làm bài vấn đáp, xem điểm |

### Địa chỉ truy cập:
- **Giao diện Web (Frontend)**: `http://localhost:5173` (chạy lệnh `npm run dev` trong `aives-frontend`)
- **Tài liệu Swagger UI (Backend)**: `http://localhost:8080/swagger-ui/index.html` (chạy `./mvnw spring-boot:run` trong `aives-backend`)
- **API Health Check**: `http://localhost:8080/api/health/tables`

---

## 2. Kịch bản Demo 1: CRUD Quản lý Phiên thi Vấn đáp (Exam Sessions)

Tính năng phục vụ Giảng viên và Quản trị viên điều phối các kỳ thi vấn đáp tự động.

### 2.1. Thao tác trên Giao diện (Frontend)
1. Đăng nhập với tài khoản Giảng viên (`gv.an@aives.edu.vn` / `Password123`).
2. Điều hướng tới menu **Phiên thi** (`/exam-sessions`):
   - **READ (Đọc/Xem danh sách)**: Màn hình hiển thị danh sách các phiên thi dưới dạng thẻ. Sử dụng thanh tìm kiếm để lọc theo từ khóa hoặc chuyển đổi các tab trạng thái: `Tất cả`, `Đang diễn ra`, `Sắp diễn ra`, `Đã kết thúc`, `Đã huỷ`.
   - **CREATE (Tạo mới)**: Bấm nút `+ Tạo phiên thi mới`:
     - Nhập tiêu đề: *"Kiểm tra Vấn đáp Kiến trúc Phần mềm - K18"*
     - Nhập thời lượng: `20` phút
     - Thời gian mở / đóng: Chọn thời điểm hiện tại đến 3 ngày tới.
     - Số câu hỏi xoáy tối đa: `2` câu
     - Thời gian chuẩn bị / trả lời: `30` giây / `120` giây.
     - Bấm `Lưu phiên thi`. Hệ thống sinh mã phiên dạng `AIVES_EXAM_2026_xxxxxx` và mã passcode 6 số ngẫu nhiên.
   - **UPDATE (Cập nhật)**: Bấm nút `Sửa` trên thẻ bài thi vừa tạo:
     - Chỉnh sửa tiêu đề hoặc bổ sung mô tả, gia hạn thời gian đóng phiên.
     - Bấm `Cập nhật` → Dữ liệu làm mới tức thì.
   - **ACTION (Đổi mã truy cập)**: Bấm nút `Tạo lại Passcode` → Hệ thống sinh mã 6 số mới và làm hết hiệu lực mã cũ.
   - **DELETE / CANCEL (Xoá hoặc Huỷ)**: Bấm nút biểu tượng thùng rác `Xoá`:
     - Nếu phiên chưa có sinh viên vào thi: Xóa hoàn toàn bản ghi khỏi CSDL.
     - Nếu phiên đã có sinh viên nộp bài: Hệ thống tự động chuyển trạng thái an toàn sang `CANCELLED` để bảo toàn dữ liệu lịch sử thi.

### 2.2. Kiểm thử bằng API (REST / cURL)

#### Bước 1: Đăng nhập lấy Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"gv.an@aives.edu.vn","password":"Password123"}'
```
*(Sao chép trường `data.accessToken` trong JSON trả về để gán vào `BEARER_TOKEN`)*

#### Bước 2: Tạo phiên thi mới (CREATE)
```bash
curl -X POST http://localhost:8080/api/exam-sessions \
  -H "Authorization: Bearer <BEARER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kỳ thi Vấn đáp Java Advanced 2026",
    "description": "Kiểm tra kiến thức concurrency và memory management",
    "durationMinutes": 15,
    "maxFollowUpPerQuestion": 2,
    "prepareSeconds": 30,
    "answerSeconds": 120,
    "domainKeywords": "garbage collection, jvm, virtual threads",
    "startAt": "2026-10-05T08:00:00Z",
    "endAt": "2026-10-07T18:00:00Z"
  }'
```

#### Bước 3: Xem danh sách phiên thi có phân trang (READ)
```bash
curl -X GET "http://localhost:8080/api/exam-sessions?page=0&size=10" \
  -H "Authorization: Bearer <BEARER_TOKEN>"
```

#### Bước 4: Chỉnh sửa phiên thi (UPDATE)
```bash
curl -X PUT http://localhost:8080/api/exam-sessions/{viva_exams_id} \
  -H "Authorization: Bearer <BEARER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kỳ thi Vấn đáp Java Advanced 2026 (Cập nhật)",
    "description": "Bổ sung kiểm tra Spring Security",
    "durationMinutes": 20,
    "maxFollowUpPerQuestion": 3,
    "prepareSeconds": 30,
    "answerSeconds": 120,
    "domainKeywords": "jvm, spring, oauth2",
    "startAt": "2026-10-05T08:00:00Z",
    "endAt": "2026-10-08T18:00:00Z"
  }'
```

#### Bước 5: Xoá / Huỷ phiên thi (DELETE)
```bash
curl -X DELETE http://localhost:8080/api/exam-sessions/{viva_exams_id} \
  -H "Authorization: Bearer <BEARER_TOKEN>"
```

---

## 3. Kịch bản Demo 2: CRUD Quản lý Tài khoản (User Management)

Tính năng dành riêng cho Administrator quản trị sinh viên và giảng viên.

### 3.1. Thao tác trên Giao diện (Frontend)
1. Đăng nhập với tài khoản Admin (`admin@aives.edu.vn` / `Password123`).
2. Điều hướng tới menu **Quản trị người dùng** (`/admin/users`):
   - **READ**: Xem bảng tổng hợp danh sách tài khoản, có hiển thị Badge màu theo Role (`ADMIN`: Đỏ tím, `LECTURER`: Xanh lam, `STUDENT`: Xanh ngọc). Lọc theo từng tab vai trò.
   - **CREATE**: Bấm `Thêm tài khoản`:
     - Chọn loại: `Giảng viên (LECTURER)` hoặc `Sinh viên (STUDENT)`.
     - Nhập Họ và tên: *"Nguyễn Văn An"*
     - Nhập Email: `nguyenvanan@fpt.edu.vn`
     - Nhập Mật khẩu khởi tạo: `Password123`
     - Bấm `Xác nhận tạo` → Tài khoản xuất hiện trên danh sách với mã định danh tự sinh (`LExxxxxx` hoặc `STxxxxxx`).
   - **UPDATE STATUS (Bật/Tắt hoạt động)**: Bấm nút gạt trạng thái:
     - Chuyển `Active` → `Inactive`: Tài khoản bị vô hiệu hóa, không thể đăng nhập vào hệ thống.
     - Chuyển `Inactive` → `Active`: Kích hoạt lại quyền truy cập.
   - **DELETE**: Bấm nút `Xoá tài khoản` → Hộp thoại xác nhận hiển thị cảnh báo → Bấm `Đồng ý xoá`.

### 3.2. Kiểm thử bằng API (REST / cURL)

#### Tạo tài khoản mới (CREATE):
```bash
curl -X POST http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer <ADMIN_BEARER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Trần Thị Mai",
    "email": "mai.tt@aives.edu.vn",
    "password": "Password123",
    "role": "LECTURER"
  }'
```

#### Danh sách người dùng (READ):
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer <ADMIN_BEARER_TOKEN>"
```

#### Khoá / Kích hoạt tài khoản (UPDATE STATUS):
```bash
curl -X PUT http://localhost:8080/api/admin/users/{userId}/status \
  -H "Authorization: Bearer <ADMIN_BEARER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

#### Xoá tài khoản (DELETE):
```bash
curl -X DELETE http://localhost:8080/api/admin/users/{userId} \
  -H "Authorization: Bearer <ADMIN_BEARER_TOKEN>"
```

---

## 4. Bảng tổng hợp tính năng CRUD phục vụ Báo cáo & Đánh giá

| Phân hệ / Thực thể | C (Create) | R (Read) | U (Update) | D (Delete) | Giao diện Frontend | API Endpoint |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Phiên thi (viva_exams)** | ✓ | ✓ | ✓ | ✓ | `/exam-sessions` | `/api/exam-sessions` |
| **Tài khoản (users)** | ✓ | ✓ | ✓ | ✓ | `/admin/users` | `/api/admin/users` |
| **Xác thực (auth)** | ✓ (Register) | ✓ (Profile) | ✓ (Profile) | - | `/login`, `/register` | `/api/auth/*` |
| **Lượt thi (viva_attempts)** | ✓ (Join/Start) | ✓ (Detail/List) | ✓ (Submit/Grade) | - | `/exam/join`, `/exam/attempts/:id` | `/api/attempts/*` |
| **Ngân hàng câu hỏi (questions)** | ✓ | ✓ | ✓ | ✓ | `/lecturer/questions` | Phục vụ module Content |
| **Tiêu chí chấm (rubrics)** | ✓ | ✓ | ✓ | ✓ | `/lecturer/rubrics` | Phục vụ module Content |
