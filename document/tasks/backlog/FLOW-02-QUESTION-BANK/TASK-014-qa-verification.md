---
id: TASK-014
title: Verification & UAT Testing for Course Rubric, Question Bank & Audit Logging
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 5 of 5 (QA Verification & UAT)
assigned_to: qa-engineer
reviewer: product-owner
status: DONE
created_at: 2026-10-24
updated_at: 2026-10-24
inputs:
  - document/01-business-rule/br-question-rubric.md
  - document/01-business-rule/lecturer-exam-prep-flow.md
outputs:
  - document/tasks/done/FLOW-02-QUESTION-BANK/UAT_REPORT.md
dependencies:
  - TASK-012
  - TASK-013
---

# Task: [TASK-014] Verification & UAT Testing for Course Rubric, Question Bank & Audit Logging

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK`
- **Position in Flow**: Step 5 of 5.
- **Previous Steps**: [TASK-012](TASK-012-backend-services.md) & [TASK-013](TASK-013-frontend-ui.md).
- **Next Step Triggered**: Đóng Flow và hoàn tất chuyển giao.

## 2. Acceptance Criteria (Product Owner)
- [x] Test Case 1: Thử phê duyệt (`APPROVE`) câu hỏi khi môn học chưa có Rubric hoặc tổng trọng số $\neq 100\%$ -> Hệ thống bắt buộc phải chặn và thông báo lỗi rõ ràng.
- [x] Test Case 2: Tạo Rubric môn học đạt 100% -> Phê duyệt câu hỏi thành công.
- [x] Test Case 3: Sinh câu hỏi AI bằng tài liệu của Chương với tỷ lệ 50% Dễ, 30% Trung bình, 20% Khó -> Xác minh kết quả trả về đúng số lượng và phân bổ độ khó, đồng thời khẳng định không có Rubric nào được sinh ra kèm câu hỏi.
- [x] Test Case 4: Khởi tạo ca thi của môn học -> Xác minh cờ `is_locked` của Rubric môn học tự động kích hoạt thành `TRUE`, không cho phép sửa/xóa tiêu chí nữa.
- [x] Test Case 5: Xác minh trong MongoDB collection `academic_audit_logs` có đầy đủ các bản ghi log thao tác của giảng viên.

## 3. Technical Constraints (Tech Lead)
- Tuân thủ quy định: Thực hiện kiểm tra toàn diện đối chiếu với 5 kịch bản UAT.
- Không dùng icon trong code và báo cáo.

## 4. Blocker & PO Clarification Section
- Status: CLEAR

## 5. Work Execution Checklist (Assignee: qa-engineer)
- [x] Thực hiện kiểm tra End-to-End theo 5 test cases chấp nhận.
- [x] Lập biên bản kiểm thử [UAT_REPORT.md](UAT_REPORT.md).
- [x] Báo cáo Product Owner ký duyệt nghiệm thu.

## 6. Review & Sign-Off (Reviewer: product-owner)
- [x] Đã nghiệm thu đạt 100% tiêu chí.
- [x] Moved ticket to `document/tasks/done/` và cập nhật BOARD.md.
