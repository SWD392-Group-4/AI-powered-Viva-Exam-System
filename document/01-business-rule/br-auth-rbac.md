# BR-AUTH: Authentication & RBAC

## 1. Actors & Roles Matrix
| Role | Mô tả | Quyền hạn chính |
| :--- | :--- | :--- |
| `ADMIN` | Quản trị hệ thống | Quản lý User, cấu hình hệ thống (STT/TTS endpoint, Language model settings). |
| `LECTURER` | Giảng viên | Quản lý ngân hàng câu hỏi, tạo kỳ thi, coi thi/giám sát, duyệt/sửa điểm cuối cùng. |
| `STUDENT` | Thí sinh / Sinh viên | Vào phòng thi theo ca, thực hiện viva exam, xem kết quả đã công bố. |

---

## 2. Business Rules

### BR-AUTH-001: Course-based Lecturer Authorization
- **Context**: Giảng viên quản lý đề thi, câu hỏi và kỳ thi.
- **Rule**: `LECTURER` chỉ có quyền xem/sửa/xóa câu hỏi, đề thi, phiên thi thuộc về các Môn học (`Course`) mà họ được phân công phụ trách.
- **Exception**: Giảng viên có quyền `COURSE_COORDINATOR` hoặc `ADMIN` có thể xem toàn bộ đề thuộc môn đó.

### BR-AUTH-002: Student Exam Access Scope
- **Context**: Sinh viên tham gia phiên thi.
- **Rule**: `STUDENT` chỉ được phép truy cập và bắt đầu lượt thi (`VivaAttempt`) khi thỏa mãn đồng thời:
  1. Tài khoản sinh viên nằm trong danh sách thí sinh (`ExamRoster`) của phiên thi.
  2. Thời điểm hiện tại nằm trong cửa sổ thời gian hợp lệ: `StartTime - GracePeriod <= Now <= EndTime`.
  3. Phiên thi đang ở trạng thái `READY` hoặc `IN_PROGRESS`.
- **Enforcement**: Từ chối truy cập với mã `403 Forbidden` hoặc `400 ExamNotOpen`.

### BR-AUTH-003: Single Active Exam Session per Student
- **Context**: Tránh gian lận mở nhiều tab hoặc thiết bị cùng lúc.
- **Rule**: Tại một thời điểm, một sinh viên chỉ có duy nhất 1 WebSocket connection / Session thi đang active.
- **Enforcement**: Nếu sinh viên kết nối từ client thứ hai khi ca thi chưa đóng:
  - Hệ thống ngắt kết nối client cũ với mã đóng `DUPLICATE_SESSION`.
  - Log cảnh báo vào `SecurityAuditLog`.
