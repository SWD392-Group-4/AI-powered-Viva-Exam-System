# Architecture Design - AIVES

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Kiểu kiến trúc**: Client - Server, backend **Monolith** (1 ứng dụng Spring Boot) gọi dịch vụ AI bên thứ ba qua HTTPS REST.  
> **Liên quan**: [00-overview](../00-overview/README.md) · [01-business-rule](../01-business-rule/README.md) · [ERD](../ERD/README.md) · [03-context-diagram](../03-context-diagram/README.md) · [core-workflows](../core-workflows.md)

---

## 1. Sơ đồ kiến trúc

![Architecture diagram](images/architecture-diagram.png)

Bản Mermaid tương đương (sửa được trực tiếp trên GitHub):

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#EEF2FF',
    'primaryTextColor': '#1E1B4B',
    'primaryBorderColor': '#6366F1',
    'lineColor': '#64748B',
    'fontFamily': 'Inter, system-ui, -apple-system, sans-serif',
    'fontSize': '13px'
  }
}}%%
flowchart LR
    %% Định nghĩa bảng màu ngữ nghĩa chuẩn thiết kế
    classDef client fill:#E0F2FE,stroke:#0284C7,stroke-width:1.5px,color:#0369A1,rx:8,ry:8;
    classDef backend fill:#F5F3FF,stroke:#8B5CF6,stroke-width:2px,color:#5B21B6,rx:8,ry:8;
    classDef ai fill:#FFE4E6,stroke:#F43F5E,stroke-width:1.5px,color:#9F1239,rx:8,ry:8;
    classDef db fill:#ECFDF5,stroke:#10B981,stroke-width:1.5px,color:#065F46,rx:4,ry:4;

    subgraph FE [" 🖥️ FE Clients (Frontend Layer) "]
        REACT["🌐 <b>Vite + React</b><br/>TailwindCSS (Web Portal)"]:::client
        MOBILE["📱 <b>React Native + Expo</b><br/>TypeScript (Mobile App)"]:::client
    end

    subgraph BE [" ⚙️ Backend Core (Monolith) "]
        SPRING["🚀 <b>Java + Spring Boot</b><br/>Spring Security, JPA & REST"]:::backend
    end

    subgraph EXT [" ☁️ Google Cloud Platform (asia-southeast1) "]
        GCS["🗂️ <b>Cloud Storage (GCS)</b><br/>Bucket lưu slide bài giảng"]:::ai
        RAG["📚 <b>Vertex AI RAG Engine</b><br/>Spanner Vector DB (Top-K)"]:::ai
        GEMINI["🧠 <b>Vertex AI Gemini 1.5 Flash</b><br/>Grounded LLM & JSON Schema"]:::ai
        SPEECH["🎙️ <b>Speech APIs (STT / TTS)</b><br/>Bóc băng & Đọc câu hỏi"]:::ai
    end

    subgraph DB [" 🗄️ Persistence Layer "]
        PG[("🐘 <b>PostgreSQL 16</b><br/>18 Bảng quan hệ")]:::db
    end

    %% Luồng kết nối với nhãn giao thức rõ ràng
    REACT <--> |"Request: HTTPS REST (JSON, AUDIO) + JWT<br/>Response: HTTP STATUS + JSON BODY"| SPRING
    MOBILE <--> |"Request: HTTPS REST (JSON, AUDIO) + JWT<br/>Response: HTTP STATUS + JSON BODY"| SPRING
    SPRING <--> |"Google Cloud SDK / HTTPS (IAM Service Account)<br/>Storage, RAG Retrieval, Grounded LLM, Speech"| EXT
    GCS -. "Auto Sync & Embed" .-> RAG
    RAG -. "Top-5 Chunks" .-> GEMINI
    SPRING <--> |"Request: JDBC (Spring Data JPA), Port 5432 TCP/IP<br/>Response: ResultSet → Entity"| PG
```

Mỗi mũi tên hai chiều ghi cả request (chiều đi) và response (chiều về), giống các cặp nét liền / nét đứt trên ảnh.

---

## 2. Thành phần

| Khối | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| **FE** | **Vite + React**, **TailwindCSS** | Web app cho cả sinh viên và giảng viên: phòng thi (ghi âm, phát câu hỏi, hiển thị transcript), quản lý bài học / câu hỏi / rubric / đề thi, màn hình thẩm định điểm, phúc khảo. |
| **BE** | **Java + Spring Boot** | Toàn bộ nghiệp vụ: xác thực JWT, phân quyền, điều phối phòng thi, gọi AI, chấm điểm, lưu dữ liệu. Là thành phần **duy nhất** lưu trữ chứng chỉ Google Cloud IAM Service Account và được gọi các dịch vụ đám mây (không dùng API key). |
| **DB** | **PostgreSQL** | Lưu toàn bộ dữ liệu nghiệp vụ theo [Physical ERD](../ERD/03-physical-erd.md) (18 bảng). |
| **Google Cloud (asia-southeast1)** | **Cloud Storage (GCS)** | Lưu trữ slide bài giảng môn học (PPTX, PDF) do giảng viên tải lên theo từng môn học. |
| | **Vertex AI RAG Engine** | Quản lý RAG Corpus trên RagManaged Cloud Spanner Vector DB, phân mảnh tài liệu (Chunk: 1024, Overlap: 256) và tính vector embedding (`text-multilingual-embedding-002`). |
| | **Vertex AI Gemini 1.5 Flash** | Suy luận có căn cứ (Grounded Inference) dựa trên Top-5 chunks từ slide bài giảng: sinh câu hỏi gợi ý, quyết định hỏi xoáy (`BR-VIVA-001/002`), chấm điểm theo rubric (`BR-GRADE-001`) kèm trích dẫn dẫn chứng (`groundingMetadata`). |
| | **Google Speech-to-Text** | Chuyển audio câu trả lời của sinh viên thành transcript (`BR-VIVA-004`). |
| | **Google Text-to-Speech** | Chuyển câu hỏi (text) thành giọng đọc để phát cho sinh viên. |

---

## 3. Giao tiếp giữa các khối

| # | Chiều | Giao thức | Dữ liệu | Ghi chú |
| :---: | :--- | :--- | :--- | :--- |
| 1 | FE (Web/Mobile) → BE | HTTPS REST + JWT | JSON; audio câu trả lời gửi dạng `multipart/form-data` | JWT gửi trong header `Authorization: Bearer <token>`; Mobile gửi `platform: "MOBILE"` khi join ca thi |
| 2 | BE → FE (Web/Mobile) | HTTP response | Mã trạng thái HTTP + JSON body | Audio câu hỏi (TTS) trả về dạng base64/URL hoặc phát qua TTS trên client |
| 3 | BE → Google Cloud | HTTPS REST / Cloud SDK | Upload slide GCS, RAG retrieval query, Grounded prompt (transcript + rubric), audio base64 (STT/TTS) | Xác thực qua Google Cloud IAM Service Account (`roles/aiplatform.user`, `roles/storage.objectAdmin`); **loại bỏ hoàn toàn static API key** |
| 4 | Google Cloud → BE | HTTPS response | URI tài liệu, Top-5 semantic chunks, kết quả LLM theo JSON Schema kèm trích dẫn (citations), transcript STT, audio TTS | BE kiểm tra tính hợp lệ của JSON Schema và metadata dẫn chứng trước khi xử lý tiếp |
| 5 | BE → DB | JDBC qua Spring Data JPA | Câu lệnh SQL | Kết nối TCP/IP cổng **5432** (mặc định của PostgreSQL) |
| 6 | DB → BE | JDBC | `ResultSet` được Hibernate map thành Entity | |

**Mã trạng thái HTTP dùng thống nhất**: `200` / `201` thành công, `400` dữ liệu sai hoặc vi phạm điều kiện thi thiết bị (`MOBILE_EXAM_NOT_ALLOWED`), `401` chưa đăng nhập / token hết hạn, `403` không đủ quyền (`BR-AUTH-002`), `404` không tìm thấy, `409` xung đột trạng thái (ví dụ bắt đầu lượt thi đã `COMPLETED`), `500` lỗi hệ thống, `502` / `504` lỗi hoặc quá thời gian khi gọi dịch vụ AI.

---

## 4. Tech stack

| Tầng | Công nghệ | Lý do chọn |
| :--- | :--- | :--- |
| FE Web | Vite + React (TypeScript) | Build nhanh, cấu hình ít, hệ sinh thái lớn. |
| FE Web | TailwindCSS | Dựng giao diện nhanh, đồng bộ style giữa các màn hình. |
| FE Web | MediaRecorder / Web Audio API | Ghi âm câu trả lời và đo khoảng lặng (`BR-VIVA-003`). Micro chỉ chạy trên `https://` hoặc `localhost`. |
| FE Mobile | React Native (Expo Router, TypeScript) | Đa nền tảng (Android/iOS), hỗ trợ hot-reload, trải nghiệm native mượt mà. |
| FE Mobile | Expo Audio / Expo Speech | Thu âm micro trực tiếp và phát giọng nói tổng hợp trên thiết bị di động. |
| BE | Java + Spring Boot (Spring Web, Spring Security + JWT, Spring Data JPA, Bean Validation) | Chuẩn phổ biến cho backend Java, chia layer rõ ràng, tích hợp sẵn bảo mật và ORM. |
| DB | PostgreSQL | CSDL quan hệ mã nguồn mở, miễn phí; database mã hoá UTF-8 nên `VARCHAR` / `TEXT` lưu đúng tiếng Việt. BE kết nối bằng driver `org.postgresql:postgresql`. |
| AI Storage | Google Cloud Storage (GCS) | Lưu trữ phi cấu trúc các tệp slide bài giảng (PPTX, PDF) phân tách theo môn học. |
| AI Retrieval | Vertex AI Managed RAG Engine + Cloud Spanner | Quản lý ngữ liệu vector, tìm kiếm tương đồng cosine Top-5 chunks với mô hình `text-multilingual-embedding-002`. |
| AI Reasoning | Vertex AI Gemini 1.5 Flash | Suy luận có dẫn chứng (Grounded Inference), độ trễ thấp (< 1.5s), tuân thủ JSON Schema nghiêm ngặt. |
| AI Speech | Google Cloud Speech-to-Text / Text-to-Speech | Hỗ trợ tiếng Việt (`vi-VN`), gọi an toàn qua Google Cloud SDK từ Backend. |

---

## 5. Bên trong BE

### 5.1. Phân tầng

```
Controller (REST API, nhận / trả DTO)
    │
    ▼
Service (nghiệp vụ, kiểm tra Business Rules, transaction)
    │                      │
    ▼                      ▼
Repository (JPA)      Integration client (Gemini, STT, TTS)
    │                      │
    ▼                      ▼
PostgreSQL            3rd Party Services
```

- Controller **không** chứa nghiệp vụ, chỉ nhận request, validate DTO và gọi Service.
- Service là nơi kiểm tra Business Rule (ví dụ lệch điểm > 2.0 phải có ghi chú).
- Gọi dịch vụ AI đi qua **interface** (`LlmClient`, `SpeechToTextClient`, `TextToSpeechClient`) để dễ mock khi test và đổi nhà cung cấp.

### 5.2. Module nghiệp vụ

| Module | Bảng sở hữu (Physical ERD) | Chức năng |
| :--- | :--- | :--- |
| `auth` | `roles`, `users` | Đăng nhập, cấp JWT, quản lý tài khoản, phân quyền `ADMIN` / `LECTURER` / `STUDENT`. |
| `content` | `lessons`, `topics`, `questions`, `rubrics`, `rubric_criteria` | Quản lý bài học, ngân hàng câu hỏi, rubric; gọi Gemini sinh câu hỏi nháp (`BR-BANK-002`). |
| `exam` | `viva_exams`, `viva_exam_topics`, `viva_exam_questions`, `viva_attempts` | Tạo phiên thi (sinh mã phiên + mã truy cập), chọn câu hỏi; sinh viên tự vào bằng 2 mã đó (tạo lượt thi `IN_PROGRESS`), đếm ngược thời gian, kết thúc bài thi. |
| `vivaroom` | `interview_exchanges` | Điều phối phòng thi: nhận audio, gọi STT → Gemini → TTS, quyết định hỏi xoáy. |
| `grading` | `question_grades`, `criteria_grades`, `grade_appeals` | Chấm điểm AI, giảng viên thẩm định / chốt điểm (HITL), công bố, phúc khảo. |
| `audit` / `jobs` | `audit_logs`, `system_settings`, `background_jobs` | Ghi vết, cấu hình hệ thống, chạy việc nền. |

### 5.3. Cấu trúc package gợi ý

```
src/main/java/com/aives/
├── AivesApplication.java
├── common/          # config, security (JWT filter), exception handler, dto dùng chung
├── modules/
│   ├── auth/        # controller/ service/ repository/ entity/ dto/
│   ├── content/
│   ├── exam/
│   ├── vivaroom/
│   ├── grading/
│   └── audit/
├── jobs/            # đọc bảng background_jobs và chạy việc nền (@Scheduled + @Async)
└── integration/
    ├── ai/          # LlmClient, GeminiClient, prompt template
    └── speech/      # SpeechToTextClient, TextToSpeechClient (Google)
```

### 5.4. Việc chạy nền

Chấm điểm AI cho cả bài thi mất nhiều thời gian, nên không chạy trong request của sinh viên:

1. Khi sinh viên nộp bài, BE cập nhật `viva_attempts.status = COMPLETED` và thêm 1 dòng `background_jobs` (`EVALUATE_ATTEMPT`) **trong cùng 1 transaction**.
2. Một tác vụ `@Scheduled` trong BE định kỳ lấy job `PENDING`, chạy bằng `@Async`.
3. Job lỗi được thử lại (`attempts < 3`); hết lượt thì `FAILED` và `result_status = GRADING_FAILED` để giảng viên chấm lại.

Cách này không cần thêm message broker (Redis, RabbitMQ...), đúng với sơ đồ chỉ có 4 khối.

---

## 6. Luồng xử lý chính

### 6.1. Một lượt hỏi - đáp trong phòng thi

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'actorBkg': '#EEF2FF',
    'actorBorder': '#6366F1',
    'actorTextColor': '#1E1B4B',
    'signalColor': '#64748B',
    'signalTextColor': '#1E293B',
    'noteBkgColor': '#FEF3C7',
    'noteBorderColor': '#F59E0B',
    'noteTextColor': '#78350F',
    'fontFamily': 'Inter, system-ui, sans-serif',
    'fontSize': '13px'
  }
}}%%
sequenceDiagram
    autonumber
    actor SV as 👨‍🎓 Sinh viên
    participant FE as 💻 FE (React/Mobile)
    participant BE as ⚙️ BE (Spring Boot)
    participant STT as 🎙️ Google STT
    participant AI as 🧠 Gemini Flash
    participant TTS as 🔊 Google TTS
    participant DB as 🗄️ PostgreSQL

    SV->>FE: Bấm bắt đầu lượt thi
    FE->>BE: POST /api/attempts/{id}/start (JWT)
    BE->>DB: Kiểm tra lượt thi thuộc SV và chưa COMPLETED (BR-AUTH-002)
    BE->>TTS: synthesize(câu hỏi 1)
    TTS-->>BE: audio (base64)
    BE-->>FE: 200 {exchangeId, questionText, audio}
    FE-->>SV: Phát giọng đọc câu hỏi + Hiển thị đồng hồ đếm ngược

    rect rgb(254, 249, 195)
        Note over SV, FE: SV nghe câu hỏi, chuẩn bị, trả lời.<br/>FE ghi âm và tự khoá mic khi im lặng ≥ 10s (BR-VIVA-003)
    end

    SV->>FE: Hoàn thành trả lời (hoặc mic tự ngắt)
    FE->>BE: POST /api/attempts/{id}/answers (multipart: exchangeId + audio)
    
    rect rgb(240, 249, 255)
        BE->>STT: recognize(audio, vi-VN, domain_keywords)
        STT-->>BE: transcript
        BE->>DB: Lưu transcript vào interview_exchanges
        BE->>AI: câu hỏi + transcript + rubric + lịch sử (JSON schema)
        AI-->>BE: {decision: FOLLOW_UP | NEXT, reason, followUpQuestion}
        BE->>BE: Kiểm tra số câu xoáy ≤ max_follow_up_per_question, câu ≤ 40 từ (BR-VIVA-001/002)
        BE->>TTS: synthesize(câu xoáy hoặc câu tiếp theo)
        TTS-->>BE: audio (base64)
    end

    BE->>DB: Lưu interview_exchanges mới (parent_exchange_id nếu là câu xoáy)
    BE-->>FE: 200 {exchangeId, questionText, audio, isFinished}
    FE-->>SV: Cập nhật câu hỏi mới & Tiếp tục lượt thi
```

### 6.2. Chấm điểm và công bố

1. Job `EVALUATE_ATTEMPT` đọc transcript + rubric của từng câu, gọi Gemini chấm từng tiêu chí kèm trích dẫn bằng chứng.
2. BE lưu `question_grades` (`AI_DRAFT`) và `criteria_grades`, chuyển `result_status = PENDING_REVIEW`.
3. Giảng viên xem transcript, duyệt hoặc sửa điểm (`graded_by`, ghi chú nếu lệch > 2.0) rồi bấm công bố → `PUBLISHED`.
4. Sinh viên chỉ xem được kết quả khi `PUBLISHED` (`BR-GRADE-003`), sau đó có thể gửi phúc khảo (`grade_appeals`).

---

## 7. Bảo mật

- Toàn bộ giao tiếp FE ↔ BE và BE ↔ Google Cloud Platform qua **HTTPS**.
- **JWT** cấp khi đăng nhập; mọi API (trừ đăng nhập) phải có token. BE kiểm tra quyền theo role và theo quyền sở hữu dữ liệu (`BR-AUTH-001`, `BR-AUTH-002`).
- **Xác thực IAM Zero Trust**: Loại bỏ hoàn toàn API key tĩnh (`GEMINI_API_KEY`). BE sử dụng Google Cloud IAM Service Account tuân thủ nguyên tắc đặc quyền tối thiểu (Least Privilege) với 2 roles: `roles/aiplatform.user` (gọi RAG Corpus & Gemini LLM) và `roles/storage.objectAdmin` (quản lý slide trên GCS). Credentials lưu qua biến môi trường bí mật trên server, **không bao giờ** gửi xuống FE hay Mobile.
- Mật khẩu lưu dạng băm (BCrypt) trong `users.password_hash`.
- PostgreSQL chỉ mở cổng 5432 cho BE, không mở ra Internet.

---

## 8. Vấn đề cần nhóm thống nhất

| # | Vấn đề | Chi tiết | Đề xuất |
| :---: | :--- | :--- | :--- |
| 1 | **Nơi lưu file audio** | Physical ERD có các cột `full_audio_key`, `question_audio_key`, `answer_audio_key` nhưng sơ đồ kiến trúc chưa có khối lưu file. | Lưu trong thư mục trên server BE (đơn giản nhất cho đồ án), hoặc thêm khối Object Storage vào sơ đồ. |
| 2 | **Độ dài audio gửi STT** | API nhận dạng đồng bộ của Google STT chỉ nhận audio ngắn (khoảng 1 phút), trong khi `answer_seconds` mặc định là 120 giây. | Giới hạn thời gian trả lời ≤ 60 giây, hoặc dùng chế độ nhận dạng dài (long-running). Nên kiểm tra lại giới hạn trên tài liệu Google Cloud trước khi chốt. |
| 3 | **REST thay cho WebSocket** | Sơ đồ chỉ dùng REST, trong khi `BR-AUTH-003` đang viết theo WebSocket (1 kết nối active / SV). | Sửa `BR-AUTH-003` theo REST, ví dụ: mỗi lượt thi chỉ có 1 phiên hợp lệ, request từ phiên cũ bị từ chối. |
| 4 | **Độ trễ ≤ 3 giây** (`BR-VIVA-003`) | Mỗi lượt gọi tuần tự STT → Gemini → TTS nên dễ vượt 3 giây. | Đo thực tế; nếu vượt thì trả text câu hỏi trước, audio TTS tải sau. |
| 5 | **Tài liệu cũ chưa khớp** | `00-overview` còn nhắc RAG, `BR-AUTH-001` còn nhắc `EXAM_EXAMINER`, `core-workflows` còn nhắc RAG worker / `pgvector`, Next.js, Redis, BullMQ, WebSocket. | Cập nhật các tài liệu này theo ERD và kiến trúc mới. |

---

## 9. Quy định Quản lý Biến Môi trường (.env & .env.example)

Để đảm bảo các thành viên trong nhóm không quên cập nhật cấu hình khi có biến mới và đồng thời đảm bảo việc triển khai (Deploy lên Render/Cloud) diễn ra trơn tru:

### 9.1. Phân biệt 2 môi trường qua `APP_ENV`
- **Môi trường Local Dev (`APP_ENV=local` hoặc `dev`)**:
  - Bắt buộc có file `.env` cục bộ được tạo từ `.env.example`.
  - Cơ chế tự động kiểm tra đồng bộ: Khi khởi chạy, ứng dụng so sánh danh sách các key giữa `.env.example` và `.env`.
  - Nếu `.env` thiếu bất kỳ key nào có trong `.env.example`: Chặn khởi động (`exit 1`) và hiển thị hướng dẫn chi tiết danh sách biến cần bổ sung.
  - Nếu `.env` có key mới chưa được ghi vào `.env.example`: Hiển thị cảnh báo nhắc dev cập nhật `.env.example` cho cả team.
- **Môi trường Deploy / Production (`APP_ENV=deploy` hoặc `production`, hoặc cờ nhận diện tự động như `RENDER=true`)**:
  - Không đọc và không kiểm tra sự tồn tại của file `.env` trên đĩa (vì trên môi trường Cloud/Docker, file `.env` bị `.dockerignore` loại bỏ để bảo mật).
  - Đọc trực tiếp cấu hình từ các biến môi trường hệ thống (`System.getenv` / `process.env`).
  - Kiểm tra tính đầy đủ của các biến môi trường bắt buộc (như `DB_URL`, `JWT_SECRET`,...).

### 9.2. Triển khai đồng bộ trên cả 3 repository
1. **Backend (`aives-backend`)**: Xử lý trong `AivesApplication.java` tại hàm `validateEnvironment()`.
2. **Frontend (`aives-frontend`)**: Xử lý trong `vite-env-check.js` (plugin Vite) kiểm tra trước khi dev/build.
3. **Mobile (`aives-mobile`)**: Xử lý trong `scripts/check-env.js` (hook `prestart` trong `package.json`).
