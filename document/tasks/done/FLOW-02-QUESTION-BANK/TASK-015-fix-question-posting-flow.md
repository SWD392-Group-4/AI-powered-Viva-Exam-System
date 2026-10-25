---
id: TASK-015
title: Fix Question Publishing Flow and Lecturer Question Bank UI according to Documentation
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 6 of 9 (Frontend & Backend Question Bank Flow Fix)
assigned_to: frontend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - document/01-business-rule/lecturer-exam-prep-flow.md
  - document/01-business-rule/br-question-rubric.md
  - document/04-ui-ux-design/page-maps/lecturer.md
outputs:
  - aives-backend/src/main/java/com/aives/modules/content/controller/CourseController.java
  - aives-backend/src/main/java/com/aives/modules/content/service/CourseService.java
  - aives-frontend/src/features/questions/ChapterQuestionBankPage.tsx
  - aives-frontend/src/features/materials/ChapterMaterialsPage.tsx
  - aives-frontend/src/features/rubric/CourseRubricPage.tsx
  - aives-frontend/src/App.tsx
dependencies:
  - TASK-014
---

# Task: [TASK-015] Fix Question Publishing Flow and Lecturer Question Bank UI according to Documentation

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK` (CLIENT HIGHEST PRIORITY)
- **Position in Flow**: Step 6 of 9.
- **Previous Step**: [TASK-014](TASK-014-qa-verification.md).
- **Next Step Triggered**: [TASK-016](TASK-016-exam-session-course-questions.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Backend: Bổ sung endpoint `GET /api/v1/courses` trả về danh sách các môn học để giảng viên chọn trên giao diện.
- [x] Backend: Đảm bảo dữ liệu môn học mặc định (SWD392) và các chương mẫu được khởi tạo sẵn sàng cho giảng viên tác nghiệp.
- [x] Frontend: Thay thế trang ngân hàng câu hỏi cũ tại `/lecturer/questions` bằng giao diện chuẩn theo doc:
  - Hỗ trợ chọn Môn học (`CourseSelector`) và chọn Chương (`ChapterSelector`).
  - Hiển thị danh sách câu hỏi theo chương kèm phân loại độ khó trực quan (Dễ, Trung bình, Khó) và trạng thái (DRAFT, APPROVED, REJECTED).
  - Modal tạo câu hỏi thủ công (`CreateChapterQuestionModal`): Nhập nội dung, độ khó, đáp án mẫu, từ khóa kỳ vọng. Tạo câu hỏi DRAFT thuộc chương.
  - Modal sinh câu hỏi AI (`GenerateQuestionModal`): Chọn tài liệu READY của chương, chọn tỷ lệ Dễ/Trung bình/Khó (100%), sinh câu hỏi DRAFT không kèm Rubric (BR-BANK-002).
  - Phê duyệt câu hỏi (`APPROVE`): Kiểm tra Rubric môn học đạt 100% trọng số (BR-BANK-001). Tuyệt đối không đòi hỏi rubric riêng cho từng câu hỏi.
  - Từ chối câu hỏi (`REJECT`): Cho phép nhập lý do từ chối.
  - Cập nhật và Xóa câu hỏi: Thao tác trực tiếp trên câu hỏi của chương.
- [x] Frontend: Đồng bộ `/lecturer/materials` sang giao diện Học liệu theo Chương (`ChapterMaterialsPage`) với bộ chọn Môn học và Chương tương ứng.
- [x] Frontend: Điều hướng mượt mà giữa Ngân hàng câu hỏi, Học liệu và Tiêu chí Rubric môn học.

## 3. Technical Constraints (Tech Lead)
- Tuân thủ quy định: Không dùng icon trong code và commit message.
- Đảm bảo `mvn test-compile` và `npm run build` vượt qua 100%.
- Không phá vỡ tương thích ngược.

## 4. Blocker & PO Clarification Section
- Status: CLEAR

## 5. Work Execution Checklist
- [x] Triển khai `CourseResponse`, `CourseService`, `CourseServiceImpl` và `CourseController` (`GET /api/v1/courses`).
- [x] Seed dữ liệu môn học SWD392 và các chương nếu bảng `courses` trống.
- [x] Cập nhật `materialService.ts` / `questionService.ts` để gọi API `GET /api/v1/courses`.
- [x] Cập nhật `ChapterQuestionBankPage.tsx` với Course & Chapter selector, form tạo câu hỏi, và luồng duyệt chuẩn.
- [x] Cập nhật `ChapterMaterialsPage.tsx` và `CourseRubricPage.tsx` với Course selector.
- [x] Cập nhật route `/lecturer/questions` và `/lecturer/materials` trong `App.tsx`.
- [x] Kiểm tra xác minh build backend & frontend.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [x] Đã nghiệm thu đạt 100% tiêu chí.
- [x] Luồng đăng câu hỏi thủ công và AI sinh câu hỏi của giảng viên hoạt động mượt mà, phân cấp môn học & chương chuẩn xác theo tài liệu.
- [x] Moved ticket to `docs/tasks/done/` và mở khóa TASK-016.
