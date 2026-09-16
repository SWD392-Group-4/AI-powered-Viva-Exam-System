# BUSINESS RULES OVERVIEW & TAXONOMY

## 1. Mục đích & Phạm vi
Tài liệu định nghĩa các Business Rules (BR) bắt buộc cho hệ thống **AI-powered Viva Exam System (AIVES)**.
- **Đối tượng đọc**: Developers, QA, LLM Coding Agents.
- **Quy ước mã định danh**: `BR-<MODULE>-<INDEX>` (ví dụ: `BR-EXAM-001`).
- **Trọng tài tối cao (Single Source of Truth)**: Trong mọi tranh chấp logic nghiệp vụ giữa prompt AI và code logic, tài liệu BR có giá trị quyết định.

---

## 2. Danh mục Modules & Mã hóa
| Code | Module Nghiệp Vụ | File Đặc Tả |
| :--- | :--- | :--- |
| **AUTH** | Authentication & RBAC | [br-auth-rbac.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-auth-rbac.md) |
| **BANK** | Question Bank & Rubric Management | [br-question-rubric.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-question-rubric.md) |
| **SESSION** | Exam Session & Scheduling | [br-exam-session.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-exam-session.md) |
| **VIVA** | AI Interview Loop (Speech & Follow-up) | [br-ai-interview.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-ai-interview.md) |
| **GRADE** | AI Scoring & Human-in-the-Loop | [br-grading-review.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-grading-review.md) |
| **AUDIT** | Audit Log, Recording & Dispute Evidence | [br-audit-evidence.md](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/01-business-rule/br-audit-evidence.md) |

---

## 3. Quy tắc cốt lõi toàn hệ thống (System Invariants)
- **HITL (Human-in-the-Loop)**: AI **không bao giờ** có quyền tự động công bố điểm thi chính thức ra cho sinh viên mà không có phê duyệt (Approve/Override) từ Giảng viên.
- **Append-only Viva Log**: Mọi phiên vấn đáp khi đã bắt đầu đều là bất biến (immutable transcript & audio logs). Không được sửa/xóa log thi cử dưới bất kỳ hình thức nào.
- **Idempotency & Timeout Safety**: Mọi state transition của phiên thi (Init -> InProgress -> Completed) đều phải kiểm tra timeout và tránh race-condition giữa WebSocket / HTTP events.
