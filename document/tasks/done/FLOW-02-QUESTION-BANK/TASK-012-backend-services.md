---
id: TASK-012
title: Implement Course Rubric, RAG Question Generation, Shared Bank & Audit Logging Services
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 3 of 5 (Backend Implementation)
assigned_to: backend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-24
updated_at: 2026-10-24
inputs:
  - document/01-business-rule/br-question-rubric.md
  - document/01-business-rule/lecturer-exam-prep-flow.md
  - document/05-api-specs/openapi-spec.yaml
outputs:
  - aives-backend/src/main/java/com/aives/modules/content/service/
  - aives-backend/src/main/java/com/aives/modules/content/controller/
dependencies:
  - TASK-011
---

# Task: [TASK-012] Implement Course Rubric, RAG Question Generation, Shared Bank & Audit Logging Services

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK`
- **Position in Flow**: Step 3 of 5.
- **Previous Step**: [TASK-011](TASK-011-db-migration.md).
- **Next Step Triggered**: [TASK-014](TASK-014-qa-verification.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Rubric Service & Controller:
  - Cho phép giảng viên tạo/sửa Rubric cho Môn học.
  - Validation: Tổng `weight_percent` của các tiêu chí con phải bằng đúng 100%. Nếu $\neq 100\%$, ném lỗi `BAD_REQUEST` (`BR-BANK-001`).
  - Immutability check: Kiểm tra cờ `is_locked`. Nếu môn học đã có ca thi `OPEN` hoặc `CLOSED`, chặn sửa và ném lỗi `ACCESS_DENIED` (`BR-BANK-006`).
- [x] RAG Question Generation Service:
  - Tích hợp Vertex AI RAG Engine: Truy vấn vector chunks từ các `materials` có `rag_status = 'READY'` thuộc `chapter_id`.
  - Prompt Gemini 1.5 Flash sinh câu hỏi theo tỷ lệ độ khó cấu hình (`EASY`, `MEDIUM`, `HARD`) (`BR-BANK-004`).
  - Output câu hỏi: `content`, `difficulty`, `model_answer`, `expected_keywords`.
  - **Khẳng định: Tuyệt đối không sinh Rubric từ RAG** (`BR-BANK-002`).
  - Lưu các câu hỏi ở trạng thái `DRAFT`, `source = AI_GENERATED`.
- [x] Shared Question Bank & Approval Gate:
  - Cho phép các giảng viên cùng dạy môn xem toàn bộ câu hỏi theo từng Chương (`BR-BANK-005`).
  - Phê duyệt câu hỏi (`APPROVE`): Kiểm tra Môn học đã có Rubric 100% hợp lệ chưa. Nếu chưa có hoặc chưa đạt 100%, ném lỗi chặn phê duyệt (`BR-BANK-001`).
  - Hỗ trợ từ chối câu hỏi (`REJECT`) kèm lý do.
- [x] Audit Logging (MongoDB):
  - Ghi nhận bản ghi log bất đồng bộ vào MongoDB `academic_audit_logs` cho mọi hành động: `CREATE_QUESTION`, `AI_GENERATE_QUESTION`, `UPDATE_QUESTION`, `APPROVE_QUESTION`, `REJECT_QUESTION`, `DELETE_QUESTION`, `UPDATE_RUBRIC` (`BR-BANK-007`).
  - Cung cấp API truy vấn log kiểm toán theo môn học (`GET /api/v1/courses/{courseId}/audit-logs`).

## 3. Technical Constraints (Tech Lead)
- Tách biệt rõ ràng interface và implementation service.
- Bắt và ghi log lỗi có cấu trúc (SLF4J); không nuốt ngoại lệ.
- MongoDB logging thực hiện bất đồng bộ (`@Async`) không làm block transaction chính của PostgreSQL.

## 4. Blocker & PO Clarification Section
- Status: CLEAR

## 5. Work Execution Checklist (Assignee: backend-dev)
- [x] Triển khai Rubric Service & Controller (`CourseRubricController`, `CourseRubricServiceImpl`).
- [x] Triển khai Chapter & Material Service & Controller (`ChapterController`, `MaterialController`).
- [x] Triển khai RAG Question Generation Service với Vertex AI & Gemini (`RagQuestionGenerationServiceImpl`).
- [x] Triển khai Question Bank Service & Controller (`QuestionBankController`, `QuestionBankServiceImpl`).
- [x] Triển khai MongoDB Audit Logging Service & Controller (`AcademicAuditLogServiceImpl`, `AcademicAuditLogController`).

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [x] Architecture and interface compliance verified.
- [x] No placeholder or mock code.
- [x] Moved ticket to `document/tasks/done/` and unblocked TASK-014.
