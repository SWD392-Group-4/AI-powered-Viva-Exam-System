# Page Map: Phân Hệ Giảng Viên (Lecturer Role)

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Vai trò người dùng**: Giảng viên / Giám khảo (`LECTURER`)  
> **Tài liệu cha**: [04-ui-ux-design/README.md](../README.md)  
> **Source of Truth**: [br-auth-rbac.md](../../01-business-rule/br-auth-rbac.md), [br-question-rubric.md](../../01-business-rule/br-question-rubric.md), [br-grading-review.md](../../01-business-rule/br-grading-review.md)

---

## 1. Danh Sách Các Trang (Route Matrix)

| Đường dẫn (URL Route) | Tên màn hình | Quyền truy cập (RBAC) | Trạng thái FE hiện tại | Mô tả nghiệp vụ |
| :--- | :--- | :--- | :---: | :--- |
| `/lecturer/dashboard` | **Bảng Điều Khiển Giảng Viên** | `LECTURER`, `ADMIN` | Cần bổ sung (`LecturerDashboardPage.tsx`) | Màn hình tổng quan sau đăng nhập: thẻ số liệu (ca thi đang mở, số bài thi đang chờ duyệt HITL, đơn phúc khảo cần xử lý), danh sách hành động nhanh và biểu đồ tiến độ chấm điểm. |
| `/exam-sessions` | **Quản Lý Phiên Thi (CRUD)** | `LECTURER`, `ADMIN` | Đã có (`ExamSessionsPage.tsx`) | Quản lý vòng đời ca thi viva: tạo mới, sửa thời gian, tạo lại passcode bí mật, hủy phiên, cấu hình số câu hỏi xoáy tối đa, từ khóa chuyên môn và cờ cho phép thi trên di động (`allow_mobile_exam`). |
| `/lecturer/exam-sessions/:id/monitor` | **Giám Sát Trực Tiếp Ca Thi (Live Monitor)** | `LECTURER`, `ADMIN` | Cần bổ sung (`LiveExamMonitorPage.tsx`) | Giám sát trạng thái phòng thi theo thời gian thực (`BR-AUTH-004`): danh sách thí sinh đang làm bài, thời gian còn lại, câu hỏi hiện tại, trạng thái mic/kết nối. |
| `/lecturer/curriculum` | **Quản Lý Bài Học & Chủ Đề (Curriculum)** | `LECTURER`, `ADMIN` | Cần bổ sung (`CurriculumManagementPage.tsx`) | Quản lý danh mục Bài học (`lessons`) và các Chủ đề con (`topics`) trực thuộc môn học phụ trách theo CSDL quan hệ. |
| `/lecturer/questions` | **Ngân Hàng Câu Hỏi & RAG** | `LECTURER`, `ADMIN` | Đã có (`QuestionBankPage.tsx`) | Quản lý câu hỏi theo 4 mức Bloom, tải file giáo trình/slide môn học để AI trích xuất câu hỏi nháp (`DRAFT`), gán rubric và phê duyệt sang `APPROVED` (`BR-BANK-002`). |
| `/lecturer/rubrics` | **Quản Lý Tiêu Chí Rubric** | `LECTURER`, `ADMIN` | Đã có (`RubricManagementPage.tsx`) | Thiết lập danh mục Rubric chấm điểm: tiêu chí, mô tả chuẩn và trọng số % đảm bảo tổng đúng bằng 100% (`BR-BANK-001`). Hỗ trợ tải file rubric bằng AI. |
| `/lecturer/materials` | **Quản Lý Học Liệu & Slide RAG** | `LECTURER`, `ADMIN` | Đang triển khai (`MaterialsManagementPage.tsx`) | Quản lý danh mục tài liệu/slide môn học đã tải lên Google Cloud Storage (GCS) theo môn học, theo dõi trạng thái đồng bộ Vertex AI RAG Corpus (`INDEXING`, `READY`, `FAILED`), cho phép tìm kiếm, xem trước, tải lại, gán bài học/chủ đề và xóa tài liệu của tài khoản giảng viên. |
| `/lecturer/reviews` | **Thẩm Định Điểm AI (HITL Review Board)** | `LECTURER`, `ADMIN` | Đã có (`LecturerReviewPage.tsx`) | Danh sách các lượt thi đã hoàn thành (`COMPLETED`) đang ở trạng thái `PENDING_REVIEW` do AI chấm ngầm đề xuất. |
| `/lecturer/reviews/:attemptId` | **Đối Soát & Duyệt Điểm Chi Tiết** | `LECTURER`, `ADMIN` | Đã có (`LecturerReviewPage.tsx`) | Màn hình split-view 2 cột đối chiếu: Audio/Transcript lời nói sinh viên vs Bảng điểm gợi ý của AI. Quyền ghi đè điểm (`OverrideScore`), bắt buộc nhập lý do nếu chênh lệch $> 2.0$ điểm (`BR-GRADE-002`) và nút Công bố điểm (`PUBLISHED`). |
| `/lecturer/appeals` | **Quản Lý Đơn Phúc Khảo** | `LECTURER`, `ADMIN` | Đã có (`AppealsManagementPage.tsx`) | Tiếp nhận khiếu nại của sinh viên, xem lại bằng chứng transcript gốc, ra quyết định Chấp thuận (điều chỉnh điểm) hoặc Từ chối kèm phản hồi giải thích. |

---

## 2. Luồng Người Dùng & Sơ Đồ Điều Hướng (Navigation Flow)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#F5F3FF', 'lineColor': '#8B5CF6'}}}%%
flowchart TD
    classDef lecturer fill:#F5F3FF,stroke:#8B5CF6,stroke-width:1.5px,color:#5B21B6,rx:8,ry:8;
    classDef prep fill:#E0F2FE,stroke:#0284C7,stroke-width:1.5px,color:#0369A1,rx:8,ry:8;
    classDef exam fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E,rx:8,ry:8;
    classDef review fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#15803D,rx:8,ry:8;

    Login["🔑 Đăng nhập Giảng viên"]:::lecturer
    Dashboard["📊 /lecturer/dashboard<br/>(Bảng Điều Khiển Giảng Viên)"]:::lecturer

    Curriculum["📚 /lecturer/curriculum<br/>(Bài học & Chủ đề)"]:::prep
    Questions["❓ /lecturer/questions<br/>(Ngân hàng câu hỏi & RAG)"]:::prep
    Rubrics["📐 /lecturer/rubrics<br/>(Bộ tiêu chí Rubric)"]:::prep

    Sessions["📋 /exam-sessions<br/>(Quản lý Phiên thi CRUD)"]:::exam
    Monitor["👁️ /lecturer/exam-sessions/:id/monitor<br/>(Giám sát phòng thi Realtime)"]:::exam

    Reviews["⚖️ /lecturer/reviews<br/>(Danh sách bài chờ duyệt)"]:::review
    ReviewDetail["🔍 /lecturer/reviews/:id<br/>(Split-View Thẩm định & Override)"]:::review
    Appeals["📬 /lecturer/appeals<br/>(Xử lý đơn phúc khảo)"]:::review

    Login --> Dashboard
    Dashboard --> Curriculum
    Dashboard --> Sessions
    Dashboard --> Reviews
    Dashboard --> Appeals

    Curriculum --> Questions
    Rubrics --> Questions
    Questions --> Sessions
    Sessions --> Monitor
    Sessions --> Reviews
    Reviews --> ReviewDetail
    ReviewDetail --> Appeals
```

---

## 3. Đặc Tả Kiến Trúc Giao Diện (Lecturer Portal Layout Architecture)

### 3.1. Cấu Trúc Bố Cục Sidebar Dọc (Lecturer Left Sidebar Layout)
Để tối ưu không gian hiển thị và loại bỏ việc nhồi nhét tới 8 mục nghiệp vụ trên thanh Top Navbar ngang, phân hệ Giảng viên chuyển sang chuẩn kiến trúc **Layout Cột Dọc Bên Trái (Left Sidebar Layout)** với các tiêu chuẩn thiết kế:
- **Thanh Cột Dọc Bên Trái (Fixed Left Sidebar - 270px)**:
  - **Header Sidebar**: Logo AIVES kèm nhãn định danh `Lecturer Portal` / `Khảo Thí & Học Thuật`.
  - **Nhóm 1: Tổng Quan (Overview)**:
    - 📊 `Bảng điều khiển` (`/lecturer/dashboard`) - Bức tranh tổng quan ca thi, bài chờ thẩm định, đơn phúc khảo.
  - **Nhóm 2: Tổ Chức Thi (Exam Operations)**:
    - ⏱️ `Phiên thi & Giám sát` (`/exam-sessions`) - Quản lý phòng thi viva, passcode, trạng thái trực tiếp.
  - **Nhóm 3: Học Liệu & Đề Thi (Academic & Content)**:
    - 📚 `Chương trình học` (`/lecturer/curriculum`) - Quản lý Bài học (`lessons`) & Chủ đề (`topics`).
    - 📁 `Học liệu & Slide RAG` (`/lecturer/materials`) - Quản lý tài liệu GCS & Vertex AI RAG Corpus.
    - ❓ `Ngân hàng câu hỏi` (`/lecturer/questions`) - Câu hỏi theo 4 mức Bloom, sinh đề bằng AI.
    - 📐 `Tiêu chí Rubric` (`/lecturer/rubrics`) - Tiêu chuẩn chấm điểm 100%.
  - **Nhóm 4: Chấm Điểm & Đánh Giá (Grading & Reviews)**:
    - ⚖️ `Thẩm định điểm (HITL)` (`/lecturer/reviews`) - Đối soát điểm AI đề xuất, override điểm.
    - 📬 `Đơn phúc khảo` (`/lecturer/appeals`) - Xử lý khiếu nại điểm thi của sinh viên.
  - **Footer Sidebar**: Phiên bản hệ thống, trạng thái Voice Engine, nút Thu nhỏ/Mở rộng.
- **Thanh Tiêu Đề Trên (Clean Top Header - 64px)**:
  - Breadcrumb định vị ngữ cảnh (`Giảng viên > Bảng điều khiển`).
  - Trạng thái Học kỳ (`Học kỳ Spring 2026`).
  - Chuyển đổi ngôn ngữ (`LanguageSwitch`).
  - Profile rút gọn của Giảng viên & Nút Đăng xuất.

### 3.2. Bảng Điều Khiển Giảng Viên Tinh Gọn (`/lecturer/dashboard` - LecturerDashboardPage)
- **Mục đích**: Bức tranh toàn cảnh về tiến độ học thuật, cảnh báo các bài thi đang chờ duyệt điểm và khiếu nại chưa xử lý với giao diện Clean, Clear, phân cấp trực quan.
- **Wireframe Layout (Clean & Balanced)**:
```text
+------------------+-------------------------------------------------------------------+
| [AIVES Lecturer] | [=] Breadcrumb: Giảng viên > Dashboard   [Spring 2026] [🌐 VI] [👤 GV] [🚪] |
+------------------+-------------------------------------------------------------------+
| [TỔNG QUAN]      |                                                                   |
| 📊 Dashboard (●) |  Bảng Điều Khiển Giảng Viên                    [Học kỳ Spring 2026] |
|                  |  ---------------------------------------------------------------- |
| [TỔ CHỨC THI]    |  [🕒 Ca thi đang mở] [⏳ Chờ duyệt HITL] [📬 Phúc khảo] [❓ Câu hỏi] |
| ⏱️ Phiên thi     |       3 Ca thi            12 Bài thi         4 Đơn         48 Câu     |
|                  |                                                                   |
| [HỌC LIỆU & ĐỀ]  |  +-----------------------------+ +-----------------------------+  |
| 📚 Chương trình  |  | ⚠️ VIỆC CẦN XỬ LÝ GẤP       | | 📋 CA THI GẦN ĐÂY           |  |
| 📁 Slide & RAG   |  | • 5 bài thi SWD392 chờ duyệt| | • Vấn đáp Java Advanced     |  |
| ❓ Ngân hàng câu |  | • 2 đơn phúc khảo mới       | | • Đồ án Kiến trúc Phần mềm  |  |
| 📐 Rubric        |  | [ Thẩm định ngay ]          | | [ Quản lý phiên thi ]       |  |
|                  |  +-----------------------------+ +-----------------------------+  |
| [CHẤM ĐIỂM]      |                                                                   |
| ⚖️ Thẩm định HITL|  +-------------------------------------------------------------+  |
| 📬 Phúc khảo     |  | 📊 TIẾN ĐỘ CHẤM ĐIỂM HỌC KỲ                                 |  |
|                  |  | 85% Hoàn thành thẩm định điểm | 15% Đang chờ xử lý          |  |
| ⚙️ v1.0.0-prod   |  +-------------------------------------------------------------+  |
+------------------+-------------------------------------------------------------------+
```

### 3.2. Màn hình Quản Lý Bài Học & Chủ Đề (`/lecturer/curriculum` - CurriculumManagementPage)
- **Mục đích**: Quản lý cây phân cấp tri thức môn học: Môn học $\rightarrow$ Bài học (`lessons`) $\rightarrow$ Chủ đề (`topics`).
- **Thành phần**:
  - Cột trái: Danh sách các Bài học (Thêm mới Lesson, Sửa tiêu đề, Xóa).
  - Cột phải: Danh sách các Chủ đề thuộc Bài học được chọn (Thêm Topic mới, mô tả chủ đề, số câu hỏi đang liên kết trong Topic).
  - Nút chuyển nhanh: "Soạn câu hỏi cho chủ đề này" $\rightarrow$ dẫn tới `/lecturer/questions?topicId=...`.

### 3.3. Màn hình Giám Sát Trực Tiếp Ca Thi (`/lecturer/exam-sessions/:id/monitor` - LiveExamMonitorPage)
- **Mục đích**: Theo dõi realtime các thí sinh đang trong phòng thi viva ảo để phòng ngừa sự cố hoặc gian lận.
- **Thành phần**:
  - Thông tin ca thi: Tên ca, Mã phiên, Passcode, Thời gian bắt đầu / kết thúc.
  - Bảng danh sách thí sinh:
    - Họ tên, Mã SV (`users_id`), Thiết bị (Web / Mobile).
    - Trạng thái phòng thi: `ĐANG TRẢ LỜI CÂU 2/4`, `CHUẨN BỊ`, `ĐÃ NỘP BÀI`.
    - Thời lượng còn lại của từng thí sinh.
    - Trạng thái tín hiệu: Micro On/Off, Ping mạng.

### 3.4. Màn hình Quản Lý Học Liệu & Slide RAG (`/lecturer/materials` - MaterialsManagementPage)
- **Mục đích**: Cho phép giảng viên quản lý toàn diện các tài liệu, bài giảng slide (.pptx, .pdf) đã tải lên Google Cloud Storage (GCS) và nạp vào Vertex AI RAG Corpus theo môn học.
- **Phân quyền (RBAC)**: Giảng viên chỉ xem và thao tác trên học liệu do chính mình tải lên (`lecturerId`), Quản trị viên (`ADMIN`) có quyền xem toàn bộ.
- **Thành phần & Chức năng**:
  - **Bộ lọc & Tìm kiếm**: Lọc theo Bài học (`lessonId`), Chủ đề (`topicId`), Trạng thái RAG (`INDEXING`, `READY`, `FAILED`), tìm kiếm theo tên file / tiêu đề.
  - **Nút "Upload tài liệu mới"**: Mở `UploadMaterialModal` chọn file `.pptx, .ppt, .pdf`, gán bài học/chủ đề và gửi lên backend lưu GCS + lập chỉ mục RAG Corpus.
  - **Bảng danh sách học liệu**:
    - Tiêu đề & Tên file gốc, kích thước, định dạng icon (.pptx / .pdf).
    - Bài học & Chủ đề liên kết.
    - Đường dẫn Cloud Storage (`gs://...`).
    - Trạng thái nạp RAG Corpus kèm badge màu (`READY`: xanh lá, `INDEXING`: xanh dương xoay, `FAILED`: đỏ).
    - Ngày tải lên.
    - Hành động: Nạp lại RAG (`Re-index`), Đổi bài học/chủ đề liên kết, Xóa tài liệu (xóa khỏi GCS & RAG Corpus).
