# Physical ERD - AIVES (PostgreSQL & MongoDB)

> **Mức**: Physical (vật lý) - gắn với PostgreSQL 16 (cho dữ liệu quan hệ ACID) và MongoDB 7 (cho nhật ký kiểm toán và theo dõi hoạt động).  
> **Mã nguồn**: [physical-erd.mmd](physical-erd.mmd)  
> **Căn cứ**: [Logical ERD](02-logical-erd.md), [01-business-rule](../01-business-rule/README.md)

---

## 1. Sơ Đồ Quan Hệ

![Physical ERD](images/physical-erd.png)

---

## 2. Quy Tắc Ánh Xạ Logical Sang Physical

| Thực thể Logical | Bảng / Collection Physical | Ghi chú chuyển đổi |
| :--- | :--- | :--- |
| `LECTURER`, `STUDENT` | `users` | Hợp nhất kèm bảng `roles` |
| `COURSE` | `courses` | Khóa chính `courses_id VARCHAR(20)`, mã môn học `course_code UNIQUE` |
| `CHAPTER` | `chapters` | Thay thế `topics`, gắn với `courses.courses_id` |
| `MATERIAL` | `materials` | Quản lý slide/tài liệu nạp theo chương cho Vertex AI RAG |
| `QUESTION` | `questions` | Ngân hàng câu hỏi dùng chung theo chương, độ khó `EASY, MEDIUM, HARD`, bỏ `rubrics_id` |
| `RUBRIC` | `rubrics` | $1:1$ với môn học (`courses_id UNIQUE`), có cờ `is_locked` |
| `RUBRIC_CRITERIA` | `rubric_criteria` | Tổng trọng số của 1 rubric = 100% |
| `VIVA_EXAM` | `viva_exams` | Thêm FK `courses_id` liên kết với môn học |
| *Audit Logging* | MongoDB `academic_audit_logs` | Lưu trữ phi cấu trúc theo dõi mọi hoạt động CRUD và duyệt câu hỏi |

---

## 3. Đặc Tả Chi Tiết Các Bảng Dữ Liệu PostgreSQL

### 3.1. Phân Hệ Người Dùng & Phân Quyền

#### `roles`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `roles_id` | VARCHAR(20) | | PK |
| `name` | VARCHAR(20) | | UNIQUE; `ADMIN`, `LECTURER`, `STUDENT` |
| `description` | VARCHAR(255) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `users`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `users_id` | VARCHAR(20) | | PK |
| `roles_id` | VARCHAR(20) | | FK → `roles.roles_id` |
| `email` | VARCHAR(255) | | UNIQUE |
| `password_hash` | VARCHAR(255) | | BCrypt hash |
| `full_name` | VARCHAR(150) | | |
| `is_active` | BOOLEAN | | DEFAULT TRUE |
| `must_change_password` | BOOLEAN | | DEFAULT FALSE |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

---

### 3.2. Phân Hệ Môn Học, Chương & Học Liệu RAG

#### `courses`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `courses_id` | VARCHAR(20) | | PK |
| `course_code` | VARCHAR(50) | | UNIQUE (ví dụ: `SWD392`) |
| `name` | VARCHAR(200) | | |
| `description` | TEXT | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `course_lecturers` (Phân công giảng dạy & dùng chung ngân hàng đề)

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `course_lecturers_id` | VARCHAR(20) | | PK |
| `courses_id` | VARCHAR(20) | | FK → `courses.courses_id` |
| `users_id` | VARCHAR(20) | | FK → `users.users_id` (role LECTURER) |
| `created_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index / Ràng buộc: `UNIQUE (courses_id, users_id)`.

#### `chapters`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `chapters_id` | VARCHAR(20) | | PK |
| `courses_id` | VARCHAR(20) | | FK → `courses.courses_id` |
| `name` | VARCHAR(200) | | |
| `order_no` | INTEGER | | DEFAULT 1 |
| `description` | TEXT | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index: `(courses_id, order_no)`.

#### `materials` (Học liệu phục vụ RAG)

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `materials_id` | VARCHAR(20) | | PK |
| `chapters_id` | VARCHAR(20) | | FK → `chapters.chapters_id` |
| `uploaded_by` | VARCHAR(20) | | FK → `users.users_id` |
| `title` | VARCHAR(200) | | |
| `file_url` | VARCHAR(500) | | Đường dẫn file trên GCS |
| `file_type` | VARCHAR(20) | | CHECK `file_type IN ('pdf', 'pptx', 'ppt')` |
| `file_size` | INTEGER | | Kích thước bytes |
| `rag_status` | VARCHAR(20) | | CHECK `INDEXING`, `READY`, `FAILED`; DEFAULT `INDEXING` |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

---

### 3.3. Phân Hệ Rubric Chuẩn & Ngân Hàng Câu Hỏi

#### `rubrics` (Duy nhất theo Môn học)

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `rubrics_id` | VARCHAR(20) | | PK |
| `courses_id` | VARCHAR(20) | | FK → `courses.courses_id`, UNIQUE (`BR-BANK-001`) |
| `created_by` | VARCHAR(20) | | FK → `users.users_id` |
| `name` | VARCHAR(200) | | |
| `description` | TEXT | ✓ | |
| `max_score` | NUMERIC(5,2) | | DEFAULT 10; CHECK `> 0` |
| `is_locked` | BOOLEAN | | DEFAULT FALSE; TRUE khi có ca thi OPEN/CLOSED (`BR-BANK-006`) |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `rubric_criteria`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `rubric_criteria_id` | VARCHAR(20) | | PK |
| `rubrics_id` | VARCHAR(20) | | FK → `rubrics.rubrics_id` |
| `name` | VARCHAR(200) | | |
| `description` | TEXT | | NOT NULL (`BR-BANK-003`) |
| `weight_percent` | NUMERIC(5,2) | | CHECK `> 0 AND <= 100`; tổng các tiêu chí = 100% |
| `order_no` | INTEGER | | DEFAULT 1 |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index: `(rubrics_id, order_no)`.

#### `questions` (Ngân hàng câu hỏi dùng chung)

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `questions_id` | VARCHAR(20) | | PK |
| `chapters_id` | VARCHAR(20) | | FK → `chapters.chapters_id` |
| `created_by` | VARCHAR(20) | | FK → `users.users_id` |
| `content` | TEXT | | |
| `difficulty` | VARCHAR(20) | | CHECK `difficulty IN ('EASY', 'MEDIUM', 'HARD')` (`BR-BANK-004`) |
| `model_answer` | TEXT | ✓ | |
| `expected_keywords` | TEXT | ✓ | Mảng JSON các từ khóa |
| `source` | VARCHAR(20) | | CHECK `MANUAL`, `AI_GENERATED`; DEFAULT `MANUAL` |
| `status` | VARCHAR(20) | | CHECK `DRAFT`, `APPROVED`, `REJECTED`, `ARCHIVED`; DEFAULT `DRAFT` |
| `question_audio_key` | VARCHAR(500) | ✓ | File TTS của câu hỏi (cache) |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index: `(chapters_id, status)`.

---

### 3.4. Phân Hệ Ca Thi, Phòng Thi & Chấm Điểm

#### `viva_exams`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_exams_id` | VARCHAR(30) | | PK |
| `courses_id` | VARCHAR(20) | | FK → `courses.courses_id` |
| `lecturer_id` | VARCHAR(20) | | FK → `users.users_id` |
| `title` | VARCHAR(200) | | |
| `description` | VARCHAR(2000) | ✓ | |
| `passcode` | VARCHAR(6) | | Mã truy cập bí mật |
| `duration_minutes` | INTEGER | | CHECK `BETWEEN 5 AND 300` |
| `max_attempts` | INTEGER | | DEFAULT 1 |
| `max_follow_up_per_question` | INTEGER | | CHECK `BETWEEN 0 AND 5`; DEFAULT 2 |
| `prepare_seconds` | INTEGER | | DEFAULT 15 |
| `answer_seconds` | INTEGER | | DEFAULT 60 |
| `domain_keywords` | TEXT | ✓ | Từ khóa cho STT |
| `question_count` | INTEGER | | Số câu hỏi trong một lượt thi |
| `start_at` | TIMESTAMP(6) | | |
| `end_at` | TIMESTAMP(6) | | |
| `cancelled_at` | TIMESTAMP(6) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `viva_exam_questions`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_exam_questions_id` | VARCHAR(20) | | PK |
| `viva_exams_id` | VARCHAR(30) | | FK → `viva_exams.viva_exams_id` |
| `questions_id` | VARCHAR(20) | | FK → `questions.questions_id` |
| `order_no` | INTEGER | | |
| `weight` | NUMERIC(5,2) | | DEFAULT 1.00 |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index / Ràng buộc: `UNIQUE (viva_exams_id, questions_id)`.

#### `viva_attempts`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `viva_attempts_id` | VARCHAR(20) | | PK |
| `viva_exams_id` | VARCHAR(30) | | FK → `viva_exams.viva_exams_id` |
| `student_id` | VARCHAR(20) | | FK → `users.users_id` |
| `attempt_no` | INTEGER | | DEFAULT 1 |
| `status` | VARCHAR(20) | | CHECK `NOT_STARTED, IN_PROGRESS, COMPLETED, ABANDONED` |
| `result_status` | VARCHAR(20) | | CHECK `NONE, GRADING, PENDING_REVIEW, GRADING_FAILED, PUBLISHED` |
| `total_ai_score` | NUMERIC(5,2) | ✓ | |
| `total_final_score` | NUMERIC(5,2) | ✓ | |
| `full_audio_key` | VARCHAR(500) | ✓ | |
| `started_at`, `deadline_at`, `completed_at`, `published_at` | TIMESTAMP(6) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `interview_exchanges`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `interview_exchanges_id` | VARCHAR(20) | | PK |
| `viva_attempts_id` | VARCHAR(20) | | FK → `viva_attempts.viva_attempts_id` |
| `viva_exam_questions_id` | VARCHAR(20) | | FK → `viva_exam_questions.viva_exam_questions_id` |
| `parent_exchange_id` | VARCHAR(20) | ✓ | FK → `interview_exchanges.interview_exchanges_id` |
| `depth` | INTEGER | | CHECK `depth >= 0`; DEFAULT 0 |
| `question_text` | TEXT | | |
| `question_audio_key` | VARCHAR(500) | ✓ | |
| `transcript` | TEXT | ✓ | |
| `answer_audio_key` | VARCHAR(500) | ✓ | |
| `follow_up_reason` | VARCHAR(20) | ✓ | CHECK `INCOMPLETE, AMBIGUOUS, CONTRADICTORY` |
| `ai_decision` | VARCHAR(20) | | CHECK `FOLLOW_UP, NEXT, SKIPPED` |
| `ai_decision_reason` | TEXT | ✓ | |
| `answer_started_at`, `answer_ended_at` | TIMESTAMP(6) | ✓ | |
| `latency_ms` | INTEGER | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `question_grades`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `question_grades_id` | VARCHAR(20) | | PK |
| `viva_attempts_id` | VARCHAR(20) | | FK → `viva_attempts.viva_attempts_id` |
| `viva_exam_questions_id` | VARCHAR(20) | | FK → `viva_exam_questions.viva_exam_questions_id` |
| `ai_score` | NUMERIC(5,2) | ✓ | |
| `final_score` | NUMERIC(5,2) | ✓ | |
| `ai_strengths`, `ai_weaknesses`, `ai_feedback` | TEXT | ✓ | |
| `lecturer_note` | TEXT | ✓ | |
| `status` | VARCHAR(20) | | CHECK `AI_DRAFT, APPROVED, FAILED` |
| `graded_by` | VARCHAR(20) | ✓ | FK → `users.users_id` |
| `graded_at` | TIMESTAMP(6) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

#### `criteria_grades`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `criteria_grades_id` | VARCHAR(20) | | PK |
| `question_grades_id` | VARCHAR(20) | | FK → `question_grades.question_grades_id` |
| `rubric_criteria_id` | VARCHAR(20) | | FK → `rubric_criteria.rubric_criteria_id` |
| `ai_score` | NUMERIC(5,2) | ✓ | |
| `final_score` | NUMERIC(5,2) | ✓ | |
| `evidence_quote` | TEXT | ✓ | |
| `rationale` | TEXT | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

Index / Ràng buộc: `UNIQUE (question_grades_id, rubric_criteria_id)`.

#### `grade_appeals`

| Cột | Kiểu | NULL | Ràng buộc / Mặc định |
| :--- | :--- | :---: | :--- |
| `grade_appeals_id` | VARCHAR(20) | | PK |
| `question_grades_id` | VARCHAR(20) | | FK → `question_grades.question_grades_id` |
| `reason` | TEXT | | |
| `status` | VARCHAR(20) | | CHECK `PENDING, ACCEPTED, REJECTED` |
| `score_before` | NUMERIC(5,2) | | |
| `score_after` | NUMERIC(5,2) | ✓ | |
| `response` | TEXT | ✓ | |
| `resolved_by` | VARCHAR(20) | ✓ | FK → `users.users_id` |
| `resolved_at` | TIMESTAMP(6) | ✓ | |
| `created_at`, `updated_at` | TIMESTAMP(6) | | DEFAULT LOCALTIMESTAMP |

---

## 4. Mô Tả Collection MongoDB `academic_audit_logs`

Collection lưu trữ các thao tác của giảng viên đối với ngân hàng câu hỏi dùng chung và Rubric của môn học:

```json
{
  "_id": { "$oid": "662a8c1f4e12ab34cd56ef78" },
  "course_id": "SWD392",
  "chapter_id": "CHAP_01",
  "actor_id": "GV001",
  "actor_name": "Tran Van B",
  "action": "APPROVE_QUESTION",
  "target_entity": "QUESTION",
  "target_id": "Q_1042",
  "before_state": {
    "status": "DRAFT",
    "difficulty": "MEDIUM"
  },
  "after_state": {
    "status": "APPROVED",
    "difficulty": "MEDIUM"
  },
  "created_at": { "$date": "2026-10-24T16:20:00.000Z" }
}
```

Index MongoDB đề xuất:
- `{ "course_id": 1, "created_at": -1 }`
- `{ "target_id": 1 }`
- `{ "actor_id": 1 }`
