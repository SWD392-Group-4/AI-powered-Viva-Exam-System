# QUY TRÌNH NGHIỆP VỤ: NẠP HỌC LIỆU RAG, SOẠN NGÂN HÀNG CÂU HỎI & KHỞI TẠO CA THI

**Document Identifier**: `FLOW-LECTURER-PREP-001`  
**Thuộc Phân Hệ**: Phân hệ Giảng viên (Lecturer Academic & Exam Operations)  
**Tài liệu liên quan**: [br-question-rubric.md](br-question-rubric.md) · [br-auth-rbac.md](br-auth-rbac.md) · [core-workflows.md](../core-workflows.md) · [lecturer.md (Page Maps)](../04-ui-ux-design/page-maps/lecturer.md)

---

## 1. Mục Đích & Bối Cảnh Nghiệp Vụ

Tài liệu này đặc tả quy trình tác nghiệp khép kín của **Giảng viên (Lecturer)** từ khi chuẩn bị học liệu môn học cho đến khi kích hoạt thành công một ca thi vấn đáp trực tuyến (Viva Exam).

### 1.1. Mục tiêu cốt lõi:

1. **Neo chặt tri thức vào giáo trình (Grounded Knowledge)**: Đảm bảo toàn bộ câu hỏi và đáp án mẫu được AI sinh ra từ slide/tài liệu bài giảng chính thống thông qua công nghệ **Google Cloud Vertex AI Managed RAG Engine**, loại bỏ hiện tượng ảo giác (hallucination) trong khảo thí.
2. **Kiểm soát chất lượng con người (Human-in-the-Loop - HITL)**: Giảng viên giữ quyền tối cao trong việc rà soát nội dung câu hỏi, điều chỉnh mức độ tư duy Bloom và thiết lập tiêu chí Rubric đạt chuẩn 100%.
3. **Cấu hình ca thi toàn diện & an toàn**: Khởi tạo ca thi với đầy đủ các ràng buộc vận hành (thời lượng, số câu hỏi chính, trần hỏi xoáy thích ứng, bộ từ khóa chuyên ngành cho STT, phân quyền thiết bị) và cấp phát cặp mã truy cập an toàn.

### 1.2. Các bên tham gia (Actors) & Thực thể CSDL:

- **Tác nhân chính**: `LECTURER` (Giảng viên phụ trách môn học), `ADMIN` (Quản trị viên có toàn quyền giám sát).
- **Thực thể dữ liệu**: `lessons`, `topics`, `materials`, `questions`, `rubrics`, `rubric_criteria`, `viva_exams`, `viva_exam_topics`, `viva_exam_questions`.

---

## 3. Đặc Tả Chi Tiết Từng Bước Tác Nghiệp & Quy Tắc Kiểm Tra

### 3.1. Bước 1: Nạp Học Liệu & Slide Môn Học (`/lecturer/materials`)

- **Mục tiêu**: Nạp giáo trình, bài giảng của giảng viên vào hệ thống lưu trữ đám mây và đưa vào kho ngữ liệu vector RAG.
- **Thao tác của Giảng viên**:
  1. Đăng nhập vào hệ thống với vai trò `LECTURER`, mở mục **Học liệu & Slide RAG** trên Sidebar dọc.
  2. Chọn Bài học (`lessonId`) và Chủ đề con (`topicId`) thuộc môn học mình phụ trách.
  3. Bấm "Tải tài liệu mới", chọn tệp từ máy tính và bấm "Tải lên".
- **Cơ chế xử lý hệ thống**:
  1. Tệp được đẩy trực tiếp lên **Google Cloud Storage (GCS)** tại bucket chuyên dụng theo đường dẫn phân tách theo môn học.
  2. Kích hoạt tiến trình bất đồng bộ của **Vertex AI RAG Engine**: bóc tách cấu trúc nội dung (LLM Parser), phân đoạn thành các chunk (1024 tokens, overlap 256 tokens) và tính vector embedding (`text-multilingual-embedding-002`) lưu vào RagManaged Cloud Spanner.
  3. Bản ghi tài liệu được tạo với trạng thái `INDEXING`.
- **Business Rules kiểm tra**:
  - `BR-AUTH-001`: Giảng viên chỉ được nạp tài liệu cho các môn học/lớp học phần được nhà trường phân công phụ trách.
  - `BR-MAT-001` (Ràng buộc tệp tài liệu):
    - Chỉ chấp nhận các định dạng tài liệu chuẩn: `.pdf`, `.pptx`, `.ppt`.
    - Dung lượng tệp tối đa không vượt quá **50MB**.
    - Tên tệp không chứa ký tự đặc biệt gây lỗi đường dẫn lưu trữ.
  - `BR-MAT-002` (Khởi tạo trạng thái RAG): Tài liệu mới tải lên luôn bắt đầu ở trạng thái `INDEXING`.

---

### 3.2. Bước 2: Xem & Quản Lý Trạng Thái Học Liệu Đã Nạp

- **Mục tiêu**: Giúp giảng viên nắm bắt toàn diện kho tài liệu đã nạp, kiểm tra tính sẵn sàng của ngữ liệu trước khi sinh câu hỏi.
- **Thao tác của Giảng viên**:
  1. Xem danh sách toàn bộ tài liệu đã tải lên kèm thông tin: Tên tệp gốc, kích thước, định dạng, bài học liên kết, ngày nạp và trạng thái RAG.
  2. Sử dụng bộ lọc để tra cứu nhanh theo Bài học hoặc Chủ đề.
  3. Trường hợp tài liệu báo lỗi (`FAILED`), giảng viên bấm nút **"Thử lại" (Re-index)** để hệ thống kích hoạt lại tiến trình lập chỉ mục.
- **Các trạng thái của học liệu (`materials.rag_status`)**:
  - `INDEXING` (Màu xanh dương xoay): Đang xử lý bóc tách và sinh vector trên GCP.
  - `READY` (Màu xanh lá): Lập chỉ mục thành công, tài liệu đã sẵn sàng được truy xuất ngữ nghĩa (Semantic Search).
  - `FAILED` (Màu đỏ): Quá trình xử lý gặp lỗi (file hỏng, lỗi mạng cloud).
- **Business Rules kiểm tra**:
  - `BR-MAT-003` (Điều kiện sử dụng học liệu): Chỉ những tài liệu có trạng thái `READY` mới được hiển thị trong danh sách tài liệu nguồn để phục vụ tính năng sinh câu hỏi tự động.
  - `BR-MAT-004` (Quyền quản trị tài liệu): Giảng viên chỉ có quyền sửa bài học liên kết hoặc xóa các tài liệu do chính mình tải lên (`lecturerId = current_user.id`).

---

### 3.3. Bước 3: Yêu Cầu AI Sinh Câu Hỏi Grounded Theo Thang Bloom (`/lecturer/questions`)

- **Mục tiêu**: Tự động hóa quá trình sinh câu hỏi thi vấn đáp dựa trên nội dung bài giảng thực tế, phân loại chính xác theo thang đo năng lực nhận thức.
- **Thao tác của Giảng viên**:
  1. Mở mục **Ngân hàng câu hỏi** trên Sidebar dọc.
  2. Bấm "Sinh câu hỏi bằng AI".
  3. Chọn Chủ đề (`topicId`) và tích chọn các tài liệu slide nguồn có trạng thái `READY`.
  4. Cấu hình số lượng câu hỏi cần sinh (ví dụ: 5 câu) và tỷ lệ mong muốn theo 4 cấp độ Bloom (`REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`).
  5. Bấm "Bắt đầu sinh đề".
- **Cơ chế xử lý hệ thống**:
  1. Backend gọi Vertex AI RAG Engine thực hiện tìm kiếm tương đồng vector trên Cloud Spanner để lấy các đoạn tri thức cốt lõi (Top-K chunks) từ slide đã chọn.
  2. Ghép ngữ cảnh tài liệu vào Prompt khuôn mẫu có ràng buộc JSON Schema gửi tới **Gemini 1.5 Flash**.
  3. Nhận về danh sách câu hỏi: nội dung hỏi (`content`), gợi ý đáp án mẫu (`model_answer`), từ khóa cần có (`expected_keywords`) và mức Bloom tương ứng. Số lượng câu hỏi của từng mức Bloom bám sát tỷ lệ phần trăm được cấu hình.
  4. Tự động sinh khung Rubric thích ứng với thang Bloom (tập trung vào mức độ nhận thức chủ đạo, tổng trọng số các tiêu chí luôn đúng 100%).
  5. Lưu toàn bộ câu hỏi vào bảng `questions` với trạng thái `DRAFT` và `source = AI_GENERATED`.
- **Business Rules kiểm tra**:
  - `BR-BANK-002` (Quy trình sinh câu hỏi AI): Mọi câu hỏi do AI sinh ra bắt buộc phải mang trạng thái ban đầu là `DRAFT`. Tuyệt đối không được gán thẳng trạng thái `APPROVED` hoặc đưa trực tiếp vào ca thi.
  - `BR-BANK-004` (Ràng buộc thang Bloom & Rubric thích ứng): Mỗi câu hỏi tạo ra bắt buộc phải thuộc một trong 4 mức Bloom hợp lệ (`REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`). Phân bổ số lượng câu hỏi phải tuân thủ chính xác tỷ lệ giảng viên đã thiết lập (nếu chọn 100% REMEMBER, toàn bộ câu hỏi sinh ra phải là REMEMBER). Rubric sinh ra phải có các tiêu chí đánh giá phù hợp với mức nhận thức đó.

---

### 3.4. Bước 4: Thẩm Định, Gán Rubric & Phê Duyệt Câu Hỏi

- **Mục tiêu**: Giảng viên kiểm soát chất lượng học thuật, hoàn thiện tiêu chí đánh giá minh bạch trước khi đưa vào ngân hàng đề thi chính thức.
- **Thao tác của Giảng viên**:
  1. Lọc danh sách câu hỏi theo trạng thái `DRAFT`.
  2. Đọc nội dung từng câu hỏi: chỉnh sửa câu từ cho chuẩn xác, điều chỉnh câu trả lời mẫu hoặc đổi cấp độ Bloom nếu thấy AI xếp chưa chuẩn.
  3. Gán Rubric đánh giá cho câu hỏi:
     - Chọn Rubric đã tạo sẵn từ trước, hoặc
     - Tạo nhanh một Rubric mới gồm các tiêu chí đánh giá cụ thể (ví dụ: Độ chính xác khái niệm, Khả năng mở rộng, Kỹ năng giải trình).
  4. Ra quyết định phê duyệt:
     - Bấm **Phê duyệt (`APPROVE`)** để chuyển trạng thái câu hỏi thành công.
     - Hoặc bấm **Từ chối / Xóa (`REJECT`)** nếu câu hỏi không đạt yêu cầu.
- **Business Rules kiểm tra (Ràng buộc cốt lõi)**:
  - `BR-BANK-001` (Ràng buộc bất biến của Rubric - Invariant Rule):
    - **CẤM PHÊ DUYỆT (`APPROVED`)** đối với bất kỳ câu hỏi nào nếu câu hỏi đó chưa được liên kết với một Rubric (`rubric_id IS NULL`).
    - **CẤM PHÊ DUYỆT** nếu Rubric liên kết chưa hoàn chỉnh, tức là tổng trọng số của các tiêu chí con khác $100\%$ ($\sum \text{weight} \neq 100\%$).
  - `BR-BANK-003` (Tiêu chuẩn Rubric cho AI chấm điểm): Mọi tiêu chí trong Rubric bắt buộc phải có mô tả rõ ràng về yêu cầu đạt điểm chuẩn để làm cơ sở cho AI chấm điểm minh bạch về sau, tránh tình trạng chấm điểm cảm tính.
  - `BR-BANK-005` (Tính hợp lệ đưa vào đề thi): Chỉ những câu hỏi ở trạng thái `APPROVED` mới đủ điều kiện xuất hiện trong danh sách câu hỏi được chọn khi thiết lập ca thi.

---

### 3.5. Bước 5: Khởi Tạo Ca Thi Vấn Đáp & Cấp Mã Truy Cập (`/exam-sessions`)

- **Mục tiêu**: Đóng gói bộ câu hỏi đã duyệt thành một kỳ thi vấn đáp hoàn chỉnh, cấu hình các luật chơi cho phòng thi và cấp phát mã truy cập cho sinh viên.
- **Thao tác của Giảng viên**:
  1. Mở mục **Phiên thi & Giám sát** trên Sidebar dọc.
  2. Bấm "Tạo ca thi mới" và điền các trường cấu hình:
     - **Tiêu đề ca thi**: Ví dụ `Kiểm tra Vấn đáp Lần 1 - Lớp SE1701`.
     - **Thời gian hiệu lực**: Thời điểm mở phòng và đóng phòng thi.
     - **Thời lượng làm bài (`duration_minutes`)**: Tổng thời gian tối đa cho 1 thí sinh (thường từ 15 - 30 phút).
     - **Số câu hỏi chính (`max_questions`)**: Số câu mỗi thí sinh phải trả lời (ví dụ: 3 câu).
     - **Giới hạn hỏi xoáy (`max_follow_up_per_question`)**: Số câu hỏi đào sâu tối đa cho mỗi câu hỏi chính (khuyến nghị: 1 - 2 lượt).
     - **Bộ từ khóa chuyên môn (`domain_keywords`)**: Danh sách từ khóa chuyên ngành (ví dụ: `polymorphism, encapsulation, postgresql, rest api, jwt`) giúp Google STT nhận dạng chính xác tiếng Việt kỹ thuật.
     - **Cho phép thi di động (`allow_mobile_exam`)**: Bật hoặc Tắt quyền thi qua ứng dụng điện thoại.
  3. Chọn danh sách câu hỏi hoặc chủ đề đưa vào ca thi (chỉ chọn từ danh sách câu hỏi đã `APPROVED`).
  4. Bấm "Hoàn tất tạo ca thi".
- **Cơ chế xử lý hệ thống**:
  1. Kiểm tra toàn bộ ràng buộc nghiệp vụ.
  2. Tự động sinh ngẫu nhiên:
     - `session_code`: Mã phòng thi công khai (ví dụ: `SWD392-SE1701`).
     - `access_code`: Mật mã truy cập bí mật dành riêng cho phiên thi (ví dụ: `VIVA@9842`).
  3. Ghi nhận ca thi vào bảng `viva_exams` ở trạng thái `SCHEDULED`.
  4. Giảng viên nhận được thông báo thành công và có thể sao chép cặp mã `session_code` + `access_code` để gửi cho sinh viên.
- **Business Rules kiểm tra**:
  - `BR-EXAM-001` (Số lượng câu hỏi tối thiểu của ca thi): Tổng số câu hỏi `APPROVED` được gán vào ca thi phải **lớn hơn hoặc bằng** số câu hỏi yêu cầu trong một lượt thi (`COUNT(assigned_approved_questions) >= max_questions`). Nếu không đủ số câu hỏi, hệ thống chặn tạo ca thi.
  - `BR-EXAM-002` (Ràng buộc thời gian ca thi): Thời gian kết thúc ca thi phải diễn ra sau thời gian bắt đầu tối thiểu bằng đúng `duration_minutes`.
  - `BR-EXAM-003` (Bảo mật mã phòng & mã truy cập):
    - `session_code` là duy nhất trên toàn hệ thống trong cùng một học kỳ.
    - `access_code` được bảo mật ở mức độ cao, chỉ hiển thị cho Giảng viên tạo ca thi; hệ thống từ chối mọi yêu cầu tham gia phòng thi của sinh viên nếu sai cặp mã này.

---

## 4. Bảng Vòng Đời Trạng Thái Của Các Thực Thể Liên Quan

### 4.1. Vòng đời Học liệu (`materials.rag_status`):

| Trạng thái | Ý nghĩa                                 | Hành động tiếp theo                         |
| :--------- | :-------------------------------------- | :------------------------------------------ |
| `INDEXING` | Đang tải lên GCS và chạy embedding RAG  | Chờ hoàn tất (thường 10 - 60 giây).         |
| `READY`    | Lập chỉ mục thành công                  | Có thể dùng để sinh câu hỏi AI.             |
| `FAILED`   | Lỗi trong quá trình bóc tách/vector hóa | Bấm "Thử lại (Re-index)" hoặc xóa tài liệu. |

### 4.2. Vòng đời Câu hỏi (`questions.status`):

| Trạng thái | Ý nghĩa                                     | Ràng buộc nghiệp vụ                                       |
| :--------- | :------------------------------------------ | :-------------------------------------------------------- |
| `DRAFT`    | Câu hỏi nháp do AI sinh ra hoặc GV soạn thô | **CẤM** đưa vào đề thi. Cần gán Rubric 100% để duyệt.     |
| `APPROVED` | Đã kiểm duyệt và gắn Rubric 100% hợp lệ     | **Đủ điều kiện** đưa vào ca thi.                          |
| `REJECTED` | Câu hỏi không đạt chất lượng học thuật      | Ẩn khỏi danh sách lựa chọn đề thi.                        |
| `ARCHIVED` | Câu hỏi cũ đã lưu trữ qua các kỳ            | Chỉ dùng để tham khảo lịch sử, không dùng cho ca thi mới. |

### 4.3. Vòng đời Ca thi (`viva_exams.status`):

| Trạng thái  | Ý nghĩa                                       | Hành vi hệ thống                                                             |
| :---------- | :-------------------------------------------- | :--------------------------------------------------------------------------- |
| `SCHEDULED` | Ca thi đã tạo, chưa đến giờ mở                | Sinh viên chưa thể bắt đầu làm bài.                                          |
| `OPEN`      | Ca thi đang trong thời gian diễn ra           | Sinh viên nhập mã hợp lệ có thể vào làm bài.                                 |
| `CLOSED`    | Hết thời gian thi                             | Chặn mọi lượt vào thi mới; chuyển sang giai đoạn chấm điểm & thẩm định HITL. |
| `ARCHIVED`  | Đã công bố điểm toàn bộ và hoàn tất phúc khảo | Đóng vĩnh viễn dữ liệu học thuật của ca thi.                                 |

---

## 5. Tóm Tắt Trách Nhiệm Đảm Bảo Chất Lượng (QA Checklist cho Luồng Này)

Khi thực hiện kiểm thử tự động (Integration Test) hoặc kiểm thử người dùng (UAT) cho luồng này, bắt buộc phải thỏa mãn các tiêu chí sau:

- [ ] Không cho phép tải lên file không phải `.pptx, .ppt, .pdf` hoặc dung lượng $> 50\text{MB}$.
- [ ] Không cho phép sinh câu hỏi từ tài liệu chưa chuyển sang `READY`.
- [ ] Mọi câu hỏi do AI sinh ra phải bắt đầu ở trạng thái `DRAFT` và có `source = AI_GENERATED`.
- [ ] Không thể bấm "Phê duyệt" câu hỏi nếu chưa có Rubric hoặc tổng trọng số Rubric $\neq 100\%$.
- [ ] Không thể tạo ca thi nếu số lượng câu hỏi `APPROVED` được chọn nhỏ hơn `max_questions`.
- [ ] Mã `session_code` và `access_code` được sinh tự động và lưu trữ chính xác vào CSDL.
