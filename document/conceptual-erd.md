# Conceptual Entity Relationship Diagram (Conceptual ERD) - AIVES

> **Tài liệu**: Conceptual ERD cho Hệ thống Thi Vấn Đáp Thông Minh Ứng Dụng AI (AIVES)  
> **Mục đích**: Mô hình hóa các thực thể dữ liệu ở tầng quan niệm (Conceptual Level), định nghĩa ranh giới các miền dữ liệu (Domains/Modules), thuộc tính đặc trưng và các mối quan hệ (cardinality) theo toàn bộ Business Rules (BR) và Architecture Design của hệ thống.  
> **Phạm vi hệ thống**: Phần mềm chuyên biệt phục vụ **Kiểm tra & Thi vấn đáp (Oral Examination Assessment)**, không chứa cấu trúc quản lý khóa học (LMS / Course Management). Thực thể trung tâm là **`EXAM`**.

---

## 1. Sơ đồ Conceptual ERD

> Toàn bộ sơ đồ Conceptual ERD chi tiết (được chuẩn hóa bằng Tiếng Anh) được lưu trữ độc lập tại file:  
> 🔗 **[conceptual.mermaid](file:///c:/Edisk/dow/Tai_lieu/ky7/swd/AI-powered-Viva-Exam-System/document/conceptual.mermaid)**

---

## 2. Giải thích Các Thực Thể Chính Theo 5 Miền Nghiệp Vụ

### Miền 1: Quản Trị & Phân Quyền (Auth & RBAC)

- **`USER`**: Người dùng trong hệ thống (Admin, Examiner / Giảng viên, Candidate / Thí sinh).
- **`EXAM`**: Kỳ thi / Đợt kiểm tra vấn đáp (Assessment). Là thực thể trung tâm cốt lõi của hệ thống kiểm tra, chứa cấu hình: thời lượng, số câu hỏi chính, trần số lần hỏi xoáy tối đa (`MaxFollowUp`), thang điểm và trạng thái kỳ thi (`DRAFT`, `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `ARCHIVED`).
- **`EXAM_EXAMINER`**: Phân công giảng viên / giám khảo phụ trách kỳ thi theo quy tắc **`BR-AUTH-001`** (quản lý câu hỏi, cấu hình rubric, giám sát phòng thi và thẩm định điểm số).
- **`EXAM_CANDIDATE`**: Danh sách thí sinh / sinh viên đủ điều kiện tham gia kỳ thi theo quy tắc **`BR-AUTH-002`**.

### Miền 2: Ngân Hàng Câu Hỏi & Rubric (Question Bank & Rubric)

- **`EXAM_DOCUMENT`**: Đề cương, giáo trình hoặc tài liệu tham khảo được nạp vào kỳ thi để phục vụ sinh câu hỏi và kiểm chứng kiến thức.
- **`DOCUMENT_CHUNK`**: Các phân đoạn tri thức tài liệu phục vụ AI RAG sinh câu hỏi và truy xuất kiến thức đối soát.
- **`TOPIC`**: Chủ đề kiến thức hoặc phần thi trong kỳ thi để phân loại và bốc đề cân bằng.
- **`RUBRIC`**: Bộ tiêu chí chấm điểm chuẩn của kỳ thi.
- **`RUBRIC_CRITERIA`**: Các tiêu chí chi tiết cấu thành Rubric (**`BR-BANK-001`**, **`BR-BANK-003`**).
- **`QUESTION_BANK_ITEM`**: Câu hỏi trong ngân hàng đề của kỳ thi (gồm câu AI sinh và Giảng viên tạo, liên kết chuẩn Rubric theo **`BR-BANK-002`**).

### Miền 3: Phiên Thi & Phân Bổ Câu Hỏi (Exam Session & Assignment)

- **`VIVA_ATTEMPT`**: Lượt thi vấn đáp cụ thể của một thí sinh trong kỳ thi, quản lý trạng thái phiên thi (Session Lifecycle) và bản ghi âm hoàn chỉnh.
- **`EXAM_QUESTION_ASSIGNMENT`**: Đề thi được bốc ngẫu nhiên theo tỷ lệ từ ngân hàng câu hỏi cho thí sinh trong từng lượt thi.

### Miền 4: Tương Tác Vấn Đáp Trực Tiếp (Real-Time Viva Interaction)

- **`INTERVIEW_EXCHANGE`**: Từng lượt trao đổi hỏi - đáp trực tiếp giữa AI và thí sinh (phân định câu hỏi chính, câu hỏi xoáy, transcript và lý do kích hoạt hỏi xoáy theo **`BR-VIVA-001`**, **`BR-VIVA-002`**).

### Miền 5: Chấm Điểm AI & Giảng Viên Thẩm Định (AI Scoring & HITL Review)

- **`QUESTION_GRADE`**: Điểm số và lý giải chấm cho từng câu hỏi thi (sinh sau khi hoàn thành phản hồi, hỗ trợ Giảng viên thẩm định/ghi đè theo **`BR-GRADE-002`**).
- **`CRITERIA_GRADE_DETAIL`**: Điểm chi tiết cho từng tiêu chí Rubric kèm trích dẫn bằng chứng từ transcript (**`BR-GRADE-001`**).
- **`EXAM_RESULT`**: Bảng điểm tổng kết ca thi, trải qua quy trình Human-in-the-Loop trước khi công bố cho thí sinh (**`BR-GRADE-003`**).

---

## 3. Ma Trận Quan Hệ Giữa Các Thực Thể (Cardinality Matrix)

| Thực thể nguồn | Ký hiệu Crow's Foot | Thực thể đích | Ràng buộc nghiệp vụ liên quan |
| :--- | :---: | :--- | :--- |
| `USER` | `\|\|--o{` | `EXAM_EXAMINER` | Giảng viên/Giám khảo được phân công phụ trách kỳ thi (`BR-AUTH-001`) |
| `EXAM` | `\|\|--o{` | `EXAM_EXAMINER` | Kỳ thi có danh sách giảng viên phụ trách thẩm định |
| `USER` | `\|\|--o{` | `EXAM_CANDIDATE` | Thí sinh đăng ký / được xếp vào danh sách thi |
| `EXAM` | `\|\|--o{` | `EXAM_CANDIDATE` | Kỳ thi tiếp nhận danh sách thí sinh hợp lệ (`BR-AUTH-002`) |
| `EXAM` | `\|\|--o{` | `EXAM_DOCUMENT` | Kỳ thi sở hữu tài liệu tham khảo / đề cương ôn tập |
| `EXAM_DOCUMENT` | `\|\|--o{` | `DOCUMENT_CHUNK` | Tài liệu được chia thành các đoạn chunk phục vụ RAG |
| `EXAM` | `\|\|--o{` | `TOPIC` | Kỳ thi phân chia thành các chủ đề kiến thức |
| `TOPIC` | `\|\|--o{` | `QUESTION_BANK_ITEM` | Câu hỏi thuộc về chủ đề kiến thức |
| `EXAM` | `\|\|--o{` | `RUBRIC` | Kỳ thi định nghĩa các rubric chuẩn chấm |
| `RUBRIC` | `\|\|--\|{` | `RUBRIC_CRITERIA` | Một rubric có 1 hoặc nhiều tiêu chí ($\sum \text{weight} = 100\%$) |
| `EXAM` | `\|\|--o{` | `QUESTION_BANK_ITEM` | Kỳ thi chứa ngân hàng câu hỏi thi |
| `RUBRIC` | `\|\|--o{` | `QUESTION_BANK_ITEM` | Câu hỏi liên kết với rubric chuẩn chấm (`BR-BANK-001`) |
| `EXAM` | `\|\|--o{` | `VIVA_ATTEMPT` | Kỳ thi tổ chức và quản lý các lượt thi vấn đáp |
| `USER` | `\|\|--o{` | `VIVA_ATTEMPT` | Thí sinh thực hiện lượt thi của mình |
| `VIVA_ATTEMPT` | `\|\|--\|{` | `EXAM_QUESTION_ASSIGNMENT` | Lượt thi được bốc và phân bổ các câu hỏi thi |
| `QUESTION_BANK_ITEM` | `\|\|--o{` | `EXAM_QUESTION_ASSIGNMENT` | Câu hỏi ngân hàng được bốc vào đề thi thí sinh |
| `EXAM_QUESTION_ASSIGNMENT` | `\|\|--\|{` | `INTERVIEW_EXCHANGE` | Câu hỏi gồm câu chính và các lượt hỏi xoáy (`BR-VIVA-001`) |
| `EXAM_QUESTION_ASSIGNMENT` | `\|\|--o\|` | `QUESTION_GRADE` | Mỗi câu hỏi được sinh bản ghi điểm sau khi thi (`1 : 0..1`) |
| `QUESTION_GRADE` | `\|\|--\|{` | `CRITERIA_GRADE_DETAIL` | Điểm mỗi câu được chi tiết hóa theo tiêu chí (`BR-GRADE-001`) |
| `RUBRIC_CRITERIA` | `\|\|--o{` | `CRITERIA_GRADE_DETAIL` | Tiêu chí Rubric được đánh giá chi tiết trong điểm thi |
| `USER` | `\|\|--o{` | `QUESTION_GRADE` | Giảng viên thẩm định và duyệt điểm (`HITL`) |
| `VIVA_ATTEMPT` | `\|\|--o\|` | `EXAM_RESULT` | Lượt thi tổng hợp thành kết quả sau khi hoàn tất (`1 : 0..1`) |
| `USER` | `\|\|--o{` | `EXAM_RESULT` | Giảng viên phê duyệt và công bố bảng điểm (`HITL`) |
