# Domain Interface: Course Content, Single Rubric & Shared Question Bank (CONTENT)

## 1. Domain Overview and Responsibilities
The Content domain governs academic structures (`Course`, `Chapter`), curriculum materials (`Material`), RAG knowledge indexing, single course-level evaluation criteria (`Rubric`, `RubricCriteria`), shared question banks (`Question`), and academic audit trails (`AcademicAuditLog`).

### Invariants:
1. **Course Single Rubric Invariant (`BR-BANK-001`)**: Mỗi môn học (`Course`) chỉ có duy nhất 1 bộ Rubric đánh giá chuẩn. Tổng trọng số ($\sum \text{weight\_percent}$) của toàn bộ tiêu chí trong Rubric bắt buộc bằng đúng $100\%$.
2. **Rubric Immutability Lock (`BR-BANK-006`)**: Khi môn học đã có ít nhất một ca thi chuyển sang trạng thái đang mở (`OPEN`) hoặc đã kết thúc (`CLOSED`, `ARCHIVED`), toàn bộ cấu trúc Rubric sẽ bị khóa cứng (`is_locked = true`), cấm mọi hành vi cập nhật hoặc xóa tiêu chí.
3. **Question Approval Gate (`BR-BANK-001`)**: Hệ thống nghiêm cấm phê duyệt câu hỏi (`DRAFT -> APPROVED`) nếu môn học chưa có bộ Rubric hoàn chỉnh đạt tổng trọng số $100\%$.
4. **Intuitive Difficulty Invariant (`BR-BANK-004`)**: Câu hỏi được phân loại theo 3 mức độ trực quan: `EASY` (Dễ), `MEDIUM` (Trung bình), `HARD` (Khó). Thang đo Bloom cũ bị bãi bỏ hoàn toàn.
5. **RAG Question Generation Scope (`BR-BANK-002`)**: Bộ máy RAG chỉ sinh câu hỏi (`content`), mức độ khó (`difficulty`), gợi ý đáp án (`model_answer`) và từ khóa (`expected_keywords`). **RAG tuyệt đối không sinh Rubric**. Câu hỏi AI sinh ra mặc định mang trạng thái `DRAFT` và tự động gắn với Rubric chuẩn của môn học.
6. **Multi-Lecturer Collaboration (`BR-BANK-005`)**: Ngân hàng câu hỏi theo từng Chương là tài nguyên dùng chung giữa tất cả giảng viên được phân công giảng dạy môn học đó. Giảng viên tạo câu hỏi DRAFT có quyền chỉnh sửa/duyệt câu hỏi của mình, và các giảng viên khác cùng dạy môn học cũng có quyền xem và tham gia duyệt.
7. **Audit Trail Mandate (`BR-BANK-007`)**: Mọi hoạt động thêm, sửa, xóa, duyệt câu hỏi và cập nhật Rubric đều phải ghi log bất đồng bộ vào MongoDB collection `academic_audit_logs`.

---

## 2. Implementations and Child Specifications
- Data Persistence Dictionary: `document/ERD/03-physical-erd.md`
- API Specification: `document/05-api-specs/openapi-spec.yaml`
- API Guidelines: `document/05-api-specs/api-guidelines.md`
- Business Rules: `document/01-business-rule/br-question-rubric.md`
- Operational Workflow: `document/01-business-rule/lecturer-exam-prep-flow.md`
- Backend Implementation:
  - Controllers:
    - `com.aives.modules.content.controller.CourseRubricController`
    - `com.aives.modules.content.controller.ChapterController`
    - `com.aives.modules.content.controller.MaterialController`
    - `com.aives.modules.content.controller.QuestionBankController`
    - `com.aives.modules.content.controller.AcademicAuditLogController`
  - Services:
    - `com.aives.modules.content.service.CourseRubricService`
    - `com.aives.modules.content.service.ChapterService`
    - `com.aives.modules.content.service.MaterialService`
    - `com.aives.modules.content.service.RagQuestionGenerationService`
    - `com.aives.modules.content.service.QuestionBankService`
    - `com.aives.modules.content.service.AcademicAuditLogService`
- Frontend Implementation:
  - Generated Client: `aives-frontend/src/generated/api/endpoints/content.ts`
  - Features:
    - `aives-frontend/src/features/courses/`
    - `aives-frontend/src/features/chapters/`
    - `aives-frontend/src/features/materials/`
    - `aives-frontend/src/features/questions/`
    - `aives-frontend/src/features/rubric/`

---

## 3. Domain Enums and Lifecycles

### 3.1 Enums

#### Enum: `QuestionDifficulty`
- `EASY`: Mức độ nhận biết và thông hiểu cơ bản.
- `MEDIUM`: Mức độ vận dụng kiến thức, giải quyết tình huống kỹ thuật.
- `HARD`: Mức độ phân tích sâu, so sánh kiến trúc và xử lý vấn đề phức tạp.

#### Enum: `QuestionStatus`
- `DRAFT`: Câu hỏi nháp (do AI sinh ra hoặc GV soạn thô). Chưa được đưa vào đề thi.
- `APPROVED`: Đã được giảng viên thẩm định và duyệt. Đủ điều kiện đưa vào ca thi.
- `REJECTED`: Câu hỏi bị từ chối do không đạt chất lượng.
- `ARCHIVED`: Câu hỏi lưu trữ lịch sử, không dùng cho ca thi mới.

#### Enum: `QuestionSource`
- `MANUAL`: Do giảng viên soạn thảo thủ công.
- `AI_GENERATED`: Do bộ máy RAG sinh ra từ slide/giáo trình.

#### Enum: `MaterialRagStatus`
- `INDEXING`: Đang upload GCS và bóc tách vector embedding trên GCP.
- `READY`: Đã lập chỉ mục xong, sẵn sàng dùng làm ngữ cảnh sinh câu hỏi.
- `FAILED`: Lỗi bóc tách hoặc kết nối GCP.

#### Enum: `AuditAction`
- `CREATE_QUESTION`
- `AI_GENERATE_QUESTION`
- `UPDATE_QUESTION`
- `APPROVE_QUESTION`
- `REJECT_QUESTION`
- `DELETE_QUESTION`
- `UPDATE_RUBRIC`

---

## 4. Shared Models and DTO Specifications

### 4.1 RubricCriteriaDto
- `id` (string, optional): Mã tiêu chí (nếu cập nhật).
- `name` (string, required, maxLength: 200): Tên tiêu chí.
- `description` (string, required): Tiêu chuẩn chi tiết để đạt điểm.
- `weightPercent` (number, required, min: 0.01, max: 100.00): Trọng số phần trăm.
- `orderNo` (integer, required, min: 1): Thứ tự hiển thị.

### 4.2 CourseRubricResponse
- `id` (string, required): Mã rubric.
- `courseId` (string, required): Mã môn học.
- `name` (string, required): Tên bộ rubric.
- `description` (string, nullable): Mô tả khung rubric.
- `maxScore` (number, required, default: 10.0): Điểm tối đa.
- `isLocked` (boolean, required): Cờ khóa chỉnh sửa khi có ca thi OPEN/CLOSED.
- `criteria` (array of RubricCriteriaDto, required): Danh sách tiêu chí con.
- `createdAt` (string, required, format: date-time)
- `updatedAt` (string, required, format: date-time)

### 4.3 UpdateCourseRubricRequest
- `name` (string, required, maxLength: 200): Tên bộ rubric.
- `description` (string, nullable): Mô tả rubric.
- `criteria` (array of RubricCriteriaDto, required, minItems: 1): Danh sách tiêu chí con. $\sum \text{weightPercent} = 100\%$.

### 4.4 DifficultyRatioConfig
- `easyPercent` (integer, required, min: 0, max: 100): Tỷ lệ câu hỏi Dễ.
- `mediumPercent` (integer, required, min: 0, max: 100): Tỷ lệ câu hỏi Trung bình.
- `hardPercent` (integer, required, min: 0, max: 100): Tỷ lệ câu hỏi Khó.
*Constraint: easyPercent + mediumPercent + hardPercent = 100*.

### 4.5 GenerateQuestionsRequest
- `materialIds` (array of string, required, minItems: 1): Danh sách ID tài liệu `READY` của Chương làm ngữ cảnh RAG.
- `totalQuestions` (integer, required, min: 1, max: 50): Tổng số câu hỏi cần sinh.
- `difficultyRatio` (DifficultyRatioConfig, required): Tỷ lệ phân bổ độ khó.

### 4.6 QuestionResponse
- `id` (string, required): Mã câu hỏi.
- `chapterId` (string, required): Mã chương.
- `courseId` (string, required): Mã môn học.
- `content` (string, required): Nội dung câu hỏi.
- `difficulty` (QuestionDifficulty, required): Độ khó (`EASY`, `MEDIUM`, `HARD`).
- `modelAnswer` (string, nullable): Gợi ý đáp án chuẩn.
- `expectedKeywords` (array of string, required): Danh sách từ khóa chuyên ngành.
- `source` (QuestionSource, required): `MANUAL` hoặc `AI_GENERATED`.
- `status` (QuestionStatus, required): `DRAFT`, `APPROVED`, `REJECTED`, `ARCHIVED`.
- `createdBy` (string, required): Mã giảng viên khởi tạo.
- `creatorName` (string, required): Họ tên giảng viên.
- `createdAt` (string, required, format: date-time)
- `updatedAt` (string, required, format: date-time)

### 4.7 CreateQuestionRequest
- `content` (string, required): Nội dung câu hỏi.
- `difficulty` (QuestionDifficulty, required): Độ khó (`EASY`, `MEDIUM`, `HARD`).
- `modelAnswer` (string, nullable): Đáp án mẫu.
- `expectedKeywords` (array of string, required): Mảng từ khóa.

### 4.8 UpdateQuestionRequest
- `content` (string, required): Nội dung câu hỏi.
- `difficulty` (QuestionDifficulty, required): Độ khó (`EASY`, `MEDIUM`, `HARD`).
- `modelAnswer` (string, nullable): Đáp án mẫu.
- `expectedKeywords` (array of string, required): Mảng từ khóa.

### 4.9 AcademicAuditLogResponse
- `id` (string, required): ID bản ghi MongoDB.
- `courseId` (string, required): Mã môn học.
- `chapterId` (string, nullable): Mã chương.
- `actorId` (string, required): Mã người thực hiện.
- `actorName` (string, required): Tên người thực hiện.
- `action` (AuditAction, required): Hành động.
- `targetEntity` (string, required): `QUESTION` hoặc `RUBRIC`.
- `targetId` (string, required): ID thực thể tác động.
- `details` (object, required): Thông tin chi tiết trước/sau khi thay đổi.
- `createdAt` (string, required, format: date-time): Thời điểm ghi nhận.

---

## 5. Domain Service Contracts

```java
public interface ICourseRubricService {
    CourseRubricResponse getRubricByCourseId(String courseId);
    CourseRubricResponse updateRubric(String courseId, UpdateCourseRubricRequest request, String lecturerId);
    boolean isRubricReadyForGrading(String courseId);
}

public interface IChapterService {
    List<ChapterResponse> getChaptersByCourseId(String courseId);
    ChapterResponse createChapter(String courseId, CreateChapterRequest request);
}

public interface IMaterialService {
    List<MaterialResponse> getMaterialsByChapterId(String chapterId);
    MaterialResponse uploadMaterial(String chapterId, MultipartFile file, String lecturerId);
    void triggerReindex(String materialId, String lecturerId);
}

public interface IRagQuestionGenerationService {
    List<QuestionResponse> generateQuestions(String chapterId, GenerateQuestionsRequest request, String lecturerId);
}

public interface IQuestionBankService {
    Page<QuestionResponse> getQuestions(String chapterId, QuestionFilter filter, Pageable pageable);
    QuestionResponse createManualQuestion(String chapterId, CreateQuestionRequest request, String lecturerId);
    QuestionResponse updateQuestion(String questionId, UpdateQuestionRequest request, String lecturerId);
    QuestionResponse approveQuestion(String questionId, String lecturerId);
    QuestionResponse rejectQuestion(String questionId, String reason, String lecturerId);
    void deleteQuestion(String questionId, String lecturerId);
}

public interface IAcademicAuditLogService {
    void logActivity(AcademicAuditLog log);
    Page<AcademicAuditLogResponse> getLogsByCourse(String courseId, Pageable pageable);
}
```
