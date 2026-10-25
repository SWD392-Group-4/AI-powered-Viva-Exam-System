# Client & BA Alignment Log

This log captures direct discussions, change requests, and requirement confirmations between the **Client** (Human Stakeholder) and the **Business Analyst (BA)**. 

Whenever the Client confirms requirements or requests UI/logic adjustments, the BA records the discussion here, updates the domain specifications, and triggers the **Project Manager (PM)** to adjust tickets on `BOARD.md`.

---

## Alignment Sessions & Change Requests

### [ALIGN-001] Baseline Squad Operating Model Alignment
- **Date**: 2026-10-24
- **Participants**: Client (User), Business Analyst (BA)
- **Discussion Summary**: 
  - PO has full decision autonomy to avoid team delays.
  - Client communicates directly with the BA for requirement changes and confirmations.
  - BA logs alignment notes here, updates documentation, and triggers PM to generate adjustment tasks.
  - Client / Team members can prompt directly for quick UI fixes, while the assistant synchronizes changes back to docs to preserve architecture integrity.
- **Specification Updates**:
  - Added `business-analyst` agent role.
  - Updated `product-owner` role to autonomous decision-maker.
- **Action Items for PM**:
  - Register BA in squad matrix on `docs/tasks/BOARD.md`.
  - Maintain synchronization between ad-hoc UI prompts and design specs.
- **Status**: CLOSED

### [ALIGN-002] Tái Cấu Trúc Luồng Tạo Câu Hỏi, Rubric Cấp Môn Học & Ngân Hàng Đề Dùng Chung
- **Date**: 2026-10-24
- **Participants**: Client (User), Business Analyst (BA)
- **Discussion Summary**: 
  - **Rubric do Giảng viên tạo 100%**: RAG tuyệt đối không sinh Rubric; RAG chỉ thuần túy sinh câu hỏi, độ khó, đáp án mẫu, từ khóa chuyên môn từ tài liệu của Chương.
  - **Mỗi môn học chỉ có duy nhất 1 Rubric**: Để đảm bảo tính công bằng khảo thí. Bất kỳ giảng viên nào dạy môn đều có quyền tạo/sửa Rubric này, nhưng Rubric bị khóa cứng (Read-only) khi môn học có ca thi đang mở hoặc đã kết thúc.
  - **Phân cấp dữ liệu Môn học - Chương**: Môn học (`Course`) là lớn nhất -> có nhiều Chương (`Chapter`) -> Tài liệu học liệu (`Material`) nạp trực tiếp theo từng Chương -> Ngân hàng câu hỏi (`Question Bank`) dùng chung giữa các giảng viên cùng dạy môn được phân bổ theo từng Chương.
  - **Phân loại độ khó trực quan**: Bỏ thang nhận thức Bloom (`REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`), thay thế bằng 3 mức độ thực tế: Dễ (`EASY`), Trung bình (`MEDIUM`), Khó (`HARD`).
  - **Khởi tạo đề thi linh hoạt**: Hỗ trợ chọn danh sách câu hỏi cố định hoặc cấu hình ma trận đề bốc ngẫu nhiên theo Chương và độ khó.
  - **Audit Logging qua MongoDB**: Tích hợp MongoDB collection `academic_audit_logs` để tracking toàn bộ hoạt động thêm, sửa, xóa, duyệt câu hỏi và cập nhật Rubric.
- **Specification Updates**:
  - `document/01-business-rule/br-question-rubric.md`
  - `document/01-business-rule/lecturer-exam-prep-flow.md`
  - `document/ERD/conceptual-erd.mmd` & `01-conceptual-erd.md`
  - `document/ERD/logical-erd.mmd` & `02-logical-erd.md`
  - `document/ERD/physical-erd.mmd` & `03-physical-erd.md`
- **Action Items for PM**:
  - [ ] Cập nhật lại các task liên quan đến API spec của Question Bank và Rubric trên `BOARD.md`.
  - [ ] Thông báo cho Tech Lead và Backend Dev về việc bỏ trường `rubrics_id` trong `questions` và cấu trúc Rubric cấp Môn học.
- **Status**: CLOSED

<!-- Template for future alignment entries:
### [ALIGN-xxx] Title of Discussion or Change Request
- **Date**: YYYY-MM-DD
- **Participants**: Client, Business Analyst
- **Discussion Summary**: Key points, UI adjustments, or business logic requested.
- **Specification Updates**: Files in docs/00-product/ or docs/01-logic/ modified by BA.
- **Action Items for PM**:
  - [ ] Adjust ticket TASK-xxx or create rework ticket TASK-yyy in docs/tasks/backlog/.
  - [ ] Update docs/tasks/BOARD.md status.
- **Status**: OPEN / IN_PROGRESS / CLOSED
-->
