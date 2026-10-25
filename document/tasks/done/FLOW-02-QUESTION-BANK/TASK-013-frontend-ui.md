---
id: TASK-013
title: Implement Frontend UI for Course Rubric, Chapter RAG & Shared Question Bank
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 4 of 5 (Frontend Implementation)
assigned_to: frontend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-24
updated_at: 2026-10-25
inputs:
  - document/04-ui-ux-design/page-maps/lecturer.md
  - document/05-api-specs/openapi-spec.yaml
outputs:
  - aives-frontend/src/features/rubric/
  - aives-frontend/src/features/materials/
  - aives-frontend/src/features/questions/
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
- [x] Màn hình Quản lý Rubric Môn học (`/lecturer/courses/:courseId/rubric`):
  - Giao diện thêm/sửa tiêu chí, nhập tên, mô tả và trọng số %.
  - Tính tổng trọng số thời gian thực; hiển thị cảnh báo đỏ nếu $\neq 100\%$, xanh nếu $= 100\%$.
  - Nếu `is_locked = true`: Hiển thị badge "Đã khóa (Ca thi đang diễn ra)" và vô hiệu hóa các nút chỉnh sửa/xóa (BR-BANK-006).
- [x] Màn hình Quản lý Chương & Học liệu (`/lecturer/chapters/:chapterId`):
  - Danh sách tài liệu kèm badge trạng thái RAG (`INDEXING` - xanh xoay, `READY` - xanh lá, `FAILED` - đỏ kèm nút thử lại).
  - Tải lên slide/giáo trình PDF, PPTX (giới hạn 50MB, validate định dạng).
- [x] Modal "Sinh câu hỏi AI" (`GenerateQuestionModal`):
  - Tích chọn các tài liệu có trạng thái `READY`.
  - Nhập số lượng câu hỏi cần sinh.
  - Ba thanh trượt và ô nhập tỷ lệ % độ khó: Dễ (`EASY`), Trung bình (`MEDIUM`), Khó (`HARD`). Tổng tỷ lệ bắt buộc = 100%.
  - **Khẳng định: Tuyệt đối không có thành phần Rubric trong modal này** (BR-BANK-002).
- [x] Màn hình Ngân hàng câu hỏi dùng chung (`/lecturer/chapters/:chapterId/questions`):
  - Bảng danh sách câu hỏi: Nội dung, độ khó (Badge Xanh: Dễ, Vàng: Trung bình, Đỏ: Khó), đáp án mẫu, từ khóa, người tạo, trạng thái (`DRAFT`, `APPROVED`, `REJECTED`).
  - Nút "Phê duyệt" (`APPROVE`) và "Từ chối" (`REJECT`).
  - Nếu môn học chưa có Rubric 100%, nút Phê duyệt bị vô hiệu hóa kèm tooltip giải thích lý do (BR-BANK-001).
- [x] Đăng ký các Route mới trong `App.tsx`.

## 3. Technical Constraints (Tech Lead)
- Tuân thủ nghiêm ngặt bảng màu, typography và animation chuẩn Tailwind CSS & design system.
- Đầy đủ trạng thái Loading (Skeleton), Error banner, và Toast thông báo kết quả.
- Không dùng icon trong code và chat.

## 4. Blocker & PO Clarification Section
- Status: CLEAR

## 5. Work Execution Checklist (Assignee: frontend-dev)
- [x] Tạo Types và Services trong `src/features/rubric/`, `src/features/materials/`, `src/features/questions/`.
- [x] Dựng trang `CourseRubricPage.tsx`.
- [x] Dựng trang `ChapterMaterialsPage.tsx`.
- [x] Dựng component `GenerateQuestionModal.tsx`.
- [x] Dựng trang `ChapterQuestionBankPage.tsx`.
- [x] Cập nhật Routes trong `src/App.tsx`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [x] Đáp ứng 100% tiêu chí chấp nhận. Không có placeholder.
- [x] Moved ticket to `document/tasks/done/`.
