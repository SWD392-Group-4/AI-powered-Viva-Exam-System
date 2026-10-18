# Danh Mục Tính Năng Hệ Thống AIVES (Feature Checklist)

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Nguồn tài liệu đối chiếu**: `document/00-overview`, `document/01-business-rule`, `document/core-workflows.md`, `document/04-ui-ux-design`, `document/05-crud-demo`, `document/Software_Architecture_Design_Report.md`.  
> **Trạng thái đối soát mã nguồn Backend (`com.aives`)**: Đã đối chiếu toàn bộ các Controller, Service, Repository và Entity hiện có.  
> **Quy ước ký hiệu**:
> - `- [x]`: Tính năng **ĐÃ HOÀN THÀNH** trong backend (`com.aives`).
> - `- [ ]`: Tính năng **CHƯA LÀM** hoặc **CẦN BỔ SUNG** trong backend.

---

## 1. Phân Hệ Xác Thực & Phân Quyền (Authentication & RBAC)
- [x] Đăng nhập hệ thống bằng Email và Mật khẩu với xác thực JWT Token (hỗ trợ Admin, Giảng viên, Sinh viên) (`POST /api/auth/login`)
- [x] Đăng ký tài khoản Sinh viên bằng email tổ chức (`@fpt.edu.vn`) (`POST /api/auth/register`)
- [x] Gửi và xác thực mã OTP qua email khi đăng ký tài khoản (hiệu lực 5 phút, cooldown 60s, giới hạn 5 lần thử) (`POST /api/auth/send-otp`)
- [ ] Yêu cầu quên mật khẩu và gửi mã OTP khôi phục qua email *(Chưa có API / Service)*
- [ ] Đặt lại mật khẩu mới thông qua xác thực mã OTP *(Chưa có API / Service)*
- [x] Xem thông tin hồ sơ cá nhân (Profile) (`GET /api/auth/me`)
- [x] Cập nhật thông tin cá nhân và thay đổi mật khẩu (`PUT /api/auth/me`, `PUT /api/auth/me/password`)
- [x] Bắt buộc đổi mật khẩu ở lần đầu đăng nhập đối với tài khoản được cấp phát sẵn (`must_change_password`)
- [x] Phân quyền người dùng dựa trên vai trò (RBAC: `ADMIN`, `LECTURER`, `STUDENT`)
- [ ] Phân quyền Giảng viên theo từng ca thi phụ trách (`EXAM_EXAMINER`, `CHIEF_EXAMINER`) *(Hiện mới kiểm tra theo `lecturerId` sở hữu ca thi)*
- [ ] Cơ chế duy trì phiên duy nhất khi thi (Single Active Connection - ngắt kết nối thiết bị cũ nếu phát hiện đăng nhập trùng) *(Chưa có session tracking / duplicate session)*
- [x] Đăng xuất hệ thống và thu hồi token phiên làm việc (`POST /api/auth/logout` + `TokenBlacklist`)

---

## 2. Phân Hệ Quản Trị Hệ Thống (Admin System Management)
- [ ] Bảng điều khiển quản trị (Admin Dashboard): thống kê số lượng người dùng theo vai trò, số phiên thi đang chạy, tài nguyên AI tiêu thụ *(Chưa có API Dashboard)*
- [x] Giám sát trạng thái hoạt động của các dịch vụ nền (PostgreSQL, Google Cloud STT/TTS, Gemini Flash API) (`GET /api/health`, `/api/health/tables`)
- [x] Quản lý tài khoản người dùng toàn hệ thống (CRUD User) (`/api/admin/users`)
- [ ] Danh sách người dùng hỗ trợ phân trang, lọc theo vai trò và tìm kiếm *(Hiện `getAllUsers` trả về toàn bộ List)*
- [x] Tạo mới tài khoản Giảng viên và Sinh viên với quy tắc tự động sinh mã định danh (`STxxxxxx`, `LExxxxxx`, `ADxxxxxx`)
- [x] Bật / Tắt kích hoạt trạng thái tài khoản (`Active` / `Inactive`) (`PUT /api/admin/users/{id}/status`)
- [x] Xóa tài khoản người dùng an toàn (Soft-delete / Kiểm tra ràng buộc dữ liệu) (`DELETE /api/admin/users/{id}`)
- [ ] Cấu hình tham số hệ thống & AI (`system_settings`): Model LLM, Endpoint STT/TTS, ngưỡng im lặng tự nộp bài, số câu hỏi xoáy tối đa *(Chưa có Controller / Service CRUD cho `system_settings`)*
- [ ] Tra cứu và lọc nhật ký kiểm toán hệ thống (Audit Logs) theo người thực hiện, loại hành động, loại thực thể và khoảng thời gian *(Chưa có Controller / Service cho `audit_logs`)*
- [ ] Xem chi tiết đối chiếu giá trị cũ (`old_value`) và giá trị mới (`new_value`) của các thao tác nhạy cảm trong Audit Logs *(Chưa có)*

---

## 3. Phân Hệ Quản Lý Học Liệu & Chương Trình (Curriculum Management)
- [ ] Quản lý danh mục Bài học (`lessons`) trực thuộc môn học phụ trách (CRUD) *(Mới có `GET /api/content/lessons`, chưa có Create/Update/Delete)*
- [ ] Quản lý danh mục Chủ đề con (`topics`) trực thuộc từng bài học (CRUD) *(Mới có `GET /api/content/topics`, chưa có Create/Update/Delete)*
- [x] Thiết lập liên kết giữa chủ đề học tập và ngân hàng câu hỏi
- [ ] Quản lý danh mục thuật ngữ chuyên môn (`domain_keywords`) hỗ trợ nhận diện giọng nói chính xác *(Chưa có CRUD danh mục chuyên môn)*

---

## 4. Phân Hệ Ngân Hàng Câu Hỏi & Sinh Đề AI (Question Bank & AI RAG)
- [x] Tải lên tài liệu học liệu (giáo trình, slide bài giảng PDF/PPTX/DOCX/TXT) để trích xuất nội dung (`POST /api/content/imports/questions`)
- [x] Tự động sinh câu hỏi và câu trả lời mẫu bằng AI (Gemini Flash RAG) theo chủ đề bài học
- [x] Phân loại câu hỏi theo 4 cấp độ tư duy Bloom (`REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`)
- [ ] Quản lý ngân hàng câu hỏi (CRUD Question) *(Mới có Import và Get List, chưa có API Create/Update/Delete thủ công)*
- [x] Quản lý vòng đời trạng thái câu hỏi (`DRAFT`, `APPROVED`, `ARCHIVED`, `REJECTED`) (`PUT /api/content/questions/{id}/status`)
- [ ] Quy trình Giảng viên kiểm duyệt, chỉnh sửa nội dung và câu trả lời mẫu của câu hỏi AI sinh ra *(Chưa có API chỉnh sửa text câu hỏi)*
- [x] Phê duyệt câu hỏi từ `DRAFT` sang `APPROVED` để đưa vào sử dụng trong ca thi
- [x] Bắt buộc gán Rubric đánh giá hợp lệ vào câu hỏi trước khi phê duyệt (`BR-BANK-001`)

---

## 5. Phân Hệ Tiêu Chí Đánh Giá (Rubric Management)
- [ ] Quản lý danh mục Rubric đánh giá (CRUD Rubric) *(Mới có Import và Get List, chưa có API Create/Update/Delete thủ công)*
- [ ] Tạo mới và chỉnh sửa danh sách tiêu chí chấm điểm (`criteria`) trong Rubric *(Chưa có API thủ công)*
- [ ] Cấu hình trọng số phần trăm (`weight %`) cho từng tiêu chí *(Chưa có API cấu hình thủ công)*
- [x] Ràng buộc kiểm tra tự động tổng trọng số các tiêu chí trong một Rubric phải bằng đúng 100%
- [x] Thiết lập mô tả chi tiết yêu cầu đạt điểm cho từng tiêu chí (tránh hiện tượng AI chấm ảo)
- [ ] Thiết lập thang điểm đánh giá (Scale) và các mức phân loại năng lực (Exemplary, Competent, Developing, Inadequate) *(Chưa hoàn thiện)*
- [x] Trích xuất và gợi ý tiêu chí Rubric tự động từ tài liệu bằng AI (`POST /api/content/imports/rubrics`)

---

## 6. Phân Hệ Thiết Lập Ca Thi Vấn Đáp (Exam Session Scheduling)
- [x] Quản lý danh sách các ca thi viva (CRUD Exam Sessions) (`/api/exam-sessions`)
- [x] Tìm kiếm ca thi và lọc theo các trạng thái: Tất cả, Đang diễn ra, Sắp diễn ra, Đã kết thúc, Đã hủy
- [x] Thiết lập thông tin ca thi: Tên ca thi, mô tả, môn học, thời gian mở phòng và thời gian đóng phòng
- [x] Tự động sinh mã phòng thi công khai (`session_code` định dạng `AIVES_EXAM_yyyy_xxxxxx`)
- [x] Tự động sinh mã truy cập bí mật 6 số (`access_code`)
- [x] Chức năng tạo lại mã truy cập bí mật (Regenerate Passcode) và hủy hiệu lực mã cũ (`POST /api/exam-sessions/{id}/regenerate-passcode`)
- [x] Cấu hình thời lượng thi tối đa của ca thi (`duration_minutes`)
- [x] Cấu hình số lượng câu hỏi chính mỗi thí sinh phải trả lời (`max_questions` / `question_count`)
- [x] Cấu hình thời gian chuẩn bị suy nghĩ cho mỗi câu hỏi (`preparation_seconds`)
- [x] Cấu hình thời gian trả lời tối đa cho mỗi câu hỏi (`answer_seconds`)
- [x] Cấu hình số lượt hỏi xoáy tối đa cho mỗi câu hỏi (`max_follow_up_per_question`)
- [ ] Cấu hình cờ cho phép hoặc cấm thí sinh thi bằng ứng dụng di động (`allow_mobile_exam`) *(Chưa có cột và trường cấu hình trong VivaExam)*
- [x] Chọn và gán danh sách chủ đề (`topics`) hoặc câu hỏi cụ thể (`questions`) áp dụng cho ca thi
- [x] Chuyển trạng thái an toàn sang `CANCELLED` khi hủy ca thi đã có dữ liệu làm bài

---

## 7. Phân Hệ Giám Sát Ca Thi Thời Gian Thực (Live Exam Monitoring)
- [ ] Bảng điều khiển giám sát trực tiếp ca thi dành cho Giảng viên (Web Portal & Mobile App) *(Chưa có API)*
- [ ] Danh sách thí sinh đang tham gia trong phòng thi theo thời gian thực *(Chưa có API)*
- [ ] Hiển thị tiến độ làm bài của từng thí sinh: câu hỏi hiện tại, số lượt hỏi xoáy đã thực hiện *(Chưa có API)*
- [ ] Hiển thị thời gian làm bài còn lại của từng thí sinh *(Chưa có API)*
- [ ] Giám sát trạng thái thiết bị và kết nối của thí sinh (micro hoạt động, kết nối mạng) *(Chưa có API)*
- [ ] Cảnh báo sự cố mất kết nối hoặc thí sinh nộp bài bất thường *(Chưa có API)*

---

## 8. Phân Hệ Vào Phòng Thi & Kiểm Tra Thiết Bị (Check-in & Device Diagnostics)
- [ ] Bảng điều khiển sinh viên (Student Dashboard): hiển thị ca thi sắp tới, ca thi đang mở, điểm TB và lịch sử thi *(Chưa có API tổng hợp dashboard)*
- [x] Giao diện nhập mã phòng thi (`session_code`) và mã passcode 6 số (`POST /api/exam-sessions/join`)
- [x] Cơ chế chống dò mã: thông báo lỗi chung khi nhập sai mã phòng hoặc mã passcode
- [x] Khóa tạm thời quyền vào thi khi nhập sai mã quá 5 lần trong vòng 10 phút (Rate limit)
- [x] Kiểm tra điều kiện mở/đóng và tính hợp lệ của ca thi
- [ ] Kiểm tra và chặn thiết bị di động truy cập ca thi nếu cờ `allow_mobile_exam` đang tắt *(Chưa có logic chặn platform header)*
- [x] Quy trình kiểm tra thiết bị âm thanh trước khi vào thi (Audio Loopback Test): thu âm giọng nói thử và phát lại qua loa/tai nghe (Hỗ trợ qua `/api/speech/stt`, `/api/speech/tts`)
- [ ] Đo ngưỡng tạp âm nền và kiểm tra tính sẵn sàng của micro (VAD Check) *(Client-side)*
- [x] Khởi tạo bản ghi lượt thi (`viva_attempts`) với trạng thái `IN_PROGRESS`
- [x] Cơ chế tiếp tục lượt thi cũ (Resume Attempt) khi bị mất kết nối hoặc tải lại trang, giữ nguyên thời gian còn lại

---

## 9. Phân Hệ Phòng Thi Vấn Đáp Trực Tiếp Bằng Giọng Nói (Live Voice AI Viva Exam Room)
- [x] Hiển thị nội dung câu hỏi chính dạng văn bản
- [x] Phát giọng đọc câu hỏi tự nhiên bằng tiếng Việt thông qua Google Cloud Text-to-Speech (TTS Neural Voice) (`GET .../interview/question-audio`)
- [x] Đồng hồ đếm ngược thời gian chuẩn bị suy nghĩ (Preparation Countdown Timer)
- [x] Tự động bật micro và chuyển sang trạng thái trả lời khi hết giờ suy nghĩ
- [x] Thu âm giọng nói của sinh viên qua micro thời gian thực (`POST .../interview/answer-audio`)
- [ ] Hiển thị hiệu ứng sóng âm thanh (Voice Wave Visualizer) theo mức năng lượng giọng nói *(Client-side)*
- [x] Nhận diện giọng nói và bóc băng tiếng Việt thời gian thực (Google Cloud STT `vi-VN`)
- [ ] Phát hiện khoảng lặng liên tục $\ge 5$ giây để hiển thị cảnh báo gợi ý hoàn thành câu trả lời *(Client-side)*
- [ ] Tự động ngắt micro và nộp câu trả lời khi phát hiện im lặng liên tục $\ge 10$ giây (`AUTO_SUBMIT`) *(Client-side)*
- [x] Nút chủ động kết thúc câu trả lời và nộp bài trước thời hạn (`POST .../interview/answer`, `.../answer-audio`, `.../finish`)
- [x] Đồng hồ đếm ngược tổng thời gian làm bài của toàn bộ ca thi
- [x] Tự động thu bài và đóng lượt thi khi hết tổng thời gian ca thi (`GradingScheduler.closeOverdueAttempts()`)
- [x] Lưu trữ bản ghi văn bản bóc băng từng lượt hỏi - đáp (`interview_exchanges`) *(Chưa lưu trữ file âm thanh binary)*

---

## 10. Phân Hệ Lõi Hỏi Xoáy Thích Ứng Thời Gian Thực (Live Adaptive Follow-up Engine)
- [x] Phân tích nội dung câu trả lời của thí sinh thời gian thực đối chiếu với Rubric và đáp án mẫu (`FollowUpDecisionService`)
- [x] Tự động phát hiện câu trả lời thiếu ý chính (`INCOMPLETE`)
- [x] Tự động phát hiện câu trả lời mơ hồ, chung chung cần làm rõ (`AMBIGUOUS`)
- [x] Tự động phát hiện câu trả lời có mâu thuẫn giữa các mệnh đề (`CONTRADICTORY`)
- [x] Tự động kích hoạt sinh câu hỏi hỏi xoáy ngắn gọn ($\le 40$ từ) bám sát phần kiến thức bị thiếu (`BR-VIVA-002`)
- [x] Ràng buộc chống lạc đề (Anti-Hallucination): tuyệt đối không hỏi sang chủ đề ngoài phạm vi câu hỏi chính
- [x] Kiểm soát số lượt hỏi xoáy không vượt quá trần cấu hình (`max_follow_up_per_question`)
- [x] Tự động dừng hỏi xoáy khi sinh viên đạt yêu cầu hoặc khi sinh viên xin bỏ qua câu hỏi (`POST .../interview/skip`)
- [x] Tổng hợp âm thanh TTS câu hỏi xoáy và phát lại ngay cho thí sinh với độ trễ $\le 3$ giây
- [x] Ghi nhận câu hỏi xoáy thành các exchange con liên kết với câu hỏi chính (`parent_exchange_id`)
- [x] Tự động chuyển tiếp sang câu hỏi chính tiếp theo khi hoàn thành đánh giá hoặc đạt trần hỏi xoáy

---

## 11. Phân Hệ Chấm Điểm Tự Động Bằng AI (Background AI Scoring Engine)
- [x] Tự động kích hoạt tác vụ chấm điểm nền bất đồng bộ ngay khi sinh viên hoàn thành bài thi (`AttemptGradingService`)
- [x] Service nền định kỳ quét hàng đợi công việc và thực thi đa luồng bất đồng bộ (`GradingScheduler` với `@Scheduled`)
- [x] Cơ chế Atomic status transition (`NONE -> GRADING`) để đảm bảo không bị xử lý trùng lặp
- [x] Đọc toàn bộ transcript của tất cả các lượt hỏi đáp chính và hỏi xoáy kèm Rubric đánh giá
- [x] Gọi mô hình Gemini Flash chấm điểm tuân thủ định dạng nghiêm ngặt theo JSON Schema (`AnswerGrader`)
- [x] Chấm điểm chi tiết cho từng tiêu chí trong Rubric (`criteria_grades`)
- [x] Trích dẫn bằng chứng cụ thể từ transcript: các điểm mạnh trả lời đúng (`strengths`, `evidenceQuote`)
- [x] Chỉ ra các ý còn thiếu hoặc sai lệch so với Rubric (`weaknesses`)
- [ ] Đánh giá độ lưu loát và thời gian trả lời làm tiêu chí phụ tham khảo (Fluency Score) *(Chưa tách thành trường điểm riêng)*
- [x] Tính điểm trung bình có trọng số cho từng câu hỏi (`question_grades`)
- [x] Tính điểm tổng kết toàn bài thi theo trọng số các câu hỏi
- [x] Lưu kết quả ở trạng thái dự thảo (`AI_DRAFT`) và đặt trạng thái bài thi là `PENDING_REVIEW` (ẩn toàn bộ điểm với sinh viên)

---

## 12. Phân Hệ Thẩm Định Điểm Số - Human-in-the-Loop (HITL Review Board)
- [ ] Bảng điều khiển Giảng viên (Lecturer Dashboard): cảnh báo số bài thi đang chờ duyệt điểm và đơn phúc khảo cần xử lý *(Chưa có API tổng hợp dashboard)*
- [x] Danh sách bài thi đã hoàn thành ở trạng thái chờ thẩm định (`PENDING_REVIEW`) (`GET /api/grading/attempts`)
- [x] Cung cấp dữ liệu đối soát thẩm định trực quan (`GET /api/grading/attempts/{attemptId}`)
- [ ] Trình phát âm thanh nghe lại audio ghi âm câu trả lời của sinh viên theo từng câu hỏi *(Hiện mới chỉ lưu transcript, chưa lưu audio binary)*
- [x] Hiển thị toàn văn bản transcript bóc băng đối thoại giữa AI và sinh viên (bao gồm câu hỏi chính và câu hỏi xoáy)
- [x] Hiển thị bảng điểm gợi ý chi tiết của AI theo từng tiêu chí Rubric kèm bằng chứng trích dẫn
- [x] Chấp thuận giữ nguyên điểm do AI đề xuất (Approve AI Score)
- [x] Ghi đè điểm thủ công (Override Score) cho từng câu hỏi (`PUT /api/grading/question-grades/{id}`)
- [ ] Chỉnh sửa nhận xét đánh giá của AI trước khi công bố *(Hiện API chỉ cập nhật `lecturerNote`, chưa cho sửa `aiFeedback`)*
- [x] Ràng buộc bắt buộc nhập lý do giải trình (`lecturer_note`) khi điểm điều chỉnh chênh lệch $> 2.0$ điểm so với AI (`BR-GRADE-002`)
- [x] Phê duyệt và công bố điểm chính thức (`PUBLISHED`) cho sinh viên xem (`POST /api/grading/attempts/{id}/publish`)
- [ ] Ghi nhận vết kiểm toán chi tiết vào `audit_logs` khi có hành động ghi đè điểm hoặc công bố kết quả *(Chưa lưu `audit_logs`)*

---

## 13. Phân Hệ Kết Quả Thi & Phúc Khảo Điểm Số (Results & Grade Appeals)
- [x] Danh sách kết quả các đợt thi đã hoàn thành của sinh viên kèm trạng thái điểm (`PENDING_REVIEW` hoặc `PUBLISHED`) (`GET /api/student/attempts`)
- [x] Chặn sinh viên xem chi tiết điểm số khi bài thi chưa được Giảng viên phê duyệt (`PENDING_REVIEW`)
- [x] Mở khóa xem báo cáo chi tiết kết quả thi khi đã công bố (`PUBLISHED`) (`GET /api/student/attempts/{id}/result`)
- [x] Báo cáo kết quả chi tiết: điểm tổng, điểm từng câu hỏi, điểm từng tiêu chí Rubric, điểm mạnh, điểm yếu và transcript đối thoại
- [x] Tạo và gửi đơn phúc khảo điểm số (`grade_appeals`) kèm lý do giải trình của sinh viên (`POST /api/student/appeals`)
- [x] Theo dõi danh sách đơn phúc khảo dành cho sinh viên (trạng thái `PENDING`, `ACCEPTED`, `REJECTED`, điểm trước/sau, phản hồi của giảng viên) (`GET /api/student/appeals`)
- [x] Phân hệ quản lý danh sách đơn phúc khảo dành cho Giảng viên (`GET /api/grading/appeals`)
- [x] Xem lại transcript gốc và bằng chứng khi xử lý đơn phúc khảo
- [x] Chấp thuận đơn phúc khảo và cập nhật điểm số mới kèm phản hồi chính thức (`PUT /api/grading/appeals/{id}`)
- [x] Từ chối đơn phúc khảo kèm phản hồi giải thích lý do (`PUT /api/grading/appeals/{id}`)

---

## 14. Phân Hệ Ứng Dụng Di Động (Mobile Client - AIVES Mobile)
- [ ] Đăng nhập tài khoản trên thiết bị di động (Tích hợp API Auth)
- [ ] Màn hình dành cho Giảng viên: xem danh sách ca thi và giám sát trạng thái phòng thi trực tiếp
- [ ] Màn hình dành cho Sinh viên: nhập mã ca thi và mã passcode để vào thi
- [ ] Kiểm tra điều kiện cho phép thi trên di động (`allow_mobile_exam`): hiển thị thông báo lỗi yêu cầu dùng máy tính nếu ca thi không cho phép
- [ ] Thu âm giọng nói và phát âm thanh câu hỏi qua module âm thanh native di động (`expo-av`)
- [ ] Trải nghiệm phòng thi vấn đáp thích ứng trên giao diện di động khi được cấp quyền

---

## 15. Phân Hệ Cổng Thông Tin Chung & Trang Tiện Ích (Public & Common Portal)
- [ ] Trang chủ giới thiệu giải pháp AIVES (Landing Page) *(Frontend)*
- [ ] Trang Chính sách bảo mật (Privacy Policy): quy định lưu trữ dữ liệu âm thanh, transcript và bảo mật thông tin *(Frontend)*
- [ ] Trang Điều khoản dịch vụ (Terms of Service): quy chuẩn liêm chính học thuật và phòng chống gian lận trong thi cử *(Frontend)*
- [ ] Trang thông báo lỗi 404 Không tìm thấy trang (Not Found Page) kèm điều hướng thông minh theo vai trò *(Frontend)*
- [ ] Hỗ trợ đa ngôn ngữ giao diện (Việt / Anh) *(Frontend)*
