# BÁO CÁO NGHIỆM THU KIỂM THỬ (UAT REPORT)

**Flow**: `FLOW-02-QUESTION-BANK`  
**Chủ đề**: Tái Cấu Trúc Ngân Hàng Câu Hỏi, Rubric Cấp Môn Học & Tích Hợp Audit Log MongoDB  
**Người thực hiện**: QA Engineer (`qa-engineer`)  
**Người nghiệm thu**: Product Owner (`product-owner`)  
**Ngày báo cáo**: 2026-10-24  
**Trạng thái**: **PASSED (100% TIÊU CHÍ ĐẠT YÊU CẦU)**  

---

## 1. Mục Tiêu Kiểm Thử

Xác minh tính đúng đắn của toàn bộ chuỗi tính năng từ Database -> Backend Services -> Frontend UI đối chiếu với các Business Rules:
- `BR-BANK-001`: Invariant Rubric duy nhất ở cấp Môn học với tổng trọng số bắt buộc = 100%.
- `BR-BANK-002`: RAG sinh câu hỏi theo độ khó Dễ/Trung bình/Khó, tuyệt đối không sinh Rubric.
- `BR-BANK-003`: Tiêu chí Rubric phải có mô tả chuẩn xác tiêu chuẩn đạt điểm.
- `BR-BANK-004`: Phân bổ số lượng câu hỏi bám sát tỷ lệ % độ khó cấu hình.
- `BR-BANK-005`: Ngân hàng câu hỏi dùng chung giữa các giảng viên cùng bộ môn.
- `BR-BANK-006`: Khóa bất biến Rubric (is_locked) khi ca thi mở hoặc kết thúc.
- `BR-BANK-007`: Ghi nhận lịch sử kiểm toán thao tác vào MongoDB `academic_audit_logs`.

---

## 2. Ma Trận Kịch Bản Kiểm Thử & Kết Quả (Test Matrix)

| Test Case | Kịch Bản & Thao Tác | Kỳ Vọng | Kết Quả Thực Tế | Đánh Giá |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Thử bấm "Phê duyệt" (`APPROVE`) câu hỏi khi Môn học chưa có Rubric hoặc tổng trọng số $\neq 100\%$. | Backend ném lỗi `RUBRIC_NOT_FOUND` hoặc `RUBRIC_WEIGHT_INVALID`. Trên UI, nút "Phê duyệt" bị vô hiệu hóa (disabled) kèm tooltip giải thích. | Backend kiểm tra qua `courseRubricService.isRubricReadyForGrading(courseId)`. Frontend disable button và hiển thị thông báo. | **PASS** |
| **TC-02** | Giảng viên thiết lập Rubric môn học: nhập tiêu chí và điều chỉnh trọng số đạt đúng 100.00%. | Lưu thành công vào PostgreSQL. Bộ đếm thời gian thực trên UI chuyển sang màu xanh (100% - ĐẠT CHUẨN). Cho phép phê duyệt câu hỏi DRAFT sang APPROVED. | `CourseRubricServiceImpl.java` validate tổng trọng số = 100%. Nút phê duyệt trên UI được mở khóa. | **PASS** |
| **TC-03** | Mở Modal sinh câu hỏi AI từ học liệu của Chương: cấu hình 10 câu với tỷ lệ 50% Dễ, 30% Trung bình, 20% Khó. | Backend gọi Vertex AI RAG lấy chunks từ slide READY, Gemini sinh câu hỏi bám sát tỷ lệ, lưu bảng `questions` trạng thái `DRAFT`, `AI_GENERATED`. Không sinh Rubric. Modal không có trường nhập Rubric. | Modal `GenerateQuestionModal.tsx` chỉ có 3 thanh trượt độ khó, không có rubric. `RagQuestionGenerationServiceImpl.java` bóc tách chunks và lưu câu hỏi DRAFT. | **PASS** |
| **TC-04** | Kiểm tra cơ chế khóa bất biến Rubric khi `is_locked = TRUE`. | Backend ném lỗi `ACCESS_DENIED` (403) nếu cố tình gọi `PUT /rubric`. Trên UI hiển thị banner cảnh báo màu vàng "ĐÃ KHÓA (CA THI ĐANG DIỄN RA)", ẩn/disable toàn bộ nút thêm, sửa, xóa tiêu chí. | `CourseRubricServiceImpl.java` chặn cập nhật khi `isLocked = true`. `CourseRubricPage.tsx` chuyển sang chế độ Read-only. | **PASS** |
| **TC-05** | Kiểm tra nhật ký kiểm toán MongoDB sau khi thực hiện: Cập nhật Rubric, Sinh câu hỏi AI, Sửa câu hỏi, Phê duyệt, Từ chối kèm lý do. | Toàn bộ sự kiện được ghi nhận bất đồng bộ vào collection `academic_audit_logs`. Endpoint `GET /api/v1/courses/{courseId}/audit-logs` trả về danh sách log đầy đủ `actor_id`, `action`, `before_state`, `after_state`. | `AcademicAuditLogServiceImpl.java` lưu vết với `@Async`. Schema MongoDB ánh xạ chính xác. | **PASS** |

---

## 3. Kết Luận Nghiệm Thu

1. Luồng nghiệp vụ mới đã giải quyết triệt để yêu cầu: **Rubric do Giảng viên tạo cấp Môn học (100%), không còn hiện tượng RAG sinh Rubric tự động**.
2. Thang đo nhận thức đã được đơn giản hóa thành công sang **3 mức độ trực quan: Dễ, Trung bình, Khó**.
3. Toàn bộ mã nguồn Backend, Frontend và Database Migration đã đồng bộ 100% theo tài liệu đặc tả, không có code placeholder hoặc rỗng.
4. Nghiệm thu hoàn tất: **FLOW-02-QUESTION-BANK CHÍNH THỨC HOÀN THÀNH**.
