# Kien Truc Va Danh Muc Thanh Phan: Nhom Chuc Nang 3 - Loi Phong Van AI

## 1. Tong Quan Nhom Chuc Nang 3

Nhom chuc nang 3 la loi nghiep vu cot loi cua he thong AIVES (AI-powered Viva Exam System):
- AI dong vai tro giam khao ao: phat am doc cau hoi bang giong noi tu nhien (Text-to-Speech).
- Sinh vien tra loi bang giong noi qua micro; he thong bóc bang tu dong sang van ban (Speech-to-Text).
- Dua tren noi dung cau tra loi, AI phan tich doi chieu Rubric va dap an mau de sinh cau hoi hoi xoay/lam ro (Adaptive Follow-up) neu cau tra loi con mo ho (AMBIGUOUS), thieu y (INCOMPLETE) hoac mau thuan (CONTRADICTORY).
- Quan ly chat che thoi gian chuan bi, thoi gian tra loi, tu dong nop bai khi im lang (Silence Detection) va gioi han so luot hoi xoay toi da moi cau (MaxFollowUpPerQuestion).

---

## 2. Danh Muc File Va Thanh Phan He Thong

### 2.1. Phan he Backend (aives-backend)

| STT | Duong dan file | Vai tro va nhiem vu |
| :---: | :--- | :--- |
| 1 | `src/main/java/com/aives/modules/vivaroom/controller/VivaInterviewController.java` | REST Controller dieu phoi phong thi cho sinh vien: `/start`, `/answer`, `/answer-audio`, `/question-audio`, `/skip`. |
| 2 | `src/main/java/com/aives/modules/vivaroom/controller/InterviewReviewController.java` | REST Controller phuc vu giang vien tra cuu cay hoi thoai boc bang (`/exchanges`) de giam sat va tham dinh diem. |
| 3 | `src/main/java/com/aives/modules/vivaroom/service/VivaInterviewService.java` | Interface hop dong FSM phong thi viva, quan ly chu trinh hoi - dap va chuyen trang thai. |
| 4 | `src/main/java/com/aives/modules/vivaroom/service/impl/VivaInterviewServiceImpl.java` | Trien khai FSM phong thi dua tren lich su `interview_exchanges`: khoi tao cau hoi, ghi nhan cau tra loi, goi AI danh gia ngoai transaction, tu dong phuc hoi timeout sau 90s. |
| 5 | `src/main/java/com/aives/modules/vivaroom/service/FollowUpDecisionService.java` | Trien khai Strategy danh gia hoi xoay bang LLM: ep schema JSON, kiem tra 3 dieu kien hoi xoay, gioi han do dai <= 40 tu, retry va fallback chuyen cau an toan. |
| 6 | `src/main/java/com/aives/modules/vivaroom/entity/InterviewExchange.java` | Entity JPA bang `interview_exchanges`: luu vet cau hoi, transcript cau tra loi, do sau `depth`, `parent_exchange_id`, quyet dinh AI, ly do hoi xoay, do tre. |
| 7 | `src/main/java/com/aives/modules/vivaroom/repository/InterviewExchangeRepository.java` | Repository truy van lich su hoi dap va update nguyen tu cau tra loi. |
| 8 | `src/main/java/com/aives/modules/vivaroom/dto/InterviewStateResponse.java` | DTO phan hoi trang thai phong thi (`QUESTION`, `PROCESSING`, `COMPLETED`), thoi gian countdown, cau hoi hien tai. |
| 9 | `src/main/java/com/aives/modules/vivaroom/dto/SubmitAnswerRequest.java` | DTO nhan cau tra loi dang text va chuoi transcript. |
| 10 | `src/main/java/com/aives/modules/vivaroom/dto/SkipQuestionRequest.java` | DTO yeu cau bo qua cau hoi. |
| 11 | `src/main/java/com/aives/modules/vivaroom/dto/InterviewExchangeResponse.java` | DTO chi tiet tung luot trao doi phuc vu giang vien tham dinh. |
| 12 | `src/main/java/com/aives/modules/vivaroom/enums/InterviewStatus.java` | Enum trang thai phong thi: `QUESTION`, `PROCESSING`, `COMPLETED`. |
| 13 | `src/main/java/com/aives/integration/speech/SttClient.java` | Interface bóc băng giọng nói sang văn bản. |
| 14 | `src/main/java/com/aives/integration/speech/GoogleSttClient.java` | Trien khai Google Cloud Speech-to-Text v1 (`WEBM_OPUS`, `vi-VN`). |
| 15 | `src/main/java/com/aives/integration/speech/TtsClient.java` | Interface tong hop van ban sang giong noi. |
| 16 | `src/main/java/com/aives/integration/speech/GoogleTtsClient.java` | Trien khai Google Cloud Text-to-Speech v1 (`vi-VN-Neural2-A`, MP3). |
| 17 | `src/main/java/com/aives/integration/speech/SpeechConfig.java` | Cau hinh Spring Bean cho Speech SDK. |
| 18 | `src/main/java/com/aives/integration/speech/SpeechProperties.java` | Thuoc tinh cau hinh: languageCode, voiceName, sampleRate, speakingRate. |
| 19 | `src/main/java/com/aives/common/controller/SpeechController.java` | Endpoint kiem tra am thanh `/api/speech/stt` va `/api/speech/tts`. |
| 20 | `src/main/java/com/aives/integration/ai/GeminiLlmClient.java` | Giao tiep LLM phan tich va sinh cau hoi xoay JSON. |
| 21 | `src/main/java/com/aives/modules/grading/service/GradingScheduler.java` | Quet tu dong dong cac luot thi het han va kich hoat cham diem. |

### 2.2. Phan he Web Frontend (aives-frontend)

| STT | Duong dan file | Vai tro va nhiem vu |
| :---: | :--- | :--- |
| 1 | `src/pages/ExamRoomPage.tsx` | Man hinh phong thi truc tiep: FSM 7 buoc (`MIC_CHECK`, `TTS_PLAY`, `STUDENT_PREPARE`, `STUDENT_SPEAKING`, `EVAL_AND_DECIDE`, `ERROR`, `COMPLETED`), timer countdown, silence detection, ghi am va nhan dien giong noi. |
| 2 | `src/services/vivaService.ts` | API Client goi `/api/exam-sessions/{id}/interview/*`. |
| 3 | `src/pages/JoinExamPage.tsx` | Man hinh nhap ma phong thi va passcode. |
| 4 | `src/pages/LiveExamMonitorPage.tsx` | Man hinh giang vien theo doi ca thi thoi gian thuc. |
| 5 | `src/pages/LecturerReviewPage.tsx` | Man hinh giang vien doi soat transcript hoi xoay va cham diem. |

### 2.3. Phan he Mobile App (aives-mobile)

| STT | Duong dan file | Vai tro va nhiem vu |
| :---: | :--- | :--- |
| 1 | `app/exam-room.tsx` | Man hinh phong thi tren thiet bi di dong: UI song am, dong ho dem nguoc, hien thi cay hoi - dap. |
| 2 | `app/device-check.tsx` | Man hinh kiem tra chan doan micro, camera va am thanh truoc khi vao thi. |
| 3 | `services/examSessionService.ts` | Service giao tiep API ca thi mobile. |

### 2.4. Phan he Dac ta & Tai lieu (AI-powered-Viva-Exam-System/document)

| STT | Duong dan file | Vai tro va nhiem vu |
| :---: | :--- | :--- |
| 1 | `document/01-business-rule/br-ai-interview.md` | Dac ta quy tac nghiep vu: FSM, dieu kien kich hoat hoi xoay (BR-VIVA-001), khong che do dai <= 40 tu (BR-VIVA-002), nguong im lang 5s/10s va SLA latency <= 3000ms (BR-VIVA-003), thuat ngu chuyen nganh STT (BR-VIVA-004). |
| 2 | `document/features-checklist.md` | Danh muc kiem toan tien do tinh nang: Muc 9 (Phong thi truc tiep) va Muc 10 (Loi hoi xoay thich ung). |
| 3 | `document/02-architecture-design/README.md` | So do kien truc tong the Dual-AI giua Spring Boot, Gemini Flash va RAG Engine. |

---

## 3. Phan Tich Khoang Cach (Gap Analysis)

1. **Kenh am thanh Audio tren Web Frontend**:
   - Backend da hoan thien `GoogleTtsClient` (tra ve MP3 chat luong cao qua `/question-audio`) va `GoogleSttClient` (nhan dien tieng Viet qua `/answer-audio`).
   - Tuy nhien, `ExamRoomPage.tsx` hien tai dang uu tien goi Web Speech API cua trinh duyet (`window.SpeechRecognition` va `window.speechSynthesis`), von khong on dinh tren cac trinh duyet khac nhau.
   - Giai phap: Chuyen doi Frontend sang su dung truc tiep stream audio tu backend, giu Web Speech API lam fallback du phong.

2. **Ket noi thuc te tren Mobile App**:
   - Man hinh `app/exam-room.tsx` hien tai dang dung mock data va mo phong go text gia lap.
   - Giai phap: Tich hop `expo-av` de thu am thuc te qua micro, goi endpoint `/answer-audio` va phat audio `/question-audio`.

3. **Nap tu khoa chuyen nganh vao STT (BR-VIVA-004)**:
   - `GoogleSttClient.java` chua nap danh sach `domainKeywords` tu mon hoc/cau hoi vao `SpeechContext.phrases` cua Google Cloud STT de tang do chinh xac cho cac thuat ngu ky thuat.
   - Giai phap: Bo sung truyen `phraseHints` tu Question/Course vao `SttClient`.

4. **Visualizer song am (Voice Waveform)**:
   - Man hinh Web hien chi hien thi muc volume %, can bo sung visualizer song am song dong de tang trai nghiem truc quan.
