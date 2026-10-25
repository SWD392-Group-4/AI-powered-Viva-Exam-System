# BR-BANK: Course-Level Rubric & Shared Question Bank Management

## 1. Data Model & Hierarchy Requirements

### 1.1. Cấu Trúc Phân Cấp Dữ Liệu
- **`Course` (Môn học)**: Thực thể cấp cao nhất trong phân hệ học thuật.
  - **Mỗi môn học chỉ có duy nhất 1 Rubric chuẩn (`Rubric`)** để đảm bảo tính công bằng và nhất quán cho toàn bộ sinh viên tham gia thi vấn đáp.
  - Một môn học gồm nhiều **Chương (`Chapter`)**.
- **`Chapter` (Chương)**:
  - Phân vùng kiến thức trực thuộc Môn học.
  - Là nơi nạp và quản lý các tài liệu học liệu (`Material` - Slide, Giáo trình PDF/PPTX) phục vụ bộ máy RAG.
  - Chứa danh sách câu hỏi trong **Ngân hàng câu hỏi dùng chung (`Shared Question Bank`)** giữa tất cả giảng viên cùng giảng dạy môn học đó.
- **`Question` (Câu hỏi trong ngân hàng)**:
  - `Content`: Nội dung câu hỏi chính (text).
  - `ChapterId`: Liên kết trực tiếp với Chương kiến thức.
  - `Difficulty`: Phân loại độ khó trực quan gồm 3 mức: `EASY` (Dễ), `MEDIUM` (Trung bình), `HARD` (Khó).
  - `ExpectedKeywords`: Danh sách từ khóa chuyên ngành bắt buộc/kỳ vọng sinh viên trình bày.
  - `ModelAnswer`: Gợi ý câu trả lời chuẩn (dùng cho LLM đối chiếu chấm điểm và giảng viên tham khảo).
  - `Source`: Nguồn gốc câu hỏi (`AI_GENERATED` hoặc `MANUAL`).
  - `Status`: Vòng đời câu hỏi (`DRAFT`, `APPROVED`, `REJECTED`, `ARCHIVED`).
  - `CreatedBy`: Giảng viên khởi tạo câu hỏi.
  - *Lưu ý*: Câu hỏi tự động kế thừa Rubric duy nhất của Môn học, không lưu khóa ngoại `rubric_id` riêng lẻ tại từng câu hỏi.

### 1.2. Cấu Trúc Rubric Môn Học (`Rubric`)
Mỗi Rubric của Môn học gồm:
- `CourseId`: Khóa ngoại 1:1 liên kết với Môn học.
- Danh sách tiêu chí (`Criteria[]`):
  - Tên tiêu chí (Criteria Name).
  - Trọng số phần trăm (`weight_percent`). Tổng trọng số của toàn bộ tiêu chí trong Rubric bắt buộc phải bằng đúng 100%.
  - Mô tả tiêu chuẩn đánh giá (`description`): Chi tiết yêu cầu cần đạt ở các mức điểm để AI và Giảng viên chấm điểm minh bạch.

---

## 2. Business Rules

### BR-BANK-001: Course Rubric Invariant & Approval Gate
- **Rule**:
  1. Môn học bắt buộc phải có Rubric hoàn chỉnh (đã được tạo và tổng trọng số các tiêu chí $\sum \text{weight} = 100\%$) trước khi bất kỳ câu hỏi nào thuộc môn học đó được chuyển sang trạng thái `APPROVED`.
  2. Hệ thống nghiêm cấm kích hoạt ca thi (`OPEN`) nếu môn học chưa có Rubric hoàn chỉnh đạt chuẩn 100%.

### BR-BANK-002: AI Question Generation Workflow (RAG Không Sinh Rubric)
- **Rule**:
  1. Khi sinh câu hỏi bằng AI thông qua Google Cloud Vertex AI Managed RAG Engine từ tài liệu của Chương, câu hỏi sinh ra mặc định mang trạng thái `DRAFT` và `Source = AI_GENERATED`.
  2. **RAG TUYỆT ĐỐI KHÔNG SINH RUBRIC**. RAG chỉ sinh:
     - Nội dung câu hỏi (`content`).
     - Độ khó (`difficulty`: `EASY`, `MEDIUM`, `HARD`).
     - Gợi ý câu trả lời mẫu (`model_answer`).
     - Danh sách từ khóa chuyên ngành (`expected_keywords`).
  3. Mọi câu hỏi AI sinh ra **bắt buộc** phải qua bước thẩm định Human-in-the-Loop (HITL) của Giảng viên:
     - Giảng viên có quyền: Tinh chỉnh câu từ, đổi mức độ khó, bổ sung từ khóa, sửa đáp án mẫu, sau đó bấm `APPROVE` hoặc `REJECT`.
  4. Chỉ những câu hỏi ở trạng thái `APPROVED` mới được đưa vào danh sách đề thi chính thức của các ca thi.

### BR-BANK-003: Rubric Completeness for AI Grading
- **Rule**: Mọi tiêu chí trong Rubric duy nhất của môn học bắt buộc phải có tiêu chuẩn định lượng/định tính rõ ràng. Tiêu chuẩn này là cơ sở bất biến để LLM phân tích transcript câu trả lời của sinh viên, trích dẫn bằng chứng và đề xuất điểm theo từng tiêu chí (`CRITERIA_GRADE`).

### BR-BANK-004: Difficulty Distribution Configuration
- **Rule**:
  1. Khi giảng viên cấu hình sinh câu hỏi AI từ tài liệu của Chương, số lượng câu hỏi phân bổ cho 3 mức độ (`EASY`, `MEDIUM`, `HARD`) phải tuân thủ chính xác tỷ lệ phần trăm giảng viên đã thiết lập (ví dụ: 40% Dễ, 40% Trung bình, 20% Khó).
  2. Nếu giảng viên chọn 100% một mức độ (ví dụ 100% `EASY`), toàn bộ câu hỏi sinh ra phải thuộc mức độ đó.

### BR-BANK-005: Shared Question Bank & Multi-Lecturer Collaboration
- **Rule**:
  1. Ngân hàng câu hỏi theo từng Chương là tài nguyên dùng chung giữa tất cả các giảng viên được phân công giảng dạy môn học đó.
  2. Mọi giảng viên cùng dạy môn đều có quyền xem toàn bộ câu hỏi của các Chương.
  3. Giảng viên tạo câu hỏi DRAFT có quyền chỉnh sửa/duyệt câu hỏi của mình. Các giảng viên khác cùng dạy môn học cũng có quyền xem và tham gia phê duyệt (`APPROVED`) để làm phong phú ngân hàng đề thi chung.

### BR-BANK-006: Rubric Governance & Immutability Lock
- **Rule**:
  1. Bất kỳ giảng viên nào được phân công giảng dạy môn học đều có quyền tạo hoặc hiệu chỉnh bộ tiêu chí Rubric duy nhất của môn học đó.
  2. **Khóa bất biến (Immutability Lock)**: Khi môn học đã có ít nhất một ca thi chuyển sang trạng thái đang diễn ra (`OPEN`) hoặc đã kết thúc (`CLOSED`, `ARCHIVED`), toàn bộ cấu trúc tiêu chí và trọng số của Rubric môn học sẽ bị khóa cứng (Read-Only) để bảo vệ tính toàn vẹn và công bằng kết quả thi.

### BR-BANK-007: Audit Logging via MongoDB
- **Rule**:
  1. Hệ thống tích hợp MongoDB để lưu trữ nhật ký hoạt động (`audit_logs`) theo thời gian thực đối với ngân hàng câu hỏi và Rubric.
  2. Mọi thao tác: Tạo câu hỏi, AI sinh câu hỏi, Sửa nội dung/độ khó, Phê duyệt (`APPROVE`), Từ chối (`REJECT`), Xóa câu hỏi, Cập nhật Rubric môn học đều phải ghi lại bản ghi log gồm: `actor_id` (mã giảng viên), `action`, `course_id`, `chapter_id`, `target_id`, `before_state`, `after_state`, `timestamp`.
