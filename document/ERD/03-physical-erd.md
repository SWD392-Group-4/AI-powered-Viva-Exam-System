# Physical ERD - AIVES (PostgreSQL)

> **Mức**: Physical - bảng thật trên **PostgreSQL** (bản 14 trở lên): tên bảng, kiểu cột, NULL, khoá, ràng buộc, index.  
> **Mã nguồn**: [physical-erd.mmd](physical-erd.mmd)  
> **Đi từ**: [02-logical-erd.md](02-logical-erd.md)  
> **Script tạo bảng**: `database/postgres/00_init_aives.sql` trong repo `aives-backend` (tài liệu này khớp với script đó)

---

## 1. Sơ đồ

![Physical ERD](images/physical-erd.png)

---

## 2. Quy ước

| Hạng mục | Quy ước | Lý do |
| :--- | :--- | :--- |
| Tên bảng / cột | `snake_case`, chữ thường, tên bảng số nhiều (`viva_attempts`) | Thống nhất, dễ map sang JPA. PostgreSQL tự đổi tên không đặt trong `"..."` thành chữ thường |
| Khoá chính | Cột `<tên bảng>_id` kiểu `VARCHAR(20)` (vd `users_id`, `viva_attempts_id`); giá trị do BE sinh | Mỗi bảng có tên khoá chính riêng, không đặt chung một tên. Riêng `viva_exams_id` là `VARCHAR(30)` (xem mục 6) |
| Khoá ngoại | Mang đúng tên và kiểu của PK mà nó trỏ tới (vd `viva_attempts.viva_exams_id` → `viva_exams.viva_exams_id`) | Nhìn tên cột là biết trỏ tới bảng nào |
| Khoá ngoại theo vai trò | Giữ tên theo vai trò: `lecturer_id`, `student_id`, `created_by`, `graded_by`, `resolved_by`, `actor_id`, `updated_by`, `parent_exchange_id` | Một bảng có thể trỏ tới `users` (hoặc chính nó) với nhiều ý nghĩa khác nhau |
| Tên ràng buộc | `pk_<bảng>`, `fk_<bảng>_<ý nghĩa>`, `uq_...`, `ck_...`, index `ix_...`, unique index `ux_...` | Đọc lỗi vi phạm ràng buộc là biết ngay bảng / cột |
| Chuỗi | `VARCHAR(n)` cho chuỗi ngắn, `TEXT` cho chuỗi dài | Database tạo với `ENCODING 'UTF8'` nên lưu đúng tiếng Việt có dấu, không cần kiểu `N...` như SQL Server |
| Enum | `VARCHAR(20)` + `CHECK (... IN (...))` | Dễ thêm giá trị mới hơn kiểu `ENUM` của PostgreSQL; JPA map bằng `@Enumerated(EnumType.STRING)` |
| Điểm số | `NUMERIC(5,2)` (thang 10), tổng điểm `NUMERIC(6,2)` | Xem lưu ý ở mục 5 |
| Thời gian | `TIMESTAMP(6)` (không kèm múi giờ), mặc định `LOCALTIMESTAMP` | Khớp `LocalDateTime` trong Java |
| Đúng / sai | `BOOLEAN` | |
| Xoá dữ liệu | Không dùng `ON DELETE CASCADE`; dữ liệu thi chỉ chuyển `ARCHIVED` | Giữ lại lịch sử thi và điểm, tránh xoá dây chuyền ngoài ý muốn |
| Unique cho phép NULL | Dùng `UNIQUE` bình thường | PostgreSQL coi các NULL là khác nhau, nhiều dòng NULL vẫn hợp lệ |
| Unique có điều kiện | Partial unique index `CREATE UNIQUE INDEX ... WHERE ...` | Dùng cho "mỗi điểm câu chỉ có 1 đơn phúc khảo đang chờ" |

---

## 3. Mapping Logical → Physical

| Logical | Physical | Thay đổi |
| :--- | :--- | :--- |
| `LECTURER`, `STUDENT` | `users` + `roles` | Gộp 2 thực thể vào `users`; vai trò tách ra bảng `roles` (`AD` / `LE` / `ST`), mỗi user trỏ tới đúng 1 role qua `roles_id`. Không có cột mã số sinh viên: sinh viên được nhận diện bằng `users_id` dạng `STxxxxxx`. |
| `<entity>_id` | `<tên bảng>_id` | PK đặt theo tên bảng (số nhiều): `VIVA_EXAM.viva_exam_id` ở Logical → `viva_exams_id`. FK trỏ tới bảng đó dùng lại đúng tên này |
| `attempt_id` (PK / FK) | `viva_attempts_id` | Đổi tên cho rõ nghĩa |
| `criteria_id` (FK) | `rubric_criteria_id` | Đổi tên cho rõ nghĩa |
| `RUBRIC` | `rubrics` | Thêm `created_by`, `created_at` (cột audit, không phải quan hệ ERD) |
| `VIVA_EXAM` | `viva_exams` + `viva_exam_topics` | Thêm `max_attempts` (số lượt thi tối đa / sinh viên), `question_count`; chủ đề được chọn khi tạo phiên lưu ở `viva_exam_topics` |
| `VIVA_ATTEMPT` | `viva_attempts` | Thêm `attempt_no` (lượt thứ mấy của sinh viên trong phiên) |
| `INTERVIEW_EXCHANGE` | `interview_exchanges` | Thêm `question_audio_key`, `answer_audio_key`, `ai_decision_reason`, `answer_started_at`, `answer_ended_at` |
| `QUESTION_GRADE` | `question_grades` | Thêm `ai_strengths`, `ai_weaknesses` (`BR-GRADE-001`) |
| – | `background_jobs`, `audit_logs`, `system_settings` | Bảng hệ thống mới |
| – | `created_at`, `updated_at` | Cột thời gian ở hầu hết các bảng |

---

## 4. Đặc tả bảng

Mọi cột `created_at` / `updated_at` là `TIMESTAMP(6) NOT NULL DEFAULT LOCALTIMESTAMP` (trừ khi ghi khác).

### 4.1. Bảng nghiệp vụ

#### `roles`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `roles_id` | VARCHAR(20) | | PK. `AD`, `LE`, `ST` |
| `name` | VARCHAR(20) | | UNIQUE; CHECK `ADMIN`, `LECTURER`, `STUDENT` (khớp enum `RoleName` trong Java) |
| `description` | VARCHAR(255) | ✓ | |
| `created_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |
| `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Script tự thêm 3 role cố định nếu chưa có.

#### `users`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `users_id` | VARCHAR(20) | | PK |
| `roles_id` | VARCHAR(20) | | FK → `roles.roles_id` |
| `email` | VARCHAR(255) | | UNIQUE |
| `password_hash` | VARCHAR(255) | | BCrypt |
| `full_name` | VARCHAR(150) | | |
| `is_active` | BOOLEAN | | DEFAULT TRUE |
| `must_change_password` | BOOLEAN | | DEFAULT FALSE. TRUE = tài khoản do admin tạo, đang dùng mật khẩu tạm gửi qua email |
| `created_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |
| `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Giá trị `users_id`: 2 chữ cái theo vai trò + 6 chữ số ngẫu nhiên (`ADxxxxxx`, `LExxxxxx`, `STxxxxxx`). Index: `(roles_id)`.

#### `lessons`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `lessons_id` | VARCHAR(20) | | PK |
| `lecturer_id` | VARCHAR(20) | | FK → `users.users_id` |
| `title` | VARCHAR(200) | | |
| `description` | TEXT | ✓ | |
| `created_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |
| `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index: `(lecturer_id)`.

#### `topics`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `topics_id` | VARCHAR(20) | | PK |
| `lessons_id` | VARCHAR(20) | | FK → `lessons.lessons_id` |
| `name` | VARCHAR(200) | | |
| `description` | TEXT | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index: `(lessons_id)`.

#### `rubrics`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `rubrics_id` | VARCHAR(20) | | PK |
| `created_by` | VARCHAR(20) | | FK → `users.users_id` |
| `name` | VARCHAR(200) | | |
| `description` | TEXT | ✓ | |
| `max_score` | NUMERIC(5,2) | | DEFAULT 10; CHECK `> 0` |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `rubric_criteria`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `rubric_criteria_id` | VARCHAR(20) | | PK |
| `rubrics_id` | VARCHAR(20) | | FK → `rubrics.rubrics_id` |
| `name` | VARCHAR(200) | | |
| `description` | TEXT | | NOT NULL (`BR-BANK-003`) |
| `weight_percent` | NUMERIC(5,2) | | CHECK `> 0 AND <= 100`; tổng của 1 rubric = 100 (kiểm tra ở service) |
| `order_no` | INTEGER | | DEFAULT 1 |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index: `(rubrics_id, order_no)`.

#### `questions`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `questions_id` | VARCHAR(20) | | PK |
| `topics_id` | VARCHAR(20) | | FK → `topics.topics_id` |
| `rubrics_id` | VARCHAR(20) | ✓ | FK → `rubrics.rubrics_id`; NULL khi còn `DRAFT` |
| `content` | TEXT | | |
| `bloom_level` | VARCHAR(20) | | CHECK `REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE` |
| `model_answer` | TEXT | ✓ | |
| `expected_keywords` | TEXT | ✓ | Mảng JSON |
| `source` | VARCHAR(20) | | CHECK `MANUAL`, `AI_GENERATED`; DEFAULT `MANUAL` |
| `status` | VARCHAR(20) | | CHECK `DRAFT`, `APPROVED`, `REJECTED`, `ARCHIVED`; DEFAULT `DRAFT` |
| `question_audio_key` | VARCHAR(500) | ✓ | File TTS của câu hỏi (cache) |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng: `CHECK (status <> 'APPROVED' OR rubrics_id IS NOT NULL)` (`BR-BANK-001`). Index: `(topics_id, status)`.

#### `viva_exams`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_exams_id` | VARCHAR(30) | | PK. Dạng `AIVES_EXAM_yyyy_xxxxxx`, đồng thời là **mã vào thi** sinh viên nhập |
| `lecturer_id` | VARCHAR(20) | | FK → `users.users_id` (người tạo phiên: giảng viên hoặc admin) |
| `title` | VARCHAR(200) | | |
| `description` | VARCHAR(2000) | ✓ | |
| `passcode` | VARCHAR(6) | | Mã truy cập 6 chữ số, dùng chung cho cả phiên; người tạo xem lại và tạo lại được |
| `duration_minutes` | INTEGER | | CHECK `BETWEEN 5 AND 300`. Thời lượng của **mỗi** lượt thi |
| `max_attempts` | INTEGER | | CHECK `BETWEEN 1 AND 10`; DEFAULT 1. Số lượt thi tối đa của mỗi sinh viên |
| `max_follow_up_per_question` | INTEGER | | CHECK `BETWEEN 0 AND 5`; DEFAULT 2 |
| `prepare_seconds` | INTEGER | | DEFAULT 30 |
| `answer_seconds` | INTEGER | | DEFAULT 120 |
| `domain_keywords` | TEXT | ✓ | Mảng JSON (`BR-VIVA-004`) |
| `question_count` | INTEGER | ✓ | Số câu bốc từ các chủ đề đã chọn |
| `start_at` | TIMESTAMP(6) | | Giờ mở phiên (lưu UTC) |
| `end_at` | TIMESTAMP(6) | | Giờ đóng phiên (lưu UTC) |
| `cancelled_at` | TIMESTAMP(6) | ✓ | Khác NULL nghĩa là phiên đã bị huỷ |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng: `CHECK (end_at > start_at)`. Index: `(lecturer_id, start_at)`.

Không có cột `status`: trạng thái phiên được **tính từ thời gian** (`UPCOMING` khi chưa tới `start_at`, `ONGOING` trong khoảng mở, `ENDED` sau `end_at`), riêng `CANCELLED` suy ra từ `cancelled_at`.

#### `viva_exam_topics`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_exams_id` | VARCHAR(30) | | PK (cùng `topics_id`); FK → `viva_exams.viva_exams_id` |
| `topics_id` | VARCHAR(20) | | PK (cùng `viva_exams_id`) |

Chủ đề được chọn khi tạo phiên thi (map bằng `@ElementCollection VivaExam.topicIds`). Cột `topics_id` hiện chưa có FK sang `topics`.

#### `viva_exam_questions`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_exam_questions_id` | VARCHAR(20) | | PK |
| `viva_exams_id` | VARCHAR(30) | | FK → `viva_exams.viva_exams_id` |
| `questions_id` | VARCHAR(20) | | FK → `questions.questions_id` |
| `order_no` | INTEGER | | |
| `weight` | NUMERIC(5,2) | | DEFAULT 1; CHECK `> 0` |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng: `UNIQUE (viva_exams_id, questions_id)`, `UNIQUE (viva_exams_id, order_no)`.

#### `viva_attempts`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_attempts_id` | VARCHAR(20) | | PK |
| `viva_exams_id` | VARCHAR(30) | | FK → `viva_exams.viva_exams_id` |
| `student_id` | VARCHAR(20) | | FK → `users.users_id` |
| `attempt_no` | INTEGER | | DEFAULT 1; CHECK `>= 1`. Lượt thứ mấy của sinh viên trong phiên |
| `status` | VARCHAR(20) | | CHECK `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED` |
| `result_status` | VARCHAR(20) | | CHECK `NONE`, `GRADING`, `PENDING_REVIEW`, `GRADING_FAILED`, `PUBLISHED`; DEFAULT `NONE` |
| `total_ai_score` | NUMERIC(6,2) | ✓ | |
| `total_final_score` | NUMERIC(6,2) | ✓ | |
| `full_audio_key` | VARCHAR(500) | ✓ | File ghi âm toàn bài |
| `started_at` | TIMESTAMP(6) | | Lúc sinh viên vào phiên (lưu UTC) |
| `deadline_at` | TIMESTAMP(6) | | Hạn làm bài = `min(started_at + duration_minutes, end_at của phiên)`, chốt lúc vào (lưu UTC) |
| `completed_at` | TIMESTAMP(6) | ✓ | |
| `published_at` | TIMESTAMP(6) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng: `UNIQUE (viva_exams_id, student_id, attempt_no)`, `CHECK (deadline_at > started_at)`. Số lượt của một sinh viên không vượt `viva_exams.max_attempts` (kiểm tra ở service). Index: `(student_id)`, `(status, result_status)` (bộ chấm điểm ngầm quét theo 2 cột này).

Lượt thi được tạo khi sinh viên tự vào phiên bằng mã phiên + mã truy cập, ở trạng thái `IN_PROGRESS`. Giá trị `viva_attempts_id`: `AT` + 8 chữ số ngẫu nhiên.

#### `interview_exchanges`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `interview_exchanges_id` | VARCHAR(20) | | PK |
| `viva_attempts_id` | VARCHAR(20) | | FK → `viva_attempts.viva_attempts_id` |
| `viva_exam_questions_id` | VARCHAR(20) | | FK → `viva_exam_questions.viva_exam_questions_id` |
| `parent_exchange_id` | VARCHAR(20) | ✓ | FK → `interview_exchanges.interview_exchanges_id`; UNIQUE |
| `depth` | INTEGER | | DEFAULT 0 (0 = câu gốc) |
| `question_text` | TEXT | | |
| `question_audio_key` | VARCHAR(500) | ✓ | |
| `transcript` | TEXT | ✓ | |
| `answer_audio_key` | VARCHAR(500) | ✓ | |
| `follow_up_reason` | VARCHAR(20) | ✓ | CHECK `INCOMPLETE`, `AMBIGUOUS`, `CONTRADICTORY` |
| `ai_decision` | VARCHAR(20) | ✓ | CHECK `FOLLOW_UP`, `NEXT`, `SKIPPED` |
| `ai_decision_reason` | TEXT | ✓ | |
| `answer_started_at` | TIMESTAMP(6) | ✓ | |
| `answer_ended_at` | TIMESTAMP(6) | ✓ | |
| `latency_ms` | INTEGER | ✓ | `BR-VIVA-003` |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng: `UNIQUE (parent_exchange_id)` (mỗi lượt hỏi - đáp có tối đa 1 câu hỏi xoáy con; câu gốc có `parent_exchange_id` NULL nên không bị trùng), `CHECK ((parent_exchange_id IS NULL AND depth = 0) OR (parent_exchange_id IS NOT NULL AND depth > 0))`. Index: `(viva_attempts_id, viva_exam_questions_id)`.

#### `question_grades`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `question_grades_id` | VARCHAR(20) | | PK |
| `viva_attempts_id` | VARCHAR(20) | | FK → `viva_attempts.viva_attempts_id` |
| `viva_exam_questions_id` | VARCHAR(20) | | FK → `viva_exam_questions.viva_exam_questions_id` |
| `ai_score` | NUMERIC(5,2) | ✓ | |
| `final_score` | NUMERIC(5,2) | ✓ | |
| `ai_strengths` | TEXT | ✓ | |
| `ai_weaknesses` | TEXT | ✓ | |
| `ai_feedback` | TEXT | ✓ | |
| `lecturer_note` | TEXT | ✓ | |
| `status` | VARCHAR(20) | | CHECK `AI_DRAFT`, `APPROVED`, `FAILED`; DEFAULT `AI_DRAFT` |
| `graded_by` | VARCHAR(20) | ✓ | FK → `users.users_id`; NULL khi chưa chốt |
| `graded_at` | TIMESTAMP(6) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng:

- `UNIQUE (viva_attempts_id, viva_exam_questions_id)`
- `CHECK (status <> 'APPROVED' OR graded_by IS NOT NULL)`
- `CHECK (final_score IS NULL OR ai_score IS NULL OR ABS(final_score - ai_score) <= 2.0 OR lecturer_note IS NOT NULL)` (`BR-GRADE-002`)

#### `criteria_grades`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `criteria_grades_id` | VARCHAR(20) | | PK |
| `question_grades_id` | VARCHAR(20) | | FK → `question_grades.question_grades_id` |
| `rubric_criteria_id` | VARCHAR(20) | | FK → `rubric_criteria.rubric_criteria_id` |
| `ai_score` | NUMERIC(5,2) | ✓ | |
| `final_score` | NUMERIC(5,2) | ✓ | |
| `evidence_quote` | TEXT | ✓ | `BR-GRADE-001` |
| `rationale` | TEXT | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng: `UNIQUE (question_grades_id, rubric_criteria_id)`.

#### `grade_appeals`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `grade_appeals_id` | VARCHAR(20) | | PK |
| `question_grades_id` | VARCHAR(20) | | FK → `question_grades.question_grades_id` |
| `reason` | TEXT | | |
| `status` | VARCHAR(20) | | CHECK `PENDING`, `ACCEPTED`, `REJECTED`; DEFAULT `PENDING` |
| `score_before` | NUMERIC(5,2) | | |
| `score_after` | NUMERIC(5,2) | ✓ | |
| `response` | TEXT | ✓ | |
| `resolved_by` | VARCHAR(20) | ✓ | FK → `users.users_id`; NULL khi đang chờ |
| `resolved_at` | TIMESTAMP(6) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Ràng buộc bảng: `CHECK (status = 'PENDING' OR resolved_by IS NOT NULL)`. Partial unique index `ux_grade_appeals_pending ON grade_appeals (question_grades_id) WHERE status = 'PENDING'` để mỗi điểm câu chỉ có 1 đơn đang chờ.

### 4.2. Bảng hệ thống

| Bảng | Mục đích | Cột chính |
| :--- | :--- | :--- |
| `background_jobs` | Hàng đợi việc chạy ngầm trong BE (chấm điểm AI sau khi thi xong, xử lý audio). Job được ghi cùng transaction nghiệp vụ nên không mất khi server khởi động lại. | `job_type` (`EVALUATE_ATTEMPT`, `AUDIO_UPLOAD`), `payload` (TEXT chứa JSON), `status` (`PENDING`, `RUNNING`, `DONE`, `FAILED`), `attempts`, `next_run_at`, `last_error`. Index `(status, next_run_at)`. |
| `audit_logs` | Vết thao tác quan trọng: ghi đè điểm, công bố kết quả, duyệt câu hỏi, xử lý phúc khảo. | `actor_id` → `users.users_id`, `action`, `entity_type`, `entity_id`, `old_value`, `new_value`. Index `(entity_type, entity_id)`. |
| `system_settings` | Cấu hình dạng key - value: model AI, ngôn ngữ STT, giọng TTS... | `setting_key` (PK), `setting_value`, `updated_by` → `users.users_id`. |

---

## 5. Lưu ý kiểu dữ liệu

- **`NUMERIC` vẫn nên ghi rõ độ chính xác.** Trên PostgreSQL, `NUMERIC` không kèm tham số lưu bao nhiêu chữ số cũng được (không làm tròn như `DECIMAL` của SQL Server), nhưng script vẫn dùng `NUMERIC(5,2)` cho điểm và trọng số, `NUMERIC(6,2)` cho tổng điểm để giới hạn giá trị và luôn có đúng 2 chữ số thập phân. Trên hình chỉ ghi `NUMERIC` vì Mermaid không cho dấu phẩy trong kiểu dữ liệu.
- **`VARCHAR` / `TEXT` lưu được tiếng Việt** vì database dùng mã hoá UTF-8. Phải tạo database với `ENCODING 'UTF8'` (BE tự tạo database theo cách này khi chạy profile `postgres`). Annotation `@Nationalized` cũ trong entity vẫn giữ được, trên PostgreSQL nó map về `varchar` / `text` bình thường.
- **`TIMESTAMP(6)` không lưu múi giờ.** Giờ của phiên thi và lượt thi do BE quy đổi sang UTC trước khi lưu. JVM phải dùng tên múi giờ `Asia/Ho_Chi_Minh`; tên cũ `Asia/Saigon` bị PostgreSQL từ chối khi kết nối (BE đã tự đổi tên này lúc khởi động).
- **Khoá ngoại phải cùng kiểu với khoá chính** được tham chiếu. Hầu hết là `VARCHAR(20)`; riêng mọi cột `viva_exams_id` là `VARCHAR(30)`.

---

## 6. Quyết định đã chốt

- **Khoá chính dạng chuỗi do BE sinh** (không dùng `SERIAL` / `IDENTITY` hay UUID): tiền tố + số ngẫu nhiên, trùng thì sinh lại. Đã áp dụng: `users_id` = `AD` / `LE` / `ST` + 6 số; `viva_attempts_id` = `AT` + 8 số.
- **Vai trò tách bảng `roles`**: mỗi user có đúng 1 role (`users.roles_id`), `roles_id` là `AD` / `LE` / `ST`, trùng với tiền tố của `users_id`.
- **`viva_exams_id` chính là mã vào thi** `AIVES_EXAM_yyyy_xxxxxx` (yyyy là năm tạo, 6 số ngẫu nhiên). Mã dài 22 ký tự nên cột này và mọi khoá ngoại `viva_exams_id` dùng `VARCHAR(30)`. Không có cột `exam_code` riêng.
- **Tên khoá**: PK = `<tên bảng>_id`; FK mang đúng tên PK nó trỏ tới, trừ FK đặt theo vai trò (mục 2).
- **`TIMESTAMP(6)`** dùng thống nhất cho mọi bảng. Thời gian của phiên thi và lượt thi lưu theo giờ UTC; `created_at` / `updated_at` lưu theo giờ máy chủ.

---

## 7. Hiện trạng triển khai

| Hạng mục | Hiện trạng |
| :--- | :--- |
| DBMS | **PostgreSQL** (đã chuyển từ SQL Server). Dữ liệu cũ trên SQL Server không được chuyển sang. |
| Script tạo bảng | `database/postgres/00_init_aives.sql` (repo `aives-backend`): tạo đủ **18 bảng** kèm CHECK, index, giá trị mặc định và 3 role. Chạy lại nhiều lần không mất dữ liệu (`IF NOT EXISTS`). |
| Tự tạo database | Khi chạy profile `postgres` (mặc định), BE tự tạo database `aives` (UTF-8) nếu chưa có và chạy script trên nếu chưa có bảng. Tắt bằng `DB_AUTO_CREATE=false`. |
| Kết nối | `jdbc:postgresql://localhost:5432/aives`, user `postgres` (cấu hình trong `.env`: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`). |
| Script SQL Server cũ | Vẫn để trong thư mục `database/` (`00_init_aives.sql`, `01_...` → `10_...`) để tham khảo, không dùng nữa. |

Trong code hiện tại, các cột `max_follow_up_per_question`, `domain_keywords`, `full_audio_key` đã có trong bảng nhưng chưa được dùng (sẽ dùng khi làm xong lõi phỏng vấn).
