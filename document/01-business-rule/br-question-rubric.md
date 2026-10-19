# BR-BANK: Question Bank & Rubric Management

## 1. Data Model Requirements
Mỗi câu hỏi trong ngân hàng (`QuestionBankItem`) gồm:
- `Content`: Nội dung câu hỏi chính (text).
- `ExamId` & `TopicId`: Gắn với kỳ thi và chủ đề.
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
  3. Chỉ câu hỏi ở trạng thái `APPROVED` mới được đưa vào danh sách câu hỏi sử dụng cho phỏng vấn.

### BR-BANK-003: Rubric Completeness for AI Grading
- **Rule**: Mọi tiêu chí trong Rubric bắt buộc phải có mô tả rõ ràng về yêu cầu đạt điểm để LLM làm cơ sở đối chiếu với transcript (tránh chấm điểm hallucination).

### BR-BANK-004: Bloom Distribution & Adaptive Rubric Mapping
- **Rule**:
  1. Khi sinh câu hỏi AI từ tài liệu (RAG), số lượng câu hỏi phân bổ cho 4 mức Bloom (`REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`) bắt buộc phải bám sát chính xác 100% theo tỷ lệ cấu hình của Giảng viên.
  2. Nếu giảng viên cấu hình 100% ở một mức Bloom (ví dụ 100% `REMEMBER`), toàn bộ câu hỏi sinh ra phải thuộc mức Bloom đó.
  3. Khung tiêu chí chấm điểm (Rubric) sinh ra tự động phải thích ứng tương ứng với trọng tâm nhận thức của bộ câu hỏi (ví dụ với mức `REMEMBER` 100%, tiêu chí Rubric tập trung vào độ chính xác định nghĩa, thuật ngữ và khả năng tái hiện kiến thức chính quy từ tài liệu; tổng trọng số các tiêu chí luôn bằng đúng 100%).
