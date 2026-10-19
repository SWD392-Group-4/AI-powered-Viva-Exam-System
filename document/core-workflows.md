# Master Workflows & Specifications: AIVES

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Tài liệu**: Đặc tả Luồng Nghiệp Vụ Cốt Lõi Toàn Hệ Thống (Master End-to-End Mainflow) & Các Quy Trình Thành Phần.  
> **Căn cứ**: [00-overview](00-overview/README.md), [01-business-rule](01-business-rule/README.md), [02-architecture-design](02-architecture-design/README.md), [03-context-diagram](03-context-diagram/README.md), [Physical ERD](ERD/03-physical-erd.md).

---

## 1. Sơ Đồ Master Mainflow Toàn Hệ Thống (End-to-End Big Picture)

Biểu đồ dưới đây mô tả toàn bộ vòng đời của một đợt thi vấn đáp từ khâu chuẩn bị học liệu, thiết lập ca thi, kiểm tra điều kiện sinh viên, vận hành phòng thi bằng giọng nói thời gian thực, chấm điểm ngầm bằng AI, thẩm định điểm (Human-in-the-Loop) đến công bố và phúc khảo.

> 🔗 **Mã nguồn Mermaid**: [master-mainflow.mmd](master-mainflow.mmd) *(Mở trực tiếp trên GitHub hoặc Mermaid Viewer để render toàn màn hình)*

| Giai đoạn | Tên Giai Đoạn | Tác nhân chính (Actors) | Hành động cốt lõi |
| :---: | :--- | :--- | :--- |
| **P1** | **Chuẩn Bị Tri Thức & Đề Thi** | Giảng viên, Vertex AI RAG Engine, Gemini Flash, PostgreSQL | Tải slide lên GCS, RAG lập chỉ mục Spanner, AI gợi ý câu hỏi Bloom đối soát slide, duyệt Rubric 100% |
| **P2** | **Thiết Lập Ca Thi (Viva Exam)** | Giảng viên, Spring Boot Core | Cấu hình ca thi, sinh `session_code` & `access_code` |
| **P3** | **Check-in & Kiểm Tra Thiết Bị** | Sinh viên, Web/Mobile Client | Nhập mã, kiểm tra cờ thiết bị, thử mic/loa VAD, tạo `viva_attempts` |
| **P4** | **Vấn Đáp Thích Ứng Real-Time** | Sinh viên, Google STT/TTS, Vertex AI RAG, Gemini Flash | Vòng lặp Voice AI: hỏi, trả lời, bóc băng, RAG truy xuất Top-5 chunks slide, hỏi xoáy thích ứng $\le 40$ từ |
| **P5** | **Chấm Điểm Nền & Thẩm Định HITL** | Worker, Vertex AI RAG, Gemini Flash, Giảng viên | Chấm Rubric ngầm đối chiếu ngữ cảnh slide, Giảng viên thẩm định & giải trình lệch điểm, công bố |

---

## 2. Ma Trận Vai Trò & Trách Nhiệm (RACI Matrix)

| Giai đoạn / Tác vụ | Giảng viên (Lecturer) | Sinh viên (Student) | Backend Core (Spring Boot) | External AI & Cloud Platform (Vertex AI RAG) | Database (PostgreSQL) |
| :--- | :--- :---: | :---: | :---: | :---: | :---: |
| **1. Soạn đề & Rubric** | **A / R** (Duyệt tối cao) | I | C (Cung cấp API, nạp slide GCS) | R (Vertex AI RAG gợi ý câu hỏi grounded) | R (Lưu trữ) |
| **2. Thiết lập Ca thi** | **A / R** (Tạo phiên & mã) | I | R (Sinh `session_code`) | - | R (Lưu `viva_exams`) |
| **3. Check-in & Kiểm tra** | I | **A / R** (Nhập mã, test mic) | R (Validate & tạo attempt) | - | R (Lưu `viva_attempts`) |
| **4. Phỏng vấn trực tiếp** | I (Giám sát nếu cần) | **A / R** (Nói & trả lời) | **R** (Điều phối FSM/REST) | **R** (STT bóc băng, TTS đọc, RAG Top-K & Gemini xoáy) | R (Lưu `interview_exchanges`) |
| **5. Chấm điểm ngầm (AI)** | I | - | **R** (Chạy Background Job) | **R** (RAG + Gemini chấm Rubric & trích dẫn citations) | R (Lưu `question_grades`) |
| **6. Thẩm định điểm (HITL)** | **A / R** (Duyệt/Sửa điểm) | - | R (Kiểm tra quy tắc lệch điểm) | - | R (Cập nhật `PUBLISHED`) |
| **7. Xem điểm & Phúc khảo** | R (Xử lý đơn phúc khảo) | **A / R** (Xem & Gửi đơn) | R (Quản lý trạng thái) | - | R (Lưu `grade_appeals`) |

> *Ghi chú ký hiệu RACI*: **R** = Responsible (Người làm), **A** = Accountable (Người chịu trách nhiệm chính/phê duyệt), **C** = Consulted (Được tham vấn), **I** = Informed (Được thông báo).

---

## 3. Đặc Tả Chi Tiết 5 Giai Đoạn Nghiệp Vụ Cốt Lõi

### 3.1. Giai đoạn 1: Chuẩn Bị Tri Thức & Soạn Đề Thi (Question & Rubric Preparation)
- **Mục tiêu**: Nạp giáo trình/slide bài giảng môn học vào kho tri thức RAG, tạo ra bộ câu hỏi chuẩn hóa có căn cứ kèm Rubric đánh giá đa mức độ tư duy (Bloom taxonomy).
- **Thực thể liên quan**: `lessons`, `topics`, `questions`, `rubrics`, `rubric_criteria`.
- **Quy trình nạp tài liệu & sinh câu hỏi**:
  1. Giảng viên tải slide môn học (PPTX, PDF) lên Web Portal.
  2. Backend đẩy file lên **Google Cloud Storage (GCS)** trong bucket chuyên dụng phân tách theo môn học/học phần.
  3. Kích hoạt **Vertex AI RAG Engine** lập chỉ mục: bóc tách nội dung bằng LLM parser, phân mảnh (chunk 1024 tokens, overlap 256 tokens) và tạo vector embedding qua `text-multilingual-embedding-002` lưu trữ trên RagManaged Cloud Spanner.
  4. Backend kích hoạt Gemini 1.5 Flash thực hiện suy luận có căn cứ (Grounded Inference) đối soát nội dung slide bài giảng để gợi ý câu hỏi nháp theo thang Bloom và đáp án mẫu.
- **Quy tắc nghiệp vụ**:
  - `BR-AUTH-001`: Giảng viên chỉ được tạo/sửa câu hỏi và rubric thuộc môn học mình phụ trách.
  - `BR-BANK-001`: Tổng trọng số ($\sum \text{weight}$) của các tiêu chí trong một Rubric bắt buộc bằng đúng $100\%$.
  - `BR-BANK-002`: Câu hỏi do AI sinh ra mang trạng thái `DRAFT` và `Source = AI_GENERATED`. Giảng viên phải kiểm tra nội dung đối soát slide, gán Rubric và đổi trạng thái sang `APPROVED` thì mới được sử dụng trong ca thi.

---

### 3.2. Giai đoạn 2: Thiết Lập Ca Thi & Cấp Mã Truy Cập (Exam Session Scheduling)
- **Mục tiêu**: Lên lịch đợt thi, cấu hình các tham số vận hành và cấp mã vào phòng thi an toàn.
- **Thực thể liên quan**: `viva_exams`, `viva_exam_topics`, `viva_exam_questions`.
- **Cấu hình ca thi**:
  - `session_code`: Mã phòng công khai (VD: `SWD392-SE1701`).
  - `access_code`: Mã bí mật do hệ thống sinh ngẫu nhiên dùng để vào phòng.
  - `duration_minutes`: Thời gian tối đa cho toàn bộ ca thi.
  - `max_questions`: Số lượng câu hỏi chính mỗi sinh viên phải trả lời.
  - `max_follow_up_per_question`: Giới hạn số lượt hỏi xoáy tối đa cho mỗi câu (thường từ 1 - 2 lượt).
  - `allow_mobile_exam`: Cờ Boolean (`true`/`false`) cho phép hoặc cấm thí sinh thi bằng ứng dụng di động.

---

### 3.3. Giai đoạn 3: Xác Thực Truy Cập & Kiểm Tra Thiết Bị (Access & Device Check)
- **Mục tiêu**: Đảm bảo thí sinh đúng danh tính, sử dụng đúng thiết bị cho phép và âm thanh đạt chuẩn.
- **Thực thể liên quan**: `viva_attempts`, `users`.
- **Luồng xử lý**:
  1. Sinh viên đăng nhập vào hệ thống, nhận JWT Token.
  2. Gửi request `POST /api/exams/join` kèm `session_code`, `access_code` và header nền tảng (`platform: WEB` hoặc `platform: MOBILE`).
  3. Backend kiểm tra:
     - Nếu `platform == MOBILE` và ca thi có `allow_mobile_exam == false` $\rightarrow$ Trả về mã lỗi `400 Bad Request (MOBILE_EXAM_NOT_ALLOWED)`.
     - Nếu ca thi chưa đến giờ hoặc đã đóng $\rightarrow$ Báo lỗi.
  4. Client tiến hành kiểm tra âm thanh (Audio Loopback Test): Thu âm giọng nói mẫu và phát lại để sinh viên tự kiểm tra tai nghe/mic, đo ngưỡng tạp âm nền (Voice Activity Detection - VAD).
  5. Sinh viên bấm "Bắt đầu làm bài" $\rightarrow$ Backend tạo bản ghi `viva_attempts` với `status = IN_PROGRESS`, gán ngẫu nhiên bộ câu hỏi từ ca thi.

---

### 3.4. Giai đoạn 4: Vòng Lặp Vấn Đáp Thích Ứng Thời Gian Thực (Live Adaptive Viva Loop)
- **Mục tiêu**: Giám khảo AI đối thoại hai chiều với thí sinh bằng giọng nói, kích hoạt hỏi xoáy bám sát tài liệu bài giảng khi phát hiện câu trả lời chưa đầy đủ.
- **Thực thể liên quan**: `viva_attempts`, `interview_exchanges`.
- **Quy tắc nghiệp vụ**:
  - `BR-VIVA-001`: Quyết định hỏi xoáy (Follow-up) được kích hoạt khi câu trả lời thiếu ý chính, mơ hồ hoặc mâu thuẫn so với tiêu chí của Rubric và slide bài giảng, đồng thời chưa chạm trần `max_follow_up_per_question`.
  - `BR-VIVA-002`: Câu hỏi xoáy do AI sinh ra phải ngắn gọn, súc tích ($\le 40$ từ) và tập trung thẳng vào phần kiến thức bài học bị thiếu, không lan man sang chủ đề khác.
  - `BR-VIVA-003`: Client sử dụng Web Audio API / Expo Audio theo dõi mức năng lượng giọng nói. Khi phát hiện im lặng liên tục $\ge 10$ giây, hệ thống tự động khóa mic và nộp câu trả lời (`AUTO_SUBMIT`).
  - `BR-VIVA-004`: Audio câu trả lời được gửi lên Backend kèm danh mục từ khóa chuyên môn môn học (`domain_keywords`) để Google STT bóc băng chính xác các thuật ngữ kỹ thuật tiếng Việt.
- **Cơ chế lưu trữ đối thoại (`interview_exchanges`)**:
  - Câu hỏi chính: `parent_exchange_id = NULL`, `exchange_type = MAIN`.
  - Câu hỏi xoáy: `parent_exchange_id = <ID câu trước>`, `exchange_type = FOLLOW_UP`.

---

### 3.5. Giai đoạn 5: Chấm Điểm AI, Thẩm Định HITL & Phúc Khảo (Scoring & HITL Review)
- **Mục tiêu**: Chấm điểm minh bạch theo Rubric có trích dẫn từ transcript và dẫn chứng từ slide giáo trình, Giảng viên kiểm soát chất lượng tối cao và hỗ trợ quy trình phúc khảo văn minh.
- **Thực thể liên quan**: `background_jobs`, `question_grades`, `criteria_grades`, `grade_appeals`.
- **Cơ chế hoạt động**:
  1. **Async Scoring**: Ngay khi sinh viên hoàn tất bài thi (`viva_attempts.status = COMPLETED`), Backend chèn một bản ghi vào bảng `background_jobs` với `job_type = EVALUATE_ATTEMPT`.
  2. **Quy trình Chấm điểm Hai Giai Đoạn (Two-Stage AI Assessment)**:
     - **Giai đoạn A (Gemini Candidate Briefing)**: Worker nạp toàn bộ transcript của các lượt exchange gửi đến Gemini 1.5 Flash API. Gemini tổng hợp, loại bỏ khẩu ngữ, chắt lọc các luận điểm kỹ thuật và lỗ hổng câu trả lời thành một bản tóm lược có cấu trúc (`candidate_response_brief`).
     - **Giai đoạn B (RAG Grounded Assessment & Slide Citations)**: Worker chuyển bản brief này cùng Rubric tiêu chí sang Knowledge RAG Engine. RAG Engine truy xuất vector slide bài giảng môn học, đối chiếu luận điểm của sinh viên với kiến thức chuẩn trong slide, chấm điểm từng tiêu chí rubric kèm dẫn chứng trích dẫn slide cụ thể (`slide citations` theo `BR-GRADE-001`).
  3. **Lưu Điểm Dự Thảo**: Kết quả chấm gồm điểm từng tiêu chí (`criteria_grades`), điểm câu hỏi (`question_grades`) kèm nhận xét điểm mạnh (`strengths`), điểm yếu (`weaknesses`), trích dẫn trực tiếp lời nói của sinh viên (`evidence_quote`) và siêu dữ liệu đối chiếu slide (`slide citations`). Trạng thái lúc này là `AI_DRAFT` và `viva_attempts.result_status = PENDING_REVIEW`. Điểm tuyệt đối **không** hiển thị cho sinh viên ở giai đoạn này.
  4. **Thẩm Định của Giảng Viên (HITL)**:
     - Giảng viên truy cập màn hình Review, nghe lại audio, xem transcript, bản tóm lược brief và đánh giá của AI.
     - Giảng viên có quyền chấp thuận hoặc điều chỉnh điểm số.
     - `BR-GRADE-002`: Nếu giảng viên điều chỉnh điểm chênh lệch $> 2.0$ điểm so với AI đề xuất, hệ thống bắt buộc giảng viên phải nhập lý do giải trình (`lecturer_note`).
  5. **Công Bố Kết Quả (Publish)**: Giảng viên bấm phê duyệt $\rightarrow$ `viva_attempts.result_status = PUBLISHED`. Sinh viên nhận được thông báo và xem chi tiết điểm số (`BR-GRADE-003`).
  6. **Phúc Khảo (Grade Appeal)**:
     - Sinh viên có thể tạo yêu cầu phúc khảo (`grade_appeals`) nếu nhận thấy điểm số chưa thỏa đáng.
     - Giảng viên tiếp nhận đơn, đối soát transcript gốc và cập nhật trạng thái (`APPROVED` / `REJECTED`) kèm phản hồi chính thức.

---

## 4. Đặc Tả Chi Tiết Sequence: Vòng Lặp Vấn Đáp Trực Tiếp

> 🔗 **Mã nguồn Mermaid**: [live-adaptive-viva-sequence.mmd](live-adaptive-viva-sequence.mmd) *(Mở trực tiếp trên GitHub hoặc Mermaid Viewer để render toàn màn hình)*

### Các bước chính trong Sequence:
1. **Khởi tạo câu hỏi**: FE gọi `POST /api/attempts/{id}/start` $\rightarrow$ BE lấy câu hỏi 1, gọi Google TTS tổng hợp âm thanh giọng đọc $\rightarrow$ trả về audio phát cho sinh viên kèm đồng hồ đếm ngược.
2. **Thu âm & Nộp bài**: Sinh viên nói qua micro. Web Audio VAD tự ngắt nếu im lặng $\ge 10$ giây (`BR-VIVA-003`). FE gửi multipart audio lên `POST /api/attempts/{id}/answers`.
3. **Bóc băng & Hỏi xoáy Real-time**: BE gọi Google STT nhận diện tiếng Việt (`vi-VN`) có nạp `domain_keywords` (`BR-VIVA-004`) $\rightarrow$ Gửi trực tiếp Transcript + Câu hỏi chính + Lịch sử hội thoại sang Gemini 1.5 Flash theo JSON Schema (tối ưu sub-second latency $< 1.5$s, không query RAG giữa vòng lặp).
4. **Rẽ nhánh Adaptive**:
   - Nếu câu trả lời thiếu ý / mâu thuẫn và chưa vượt trần `max_follow_up_per_question`: Gemini sinh câu hỏi xoáy ngắn $\le 40$ từ (`BR-VIVA-001/002`) $\rightarrow$ TTS đọc câu xoáy $\rightarrow$ ghi nhận exchange con.
   - Nếu đạt yêu cầu hoặc đủ trần: Chuyển câu hỏi chính tiếp theo.
5. **Nộp bài & Kết thúc ca thi**: Khi hoàn tất toàn bộ câu hỏi $\rightarrow$ BE chuyển `viva_attempts.status = COMPLETED`, đồng thời ghi một bản ghi vào `background_jobs` (`EVALUATE_ATTEMPT`).

---

## 5. Đặc Tả Chi Tiết Sequence: Chấm Điểm Nền & Thẩm Định HITL

> 🔗 **Mã nguồn Mermaid**: [scoring-hitl-review-sequence.mmd](scoring-hitl-review-sequence.mmd) *(Mở trực tiếp trên GitHub hoặc Mermaid Viewer để render toàn màn hình)*

### Các bước chính trong Sequence:
1. **Background Job Runner**: Task định kỳ `@Scheduled` quét bảng `background_jobs` lấy job `PENDING` và khóa bi quan (`FOR UPDATE`) để chạy `@Async`.
2. **Quy trình Chấm điểm Hai Giai Đoạn (Two-Stage AI Assessment)**:
   - **Giai đoạn A (Gemini Candidate Briefing)**: Worker nạp toàn bộ transcript của các lượt exchange gửi đến Gemini 1.5 Flash. Gemini tổng hợp, loại bỏ khẩu ngữ, chắt lọc các luận điểm kỹ thuật và lỗ hổng câu trả lời thành một bản tóm lược có cấu trúc (`candidate_response_brief`).
   - **Giai đoạn B (RAG Grounded Assessment & Slide Citations)**: Worker chuyển bản brief này cùng Rubric tiêu chí sang Knowledge RAG Engine. RAG Engine truy xuất vector slide bài giảng môn học, đối chiếu luận điểm của sinh viên với kiến thức chuẩn trong slide, chấm điểm từng tiêu chí rubric kèm dẫn chứng trích dẫn slide cụ thể (`slide citations` theo `BR-GRADE-001`).
3. **Lưu Điểm Dự Thảo**: BE lưu `criteria_grades` và `question_grades` với trạng thái `AI_DRAFT`, chuyển `viva_attempts.result_status = PENDING_REVIEW`.
4. **Giảng viên Thẩm định (HITL)**: Giảng viên mở Review Dashboard, xem bản tóm lược, transcript, slide trích dẫn và điểm AI gợi ý:
   - Nếu đồng thuận: bấm **Approve** giữ nguyên điểm.
   - Nếu điều chỉnh: bấm **Override** nhập điểm mới. Nếu độ lệch $| \text{Điểm mới} - \text{Điểm AI} | > 2.0$ điểm, hệ thống bắt buộc nhập giải trình `lecturer_note` (`BR-GRADE-002`).
5. **Công Bố Điểm**: Cập nhật `viva_attempts.result_status = PUBLISHED`. Sinh viên được mở khóa xem toàn bộ bảng điểm, nhận xét và transcript (`BR-GRADE-003`). Nếu có khiếu nại, sinh viên có thể tạo đơn `grade_appeals`.

---

## 6. Tổng Kết Tính Nhất Quán Kiến Trúc

| Thành phần | Công nghệ triển khai | Vai trò trong Mainflow |
| :--- | :--- | :--- |
| **Frontend Web** | React 19 + Vite + TailwindCSS | Cổng thông tin cho Giảng viên (nạp slide, soạn đề, thẩm định) & Sinh viên (vào phòng thi, xem điểm). |
| **Frontend Mobile** | React Native + Expo | Thiết bị thi di động tiện lợi cho Sinh viên (chỉ khả dụng khi có cờ `allow_mobile_exam`). |
| **Backend Monolith** | Java 17 + Spring Boot | Điều phối toàn bộ nghiệp vụ, kiểm tra Business Rules, quản lý REST APIs, bảo mật API Gateway và credentials. |
| **Persistence** | PostgreSQL | Lưu trữ tập trung 18 bảng quan hệ theo Physical ERD, quản lý hàng đợi tác vụ qua bảng `background_jobs`. |
| **Curriculum RAG** | Knowledge RAG Engine | Kho ngữ liệu slide bài giảng, sinh câu hỏi nháp chuẩn Bloom và thẩm định Rubric có căn cứ kèm trích dẫn slide. |
| **Conversational LLM** | Gemini 1.5 Flash API | Suy luận thời gian thực trong phòng thi (< 1.5s latency, hỏi xoáy $\le 40$ từ) và tổng hợp brief transcript sau thi. |
| **Speech Processing** | Google Cloud STT & TTS | Chuyển đổi giọng nói - văn bản hai chiều tiếng Việt (`vi-VN`) với độ trễ thấp. |
