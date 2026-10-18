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
  5. **Kiểm tra thiết bị (Mobile Device Control)**: Nếu sinh viên tham gia thi từ ứng dụng di động (`platform = MOBILE`), ca thi phải được bật cấu hình `allow_mobile_exam = TRUE`. Nếu ca thi không cho phép thi trên di động (`allow_mobile_exam = FALSE` - giá trị mặc định), hệ thống chặn vào thi với mã lỗi `400` (`MOBILE_EXAM_NOT_ALLOWED`: "Ca thi này không cho phép làm bài trên thiết bị di động. Vui lòng sử dụng máy tính.").
- **Enforcement**:
  - Sai mã phiên hoặc sai mã truy cập trả cùng một thông báo, để không dò được mã phiên nào có thật.
  - Nhập sai 5 lần trong 10 phút thì tài khoản sinh viên bị khoá chức năng vào thi cho đến khi lần sai cũ nhất hết hạn (`429 Too Many Requests`).
  - Phiên chưa mở, đã đóng, đã huỷ hoặc lượt thi đã kết thúc: từ chối với `409 Conflict`.
  - Thiết bị mobile không được cấp quyền thi: từ chối với `400 Bad Request` (`MOBILE_EXAM_NOT_ALLOWED`).
  - Sinh viên chỉ xem được lượt thi của chính mình; lượt thi của người khác trả `404 Not Found`.

### BR-AUTH-003: Single Active Viva Connection per Student
- **Context**: Tránh gian lận mở nhiều tab hoặc thiết bị cùng lúc.
- **Rule**: Tại một thời điểm, một sinh viên chỉ có duy nhất 1 kết nối / phiên phỏng vấn đang active.
- **Enforcement**: Nếu sinh viên kết nối từ client thứ hai (ví dụ từ web sang mobile hoặc mở tab mới) khi buổi thi chưa đóng:
  - Hệ thống ngắt kết nối / vô hiệu hoá client cũ với mã lỗi `DUPLICATE_SESSION`.

### BR-AUTH-004: Lecturer Mobile Access Scope
- **Context**: Giảng viên truy cập qua ứng dụng di động (AIVES Mobile).
- **Rule**: Giảng viên trên Mobile có quyền xem danh sách các ca thi và giám sát trực tiếp tiến độ phòng thi (danh sách thí sinh, thời gian còn lại, trạng thái thi).
- **Phân định**: Các nghiệp vụ quản trị chuyên sâu (tải tài liệu RAG, tạo ca thi, thiết lập rubric, thẩm định & sửa điểm chi tiết) được thực hiện tập trung trên Web Portal.

### BR-AUTH-005: Student Registration Email Verification via OTP
- **Context**: Sinh viên tự đăng ký tài khoản mới trên hệ thống (`POST /api/auth/register`).
- **Rule**:
  1. **Yêu cầu mã xác thực OTP**: Trước khi tài khoản sinh viên được tạo thành công, hệ thống phải xác minh quyền sở hữu email thông qua mã OTP 6 chữ số gửi qua hòm thư chính thức của hệ thống (`faives.support@gmail.com`).
  2. **Hiệu lực mã**: Mã OTP có hiệu lực tối đa 5 phút kể từ thời điểm gửi.
  3. **Tần suất gửi lại (Rate Limit / Cooldown)**: Thời gian chờ tối thiểu giữa 2 lần gửi mã OTP liên tiếp tới cùng một email là 60 giây.
  4. **Giới hạn số lần thử (Brute-force protection)**: Nếu nhập sai mã OTP quá 5 lần, mã hiện tại bị hủy hiệu lực và người dùng phải yêu cầu gửi lại mã mới (`OTP_MAX_ATTEMPTS_EXCEEDED`).
  5. **Hoàn tất đăng ký**: Chỉ khi mã OTP hợp lệ và chưa hết hạn, hệ thống mới lưu tài khoản sinh viên vào cơ sở dữ liệu với trạng thái kích hoạt (`active = true`).

### BR-AUTH-006: Google Authentication (Single Sign-On)
- **Context**: Người dùng đăng nhập nhanh bằng tài khoản Google trên Web hoặc Mobile (`POST /api/auth/google`).
- **Rule**:
  1. **Xác thực Google ID Token**: Phía client (Web hoặc Mobile) gửi Google ID Token (`idToken`) lên backend. Backend xác thực chữ ký và tính hợp lệ của token với `GOOGLE_CLIENT_ID` qua Google IdTokenVerifier. Nếu token không hợp lệ hoặc đã hết hạn, hệ thống từ chối với mã lỗi `INVALID_CREDENTIALS` (hoặc `GOOGLE_AUTH_FAILED`).
  2. **Tài khoản đã tồn tại**: Nếu email từ Google Token đã tồn tại trong CSDL `users`:
     - Kiểm tra trạng thái hoạt động `is_active`. Nếu tài khoản bị vô hiệu hoá (`is_active = FALSE`), từ chối với mã lỗi `ACCOUNT_DISABLED`.
     - Cho phép đăng nhập thành công theo vai trò hiện tại của tài khoản (`STUDENT`, `LECTURER`, hoặc `ADMIN`) và cấp phát AIVES JWT Access Token.
  3. **Tài khoản chưa tồn tại**: Nếu email từ Google Token chưa tồn tại:
     - Hệ thống tự động khởi tạo tài khoản mới với vai trò mặc định là `STUDENT`.
     - Mã người dùng được sinh theo tiền tố sinh viên `STxxxxxx`.
     - Mật khẩu ngẫu nhiên bảo mật được băm BCrypt để đảm bảo ràng buộc toàn vẹn của CSDL.
     - `full_name` lấy từ tên tài khoản Google (fallback sang phần tiền tố của email nếu trống).
     - Trạng thái mặc định: `is_active = TRUE`, `must_change_password = FALSE`.
     - Cấp phát AIVES JWT Access Token cho người dùng mới và trả về thông tin đăng nhập thành công.


