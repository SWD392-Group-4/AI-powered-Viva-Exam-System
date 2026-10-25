---
id: TASK-013
title: Implement Frontend UI for Course Rubric, Chapter RAG & Shared Question Bank
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 4 of 5 (Frontend Implementation)
assigned_to: frontend-dev
reviewer: tech-lead
status: PENDING_DEPENDENCY
created_at: 2026-10-24
updated_at: 2026-10-24
inputs:
  - document/04-ui-ux-design/page-maps/lecturer.md
  - document/05-api-specs/openapi-spec.yaml
outputs:
  - aives-frontend/src/features/courses/
  - aives-frontend/src/features/questions/
  - aives-frontend/src/features/rubric/
dependencies:
  - TASK-010
---

# Task: [TASK-013] Implement Frontend UI for Course Rubric, Chapter RAG & Shared Question Bank

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK`
- **Position in Flow**: Step 4 of 5.
- **Previous Step**: [TASK-010](TASK-010-contracts-specs.md).
- **Next Step Triggered**: [TASK-014](TASK-014-qa-verification.md).

## 2. Acceptance Criteria (Product Owner)
- [ ] Màn hình Quản lý Rubric Môn học (`/lecturer/courses/{courseId}/rubric`):
  - Giao diện thêm/sửa tiêu chí, nhập tên, mô tả và trọng số %.
  - Tính tổng trọng số thời gian thực; hiển thị cảnh báo đỏ nếu $\neq 100\%$, xanh nếu $= 100\%$.
  - Nếu `is_locked = true`: Hiển thị badge "Đã khóa (Ca thi đang diễn ra)" và vô hiệu hóa các nút chỉnh sửa/xóa.
- [ ] Màn hình Quản lý Chương & Học liệu (`/lecturer/chapters/{chapterId}`):
  - Danh sách tài liệu kèm badge trạng thái RAG (`INDEXING` - xanh xoay, `READY` - xanh lá, `FAILED` - đỏ kèm nút thử lại).
  - Tải lên slide/giáo trình PDF, PPTX (giới hạn 50MB, validate định dạng).
- [ ] Modal "Sinh câu hỏi AI" (`GenerateQuestionModal`):
  - Tích chọn các tài liệu có trạng thái `READY`.
  - Nhập số lượng câu hỏi cần sinh.
  - Ba thanh trượt hoặc ô nhập tỷ lệ % độ khó: Dễ (`EASY`), Trung bình (`MEDIUM`), Khó (`HARD`). Tổng tỷ lệ bắt buộc = 100%.
  - **Không có thành phần Rubric trong modal này**.
- [ ] Màn hình Ngân hàng câu hỏi dùng chung (`/lecturer/chapters/{chapterId}/questions`):
  - Bảng danh sách câu hỏi: Nội dung, độ khó (Badge Xanh: Dễ, Vàng: Trung bình, Đỏ: Khó), đáp án mẫu, từ khóa, người tạo, trạng thái (`DRAFT`, `APPROVED`).
  - Nút "Phê duyệt" (`APPROVE`) và "Từ chối" (`REJECT`).
  - Nếu môn học chưa có Rubric 100%, nút Phê duyệt bị vô hiệu hóa kèm tooltip giải thích lý do.
- [ ] Đồng bộ Typesafe API client tự động bằng Orval từ OpenAPI specs.

## 3. Technical Constraints (Tech Lead)
- Tuân thủ nghiêm ngặt bảng màu, typography và animation chuẩn shadcn/ui & Tailwind CSS.
- Tuyệt đối không tạo mock rỗng hoặc placeholder không tương tác được.
- Đầy đủ trạng thái Loading (Skeleton), Error banner, và Toast thông báo kết quả.

## 4. Blocker & PO Clarification Section
- Status: PENDING_DEPENDENCY (Có thể sinh trước Type client từ OpenAPI của TASK-010 và dựng UI components)

## 5. Work Execution Checklist (Assignee: frontend-dev)
- [ ] Chạy Orval generate API hooks từ OpenAPI spec.
- [ ] Dựng trang Quản lý Rubric môn học.
- [ ] Dựng trang Quản lý Học liệu Chương.
- [ ] Dựng Modal Sinh câu hỏi bằng AI với slider tỷ lệ Dễ / Trung bình / Khó.
- [ ] Dựng Bảng Ngân hàng câu hỏi dùng chung & thao tác phê duyệt.
