# Context Diagram - AIVES

> **Loại sơ đồ**: Context Diagram (DFD mức 0)  
> **Mục đích**: Xem toàn bộ hệ thống AIVES như **một process duy nhất** và mô tả các luồng dữ liệu giữa hệ thống với các thực thể bên ngoài.  
> **Liên quan**: [00-overview](../00-overview/README.md) · [02-architecture-design](../02-architecture-design/README.md) · [ERD](../ERD/README.md)

---

## 1. Sơ đồ

![Context Diagram](images/context-diagram.png)

---

## 2. Thành phần

| Ký hiệu | Thành phần | Loại | Mô tả |
| :--- | :--- | :--- | :--- |
| Hình tròn | **AIVES System** | Process | Toàn bộ hệ thống (FE + BE + DB), xem như hộp đen. |
| Hình chữ nhật | **Lecturer** | Người dùng | Giảng viên: chuẩn bị câu hỏi / rubric, tạo đề thi, thẩm định và công bố điểm, xử lý phúc khảo. |
| Hình chữ nhật | **Student** | Người dùng | Sinh viên: làm bài thi vấn đáp bằng giọng nói, xem điểm, gửi phúc khảo. |
| Hình chữ nhật | **Google Cloud Platform (Vertex AI RAG & Gemini)** | Hệ thống ngoài | Quản lý slide môn học (GCS), tìm kiếm vector tương đồng (RAG Corpus Spanner), suy luận có căn cứ (Grounded Inference bằng Gemini 1.5 Flash). |
| Hình chữ nhật | **Google Speech-to-Text** | Hệ thống ngoài | Chuyển audio câu trả lời thành transcript (`vi-VN`). |
| Hình chữ nhật | **Google Text-to-Speech** | Hệ thống ngoài | Chuyển câu hỏi dạng text thành audio. |

Các thực thể ngoài khớp với actor trong use case diagram (Lecturer, Student, AI Cloud Platform). Nền tảng Google Cloud quản trị tập trung việc lưu trữ slide, truy xuất vector RAG và suy luận mô hình thông qua IAM Service Account.

---

## 3. Luồng dữ liệu

### 3.1. Lecturer ↔ AIVES

| # | Chiều | Luồng dữ liệu | Use case liên quan |
| :---: | :--- | :--- | :--- |
| L1 | Lecturer → AIVES | Login credentials | Log in / Log out |
| L2 | Lecturer → AIVES | Course materials | Upload course materials |
| L3 | Lecturer → AIVES | Rubric & criteria | Assign rubric |
| L4 | Lecturer → AIVES | Question edits & approval | Review & edit questions, Approve question bank |
| L5 | Lecturer → AIVES | Viva exam setup | Tạo phiên thi; nhận mã phiên + mã truy cập để gửi cho sinh viên (không còn gán danh sách sinh viên; trên hình vẫn ghi "student list") |
| L6 | Lecturer → AIVES | Publish decision | Confirm & publish final score |
| L7 | Lecturer → AIVES | Adjusted score + reason | Adjust score with reason (`BR-GRADE-002`) |
| L8 | Lecturer → AIVES | Appeal resolution | View appeal |
| L9 | AIVES → Lecturer | Login result | Log in / Log out |
| L10 | AIVES → Lecturer | AI-generated draft questions | Generate questions (Bloom) |
| L11 | AIVES → Lecturer | Question bank & rubrics | Review & edit questions |
| L12 | AIVES → Lecturer | Transcripts + AI-suggested scores | Review AI-suggested score |
| L13 | AIVES → Lecturer | Scores | Review AI-suggested score |
| L14 | AIVES → Lecturer | Appeal list | View appeal |
| L15 | AIVES → Lecturer | Exam results | Confirm & publish final score |

### 3.2. Student ↔ AIVES

| # | Chiều | Luồng dữ liệu | Use case liên quan |
| :---: | :--- | :--- | :--- |
| S1 | Student → AIVES | Login credentials | Log in / Log out |
| S2 | Student → AIVES | Start exam request (mã phiên + mã truy cập) | Take viva exam |
| S3 | Student → AIVES | Voice answers (audio) | Answer by voice, Answer follow-up question |
| S4 | Student → AIVES | Appeal request | Appeal |
| S5 | AIVES → Student | Login result | Log in / Log out |
| S6 | AIVES → Student | Assigned exams | Take viva exam |
| S7 | AIVES → Student | Questions & follow-up questions | Take viva exam, Answer follow-up question |
| S8 | AIVES → Student | Text + audio (của câu hỏi) | Take viva exam |
| S9 | AIVES → Student | Published score & feedback | View score (`BR-GRADE-003`) |
| S10 | AIVES → Student | Appeal result | Appeal |

### 3.3. AIVES ↔ Dịch vụ AI & Google Cloud Platform

| # | Chiều | Luồng dữ liệu | Mục đích |
| :---: | :--- | :--- | :--- |
| A1 | AIVES → GCS & Vertex AI RAG | Upload slides & Import task | Đẩy slide lên GCS và kích hoạt lập chỉ mục RAG Corpus (`text-multilingual-embedding-002`) |
| A2 | AIVES → Vertex AI RAG & Gemini | Prompt: generate questions + RAG Corpus ID | Sinh câu hỏi nháp đối soát kiến thức từ slide bài giảng theo thang Bloom (`BR-BANK-002`) |
| A3 | AIVES → Vertex AI RAG & Gemini | Prompt: follow-up decision + Top-5 Chunks | RAG truy xuất Top-5 chunks từ slide kết hợp transcript + rubric để AI quyết định hỏi xoáy (`BR-VIVA-001`) |
| A4 | AIVES → Vertex AI RAG & Gemini | Prompt: grade by rubric + RAG context | Đối chiếu transcript, rubric và nội dung slide bài giảng để chấm điểm minh bạch (`BR-GRADE-001`) |
| A5 | Vertex AI → AIVES | Grounded draft questions (Bloom) | Danh sách câu hỏi nháp có căn cứ từ slide môn học (Status: `DRAFT`) |
| A6 | Vertex AI → AIVES | Follow-up decision & question | Quyết định `FOLLOW_UP` / `NEXT` kèm câu hỏi xoáy ≤ 40 từ (`BR-VIVA-002`) |
| A7 | Vertex AI → AIVES | Criteria scores + Grounding citations | Điểm từng tiêu chí kèm trích dẫn bằng chứng từ transcript và trích dẫn slide (`groundingMetadata`) |
| A8 | AIVES → Google STT | Answer audio + domain keywords | Audio câu trả lời kèm thuật ngữ chuyên ngành (`BR-VIVA-004`) |
| A9 | Google STT → AIVES | Transcript | Văn bản câu trả lời sau khi bóc băng |
| A10 | AIVES → Google TTS | Question text | Nội dung câu hỏi / câu xoáy cần phát âm |
| A11 | Google TTS → AIVES | Question audio | Luồng âm thanh tổng hợp để phát cho sinh viên |

**Tổng cộng**: 37 luồng dữ liệu (Lecturer 15, Student 10, Vertex AI RAG 7, STT 2, TTS 2).

---

## 4. Ghi chú

- Context Diagram **không** vẽ kho dữ liệu (PostgreSQL) vì đó là thành phần bên trong hệ thống. Kho dữ liệu sẽ xuất hiện ở DFD mức 1.
- Luồng **Course materials** (L2) và **Prompt: generate question** (A1) đến từ use case *Upload course materials*. Hiện [ERD](../ERD/README.md) chưa có thực thể lưu tài liệu môn học, nên nhóm cần bổ sung ERD hoặc bỏ 2 luồng này cho khớp.
- Không có actor **Admin** vì use case diagram không có Admin.

---

## 5. Điểm cần sửa trên hình

Tài liệu ở mục 3 đã ghi đúng chính tả; các lỗi dưới đây nằm trên file draw.io, cần sửa rồi xuất lại ảnh:

| Trên hình | Sửa thành |
| :--- | :--- |
| `Lecture` | `Lecturer` |
| `Appealist` | `Appeal list` |
| `Promt: generate question` / `Promt: follow-up decision` / `Promt: grade by rubric` | `Prompt: ...` (3 chỗ) |
| `Quesntions & follow up` | `Questions & follow-up questions` |
| `Publish score & feedback` | `Published score & feedback` |
| `Transcripts + AI suggested` | `Transcripts + AI-suggested scores` (hoặc gộp với luồng `Scores`) |
| `AI-Generated draft` | `AI-generated draft questions` |

Khi xuất lại, nên export PNG từ draw.io với **Zoom 200%** (ảnh hiện tại chỉ 874×626 nên chữ nhỏ) và commit kèm file `.drawio` gốc vào thư mục này để người khác sửa được.
