# AI-powered Viva Exam System (AIVES) - Document Repository

> **Đồ án môn học**: Software Architecture & Design (SWD392)  
> **Nhóm thực hiện**: Group 4  
> **Kho tài liệu**: Toàn bộ đặc tả nghiệp vụ, kiến trúc, thiết kế UI/UX, Class Diagram, ERD và hướng dẫn kiểm thử hệ thống.

---

## Danh mục Tài liệu Kỹ thuật & Báo cáo

| # | Hạng mục Báo cáo / Đánh giá | Đường dẫn tài liệu chi tiết | Mô tả nội dung chính |
| :-: | :--- | :--- | :--- |
| **1** | **Show UI/UX Design** | [04-ui-ux-design/README.md](document/04-ui-ux-design/README.md) | Thiết kế Material Design 3, Site Map, đặc tả màn hình phòng thi vấn đáp (Audio Wave, VAD), màn hình quản lý phiên thi, thẩm định điểm |
| **2** | **Demo CRUD Features** | [05-crud-demo/README.md](document/05-crud-demo/README.md) | Kịch bản chi tiết Demo tính năng CRUD Phiên thi (Exam Sessions), Quản trị người dùng (User Management), kèm tài khoản kiểm thử và cURL API |
| **3** | **Show Class Diagram** | [06-class-diagram/README.md](document/06-class-diagram/README.md) | Sơ đồ lớp toàn hệ thống (Domain Entity 16 bảng JPA, Enum, Kiến trúc phân tầng Controller → Service → Repository) bằng Mermaid |
| **4** | **Show Database Diagram (Physical ERD)** | [ERD/03-physical-erd.md](document/ERD/03-physical-erd.md) | Sơ đồ ERD vật lý 16 bảng, kiểu dữ liệu Supabase PostgreSQL / SQL Server, trạng thái triển khai 100% Code-First |

---

## Các tài liệu Kiến trúc & Nghiệp vụ Bổ trợ

- [00-overview/README.md](document/00-overview/README.md): Tổng quan bài toán, giải pháp và phạm vi đồ án.
- [01-business-rule/README.md](document/01-business-rule/README.md): Toàn bộ quy tắc nghiệp vụ (Phân quyền, Phỏng vấn AI, Chấm điểm, Ngân hàng đề).
- [02-architecture-design/README.md](document/02-architecture-design/README.md): Kiến trúc hệ thống tổng thể, Sequence diagram luồng thi vấn đáp, tích hợp Gemini Flash, Google STT/TTS.
- [03-context-diagram/README.md](document/03-context-diagram/README.md): Sơ đồ ngữ cảnh và tương tác các tác nhân (Student, Lecturer, Admin, AI Engine).
- [ERD/README.md](document/ERD/README.md): Bộ 3 mức mô hình dữ liệu (Conceptual → Logical → Physical).

---

## Liên kết Kho mã nguồn (Repositories)

- **Frontend**: [SWD392-Group-4/aives-frontend](https://github.com/SWD392-Group-4/aives-frontend) (React 19 + Vite + TailwindCSS v4)
- **Backend**: [SWD392-Group-4/aives-backend](https://github.com/SWD392-Group-4/aives-backend) (Spring Boot 3.5.6 + Java 17 + Spring Data JPA + Spring Security JWT)
- **Database**: Cloud Managed PostgreSQL 17 on Supabase (Tokyo region)
