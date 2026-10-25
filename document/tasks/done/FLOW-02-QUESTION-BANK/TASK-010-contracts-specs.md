---
id: TASK-010
title: Define OpenAPI Schemas and Domain Contracts for Course Rubric & Question Bank
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 1 of 5 (Contract Definition)
assigned_to: tech-lead
reviewer: software-architect
status: DONE
created_at: 2026-10-24
updated_at: 2026-10-24
inputs:
  - document/01-business-rule/br-question-rubric.md
  - document/01-business-rule/lecturer-exam-prep-flow.md
  - document/ERD/02-logical-erd.md
outputs:
  - document/05-api-specs/openapi-spec.yaml
  - document/04-domains/content/interface_content.md
dependencies: []
---

# Task: [TASK-010] Define OpenAPI Schemas and Domain Contracts for Course Rubric & Question Bank

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK` (Tái Cấu Trúc Ngân Hàng Câu Hỏi, Rubric Cấp Môn Học & Tích Hợp Audit Log MongoDB)
- **Position in Flow**: Step 1 of 5.
- **Previous Step**: None (Entry point).
- **Next Step Triggered**: [TASK-011](file:///AI-powered-Viva-Exam-System/document/tasks/backlog/FLOW-02-QUESTION-BANK/TASK-011-db-migration.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Bổ sung endpoints và schemas cho Rubric duy nhất của Môn học:
  - `GET /api/v1/courses/{courseId}/rubric` (Lấy Rubric của môn học, bao gồm cờ `is_locked`).
  - `PUT /api/v1/courses/{courseId}/rubric` (Tạo/Cập nhật Rubric: validate tổng trọng số các tiêu chí = 100%, chặn sửa nếu `is_locked = true`).
- [x] Bổ sung endpoints quản lý Chương (`Chapter`) và Học liệu (`Material`):
  - `GET /api/v1/courses/{courseId}/chapters`
  - `POST /api/v1/courses/{courseId}/chapters`
  - `POST /api/v1/chapters/{chapterId}/materials` (Upload slide GCS, kích hoạt RAG).
  - `GET /api/v1/chapters/{chapterId}/materials` (Theo dõi trạng thái `INDEXING`, `READY`, `FAILED`).
  - `POST /api/v1/materials/{materialId}/reindex`
- [x] Bổ sung endpoints RAG sinh câu hỏi và Ngân hàng câu hỏi dùng chung:
  - `POST /api/v1/chapters/{chapterId}/questions/generate` (Request payload gồm: `materialIds`, `totalQuestions`, `difficultyRatio: { easyPercent, mediumPercent, hardPercent }`. Schema trả về danh sách câu hỏi DRAFT, KHÔNG có Rubric).
  - `GET /api/v1/chapters/{chapterId}/questions` (Lấy danh sách câu hỏi trong ngân hàng chung, lọc theo status, difficulty).
  - `POST /api/v1/chapters/{chapterId}/questions` (Tạo câu hỏi thủ công).
  - `PUT /api/v1/questions/{id}` (Chỉnh sửa câu hỏi).
  - `DELETE /api/v1/questions/{id}` (Xóa câu hỏi).
  - `PATCH /api/v1/questions/{id}/approve` (Kiểm tra môn học đã có Rubric 100% hợp lệ trước khi chuyển sang APPROVED).
  - `PATCH /api/v1/questions/{id}/reject` (Từ chối câu hỏi).
- [x] Bổ sung query endpoint cho MongoDB Audit Log:
  - `GET /api/v1/courses/{courseId}/audit-logs` (Lấy lịch sử thao tác với câu hỏi và rubric).

## 3. Technical Constraints (Tech Lead)
- Tuân thủ nghiêm ngặt chuẩn RESTful tại `document/05-api-specs/api-guidelines.md`.
- Độ khó câu hỏi bắt buộc sử dụng Enum: `EASY`, `MEDIUM`, `HARD`.
- Schema phản hồi lỗi nhất quán theo format `ErrorResponse`.

## 4. Blocker & PO Clarification Section
- Status: CLEAR

## 5. Work Execution Checklist (Assignee: tech-lead)
- [x] Tạo file mô tả domain contract `document/04-domains/content/interface_content.md`.
- [x] Cập nhật file `document/05-api-specs/openapi-spec.yaml` với đầy đủ các schemas và paths mới.
- [x] Xác nhận tính nhất quán với PO/BA và bàn giao cho Backend Dev thực hiện TASK-011 & TASK-012.

## 6. Review & Sign-Off (Reviewer: software-architect)
- [x] Architecture and interface compliance verified.
- [x] No hardcoded secrets or unresolved blockers.
- [x] Moved ticket to `document/tasks/done/` and unblocked TASK-011 and TASK-013.
