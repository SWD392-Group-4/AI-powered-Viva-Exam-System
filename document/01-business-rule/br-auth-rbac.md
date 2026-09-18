# BR-AUTH: Authentication & RBAC

## 1. Actors & Roles Matrix
| Role | Mô tả | Quyền hạn chính |
| :--- | :--- | :--- |
| `ADMIN` | Quản trị hệ thống | Quản lý User, cấu hình hệ thống (STT/TTS endpoint, Language model settings). |
| `LECTURER` | Giảng viên | Quản lý ngân hàng câu hỏi & rubric, giám sát và duyệt/sửa điểm cuối cùng. |
| `STUDENT` | Thí sinh / Sinh viên | Tham gia phòng phỏng vấn viva với AI, xem kết quả đã công bố. |

---

## 2. Business Rules

### BR-AUTH-001: Course-based Lecturer Authorization
- **Context**: Giảng viên quản lý đề thi, câu hỏi và điểm số.
- **Rule**: `LECTURER` chỉ có quyền xem/sửa/xóa câu hỏi và duyệt điểm thuộc về các Môn học (`Course`) mà họ được phân công phụ trách.
- **Exception**: Giảng viên có quyền `COURSE_COORDINATOR` hoặc `ADMIN` có thể xem toàn bộ dữ liệu thuộc môn đó.

### BR-AUTH-002: Student Viva Access Scope
- **Context**: Sinh viên tham gia lượt phỏng vấn viva.
- **Rule**: `STUDENT` chỉ được phép truy cập và bắt đầu lượt vấn đáp (`VivaAttempt`) khi:
  1. Tài khoản sinh viên được chỉ định hoặc được phân công cho môn học tương ứng.
  2. Lượt vấn đáp chưa ở trạng thái hoàn thành (`COMPLETED`).
- **Enforcement**: Từ chối truy cập với mã `403 Forbidden` nếu không đúng quyền.

### BR-AUTH-003: Single Active Viva Connection per Student
- **Context**: Tránh gian lận mở nhiều tab hoặc thiết bị cùng lúc.
- **Rule**: Tại một thời điểm, một sinh viên chỉ có duy nhất 1 WebSocket connection phỏng vấn đang active.
- **Enforcement**: Nếu sinh viên kết nối từ client thứ hai khi buổi thi chưa đóng:
  - Hệ thống ngắt kết nối client cũ với mã đóng `DUPLICATE_SESSION`.
