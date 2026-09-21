

1. Sơ đồ Use Case (Mermaid Flowchart)

code mermaid
flowchart LR
    %% Định nghĩa các Actor
    STU(["🎓 Student\n(Sinh viên)"])
    LEC(["👨‍🏫 Lecturer\n(Giảng viên)"])
    ADM(["👨‍💻 Admin\n(Quản trị viên)"])
    AI(["🤖 AI Engine\n(Hệ thống AI)"])

    %% Nhóm chức năng của Sinh viên
    subgraph Student_Actions ["Chức năng của Sinh viên"]
        direction TB
        UC_TestMic([Kiểm tra Audio/Mic])
        UC_JoinRoom([Tham gia Phòng thi Ảo])
        UC_Answer([Trả lời Phỏng vấn bằng Giọng nói])
        UC_ViewResult([Xem Điểm & Báo cáo Chi tiết])
    end

    %% Nhóm chức năng của Giảng viên
    subgraph Lecturer_Actions ["Chức năng của Giảng viên (HITL)"]
        direction TB
        UC_UploadDoc([Tải lên Tài liệu Môn học])
        UC_ManageBank([Quản lý Ngân hàng Câu hỏi & Rubric])
        UC_CreateExam([Tạo Đợt thi / Ca thi])
        UC_ReviewExam([Thẩm định Bài thi Sinh viên])
        UC_PublishScore([Công bố Điểm Chính thức])
    end

    %% Nhóm chức năng của Admin
    subgraph Admin_Actions ["Chức năng của Admin"]
        direction TB
        UC_ManageUsers([Quản lý Người dùng & Môn học])
        UC_ConfigSys([Cấu hình Hệ thống & AI Endpoints])
    end

    %% Nhóm chức năng tự động của AI
    subgraph AI_Actions ["Tác vụ tự động của AI"]
        direction TB
        UC_GenQ([Sinh Câu hỏi tự động qua RAG])
        UC_FollowUp([Hỏi xoáy thích ứng - Follow-up])
        UC_Grade([Chấm điểm & Viết nhận xét ngầm])
    end

    %% Gắn Actor với Use Case (Sinh viên)
    STU --> UC_TestMic
    STU --> UC_JoinRoom
    STU --> UC_Answer
    STU --> UC_ViewResult

    %% Gắn Actor với Use Case (Giảng viên)
    LEC --> UC_UploadDoc
    LEC --> UC_ManageBank
    LEC --> UC_CreateExam
    LEC --> UC_ReviewExam
    LEC --> UC_PublishScore

    %% Gắn Actor với Use Case (Admin)
    ADM --> UC_ManageUsers
    ADM --> UC_ConfigSys

    %% Mối quan hệ Include / Extend (Mô phỏng)
    UC_ManageBank -.->|<<includes>>| UC_GenQ
    UC_Answer -.->|<<includes>>| UC_FollowUp
    UC_ReviewExam -.->|<<includes>>| UC_Grade

    %% Tác nhân AI thực thi ngầm
    AI --- UC_GenQ
    AI --- UC_FollowUp
    AI --- UC_Grade
```

---

## 2. Danh sách các Tác nhân (Actors)

1. **Sinh viên (Student)**: Thí sinh tham gia kỳ thi vấn đáp. Tương tác chính là thi qua giọng nói.
2. **Giảng viên (Lecturer)**: Người chịu trách nhiệm về chuyên môn, quản lý đề, chấm thi và thẩm định kết quả (Human-in-the-Loop).
3. **Quản trị viên (Admin)**: Người phụ trách hệ thống, cấu hình người dùng và kết nối API.
4. **Hệ thống AI (AI Engine)**: Tác nhân phụ hỗ trợ tạo đề, hỏi xoáy trực tiếp và chấm điểm tự động.

---

## 3. Mô tả Các Chức Năng Chính (Use Case Descriptions)

| Tên Use Case | Tác nhân chính | Mô tả ngắn gọn |
| :--- | :--- | :--- |
| **Quản lý Ngân hàng Câu hỏi & Rubric** | Giảng viên | Giảng viên duyệt các câu hỏi và tiêu chí chấm điểm được tạo thủ công hoặc nhờ AI gợi ý. |
| **Sinh Câu hỏi tự động qua RAG** | Hệ thống AI | (*Included*) AI đọc giáo trình tải lên để trích xuất và sinh câu hỏi trắc nghiệm / tự luận. |
| **Tham gia Phòng thi Ảo** | Sinh viên | Thí sinh bắt đầu kết nối vào phòng thi để đối thoại trực tiếp với Giám khảo AI. |
| **Trả lời Phỏng vấn bằng Giọng nói** | Sinh viên | Thí sinh dùng Micro để trả lời câu hỏi do AI phát ra. |
| **Hỏi xoáy thích ứng (Follow-up)** | Hệ thống AI | (*Included*) Nếu thí sinh trả lời thiếu, AI tự động sinh câu hỏi phụ để làm rõ ý trong thời gian thực. |
| **Thẩm định Bài thi Sinh viên** | Giảng viên | Sau khi ca thi kết thúc, giảng viên vào nghe lại/đọc transcript và xem điểm do AI gợi ý. |
| **Chấm điểm & Viết nhận xét ngầm** | Hệ thống AI | (*Included*) Xử lý ngầm phía hệ thống: Đối chiếu transcript của sinh viên với Rubric để xuất điểm và lý do. |
| **Công bố Điểm Chính thức** | Giảng viên | Quyết định cuối cùng (HITL), chốt điểm và công bố kết quả cho sinh viên xem. |
