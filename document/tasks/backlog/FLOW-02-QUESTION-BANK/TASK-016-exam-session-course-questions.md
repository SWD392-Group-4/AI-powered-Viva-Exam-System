---
id: TASK-016
title: Integrate Course & Chapter Question Bank into Exam Scheduling & Student Viva Session
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 7 of 9 (Backend & Frontend Exam Integration)
assigned_to: backend-dev
reviewer: tech-lead
status: BACKLOG
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - document/01-business-rule/lecturer-exam-prep-flow.md
  - document/01-business-rule/br-question-rubric.md
  - document/master-mainflow.mmd
outputs:
  - aives-backend/src/main/java/com/aives/modules/exam/
  - aives-backend/src/main/java/com/aives/modules/vivaroom/
dependencies:
  - TASK-015
---

# Task: [TASK-016] Integrate Course & Chapter Question Bank into Exam Scheduling & Student Viva Session

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK` (Lifecycle from Question Bank -> Exam -> Grading)
- **Position in Flow**: Step 7 of 9.
- **Previous Step**: [TASK-015](TASK-015-fix-question-posting-flow.md).
- **Next Step Triggered**: [TASK-017](TASK-017-grading-course-rubric.md).

## 2. Acceptance Criteria (Product Owner)
- [ ] Cho phép ca thi (`VivaExam`) liên kết với Môn học (`courses_id`).
- [ ] Cho phép ca thi chọn câu hỏi từ danh sách câu hỏi đã APPROVED của Môn học/Chương (theo cấu hình cố định hoặc bốc ngẫu nhiên).
- [ ] Khi sinh viên bắt đầu làm bài (`VivaInterviewServiceImpl.start`): Nếu ca thi chưa có câu hỏi gán sẵn, tự động bốc câu hỏi đã APPROVED từ Course/Chapters của ca thi đó.
- [ ] Trong quá trình phỏng vấn AI (`VivaInterviewServiceImpl.buildContext`), nếu câu hỏi không lưu rubric riêng thì tự động kế thừa tiêu chí đánh giá từ Rubric môn học (`CourseRubric`).

## 3. Technical Constraints (Tech Lead)
- Tương thích ngược với các ca thi cũ.
- Không phá vỡ ràng buộc ACID của PostgreSQL.
