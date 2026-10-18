# Danh Mục Tính Năng Hệ Thống AIVES (Feature Checklist)

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Nguồn tài liệu đối chiếu**: `document/00-overview`, `document/01-business-rule`, `document/core-workflows.md`, `document/04-ui-ux-design`, `document/05-crud-demo`, `document/Software_Architecture_Design_Report.md`.

---

## 1. Phân Hệ Xác Thực & Phân Quyền (Authentication & RBAC)
- [ ] Đăng nhập hệ thống bằng Email và Mật khẩu với xác thực JWT Token (hỗ trợ Admin, Giảng viên, Sinh viên)
- [ ] Đăng ký tài khoản Sinh viên bằng email tổ chức (`@fpt.edu.vn`)
- [ ] Gửi và xác thực mã OTP qua email khi đăng ký tài khoản (hiệu lực 5 phút, cooldown 60s, giới hạn 5 lần thử)
- [ ] Yêu cầu quên mật khẩu và gửi mã OTP khôi phục qua email
- [ ] Đặt lại mật khẩu mới thông qua xác thực mã OTP
- [ ] Xem thông tin hồ sơ cá nhân (Profile)
- [ ] Cập nhật thông tin cá nhân và thay đổi mật khẩu
- [ ] Bắt buộc đổi mật khẩu ở lần đầu đăng nhập đối với tài khoản được cấp phát sẵn (`must_change_password`)
- [ ] Phân quyền người dùng dựa trên vai trò (RBAC: `ADMIN`, `LECTURER`, `STUDENT`)
- [ ] Phân quyền Giảng viên theo từng ca thi phụ trách (`EXAM_EXAMINER`, `CHIEF_EXAMINER`)
- [ ] Cơ chế duy trì phiên duy nhất khi thi (Single Active Connection - ngắt kết nối thiết bị cũ nếu phát hiện đăng nhập trùng)
- [ ] Đăng xuất hệ thống và thu hồi token phiên làm việc

---

## 2. Phân Hệ Quản Trị Hệ Thống (Admin System Management)
- [ ] Bảng điều khiển quản trị (Admin Dashboard): thống kê số lượng người dùng theo vai trò, số phiên thi đang chạy, tài nguyên AI tiêu thụ
- [ ] Giám sát trạng thái hoạt động của các dịch vụ nền (PostgreSQL, Google Cloud STT/TTS, Gemini Flash API)
- [ ] Quản lý tài khoản người dùng toàn hệ thống (CRUD User)
- [ ] Danh sách người dùng hỗ trợ phân trang, lọc theo vai trò và tìm kiếm
- [ ] Tạo mới tài khoản Giảng viên và Sinh viên với quy tắc tự động sinh mã định danh (`STxxxxxx`, `LExxxxxx`)
- [ ] Bật / Tắt kích hoạt trạng thái tài khoản (`Active` / `Inactive`)
- [ ] Xóa tài khoản người dùng an toàn (Soft-delete / Kiểm tra ràng buộc dữ liệu)
- [ ] Cấu hình tham số hệ thống & AI (`system_settings`): Model LLM, Endpoint STT/TTS, ngưỡng im lặng tự nộp bài, số câu hỏi xoáy tối đa
- [ ] Tra cứu và lọc nhật ký kiểm toán hệ thống (Audit Logs) theo người thực hiện, loại hành động, loại thực thể và khoảng thời gian
- [ ] Xem chi tiết đối chiếu giá trị cũ (`old_value`) và giá trị mới (`new_value`) của các thao tác nhạy cảm trong Audit Logs

---

## 3. Phân Hệ Quản Lý Học Liệu & Chương Trình (Curriculum Management)
- [ ] Quản lý danh mục Bài học (`lessons`) trực thuộc môn học phụ trách (CRUD)
- [ ] Quản lý danh mục Chủ đề con (`topics`) trực thuộc từng bài học (CRUD)
- [ ] Thiết lập liên kết giữa chủ đề học tập và ngân hàng câu hỏi
- [ ] Quản lý danh mục thuật ngữ chuyên môn (`domain_keywords`) hỗ trợ nhận diện giọng nói chính xác

---

## 4. Phân Hệ Ngân Hàng Câu Hỏi & Sinh Đề AI (Question Bank & AI RAG)
- [ ] Tải lên tài liệu học liệu (giáo trình, slide bài giảng PDF/PPTX) để trích xuất nội dung
- [ ] Tự động sinh câu hỏi và câu trả lời mẫu bằng AI (Gemini Flash RAG) theo chủ đề bài học
- [ ] Phân loại câu hỏi theo 4 cấp độ tư duy Bloom (`REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`)
- [ ] Quản lý ngân hàng câu hỏi (CRUD Question)
- [ ] Quản lý vòng đời trạng thái câu hỏi (`DRAFT`, `APPROVED`, `ARCHIVED`)
- [ ] Quy trình Giảng viên kiểm duyệt, chỉnh sửa nội dung và câu trả lời mẫu của câu hỏi AI sinh ra
- [ ] Phê duyệt câu hỏi từ `DRAFT` sang `APPROVED` để đưa vào sử dụng trong ca thi
- [ ] Bắt buộc gán Rubric đánh giá hợp lệ vào câu hỏi trước khi phê duyệt

---

## 5. Phân Hệ Tiêu Chí Đánh Giá (Rubric Management)
- [ ] Quản lý danh mục Rubric đánh giá (CRUD Rubric)
- [ ] Tạo mới và chỉnh sửa danh sách tiêu chí chấm điểm (`criteria`) trong Rubric
- [ ] Cấu hình trọng số phần trăm (`weight %`) cho từng tiêu chí
- [ ] Ràng buộc kiểm tra tự động tổng trọng số các tiêu chí trong một Rubric phải bằng đúng 100%
- [ ] Thiết lập mô tả chi tiết yêu cầu đạt điểm cho từng tiêu chí (tránh hiện tượng AI chấm ảo)
- [ ] Thiết lập thang điểm đánh giá (Scale) và các mức phân loại năng lực (Exemplary, Competent, Developing, Inadequate)
- [ ] Trích xuất và gợi ý tiêu chí Rubric tự động từ tài liệu bằng AI

---

## 6. Phân Hệ Thiết Lập Ca Thi Vấn Đáp (Exam Session Scheduling)
- [ ] Quản lý danh sách các ca thi viva (CRUD Exam Sessions)
- [ ] Tìm kiếm ca thi và lọc theo các trạng thái: Tất cả, Đang diễn ra, Sắp diễn ra, Đã kết thúc, Đã hủy
- [ ] Thiết lập thông tin ca thi: Tên ca thi, mô tả, môn học, thời gian mở phòng và thời gian đóng phòng
- [ ] Tự động sinh mã phòng thi công khai (`session_code` định dạng `AIVES_EXAM_yyyy_xxxxxx`)
- [ ] Tự động sinh mã truy cập bí mật 6 số (`access_code`)
- [ ] Chức năng tạo lại mã truy cập bí mật (Regenerate Passcode) và hủy hiệu lực mã cũ
- [ ] Cấu hình thời lượng thi tối đa của ca thi (`duration_minutes`)
- [ ] Cấu hình số lượng câu hỏi chính mỗi thí sinh phải trả lời (`max_questions`)
- [ ] Cấu hình thời gian chuẩn bị suy nghĩ cho mỗi câu hỏi (`preparation_seconds`)
- [ ] Cấu hình thời gian trả lời tối đa cho mỗi câu hỏi (`answer_seconds`)
- [ ] Cấu hình số lượt hỏi xoáy tối đa cho mỗi câu hỏi (`max_follow_up_per_question`)
- [ ] Cấu hình cờ cho phép hoặc cấm thí sinh thi bằng ứng dụng di động (`allow_mobile_exam`)
- [ ] Chọn và gán danh sách chủ đề (`topics`) hoặc câu hỏi cụ thể (`questions`) áp dụng cho ca thi
- [ ] Chuyển trạng thái an toàn sang `CANCELLED` khi hủy ca thi đã có dữ liệu làm bài

---

## 7. Phân Hệ Giám Sát Ca Thi Thời Gian Thực (Live Exam Monitoring)
- [ ] Bảng điều khiển giám sát trực tiếp ca thi dành cho Giảng viên (Web Portal & Mobile App)
- [ ] Danh sách thí sinh đang tham gia trong phòng thi theo thời gian thực
- [ ] Hiển thị tiến độ làm bài của từng thí sinh: câu hỏi hiện tại, số lượt hỏi xoáy đã thực hiện
- [ ] Hiển thị thời gian làm bài còn lại của từng thí sinh
- [ ] Giám sát trạng thái thiết bị và kết nối của thí sinh (micro hoạt động, kết nối mạng)
- [ ] Cảnh báo sự cố mất kết nối hoặc thí sinh nộp bài bất thường

---

## 8. Phân Hệ Vào Phòng Thi & Kiểm Tra Thiết Bị (Check-in & Device Diagnostics)
- [ ] Bảng điều khiển sinh viên (Student Dashboard): hiển thị ca thi sắp tới, ca thi đang mở, điểm TB và lịch sử thi
- [ ] Giao diện nhập mã phòng thi (`session_code`) và mã passcode 6 số
- [ ] Cơ chế chống dò mã: thông báo lỗi chung khi nhập sai mã phòng hoặc mã passcode
- [ ] Khóa tạm thời quyền vào thi khi nhập sai mã quá 5 lần trong vòng 10 phút (Rate limit)
- [ ] Kiểm tra điều kiện mở/đóng và tính hợp lệ của ca thi
- [ ] Kiểm tra và chặn thiết bị di động truy cập ca thi nếu cờ `allow_mobile_exam` đang tắt
- [ ] Quy trình kiểm tra thiết bị âm thanh trước khi vào thi (Audio Loopback Test): thu âm giọng nói thử và phát lại qua loa/tai nghe
- [ ] Đo ngưỡng tạp âm nền và kiểm tra tính sẵn sàng của micro (VAD Check)
- [ ] Khởi tạo bản ghi lượt thi (`viva_attempts`) với trạng thái `IN_PROGRESS`
- [ ] Cơ chế tiếp tục lượt thi cũ (Resume Attempt) khi bị mất kết nối hoặc tải lại trang, giữ nguyên thời gian còn lại

---

## 9. Phân Hệ Phòng Thi Vấn Đáp Trực Tiếp Bằng Giọng Nói (Live Voice AI Viva Exam Room)
- [ ] Hiển thị nội dung câu hỏi chính dạng văn bản
- [ ] Phát giọng đọc câu hỏi tự nhiên bằng tiếng Việt thông qua Google Cloud Text-to-Speech (TTS Neural Voice)
- [ ] Đồng hồ đếm ngược thời gian chuẩn bị suy nghĩ (Preparation Countdown Timer)
- [ ] Tự động bật micro và chuyển sang trạng thái trả lời khi hết giờ suy nghĩ
- [ ] Thu âm giọng nói của sinh viên qua micro thời gian thực
- [ ] Hiển thị hiệu ứng sóng âm thanh (Voice Wave Visualizer) theo mức năng lượng giọng nói
- [ ] Nhận diện giọng nói và bóc băng tiếng Việt thời gian thực (Google Cloud STT `vi-VN`) kết hợp context từ khóa chuyên ngành
- [ ] Phát hiện khoảng lặng liên tục $\ge 5$ giây để hiển thị cảnh báo gợi ý hoàn thành câu trả lời
- [ ] Tự động ngắt micro và nộp câu trả lời khi phát hiện im lặng liên tục $\ge 10$ giây (`AUTO_SUBMIT`)
- [ ] Nút chủ động kết thúc câu trả lời và nộp bài trước thời hạn
- [ ] Đồng hồ đếm ngược tổng thời gian làm bài của toàn bộ ca thi
- [ ] Tự động thu bài và đóng lượt thi khi hết tổng thời gian ca thi
- [ ] Lưu trữ bản ghi âm thanh và văn bản bóc băng từng lượt hỏi - đáp (`interview_exchanges`)

---

## 10. Phân Hệ Lõi Hỏi Xoáy Thích Ứng Thời Gian Thực (Live Adaptive Follow-up Engine)
- [ ] Phân tích nội dung câu trả lời của thí sinh thời gian thực đối chiếu với Rubric và đáp án mẫu
- [ ] Tự động phát hiện câu trả lời thiếu ý chính (`INCOMPLETE`)
- [ ] Tự động phát hiện câu trả lời mơ hồ, chung chung cần làm rõ (`AMBIGUOUS`)
- [ ] Tự động phát hiện câu trả lời có mâu thuẫn giữa các mệnh đề (`CONTRADICTORY`)
- [ ] Tự động kích hoạt sinh câu hỏi hỏi xoáy ngắn gọn ($\le 40$ từ) bám sát phần kiến thức bị thiếu
- [ ] Ràng buộc chống lạc đề (Anti-Hallucination): tuyệt đối không hỏi sang chủ đề ngoài phạm vi câu hỏi chính
- [ ] Kiểm soát số lượt hỏi xoáy không vượt quá trần cấu hình (`max_follow_up_per_question`)
- [ ] Tự động dừng hỏi xoáy khi sinh viên đạt $\ge 90\%$ tiêu chí hoặc khi sinh viên xin bỏ qua câu hỏi
- [ ] Tổng hợp âm thanh TTS câu hỏi xoáy và phát lại ngay cho thí sinh với độ trễ $\le 3$ giây
- [ ] Ghi nhận câu hỏi xoáy thành các exchange con liên kết với câu hỏi chính (`parent_exchange_id`)
- [ ] Tự động chuyển tiếp sang câu hỏi chính tiếp theo khi hoàn thành đánh giá hoặc đạt trần hỏi xoáy

---

## 11. Phân Hệ Chấm Điểm Tự Động Bằng AI (Background AI Scoring Engine)
- [ ] Tự động tạo tác vụ chấm điểm nền (`background_jobs` với `EVALUATE_ATTEMPT`) ngay khi sinh viên hoàn thành bài thi
- [ ] Service nền định kỳ quét hàng đợi công việc PENDING và thực thi đa luồng bất đồng bộ (`@Scheduled` + `@Async`)
- [ ] Khóa bi quan (`FOR UPDATE`) bản ghi tác vụ để đảm bảo không bị xử lý trùng lặp
- [ ] Đọc toàn bộ transcript của tất cả các lượt hỏi đáp chính và hỏi xoáy kèm Rubric đánh giá
- [ ] Gọi mô hình Gemini Flash chấm điểm tuân thủ định dạng nghiêm ngặt theo JSON Schema
- [ ] Chấm điểm chi tiết cho từng tiêu chí trong Rubric (`criteria_grades`)
- [ ] Trích dẫn bằng chứng cụ thể từ transcript: các điểm mạnh trả lời đúng (`strengths`)
- [ ] Chỉ ra các ý còn thiếu hoặc sai lệch so với Rubric (`weaknesses`)
- [ ] Đánh giá độ lưu loát và thời gian trả lời làm tiêu chí phụ tham khảo (Fluency Score)
- [ ] Tính điểm trung bình có trọng số cho từng câu hỏi (`question_grades`)
- [ ] Tính điểm tổng kết toàn bài thi theo trọng số các câu hỏi
- [ ] Lưu kết quả ở trạng thái dự thảo (`AI_DRAFT`) và đặt trạng thái bài thi là `PENDING_REVIEW` (ẩn toàn bộ điểm với sinh viên)

---

## 12. Phân Hệ Thẩm Định Điểm Số - Human-in-the-Loop (HITL Review Board)
- [ ] Bảng điều khiển Giảng viên (Lecturer Dashboard): cảnh báo số bài thi đang chờ duyệt điểm và đơn phúc khảo cần xử lý
- [ ] Danh sách bài thi đã hoàn thành ở trạng thái chờ thẩm định (`PENDING_REVIEW`)
- [ ] Giao diện thẩm định Split-View 2 cột đối chiếu trực quan
- [ ] Trình phát âm thanh nghe lại audio ghi âm câu trả lời của sinh viên theo từng câu hỏi
- [ ] Hiển thị toàn văn bản transcript bóc băng đối thoại giữa AI và sinh viên (bao gồm câu hỏi chính và câu hỏi xoáy)
- [ ] Hiển thị bảng điểm gợi ý chi tiết của AI theo từng tiêu chí Rubric kèm bằng chứng trích dẫn
- [ ] Chấp thuận giữ nguyên điểm do AI đề xuất (Approve AI Score)
- [ ] Ghi đè điểm thủ công (Override Score) cho từng tiêu chí hoặc từng câu hỏi
- [ ] Chỉnh sửa nhận xét đánh giá của AI trước khi công bố
- [ ] Ràng buộc bắt buộc nhập lý do giải trình (`lecturer_note`) khi điểm điều chỉnh chênh lệch $> 2.0$ điểm so với AI
- [ ] Phê duyệt và công bố điểm chính thức (`PUBLISHED`) cho sinh viên xem
- [ ] Ghi nhận vết kiểm toán chi tiết vào `audit_logs` khi có hành động ghi đè điểm hoặc công bố kết quả

---

## 13. Phân Hệ Kết Quả Thi & Phúc Khảo Điểm Số (Results & Grade Appeals)
- [ ] Danh sách kết quả các đợt thi đã hoàn thành của sinh viên kèm trạng thái điểm (`PENDING_REVIEW` hoặc `PUBLISHED`)
- [ ] Chặn sinh viên xem chi tiết điểm số khi bài thi chưa được Giảng viên phê duyệt (`PENDING_REVIEW`)
- [ ] Mở khóa xem báo cáo chi tiết kết quả thi khi đã công bố (`PUBLISHED`)
- [ ] Báo cáo kết quả chi tiết: điểm tổng, điểm từng câu hỏi, điểm từng tiêu chí Rubric, điểm mạnh, điểm cần cải thiện và transcript đối thoại
- [ ] Tạo và gửi đơn phúc khảo điểm số (`grade_appeals`) kèm lý do giải trình của sinh viên
- [ ] Màn hình theo dõi tiến độ xử lý đơn phúc khảo dành cho sinh viên (trạng thái `PENDING`, `ACCEPTED`, `REJECTED`, điểm trước/sau, phản hồi của giảng viên)
- [ ] Phân hệ quản lý danh sách đơn phúc khảo dành cho Giảng viên
- [ ] Xem lại transcript gốc và bằng chứng khi xử lý đơn phúc khảo
- [ ] Chấp thuận đơn phúc khảo và cập nhật điểm số mới kèm phản hồi chính thức
- [ ] Từ chối đơn phúc khảo kèm phản hồi giải thích lý do

---

## 14. Phân Hệ Ứng Dụng Di Động (Mobile Client - AIVES Mobile)
- [ ] Đăng nhập tài khoản trên thiết bị di động
- [ ] Màn hình dành cho Giảng viên: xem danh sách ca thi và giám sát trạng thái phòng thi trực tiếp
- [ ] Màn hình dành cho Sinh viên: nhập mã ca thi và mã passcode để vào thi
- [ ] Kiểm tra điều kiện cho phép thi trên di động (`allow_mobile_exam`): hiển thị thông báo lỗi yêu cầu dùng máy tính nếu ca thi không cho phép
- [ ] Thu âm giọng nói và phát âm thanh câu hỏi qua module âm thanh native di động (`expo-av`)
- [ ] Trải nghiệm phòng thi vấn đáp thích ứng trên giao diện di động khi được cấp quyền

---

## 15. Phân Hệ Cổng Thông Tin Chung & Trang Tiện Ích (Public & Common Portal)
- [ ] Trang chủ giới thiệu giải pháp AIVES (Landing Page)
- [ ] Trang Chính sách bảo mật (Privacy Policy): quy định lưu trữ dữ liệu âm thanh, transcript và bảo mật thông tin
- [ ] Trang Điều khoản dịch vụ (Terms of Service): quy chuẩn liêm chính học thuật và phòng chống gian lận trong thi cử
- [ ] Trang thông báo lỗi 404 Không tìm thấy trang (Not Found Page) kèm điều hướng thông minh theo vai trò
- [ ] Hỗ trợ đa ngôn ngữ giao diện (Việt / Anh)
