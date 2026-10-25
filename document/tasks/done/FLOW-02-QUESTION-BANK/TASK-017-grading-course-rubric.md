---
id: TASK-017
title: Connect Student Viva Attempt Answers to Course Rubric AI Grading & Score Calculation
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 8 of 9 (Grading & HITL Review Integration)
assigned_to: backend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - document/01-business-rule/br-grading-review.md
  - document/01-business-rule/br-question-rubric.md
outputs:
  - aives-backend/src/main/java/com/aives/modules/grading/service/AttemptGradingService.java
  - aives-frontend/src/pages/LecturerReviewPage.tsx
  - aives-frontend/src/pages/ExamResultPage.tsx
dependencies:
  - TASK-016
---

# Task: [TASK-017] Connect Student Viva Attempt Answers to Course Rubric AI Grading & Score Calculation

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK` (Lifecycle from Question Bank -> Exam -> Grading)
- **Position in Flow**: Step 8 of 9.
- **Previous Step**: [TASK-016](TASK-016-exam-session-course-questions.md).
- **Next Step Triggered**: [TASK-018](TASK-018-e2e-qa-verification.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Trong `AttemptGradingService`: Khi chấm điểm câu trả lời, nếu câu hỏi không có Rubric riêng thì tự động truy xuất các tiêu chí của Rubric Môn học (`CourseRubric`).
- [x] AI sinh `criteria_grades` đúng theo danh sách tiêu chí của Rubric môn học kèm trích dẫn bằng chứng (Strengths, Weaknesses).
- [x] Tính tổng điểm lượt thi chuẩn hóa theo thang điểm 10 (`TotalScore = sum(QuestionFinalScore * Weight)`).
- [x] Giảng viên trong `LecturerReviewPage` xem được điểm từng tiêu chí của Rubric môn học và có quyền ghi đè điểm.
- [x] Khi điểm công bố (`PUBLISHED`), học sinh xem được bảng điểm chi tiết (`ExamResultPage`).
