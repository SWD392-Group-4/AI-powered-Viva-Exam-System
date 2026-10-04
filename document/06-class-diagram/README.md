# Class Diagram - AIVES (AI-powered Viva Exam System)

> **Hệ thống**: AI-powered Viva Exam System (AIVES)  
> **Mục đích**: Mô tả cấu trúc lớp đối tượng của hệ thống, bao gồm **Domain Entity Model** (16 thực thể JPA ánh xạ CSDL) và **Layered Architecture Model** (Controller → Service → Repository → DTO).  
> **Mã nguồn Mermaid**: [class-diagram.mmd](class-diagram.mmd)  
> **Triển khai**: Đã triển khai đầy đủ trong `aives-backend` sử dụng Java 17, Spring Boot 3 và Hibernate JPA.

---

## 1. Sơ đồ Lớp miền Nghiệp vụ (Domain Entities Class Diagram)

Sơ đồ thể hiện toàn bộ các thực thể JPA, các thuộc tính chính, kiểu dữ liệu, các Enum và mối quan hệ giữa các thực thể:

```mermaid
classDiagram
    direction TB

    %% ===== ENUMS =====
    class Role {
        <<enumeration>>
        ADMIN
        LECTURER
        STUDENT
    }

    class BloomLevel {
        <<enumeration>>
        REMEMBER
        UNDERSTAND
        APPLY
        ANALYZE
    }

    class QuestionSource {
        <<enumeration>>
        MANUAL
        AI_GENERATED
    }

    class QuestionStatus {
        <<enumeration>>
        DRAFT
        APPROVED
        REJECTED
        ARCHIVED
    }

    class AttemptStatus {
        <<enumeration>>
        NOT_STARTED
        IN_PROGRESS
        COMPLETED
        ABANDONED
    }

    class ResultStatus {
        <<enumeration>>
        NONE
        GRADING
        PENDING_REVIEW
        GRADING_FAILED
        PUBLISHED
    }

    class AiDecision {
        <<enumeration>>
        FOLLOW_UP
        NEXT
        SKIPPED
    }

    class GradeStatus {
        <<enumeration>>
        AI_DRAFT
        APPROVED
        FAILED
    }

    class AppealStatus {
        <<enumeration>>
        PENDING
        ACCEPTED
        REJECTED
    }

    %% ===== ENTITIES =====
    class User {
        +String id
        +String email
        +String passwordHash
        +String fullName
        +Role role
        +Boolean isActive
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class Lesson {
        +String id
        +String title
        +String description
        +User lecturer
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class Topic {
        +String id
        +String name
        +String description
        +Lesson lesson
    }

    class Rubric {
        +String id
        +String name
        +String description
        +BigDecimal maxScore
        +User createdBy
        +LocalDateTime createdAt
    }

    class RubricCriterion {
        +String id
        +String name
        +String description
        +BigDecimal weightPercent
        +Integer orderNo
        +Rubric rubric
    }

    class Question {
        +String id
        +String content
        +BloomLevel bloomLevel
        +String modelAnswer
        +String expectedKeywords
        +QuestionSource source
        +QuestionStatus status
        +String questionAudioKey
        +Topic topic
        +Rubric rubric
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class VivaExam {
        +String id
        +String title
        +String description
        +String passcode
        +Integer durationMinutes
        +Integer maxFollowUpPerQuestion
        +Integer prepareSeconds
        +Integer answerSeconds
        +String domainKeywords
        +LocalDateTime startAt
        +LocalDateTime endAt
        +LocalDateTime cancelledAt
        +User lecturer
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class VivaExamQuestion {
        +String id
        +Integer orderNo
        +BigDecimal weight
        +VivaExam exam
        +Question question
    }

    class VivaAttempt {
        +String id
        +AttemptStatus status
        +ResultStatus resultStatus
        +BigDecimal totalAiScore
        +BigDecimal totalFinalScore
        +String fullAudioKey
        +LocalDateTime startedAt
        +LocalDateTime deadlineAt
        +LocalDateTime completedAt
        +LocalDateTime publishedAt
        +VivaExam exam
        +User student
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class InterviewExchange {
        +String id
        +Integer depth
        +String questionText
        +String questionAudioKey
        +String transcript
        +String answerAudioKey
        +String followUpReason
        +AiDecision aiDecision
        +String aiDecisionReason
        +LocalDateTime answerStartedAt
        +LocalDateTime answerEndedAt
        +Integer latencyMs
        +VivaAttempt attempt
        +VivaExamQuestion examQuestion
        +InterviewExchange parentExchange
        +LocalDateTime createdAt
    }

    class QuestionGrade {
        +String id
        +BigDecimal aiScore
        +BigDecimal finalScore
        +String aiStrengths
        +String aiWeaknesses
        +String aiFeedback
        +String lecturerNote
        +GradeStatus status
        +User gradedBy
        +LocalDateTime gradedAt
        +VivaAttempt attempt
        +VivaExamQuestion examQuestion
        +LocalDateTime createdAt
    }

    class CriteriaGrade {
        +String id
        +BigDecimal aiScore
        +BigDecimal finalScore
        +String evidenceQuote
        +String rationale
        +QuestionGrade questionGrade
        +RubricCriterion criterion
    }

    class GradeAppeal {
        +String id
        +String reason
        +AppealStatus status
        +BigDecimal scoreBefore
        +BigDecimal scoreAfter
        +String response
        +User resolvedBy
        +LocalDateTime resolvedAt
        +QuestionGrade questionGrade
        +LocalDateTime createdAt
    }

    class BackgroundJob {
        +String id
        +String jobType
        +String payload
        +String status
        +Integer attempts
        +LocalDateTime nextRunAt
        +String lastError
        +LocalDateTime createdAt
    }

    class AuditLog {
        +String id
        +String action
        +String entityType
        +String entityId
        +String oldValue
        +String newValue
        +User actor
        +LocalDateTime createdAt
    }

    class SystemSetting {
        +String settingKey
        +String settingValue
        +User updatedBy
        +LocalDateTime updatedAt
    }

    %% ===== RELATIONSHIPS =====
    User "1" <-- "*" Lesson : manages
    Lesson "1" *-- "*" Topic : contains
    Topic "1" <-- "*" Question : classifies
    User "1" <-- "*" Rubric : creates
    Rubric "1" *-- "*" RubricCriterion : defines
    Rubric "0..1" <-- "*" Question : evaluated_by
    User "1" <-- "*" VivaExam : hosts
    VivaExam "1" *-- "*" VivaExamQuestion : includes
    Question "1" <-- "*" VivaExamQuestion : references
    VivaExam "1" <-- "*" VivaAttempt : provides
    User "1" <-- "*" VivaAttempt : submits
    VivaAttempt "1" *-- "*" InterviewExchange : records
    VivaExamQuestion "1" <-- "*" InterviewExchange : prompts
    InterviewExchange "0..1" <-- "*" InterviewExchange : follow_up_to
    VivaAttempt "1" *-- "*" QuestionGrade : scores
    VivaExamQuestion "1" <-- "*" QuestionGrade : evaluates
    User "0..1" <-- "*" QuestionGrade : graded_by
    QuestionGrade "1" *-- "*" CriteriaGrade : details
    RubricCriterion "1" <-- "*" CriteriaGrade : criteria
    QuestionGrade "1" <-- "*" GradeAppeal : appeals
    User "0..1" <-- "*" GradeAppeal : resolved_by
    User "0..1" <-- "*" AuditLog : records_action_of
    User "0..1" <-- "*" SystemSetting : configured_by
```

---

## 2. Đặc tả các gói và lớp Entity theo Mô-đun Backend

### 2.1. Gói `com.aives.modules.auth`
- **`User`**: Đại diện cho người dùng hệ thống (Admin, Giảng viên, Sinh viên).
- **`Role`**: Enum phân quyền: `ADMIN`, `LECTURER`, `STUDENT`.

### 2.2. Gói `com.aives.modules.content`
- **`Lesson`**: Bài học do Giảng viên quản lý.
- **`Topic`**: Chủ đề kiến thức trực thuộc bài học.
- **`Rubric`**: Ma trận thang điểm dùng để hướng dẫn AI và Giảng viên đánh giá.
- **`RubricCriterion`**: Tiêu chí chấm chi tiết, có trọng số phần trăm (`weightPercent`, tổng = 100%).
- **`Question`**: Câu hỏi trong ngân hàng câu hỏi; phân loại theo `bloomLevel` (Nhận biết, Thông hiểu, Vận dụng, Phân tích) và trạng thái duyệt `status`.

### 2.3. Gói `com.aives.modules.exam`
- **`VivaExam`**: Phiên thi vấn đáp trực tuyến do Giảng viên hoặc Admin mở. Khóa chính `viva_exams_id` (độ dài 30) đồng thời là mã phòng thi. Chứa tham số cấu hình: `durationMinutes`, `prepareSeconds`, `answerSeconds`, `maxFollowUpPerQuestion`, `domainKeywords`.
- **`VivaExamQuestion`**: Bảng quan hệ N-N gắn câu hỏi vào đề thi với thứ tự `orderNo` và hệ số điểm `weight`.
- **`VivaAttempt`**: Lượt thi của từng sinh viên trong phiên, lưu trữ hạn chốt nộp bài (`deadlineAt`), điểm AI chấm (`totalAiScore`), điểm duyệt cuối (`totalFinalScore`) và file audio toàn bài (`fullAudioKey`).

### 2.4. Gói `com.aives.modules.vivaroom`
- **`InterviewExchange`**: Mỗi lượt hỏi - đáp giữa AI và Thí sinh.
  - Hỗ trợ quan hệ tự tham chiếu (`parentExchange`): Khi thí sinh trả lời chưa rõ ràng, AI quyết định sinh câu hỏi xoáy (`depth > 0`), liên kết trực tiếp với câu hỏi gốc (`depth = 0`).
  - Ghi nhận độ trễ (`latencyMs`), thời gian trả lời (`answerStartedAt`, `answerEndedAt`), tệp âm thanh câu hỏi TTS và câu trả lời STT.

### 2.5. Gói `com.aives.modules.grading`
- **`QuestionGrade`**: Điểm số và nhận xét điểm mạnh/yếu của AI cho từng câu hỏi trong bài thi.
- **`CriteriaGrade`**: Điểm chi tiết cho từng tiêu chí của Rubric kèm đoạn trích bằng chứng thực tế (`evidenceQuote`) lấy từ câu trả lời của thí sinh.
- **`GradeAppeal`**: Đơn khiếu nại/phúc khảo điểm của sinh viên và quyết định phê duyệt của giảng viên.

### 2.6. Gói `com.aives.modules.system`
- **`BackgroundJob`**: Hàng đợi các tác vụ bất đồng bộ (chấm điểm AI, đồng bộ audio S3/GCS).
- **`AuditLog`**: Nhật ký lưu vết mọi thao tác nhạy cảm (sửa điểm, duyệt bài, đổi trạng thái).
- **`SystemSetting`**: Cấu hình toàn hệ thống dạng Key - Value.

---

## 3. Sơ đồ Kiến trúc Phân tầng (Layered Class Diagram)

Sơ đồ thể hiện cách các lớp trong Backend phối hợp theo mô hình chuẩn **Controller → Service → Repository → Database**:

```mermaid
classDiagram
    direction LR

    class ExamSessionController {
        -ExamSessionService examSessionService
        +createSession(request, principal) ApiResponse
        +getSessions(status, keyword, page, size, principal) ApiResponse
        +getSession(id, principal) ApiResponse
        +updateSession(id, request, principal) ApiResponse
        +deleteSession(id, principal) ApiResponse
        +regeneratePasscode(id, principal) ApiResponse
    }

    class ExamSessionService {
        <<interface>>
        +createSession(request, principal) ExamSessionResponse
        +getSessions(principal, status, keyword, page, size) PageResponse
        +getSession(id, principal) ExamSessionResponse
        +updateSession(id, request, principal) ExamSessionResponse
        +deleteSession(id, principal) DeleteExamSessionResponse
        +regeneratePasscode(id, principal) ExamSessionResponse
    }

    class ExamSessionServiceImpl {
        -VivaExamRepository vivaExamRepo
        -UserRepository userRepo
        -VivaAttemptRepository vivaAttemptRepo
    }

    class VivaExamRepository {
        <<interface>>
        +findByLecturerId(lecturerId, pageable) Page
        +searchSessions(lecturerId, keyword, pageable) Page
        +existsByPasscode(passcode) boolean
    }

    class VivaExam {
        <<Entity>>
    }

    ExamSessionController ..> ExamSessionService : invokes
    ExamSessionServiceImpl ..|> ExamSessionService : implements
    ExamSessionServiceImpl ..> VivaExamRepository : uses
    VivaExamRepository ..> VivaExam : manages
```
