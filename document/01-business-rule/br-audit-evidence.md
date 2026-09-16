# BR-AUDIT: Audit Log, Recording & Dispute Evidence

## 1. Evidence Artifacts per Viva Attempt
Mỗi lượt thi của sinh viên (`VivaAttempt`) bao gồm các bằng chứng bất biến:
1. `AudioRecordingUrl` / `VideoRecordingUrl`: Link lưu trữ file ghi âm/hình toàn bộ quá trình thi.
2. `QuestionTimelineLog`: Timestamp từng câu hỏi được phát ra, thời gian sinh viên bắt đầu trả lời và kết thúc trả lời.
3. `TranscriptRaw`: Toàn văn nội dung lời nói sinh viên được STT bóc băng.
4. `AiScoringLog`: Chi tiết điểm và nhận xét AI đưa ra kèm timestamp.
5. `LecturerAuditTrail`: Lịch sử duyệt điểm (Ai duyệt, thời điểm duyệt, điểm trước/sau khi sửa, lý do sửa).

---

## 2. Business Rules

### BR-AUDIT-001: Immutability of Examination Artifacts
- **Rule**:
  - Dữ liệu audio/video và transcript được lưu trữ theo cơ chế **WORM (Write Once, Read Many)** hoặc gắn cờ bất biến (Immutable Storage).
  - Không có role nào (kể cả `ADMIN`) được phép chỉnh sửa nội dung raw transcript hoặc audio của sinh viên sau khi phiên thi kết thúc.
  - Xóa dữ liệu chỉ được thực hiện theo chính sách lưu trữ chung của nhà trường (`Retention Policy`, ví dụ: sau 1 năm hoặc sau khi kết thúc thời hạn khiếu nại).

### BR-AUDIT-002: Dispute Resolution Protocol (Khiếu nại điểm)
- **Rule**:
  - Khi sinh viên gửi đơn phúc khảo (`GradeDispute`):
    1. Giảng viên phúc khảo được cấp quyền truy cập **phòng đối chiếu**: giao diện đồng bộ giữa audio waveform và text transcript từng câu hỏi.
    2. Nếu transcript bị sai do lỗi STT nhận diện sai thuật ngữ âm thanh, giảng viên có quyền sửa transcript chính thức kèm lý do hiệu đính âm thanh.
    3. Điểm sau phúc khảo được ghi nhận thành phiên bản điểm mới (`GradeVersion = 2`) và lưu vết toàn bộ lý do điều chỉnh.

### BR-AUDIT-003: Privacy & Student Data Protection
- **Rule**:
  - Dữ liệu giọng nói và hình ảnh của sinh viên là dữ liệu nhạy cảm.
  - Link stream audio/video phải dùng **Presigned URL** có thời hạn hết hạn (TTL tối đa 30 phút), không lưu URL public.
  - Chỉ Giảng viên phụ trách môn và Sinh viên sở hữu lượt thi mới có quyền nghe lại file ghi âm của lượt thi đó.
