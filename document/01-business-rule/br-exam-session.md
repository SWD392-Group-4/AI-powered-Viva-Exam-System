# BR-SESSION: Exam Session & Scheduling

## 1. Exam Configuration Parameters
Một đợt thi (`ExamSession`) cấu hình các thông số sau:
- `TotalMainQuestions`: Số câu hỏi chính mỗi thí sinh phải trả lời (ví dụ: 3 - 5 câu).
- `MaxFollowUpPerQuestion`: Số lượt hỏi xoáy tối đa cho mỗi câu chính (ví dụ: 2 lượt).
- `AnswerTimeLimitSeconds`: Thời gian tối đa sinh viên được trả lời cho 1 câu (ví dụ: 90s - 120s).
- `PreparationTimeSeconds`: Thời gian suy nghĩ trước khi hệ thống bắt đầu thu âm (ví dụ: 15s).
- `Language`: Ngôn ngữ thi (`vi-VN` hoặc `en-US`).
- `BloomDistribution`: Tỉ lệ Bloom level trong đề (ví dụ: 30% Nhớ, 40% Hiểu, 30% Vận dụng).

---

## 2. Business Rules

### BR-SESSION-001: Adaptive & Anti-Collision Question Assignment
- **Rule**: Khi sinh viên bắt đầu ca thi (`START_EXAM`), hệ thống bốc câu hỏi từ ngân hàng thỏa mãn:
  1. Đạt đủ tỉ lệ cấu hình `BloomDistribution` của kỳ thi.
  2. **Tránh trùng lặp cận kề**: 2 sinh viên có khung giờ thi liền kề (trong cùng ca thi hoặc chênh nhau $\le 30$ phút) không được nhận bộ câu hỏi chính trùng lặp quá $40\%$ số câu.
  3. Một sinh viên không bao giờ nhận 2 câu hỏi có cùng chủ đề phụ (`SubTopic`) trong cùng 1 lượt thi (trừ khi cấu hình đề yêu cầu chuyên sâu 1 chủ đề).

### BR-SESSION-002: Session Lifecycle State Machine
- **Trạng thái hợp lệ**: `SCHEDULED` -> `READY` -> `IN_PROGRESS` -> `COMPLETED` / `TERMINATED` / `ABANDONED`.
- **Chuyển trạng thái**:
  - `READY`: Khi đến giờ thi (`ScheduledAt - 15m`).
  - `IN_PROGRESS`: Khi sinh viên check mic, camera thành công và bấm "Bắt đầu".
  - `COMPLETED`: Sinh viên hoàn thành câu hỏi cuối cùng hoặc hết tổng thời lượng kỳ thi.
  - `TERMINATED`: Giảng viên hoặc hệ thống chủ động dừng khẩn cấp (vi phạm quy chế/mất mạng kéo dài).
  - `ABANDONED`: Sinh viên rời phòng quá `MaxDisconnectDurationSeconds` (mặc định 180s) mà không reconnect lại.

### BR-SESSION-003: Reconnect & Recovery Window
- **Rule**: Nếu sinh viên bị rớt mạng trong lúc thi:
  - Hệ thống tạm dừng đếm ngược câu hỏi hiện tại tối đa `GracePeriod` = 60s (tối đa 1 lần/câu).
  - Nếu sinh viên reconnect trong vòng 180s, khôi phục lại đúng câu hỏi đang dang dở.
  - Nếu quá 180s không reconnect, phiên thi tự động chuyển sang `ABANDONED` và lưu vết trạng thái chấm cho các câu đã làm xong.
