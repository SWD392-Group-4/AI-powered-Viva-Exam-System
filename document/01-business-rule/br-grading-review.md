# BR-GRADE: AI Scoring & Human-in-the-Loop (HITL)

## 1. Grading Workflow Overview
```
[Viva Completed]
       │
       ▼
[Scoring Worker (Calling Cloud LLM API)] ──(Đối chiếu Transcript vs Rubric)──> [AI Suggested Score & Feedback]
                                                                     │
                                                                     ▼
                                                          [Lecturer Review Board]
                                                          (Chấp thuận hoặc Chỉnh sửa)
                                                                     │
                                                                     ▼
                                                          [Final Published Grade]
```

---

## 2. Business Rules

### BR-GRADE-001: AI Scoring Grounding & Transparency
- **Rule**: Khi AI chấm điểm cho mỗi câu hỏi:
  1. AI **phải** chấm điểm chi tiết theo từng tiêu chí (`CriteriaScore`) trong Rubric của câu đó.
  2. Bắt buộc cung cấp **bằng chứng cụ thể (Rationale)**:
     - `Strengths`: Trích dẫn câu/từ trong transcript sinh viên đã trả lời đúng.
     - `Weaknesses`: Các ý còn thiếu so với Rubric/Model answer.
     - `Fluency / Time Score` (nếu có): Tín hiệu phụ tham khảo (độ lưu loát, ngập ngừng).
  3. Không được chấm điểm số không có cơ sở lý giải hoặc không map với tiêu chí trong Rubric.

### BR-GRADE-002: Human-in-the-Loop (HITL) Absolute Authority
- **Rule**:
  1. Điểm do AI sinh ra (`AiSuggestedScore`) chỉ mang tính chất **tham khảo (Draft/Pending Review)**.
  2. Sinh viên **tuyệt đối không được xem điểm** trước khi Giảng viên duyệt (`APPROVED`).
  3. `LECTURER` có toàn quyền:
     - Giữ nguyên điểm AI đề xuất.
     - Ghi đè điểm (`OverrideScore`) tăng hoặc giảm.
     - Sửa nhận xét của AI trước khi công bố.
  4. Nếu Giảng viên sửa điểm chênh lệch $> 2.0$ điểm (trên thang 10) so với gợi ý của AI, hệ thống yêu cầu giảng viên nhập ghi chú lý do (`LecturerNote`).

### BR-GRADE-003: Final Score Calculation & Grade Publication
- **Rule**:
  - Điểm tổng kết môn viva: $\text{TotalScore} = \sum (\text{QuestionFinalScore}_i \times \text{Weight}_i)$.
  - Trạng thái điểm chuyển từ `PENDING_REVIEW` -> `PUBLISHED`.
  - Khi điểm ở trạng thái `PUBLISHED`, sinh viên mới được mở khóa giao diện xem báo cáo chi tiết (transcript, điểm từng câu, nhận xét).
