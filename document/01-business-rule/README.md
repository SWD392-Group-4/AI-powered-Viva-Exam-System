# BUSINESS RULES OVERVIEW & TAXONOMY

## 1. Mục đích & Phạm vi
Tài liệu định nghĩa các Business Rules (BR) bắt buộc cho hệ thống **AI-powered Viva Exam System (AIVES)** tập trung vào 3 module nghiệp vụ cốt lõi:
1. **Module 1**: Quản lý ngân hàng câu hỏi & Rubric.
2. **Module 3**: Lõi phỏng vấn ảo AI (Adaptive Follow-up).
3. **Module 4**: Hỗ trợ chấm điểm AI & Giảng viên thẩm định (HITL).

- **Đối tượng đọc**: Developers, QA, LLM Coding Agents.
- **Quy ước mã định danh**: `BR-<MODULE>-<INDEX>` (ví dụ: `BR-BANK-001`, `BR-VIVA-001`).
- **Trọng tài tối cao (Single Source of Truth)**: Trong mọi tranh chấp logic nghiệp vụ giữa prompt AI và code logic, tài liệu BR có giá trị quyết định.

---

## 2. Danh mục Modules & Mã hóa
| Code | Module Nghiệp Vụ | File Đặc Tả |
| :--- | :--- | :--- |
| **AUTH** | Authentication & RBAC | [br-auth-rbac.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-auth-rbac.md) |
| **BANK** | Question Bank & Rubric Management (Module 1) | [br-question-rubric.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-question-rubric.md) |
| **VIVA** | AI Interview Loop & Adaptive Follow-up (Module 3) | [br-ai-interview.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-ai-interview.md) |
| **GRADE** | AI Scoring & Human-in-the-Loop Review (Module 4) | [br-grading-review.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-grading-review.md) |

---

## 3. Quy tắc cốt lõi toàn hệ thống (System Invariants)
- **HITL (Human-in-the-Loop)**: AI **không bao giờ** có quyền tự động công bố điểm thi chính thức ra cho sinh viên mà không có phê duyệt (Approve/Override) từ Giảng viên.
- **Rubric-first Scoring**: AI chỉ được chấm điểm dựa trên bằng chứng cụ thể trích từ transcript và đối chiếu với tiêu chí trong Rubric, không chấm cảm tính ngoài rubric.
- **Anti-Hallucination Follow-up**: Câu hỏi hỏi xoáy của AI phải bám sát chủ đề câu hỏi chính và tiêu chí đánh giá, không chuyển hướng sang nội dung ngoài lề.
