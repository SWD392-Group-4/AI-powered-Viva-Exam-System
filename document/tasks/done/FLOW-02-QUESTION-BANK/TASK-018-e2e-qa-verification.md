---
id: TASK-018
title: End-to-End QA Verification for Question Publishing, Exam Session, and Score Delivery Flow
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 9 of 9 (End-to-End QA & UAT)
assigned_to: qa-engineer
reviewer: product-owner
status: DONE
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - document/01-business-rule/lecturer-exam-prep-flow.md
  - document/01-business-rule/br-question-rubric.md
  - document/01-business-rule/br-grading-review.md
outputs:
  - document/tasks/done/FLOW-02-QUESTION-BANK/E2E_VERIFICATION_REPORT.md
dependencies:
  - TASK-017
---

# Task: [TASK-018] End-to-End QA Verification for Question Publishing, Exam Session, and Score Delivery Flow

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK` (Lifecycle from Question Bank -> Exam -> Grading)
- **Position in Flow**: Step 9 of 9.
- **Previous Step**: [TASK-017](TASK-017-grading-course-rubric.md).
- **Next Step Triggered**: Complete Flow and Client Sign-off.

## 2. Acceptance Criteria (Product Owner)
- [x] Test Case 1: Giảng viên mở ngân hàng câu hỏi, chọn Môn học & Chương, tạo câu hỏi thủ công & sinh bằng AI -> Trạng thái DRAFT.
- [x] Test Case 2: Giảng viên phê duyệt câu hỏi -> Hệ thống kiểm tra Rubric môn học đạt 100% -> Chuyển thành APPROVED.
- [x] Test Case 3: Giảng viên tạo ca thi liên kết Môn học -> Câu hỏi APPROVED được chọn vào ca thi.
- [x] Test Case 4: Sinh viên vào thi vấn đáp AI qua Web Portal -> Hoàn thành bài thi -> Trạng thái COMPLETED.
- [x] Test Case 5: Background AI Worker chấm điểm theo tiêu chí Rubric môn học -> Giảng viên công bố điểm -> Sinh viên xem điểm thành công.
