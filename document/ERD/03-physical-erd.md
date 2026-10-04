# Physical ERD - AIVES (Supabase PostgreSQL & SQL Server)

> **Mức**: Physical - bảng thật trên **Supabase PostgreSQL** (PostgreSQL 17.x, Cloud Managed) & tương thích **Microsoft SQL Server**: tên bảng, kiểu cột, NULL, khoá, ràng buộc, index.  
> **Mã nguồn**: [physical-erd.mmd](physical-erd.mmd)  
> **Đi từ**: [02-logical-erd.md](02-logical-erd.md)  
> **Triển khai**: Đã hoàn thành 100% Code-First qua **Spring Data JPA** trong repository `aives-backend`.

---

## 1. Sơ đồ

![Physical ERD](images/physical-erd.png)

---

## 2. Quy ước & Ánh xạ kiểu dữ liệu

| Hạng mục | Quy ước logic | PostgreSQL (Supabase) | SQL Server | Ghi chú / Lý do |
| :--- | :--- | :--- | :--- | :--- |
| Tên bảng / cột | `snake_case`, tên bảng số nhiều (`viva_attempts`) | `snake_case` | `snake_case` | Thống nhất, tương thích Hibernate JPA naming strategy |
| Khoá chính | Cột `<tên bảng>_id` (vd `users_id`, `viva_attempts_id`); BE sinh | `VARCHAR(20)` | `NVARCHAR(20)` | Mỗi bảng có tên PK riêng. Riêng `viva_exams_id` là `VARCHAR(30)` |
| Khoá ngoại | Tên trùng PK được trỏ tới | `VARCHAR(20)` / `VARCHAR(30)` | `NVARCHAR(20)` / `NVARCHAR(30)` | Nhìn tên cột nhận diện ngay bảng cha |
| Khoá ngoại theo vai trò | Giữ tên vai trò: `lecturer_id`, `student_id`, `created_by`, `graded_by`, `resolved_by`, `actor_id`, `updated_by`, `parent_exchange_id` | `VARCHAR(20)` | `NVARCHAR(20)` | Trỏ tới `users` hoặc tự tham chiếu nhiều ý nghĩa |
| Chuỗi Unicode | Chuỗi ngắn / dài | `VARCHAR(n)` / `TEXT` | `NVARCHAR(n)` / `NVARCHAR(MAX)` | Lưu tiếng Việt có dấu, mô tả, transcript |
| Enum | Chuỗi ngắn + CHECK constraint | `VARCHAR(20)` + `CHECK` | `NVARCHAR(20)` + `CHECK` | Độc lập nền tảng, dễ migrate |
| Điểm số / Trọng số | Số thập phân có độ chính xác | `NUMERIC(5,2)` / `NUMERIC(6,2)` | `DECIMAL(5,2)` / `DECIMAL(6,2)` | Thang 10; tổng điểm 6 chữ số, không bị làm tròn |
| Thời gian | Ngày giờ kèm timezone | `TIMESTAMPTZ` / `TIMESTAMP` | `DATETIME` / `DATETIME2` | Lưu giờ UTC chuẩn quốc tế |
| Đúng / sai | Logic boolean | `BOOLEAN` (`TRUE`/`FALSE`) | `BIT` (`1`/`0`) | Map trực tiếp sang `java.lang.Boolean` trong JPA |
| Xoá dữ liệu | Không dùng `CASCADE`; dữ liệu chỉ chuyển trạng thái | Soft status / archive | Soft status / archive | Tránh xóa nhầm dữ liệu lịch sử thi |
| Unique cho phép NULL | Cho phép nhiều dòng NULL | Mặc định ANSI SQL | Filtered index `WHERE col IS NOT NULL` | PostgreSQL cho phép nhiều NULL trong UNIQUE theo chuẩn SQL |

---

## 3. Mapping Logical → Physical

| Logical | Physical | Thay đổi |
| :--- | :--- | :--- |
| `LECTURER`, `STUDENT` | `users` | Gộp 2 thực thể, thêm `role` (`ADMIN` / `LECTURER` / `STUDENT`). Không có cột mã số sinh viên: sinh viên được nhận diện bằng `users_id` dạng `STxxxxxx`. |
| `<entity>_id` | `<tên bảng>_id` | PK đặt theo tên bảng (số nhiều): `VIVA_EXAM.viva_exam_id` ở Logical → `viva_exams_id`. FK trỏ tới bảng đó dùng lại đúng tên này |
| `attempt_id` (PK / FK) | `viva_attempts_id` | Đổi tên cho rõ nghĩa |
| `criteria_id` (FK) | `rubric_criteria_id` | Đổi tên cho rõ nghĩa |
| `RUBRIC` | `rubrics` | Thêm `created_by`, `created_at` (cột audit, không phải quan hệ ERD) |
| `INTERVIEW_EXCHANGE` | `interview_exchanges` | Thêm `question_audio_key`, `answer_audio_key`, `ai_decision_reason`, `answer_started_at`, `answer_ended_at` |
| `QUESTION_GRADE` | `question_grades` | Thêm `ai_strengths`, `ai_weaknesses` (`BR-GRADE-001`) |
| – | `background_jobs`, `audit_logs`, `system_settings` | Bảng hệ thống mới |
| – | `created_at`, `updated_at` | Cột thời gian ở hầu hết các bảng |

---

## 4. Đặc tả bảng

### 4.1. Bảng nghiệp vụ

#### `users`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `users_id` | NVARCHAR(20) | | PK |
| `email` | NVARCHAR(255) | | UNIQUE |
| `password_hash` | NVARCHAR(255) | | |
| `full_name` | NVARCHAR(150) | | |
| `role` | NVARCHAR(20) | | CHECK `ADMIN`, `LECTURER`, `STUDENT` |
| `is_active` | BIT | | DEFAULT 1 |
| `created_at` | DATETIME | | DEFAULT GETDATE() |
| `updated_at` | DATETIME | | DEFAULT GETDATE() |

Giá trị `users_id`: 2 chữ cái theo vai trò + 6 chữ số ngẫu nhiên (`ADxxxxxx`, `LExxxxxx`, `STxxxxxx`).

#### `lessons`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `lessons_id` | NVARCHAR(20) | | PK |
| `lecturer_id` | NVARCHAR(20) | | FK → `users.users_id` |
| `title` | NVARCHAR(200) | | |
| `description` | NVARCHAR(MAX) | ✓ | |
| `created_at` | DATETIME | | DEFAULT GETDATE() |
| `updated_at` | DATETIME | ✓ | |

#### `topics`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `topics_id` | NVARCHAR(20) | | PK |
| `lessons_id` | NVARCHAR(20) | | FK → `lessons.lessons_id` |
| `name` | NVARCHAR(200) | | |
| `description` | NVARCHAR(MAX) | ✓ | |

#### `rubrics`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `rubrics_id` | NVARCHAR(20) | | PK |
| `created_by` | NVARCHAR(20) | | FK → `users.users_id` |
| `name` | NVARCHAR(200) | | |
| `description` | NVARCHAR(MAX) | ✓ | |
| `max_score` | DECIMAL(5,2) | | DEFAULT 10 |
| `created_at` | DATETIME | | DEFAULT GETDATE() |

#### `rubric_criteria`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `rubric_criteria_id` | NVARCHAR(20) | | PK |
| `rubrics_id` | NVARCHAR(20) | | FK → `rubrics.rubrics_id` |
| `name` | NVARCHAR(200) | | |
| `description` | NVARCHAR(MAX) | | NOT NULL (`BR-BANK-003`) |
| `weight_percent` | DECIMAL(5,2) | | CHECK `> 0 AND <= 100` |
| `order_no` | INT | | DEFAULT 1 |

#### `questions`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `questions_id` | NVARCHAR(20) | | PK |
| `topics_id` | NVARCHAR(20) | | FK → `topics.topics_id` |
| `rubrics_id` | NVARCHAR(20) | ✓ | FK → `rubrics.rubrics_id`; NULL khi còn `DRAFT` |
| `content` | NVARCHAR(MAX) | | |
| `bloom_level` | NVARCHAR(20) | | CHECK `REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE` |
| `model_answer` | NVARCHAR(MAX) | ✓ | |
| `expected_keywords` | NVARCHAR(MAX) | ✓ | Mảng JSON |
| `source` | NVARCHAR(20) | | CHECK `MANUAL`, `AI_GENERATED`; DEFAULT `MANUAL` |
| `status` | NVARCHAR(20) | | CHECK `DRAFT`, `APPROVED`, `REJECTED`, `ARCHIVED`; DEFAULT `DRAFT` |
| `question_audio_key` | NVARCHAR(500) | ✓ | File TTS của câu hỏi (cache) |
| `created_at` | DATETIME | | DEFAULT GETDATE() |
| `updated_at` | DATETIME | ✓ | |

Ràng buộc bảng: `CHECK (status <> 'APPROVED' OR rubrics_id IS NOT NULL)` (`BR-BANK-001`). Index: `(topics_id, status)`.

#### `viva_exams`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_exams_id` | NVARCHAR(30) | | PK. Dạng `AIVES_EXAM_yyyy_xxxxxx`, đồng thời là **mã vào thi** sinh viên nhập |
| `lecturer_id` | NVARCHAR(20) | | FK → `users.users_id` (người tạo phiên: giảng viên hoặc admin) |
| `title` | NVARCHAR(200) | | |
| `description` | NVARCHAR(MAX) | ✓ | |
| `passcode` | NVARCHAR(6) | | Mã truy cập 6 chữ số, dùng chung cho cả phiên; người tạo xem lại và tạo lại được |
| `duration_minutes` | INT | | CHECK `BETWEEN 5 AND 300` |
| `max_follow_up_per_question` | INT | | CHECK `BETWEEN 0 AND 5`; DEFAULT 2 |
| `prepare_seconds` | INT | | DEFAULT 30 |
| `answer_seconds` | INT | | DEFAULT 120 |
| `domain_keywords` | NVARCHAR(MAX) | ✓ | Mảng JSON (`BR-VIVA-004`) |
| `start_at` | DATETIME | | Giờ mở phiên (lưu UTC) |
| `end_at` | DATETIME | | Giờ đóng phiên (lưu UTC) |
| `cancelled_at` | DATETIME | ✓ | Khác NULL nghĩa là phiên đã bị huỷ |
| `created_at` | DATETIME | | DEFAULT GETDATE() |
| `updated_at` | DATETIME | | DEFAULT GETDATE() |

Ràng buộc bảng: `CHECK (end_at > start_at)`. Index: `(lecturer_id, start_at)`.

Không có cột `status`: trạng thái phiên được **tính từ thời gian** (`UPCOMING` khi chưa tới `start_at`, `ONGOING` trong khoảng mở, `ENDED` sau `end_at`), riêng `CANCELLED` suy ra từ `cancelled_at`.

#### `viva_exam_questions`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_exam_questions_id` | NVARCHAR(20) | | PK |
| `viva_exams_id` | NVARCHAR(30) | | FK → `viva_exams.viva_exams_id` |
| `questions_id` | NVARCHAR(20) | | FK → `questions.questions_id` |
| `order_no` | INT | | |
| `weight` | DECIMAL(5,2) | | DEFAULT 1 |

Ràng buộc bảng: `UNIQUE (viva_exams_id, questions_id)`, `UNIQUE (viva_exams_id, order_no)`.

#### `viva_attempts`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_attempts_id` | NVARCHAR(20) | | PK |
| `viva_exams_id` | NVARCHAR(30) | | FK → `viva_exams.viva_exams_id` |
| `student_id` | NVARCHAR(20) | | FK → `users.users_id` |
| `status` | NVARCHAR(20) | | CHECK `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED` |
| `result_status` | NVARCHAR(20) | | CHECK `NONE`, `GRADING`, `PENDING_REVIEW`, `GRADING_FAILED`, `PUBLISHED`; DEFAULT `NONE` |
| `total_ai_score` | DECIMAL(6,2) | ✓ | |
| `total_final_score` | DECIMAL(6,2) | ✓ | |
| `full_audio_key` | NVARCHAR(500) | ✓ | File ghi âm toàn bài |
| `started_at` | DATETIME | | Lúc sinh viên vào phiên (lưu UTC) |
| `deadline_at` | DATETIME | | Hạn làm bài = `min(started_at + duration_minutes, end_at của phiên)`, chốt lúc vào (lưu UTC) |
| `completed_at` | DATETIME | ✓ | |
| `published_at` | DATETIME | ✓ | |
| `created_at` | DATETIME | | DEFAULT GETDATE() |
| `updated_at` | DATETIME | | DEFAULT GETDATE() |

Ràng buộc bảng: `UNIQUE (viva_exams_id, student_id)` (`BR-AUTH-002`), `CHECK (deadline_at > started_at)`.

Lượt thi được tạo khi sinh viên tự vào phiên bằng mã phiên + mã truy cập, ở trạng thái `IN_PROGRESS`. Giá trị `viva_attempts_id`: `AT` + 8 chữ số ngẫu nhiên.

#### `interview_exchanges`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `interview_exchanges_id` | NVARCHAR(20) | | PK |
| `viva_attempts_id` | NVARCHAR(20) | | FK → `viva_attempts.viva_attempts_id` |
| `viva_exam_questions_id` | NVARCHAR(20) | | FK → `viva_exam_questions.viva_exam_questions_id` |
| `parent_exchange_id` | NVARCHAR(20) | ✓ | FK → `interview_exchanges.interview_exchanges_id`; Filtered UNIQUE |
| `depth` | INT | | DEFAULT 0 (0 = câu gốc) |
| `question_text` | NVARCHAR(MAX) | | |
| `question_audio_key` | NVARCHAR(500) | ✓ | |
| `transcript` | NVARCHAR(MAX) | ✓ | |
| `answer_audio_key` | NVARCHAR(500) | ✓ | |
| `follow_up_reason` | NVARCHAR(20) | ✓ | CHECK `INCOMPLETE`, `AMBIGUOUS`, `CONTRADICTORY` |
| `ai_decision` | NVARCHAR(20) | ✓ | CHECK `FOLLOW_UP`, `NEXT`, `SKIPPED` |
| `ai_decision_reason` | NVARCHAR(MAX) | ✓ | |
| `answer_started_at` | DATETIME | ✓ | |
| `answer_ended_at` | DATETIME | ✓ | |
| `latency_ms` | INT | ✓ | `BR-VIVA-003` |
| `created_at` | DATETIME | | DEFAULT GETDATE() |

Ràng buộc bảng: `CHECK ((parent_exchange_id IS NULL AND depth = 0) OR (parent_exchange_id IS NOT NULL AND depth > 0))`. Index: `(viva_attempts_id, viva_exam_questions_id)`.

#### `question_grades`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `question_grades_id` | NVARCHAR(20) | | PK |
| `viva_attempts_id` | NVARCHAR(20) | | FK → `viva_attempts.viva_attempts_id` |
| `viva_exam_questions_id` | NVARCHAR(20) | | FK → `viva_exam_questions.viva_exam_questions_id` |
| `ai_score` | DECIMAL(5,2) | ✓ | |
| `final_score` | DECIMAL(5,2) | ✓ | |
| `ai_strengths` | NVARCHAR(MAX) | ✓ | |
| `ai_weaknesses` | NVARCHAR(MAX) | ✓ | |
| `ai_feedback` | NVARCHAR(MAX) | ✓ | |
| `lecturer_note` | NVARCHAR(MAX) | ✓ | |
| `status` | NVARCHAR(20) | | CHECK `AI_DRAFT`, `APPROVED`, `FAILED`; DEFAULT `AI_DRAFT` |
| `graded_by` | NVARCHAR(20) | ✓ | FK → `users.users_id`; NULL khi chưa chốt |
| `graded_at` | DATETIME | ✓ | |
| `created_at` | DATETIME | | DEFAULT GETDATE() |

Ràng buộc bảng:

- `UNIQUE (viva_attempts_id, viva_exam_questions_id)`
- `CHECK (status <> 'APPROVED' OR graded_by IS NOT NULL)`
- `CHECK (final_score IS NULL OR ai_score IS NULL OR ABS(final_score - ai_score) <= 2.0 OR lecturer_note IS NOT NULL)` (`BR-GRADE-002`)

#### `criteria_grades`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `criteria_grades_id` | NVARCHAR(20) | | PK |
| `question_grades_id` | NVARCHAR(20) | | FK → `question_grades.question_grades_id` |
| `rubric_criteria_id` | NVARCHAR(20) | | FK → `rubric_criteria.rubric_criteria_id` |
| `ai_score` | DECIMAL(5,2) | ✓ | |
| `final_score` | DECIMAL(5,2) | ✓ | |
| `evidence_quote` | NVARCHAR(MAX) | ✓ | `BR-GRADE-001` |
| `rationale` | NVARCHAR(MAX) | ✓ | |

Ràng buộc bảng: `UNIQUE (question_grades_id, rubric_criteria_id)`.

#### `grade_appeals`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `grade_appeals_id` | NVARCHAR(20) | | PK |
| `question_grades_id` | NVARCHAR(20) | | FK → `question_grades.question_grades_id` |
| `reason` | NVARCHAR(MAX) | | |
| `status` | NVARCHAR(20) | | CHECK `PENDING`, `ACCEPTED`, `REJECTED`; DEFAULT `PENDING` |
| `score_before` | DECIMAL(5,2) | | |
| `score_after` | DECIMAL(5,2) | ✓ | |
| `response` | NVARCHAR(MAX) | ✓ | |
| `resolved_by` | NVARCHAR(20) | ✓ | FK → `users.users_id`; NULL khi đang chờ |
| `created_at` | DATETIME | | DEFAULT GETDATE() |
| `resolved_at` | DATETIME | ✓ | |

Ràng buộc bảng: `CHECK (status = 'PENDING' OR resolved_by IS NOT NULL)`. Filtered UNIQUE `(question_grades_id) WHERE status = 'PENDING'` để mỗi điểm câu chỉ có 1 đơn đang chờ.

### 4.2. Bảng hệ thống

| Bảng | Mục đích | Cột chính |
| :--- | :--- | :--- |
| `background_jobs` | Hàng đợi việc chạy ngầm trong BE (chấm điểm AI sau khi thi xong, xử lý audio). Job được ghi cùng transaction nghiệp vụ nên không mất khi server khởi động lại. | `job_type` (`EVALUATE_ATTEMPT`, `AUDIO_UPLOAD`), `payload` (JSON), `status` (`PENDING`, `RUNNING`, `DONE`, `FAILED`), `attempts`, `next_run_at`, `last_error`. Index `(status, next_run_at)`. |
| `audit_logs` | Vết thao tác quan trọng: ghi đè điểm, công bố kết quả, duyệt câu hỏi, xử lý phúc khảo. | `actor_id` → `users.users_id`, `action`, `entity_type`, `entity_id`, `old_value`, `new_value`. Index `(entity_type, entity_id)`. |
| `system_settings` | Cấu hình dạng key - value: model AI, ngôn ngữ STT, giọng TTS... | `setting_key` (PK), `setting_value`, `updated_by` → `users.users_id`. |

---

## 5. Lưu ý kiểu dữ liệu

- **`DECIMAL` phải ghi rõ độ chính xác.** Trên SQL Server, `DECIMAL` không kèm tham số mặc định là `DECIMAL(18,0)`, tức **không có phần thập phân**: điểm 7.5 sẽ bị làm tròn thành 8. Vì vậy script tạo bảng phải dùng `DECIMAL(5,2)` cho điểm và trọng số, `DECIMAL(6,2)` cho tổng điểm. Trên hình chỉ ghi `DECIMAL` vì Mermaid không cho dấu phẩy trong kiểu dữ liệu.
- **`NVARCHAR` thay vì `VARCHAR`** để lưu đúng tiếng Việt. Khi dùng JPA, bật `hibernate.use_nationalized_character_data=true`.
- **Khoá ngoại phải cùng kiểu với khoá chính** được tham chiếu, nếu không SQL Server sẽ báo lỗi khi tạo FK. Hầu hết là `NVARCHAR(20)`; riêng mọi cột `viva_exams_id` là `NVARCHAR(30)`.

---

## 6. Quyết định đã chốt

- **Khoá chính dạng chuỗi do BE sinh** (không dùng `IDENTITY` hay UUID): tiền tố + số ngẫu nhiên, trùng thì sinh lại. Đã áp dụng: `users_id` = `AD` / `LE` / `ST` + 6 số; `viva_attempts_id` = `AT` + 8 số.
- **`viva_exams_id` chính là mã vào thi** `AIVES_EXAM_yyyy_xxxxxx` (yyyy là năm tạo, 6 số ngẫu nhiên). Mã dài 22 ký tự nên cột này và mọi khoá ngoại `viva_exams_id` dùng `NVARCHAR(30)`. Không có cột `exam_code` riêng.
- **Tên khoá**: PK = `<tên bảng>_id`; FK mang đúng tên PK nó trỏ tới, trừ FK đặt theo vai trò (mục 2).
- **`DATETIME`** dùng thống nhất cho mọi bảng. Thời gian của phiên thi và lượt thi lưu theo giờ UTC; `created_at` / `updated_at` lưu theo giờ máy chủ.

---

## 7. Hiện trạng triển khai

Toàn bộ **16 bảng** vật lý đã được triển khai đầy đủ theo phương pháp **Code-First (Spring Data JPA)** trong repository `aives-backend`, đồng bộ thành công lên CSDL **Supabase (PostgreSQL 17.x)** và đã được kiểm chứng hoạt động thực tế.

| # | Tên bảng CSDL | Trạng thái | JPA Entity Class | Module Backend |
| :-: | :--- | :---: | :--- | :--- |
| 1 | `users` | Đã tạo & Đang dùng | `com.aives.modules.auth.entity.User` | `auth` |
| 2 | `lessons` | Đã tạo (Code-First) | `com.aives.modules.content.entity.Lesson` | `content` |
| 3 | `topics` | Đã tạo (Code-First) | `com.aives.modules.content.entity.Topic` | `content` |
| 4 | `rubrics` | Đã tạo (Code-First) | `com.aives.modules.content.entity.Rubric` | `content` |
| 5 | `rubric_criteria` | Đã tạo (Code-First) | `com.aives.modules.content.entity.RubricCriterion` | `content` |
| 6 | `questions` | Đã tạo (Code-First) | `com.aives.modules.content.entity.Question` | `content` |
| 7 | `viva_exams` | Đã tạo & Đang dùng | `com.aives.modules.exam.entity.VivaExam` | `exam` |
| 8 | `viva_exam_questions` | Đã tạo (Code-First) | `com.aives.modules.exam.entity.VivaExamQuestion` | `exam` |
| 9 | `viva_attempts` | Đã tạo & Đang dùng | `com.aives.modules.exam.entity.VivaAttempt` | `exam` / `vivaroom` |
| 10 | `interview_exchanges` | Đã tạo (Code-First) | `com.aives.modules.vivaroom.entity.InterviewExchange` | `vivaroom` |
| 11 | `question_grades` | Đã tạo (Code-First) | `com.aives.modules.grading.entity.QuestionGrade` | `grading` |
| 12 | `criteria_grades` | Đã tạo (Code-First) | `com.aives.modules.grading.entity.CriteriaGrade` | `grading` |
| 13 | `grade_appeals` | Đã tạo (Code-First) | `com.aives.modules.grading.entity.GradeAppeal` | `grading` |
| 14 | `background_jobs` | Đã tạo (Code-First) | `com.aives.modules.system.entity.BackgroundJob` | `system` |
| 15 | `audit_logs` | Đã tạo (Code-First) | `com.aives.modules.system.entity.AuditLog` | `system` |
| 16 | `system_settings` | Đã tạo (Code-First) | `com.aives.modules.system.entity.SystemSetting` | `system` |

### Kiểm chứng trên Supabase:
- **Database Engine**: PostgreSQL 17.11 (AWS Tokyo `ap-northeast-1`).
- **JPA DDL Auto**: `spring.jpa.hibernate.ddl-auto: update`.
- **Health Check Endpoint**: `/api/health/tables` truy vấn trực tiếp `information_schema.tables` và trả về đúng danh sách 16 bảng public.
- **Tương thích SQL Server**: Với các môi trường chạy On-Premise hoặc SQL Server truyền thống, các script DDL trong thư mục `database/` (`01_users.sql`, `02_viva_exams.sql`...) vẫn được duy trì làm tài liệu tham khảo đồng bộ.
