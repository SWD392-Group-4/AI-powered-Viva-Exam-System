# BR-BANK: Question Bank & Rubric Management

## 1. Data Model Requirements
Mỗi câu hỏi trong ngân hàng (`QuestionBankItem`) gồm:
- `Content`: Nội dung câu hỏi chính (text).
- `CourseId` & `TopicId`: Gắn với môn và chủ đề.
- `BloomLevel`: `REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`.
- `RubricId`: Bắt buộc liên kết với 1 Rubric chi tiết.
- `ExpectedKeywords` / `ModelAnswer`: Ý chính cần trả lời.
- `Status`: `DRAFT`, `APPROVED`, `ARCHIVED`.

Mỗi Rubric (`Rubric`) gồm:
- Danh sách tiêu chí (`Criteria[]`): Tên tiêu chí, trọng số (weight %). Tổng weight của 1 rubric phải bằng 100%.
- Thang điểm (`Scale`): Mức điểm tối đa (ví dụ 10.0), mô tả tiêu chuẩn đạt mức (Exemplary, Competent, Developing, Inadequate).

---

## 2. Business Rules

### BR-BANK-001: Rubric Attachment Invariant
- **Rule**: Không cho phép kích hoạt câu hỏi (`APPROVED`) nếu câu hỏi chưa được gán Rubric hoặc Rubric chưa hoàn chỉnh (tổng trọng số tiêu chí $\neq 100\%$).

### BR-BANK-002: AI Question Generation Workflow
- **Rule**:
  1. Câu hỏi sinh ra từ AI (thông qua RAG từ giáo trình/slide) mặc định có trạng thái `DRAFT` và `Source = AI_GENERATED`.
  2. Câu hỏi AI sinh ra **bắt buộc** phải qua bước review của `LECTURER`:
     - Giảng viên có thể: Sửa nội dung, chỉnh Bloom level, gán Rubric, rồi chọn `APPROVE` hoặc `REJECT`.
  3. Chỉ câu hỏi ở trạng thái `APPROVED` mới được đưa vào pool bốc đề ngẫu nhiên cho kỳ thi.

### BR-BANK-003: Immutability of Questions in Active Exams
- **Rule**: Khi một câu hỏi đã được gán vào phiên thi đang diễn ra (`IN_PROGRESS`) hoặc đã có lịch thi trong vòng 24h:
  - Cấm chỉnh sửa nội dung câu hỏi và Rubric liên kết.
  - Nếu cần cập nhật, hệ thống tạo bản ghi mới (`Version + 1`) và lưu bản cũ để phục vụ chấm điểm và tra cứu lịch sử.
