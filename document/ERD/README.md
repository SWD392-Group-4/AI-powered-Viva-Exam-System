# ERD - Mô hình dữ liệu AIVES

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Mục đích**: Mô tả dữ liệu của hệ thống qua 3 mức: Conceptual → Logical → Physical.  
> **DBMS đích**: Microsoft SQL Server (xem [02-architecture-design](../02-architecture-design/README.md)).

---

## 1. Danh sách tài liệu

| Mức | Tài liệu | Sơ đồ (ảnh) | Mã nguồn Mermaid | Trả lời câu hỏi |
| :--- | :--- | :--- | :--- | :--- |
| Conceptual | [01-conceptual-erd.md](01-conceptual-erd.md) | [conceptual-erd.png](images/conceptual-erd.png) | [conceptual-erd.mmd](conceptual-erd.mmd) | Hệ thống có những **thực thể** nào và chúng **quan hệ** ra sao? |
| Logical | [02-logical-erd.md](02-logical-erd.md) | [logical-erd.png](images/logical-erd.png) | [logical-erd.mmd](logical-erd.mmd) | Mỗi thực thể có **thuộc tính** gì, khoá chính / khoá ngoại là gì? (chưa phụ thuộc DBMS) |
| Physical | [03-physical-erd.md](03-physical-erd.md) | [physical-erd.png](images/physical-erd.png) | [physical-erd.mmd](physical-erd.mmd) | Dữ liệu được **lưu thế nào trên SQL Server**: tên bảng, kiểu cột, ràng buộc? |

> Muốn xem / sửa sơ đồ: mở file `.mmd` trên [mermaid.live](https://mermaid.live) hoặc plugin Mermaid của IDE, sửa xong export lại PNG vào `images/`.

---

## 2. Khác nhau giữa 3 mức

| Tiêu chí | Conceptual | Logical | Physical |
| :--- | :--- | :--- | :--- |
| Nội dung | Thực thể + quan hệ + bản số | Thêm thuộc tính, PK, FK, UK | Thêm kiểu dữ liệu SQL Server, bảng hệ thống |
| Tên gọi | Thực thể nghiệp vụ: `VIVA_ATTEMPT` | Giữ tên thực thể | Tên bảng: `viva_attempts` (snake_case, số nhiều) |
| Tên khoá | Không có | PK `<thực thể>_id` (`viva_exam_id`) | PK `<tên bảng>_id` (`viva_exams_id`); FK mang đúng tên PK nó trỏ tới, trừ FK theo vai trò (`lecturer_id`, `student_id`...) |
| LECTURER / STUDENT | 2 thực thể | 2 thực thể | Gộp vào bảng `users`, phân biệt bằng cột `role` |
| Kiểu dữ liệu | Không có | Không ghi (hoặc kiểu chung trong file `.mmd`) | `NVARCHAR(n)`, `INT`, `DECIMAL`, `DATETIME`, `BIT` |
| Phụ thuộc DBMS | Không | Không | Có (SQL Server) |
| Người đọc chính | Giảng viên, BA, cả nhóm | Cả nhóm, BE | BE, người viết script DB |

---

## 3. Mapping thực thể xuyên suốt 3 mức

| Conceptual / Logical | Physical (bảng) | Module BE | Ghi chú |
| :--- | :--- | :--- | :--- |
| `LECTURER` | `users` (`role = LECTURER`) | auth | Gộp bảng |
| `STUDENT` | `users` (`role = STUDENT`) | auth | Gộp bảng; không có mã số sinh viên riêng, dùng `users_id` dạng `STxxxxxx` |
| `LESSON` | `lessons` | content | |
| `TOPIC` | `topics` | content | |
| `QUESTION` | `questions` | content | |
| `RUBRIC` | `rubrics` | content | |
| `RUBRIC_CRITERIA` | `rubric_criteria` | content | |
| `VIVA_EXAM` | `viva_exams` | exam | Khoá chính `viva_exams_id` cũng là mã vào thi |
| `VIVA_EXAM_QUESTION` | `viva_exam_questions` | exam | Bảng trung gian QUESTION - VIVA_EXAM |
| `VIVA_ATTEMPT` | `viva_attempts` | exam / vivaroom | |
| `INTERVIEW_EXCHANGE` | `interview_exchanges` | vivaroom | Tự tham chiếu (hỏi xoáy) |
| `QUESTION_GRADE` | `question_grades` | grading | |
| `CRITERIA_GRADE` | `criteria_grades` | grading | |
| `GRADE_APPEAL` | `grade_appeals` | grading | |
| – | `background_jobs`, `audit_logs`, `system_settings` | jobs / audit | Bảng hệ thống, chỉ có ở Physical |

**Tổng kết**: 14 thực thể (Conceptual) → 14 thực thể (Logical) → 13 bảng nghiệp vụ + 3 bảng hệ thống = 16 bảng (Physical).

---

## 4. Ký hiệu Crow's Foot dùng trong sơ đồ

| Mermaid | Ý nghĩa |
| :--- | :--- |
| `\|\|` | Đúng 1 |
| `\|o` | 0 hoặc 1 |
| `\|{` | 1 hoặc nhiều |
| `o{` | 0 hoặc nhiều |

Ví dụ: `LECTURER ||--|{ LESSON : "Manages"` đọc là *"Mỗi LESSON do đúng 1 LECTURER quản lý; một LECTURER quản lý 1 hoặc nhiều LESSON"*.
