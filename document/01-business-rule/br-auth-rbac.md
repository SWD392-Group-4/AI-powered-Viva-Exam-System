# BR-AUTH: Authentication & RBAC

## 1. Actors & Roles Matrix
| Role | Mô tả | Quyền hạn chính |
| :--- | :--- | :--- |
| `ADMIN` | Quản trị hệ thống | Quản lý User, cấu hình hệ thống (STT/TTS endpoint, Language model settings). |
| `LECTURER` | Giảng viên | Quản lý ngân hàng câu hỏi & rubric, giám sát và duyệt/sửa điểm cuối cùng. |
| `STUDENT` | Thí sinh / Sinh viên | Tham gia phòng phỏng vấn viva với AI, xem kết quả đã công bố. |

---

## 2. Business Rules

### BR-AUTH-001: Exam-based Examiner Authorization
- **Context**: Giảng viên / Giám khảo quản lý đề thi, câu hỏi và điểm số.
- **Rule**: `LECTURER` chỉ có quyền xem/sửa/xóa câu hỏi và duyệt điểm thuộc về các Kỳ thi (`Exam`) mà họ được phân công phụ trách (`EXAM_EXAMINER`).
- **Exception**: Giảng viên có quyền `CHIEF_EXAMINER` hoặc `ADMIN` có thể xem toàn bộ dữ liệu thuộc kỳ thi đó.

### BR-AUTH-002: Candidate Viva Access Scope
- **Context**: Thí sinh tham gia lượt phỏng vấn viva.
- **Rule**: `STUDENT` chỉ được vào một phiên thi và bắt đầu lượt vấn đáp (`VivaAttempt`) khi:
  1. Nhập đúng **mã phiên** (`AIVES_EXAM_yyyy_xxxxxx`) và **mã truy cập** 6 chữ số do người tạo phiên cung cấp. Không còn danh sách thí sinh được chỉ định trước.
  2. Phiên đang mở (đã tới giờ mở, chưa tới giờ đóng) và chưa bị huỷ.
  3. Mỗi sinh viên chỉ có 1 lượt vấn đáp trong 1 phiên; vào lại thì tiếp tục lượt cũ, đồng hồ không chạy lại.
  4. Lượt vấn đáp chưa kết thúc: sinh viên chưa bấm kết thúc bài thi và chưa hết thời gian làm bài.
- **Enforcement**:
  - Sai mã phiên hoặc sai mã truy cập trả cùng một thông báo, để không dò được mã phiên nào có thật.
  - Nhập sai 5 lần trong 10 phút thì tài khoản sinh viên bị khoá chức năng vào thi cho đến khi lần sai cũ nhất hết hạn (`429 Too Many Requests`).
  - Phiên chưa mở, đã đóng, đã huỷ hoặc lượt thi đã kết thúc: từ chối với `409 Conflict`.
  - Sinh viên chỉ xem được lượt thi của chính mình; lượt thi của người khác trả `404 Not Found`.

### BR-AUTH-003: Single Active Viva Connection per Student
- **Context**: Tránh gian lận mở nhiều tab hoặc thiết bị cùng lúc.
- **Rule**: Tại một thời điểm, một sinh viên chỉ có duy nhất 1 WebSocket connection phỏng vấn đang active.
- **Enforcement**: Nếu sinh viên kết nối từ client thứ hai khi buổi thi chưa đóng:
  - Hệ thống ngắt kết nối client cũ với mã đóng `DUPLICATE_SESSION`.
