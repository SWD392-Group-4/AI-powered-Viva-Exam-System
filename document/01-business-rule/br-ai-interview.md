# BR-VIVA: AI Interview Loop (Speech & Follow-up Engine)

## 1. Interview Loop Flow (State Machine mỗi câu hỏi)
Mỗi câu hỏi chính trải qua chu trình:
1. `TTS_PLAY`: Hệ thống phát âm câu hỏi qua TTS (hoặc hiển thị kèm text).
2. `STUDENT_PREPARE`: Bộ đếm thời gian suy nghĩ (Preparation Time).
3. `STUDENT_SPEAKING`: Hệ thống bật micro, STT stream chuyển audio thành text real-time.
4. `EVAL_AND_DECIDE`: AI phân tích câu trả lời, quyết định:
   - **Chuyển câu chính tiếp theo** (nếu câu trả lời đã đầy đủ, hoặc hết quota hỏi xoáy).
   - **Sinh câu hỏi hỏi xoáy** (`Follow-up Question`) nếu câu trả lời còn thiếu ý quan trọng, mơ hồ hoặc mâu thuẫn.

---

## 2. Business Rules

### BR-VIVA-001: Adaptive Follow-up Trigger Conditions
- **Rule**: AI chỉ được phép sinh câu hỏi hỏi xoáy khi:
  1. Số lượt follow-up hiện tại của câu chính này $< \text{MaxFollowUpPerQuestion}$.
  2. Câu trả lời của sinh viên rơi vào 1 trong các trường hợp:
     - `INCOMPLETE`: Thiếu $\ge 1$ ý/từ khóa quan trọng trong Rubric nhưng sinh viên có thể hiện hiểu biết một phần.
     - `AMBIGUOUS`: Trả lời chung chung, cần đào sâu ví dụ thực tế hoặc giải thích thuật ngữ.
     - `CONTRADICTORY`: Có mâu thuẫn giữa các mệnh đề trong câu trả lời.
- **Dừng hỏi xoáy ngay khi**:
  - Sinh viên trả lời xuất sắc (đạt $\ge 90\%$ rubric criteria).
  - Sinh viên nói "Em không biết / Bỏ qua câu này" (tránh lãng phí thời gian và áp lực tâm lý).
  - Đạt trần $\text{MaxFollowUpPerQuestion}$.

### BR-VIVA-002: Follow-up Scope & Anti-Hallucination
- **Rule**: Câu hỏi hỏi xoáy sinh ra từ AI:
  1. **Bắt buộc** phải xoay quanh chủ đề của câu hỏi chính và các tiêu chí trong Rubric của câu đó.
  2. Tuyệt đối **không được** chuyển sang một chủ đề hoàn toàn mới nằm ngoài phạm vi câu hỏi chính.
  3. Độ dài câu hỏi hỏi xoáy tối đa 40 từ để đảm bảo súc tích, dễ nghe qua TTS.

### BR-VIVA-003: Latency & Silence Detection SLA
- **Silence Threshold**: Nếu phát hiện khoảng lặng (silence) liên tục $\ge 5$ giây sau khi sinh viên đã nói $\ge 10$ giây, hệ thống hiển thị gợi ý "Bạn đã hoàn thành câu trả lời chưa?". Nếu im lặng $\ge 10$ giây, hệ thống tự động khóa mic (`AUTO_SUBMIT`).
- **Processing Latency**: Thời gian từ khi sinh viên kết thúc nói (`End-of-Speech`) đến khi AI phát audio câu hỏi tiếp theo phải $\le 3000\text{ ms}$ (3 giây) trong điều kiện mạng ổn định.

### BR-VIVA-004: Speech-to-Text Fallback & Specialized Terms
- **Rule**:
  - Hệ thống phải nạp danh mục thuật ngữ chuyên ngành (`DomainKeywords` của môn học) vào STT Context/Prompt để hạn chế lỗi nhận diện từ ngữ kỹ thuật.
  - Transcript dạng text phải được lưu đồng thời với file audio gốc để phục vụ phúc khảo.
