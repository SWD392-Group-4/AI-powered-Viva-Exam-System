---
id: TASK-011
title: Database Migrations for Course Hierarchy, Shared Questions, and MongoDB Audit Log Setup
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 2 of 5 (Database Migration & Entities)
assigned_to: backend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-24
updated_at: 2026-10-24
inputs:
  - document/ERD/03-physical-erd.md
  - document/05-api-specs/openapi-spec.yaml
outputs:
  - aives-backend/src/main/resources/db/postgres/01_course_rubric_question_bank.sql
  - aives-backend/src/main/java/com/aives/modules/content/entity/
  - aives-backend/src/main/java/com/aives/modules/content/document/AcademicAuditLog.java
  - aives-backend/src/main/java/com/aives/modules/content/repository/AcademicAuditLogRepository.java
dependencies:
  - TASK-010
---

# Task: [TASK-011] Database Migrations for Course Hierarchy, Shared Questions, and MongoDB Audit Log Setup

## 1. Flow Context
- **Target Flow**: `FLOW-02-QUESTION-BANK`
- **Position in Flow**: Step 2 of 5.
- **Previous Step**: [TASK-010](TASK-010-contracts-specs.md).
- **Next Step Triggered**: [TASK-012](TASK-012-backend-services.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Flyway SQL Migration trên PostgreSQL:
  - Tạo bảng `courses` (courses_id, course_code UNIQUE, name, description, timestamps).
  - Tạo bảng `course_lecturers` (course_lecturers_id, courses_id, users_id, UNIQUE pair).
  - Tạo bảng `chapters` (chapters_id, courses_id, name, order_no, description, timestamps).
  - Tạo/điều chỉnh bảng `materials` (materials_id, chapters_id, uploaded_by, title, file_url, file_type, file_size, rag_status).
  - Cập nhật bảng `rubrics`: Thêm FK `courses_id` với ràng buộc UNIQUE, thêm cột `is_locked BOOLEAN DEFAULT FALSE`.
  - Cập nhật bảng `questions`: Bỏ cột `rubrics_id`, thêm `chapters_id`, thêm `created_by`, đổi cột bloom thành `difficulty VARCHAR(20) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))`.
  - Cập nhật bảng `viva_exams`: Thêm FK `courses_id`.
- [x] JPA Entities:
  - Cập nhật và tạo mới các entity classes: `Course`, `CourseLecturer`, `Chapter`, `Material`, `Rubric`, `RubricCriterion`, `Question`, `VivaExam`.
- [x] MongoDB Configuration & Document:
  - Bổ sung dependency `spring-boot-starter-data-mongodb` trong `pom.xml`.
  - Cấu hình Spring Data MongoDB kết nối cụm MongoDB qua biến môi trường trong `application.yml`.
  - Tạo document entity `AcademicAuditLog` mapping với collection `academic_audit_logs`.
  - Tạo repository `AcademicAuditLogRepository`.

## 3. Technical Constraints (Tech Lead)
- Không làm mất mát dữ liệu hiện có trong database dev.
- Các migration script viết idempotent với `IF NOT EXISTS`.
- Cấm để lộ mật khẩu kết nối database trong code; dùng biến môi trường.

## 4. Blocker & PO Clarification Section
- Status: CLEAR

## 5. Work Execution Checklist (Assignee: backend-dev)
- [x] Tạo file migration `01_course_rubric_question_bank.sql`.
- [x] Cập nhật/tạo mới các JPA Entity classes và Enums.
- [x] Tạo Mongo Document `AcademicAuditLog` và `AcademicAuditLogRepository`.
- [x] Bàn giao cho TASK-012.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [x] Schema và Enums tuân thủ 100% tài liệu `interface_content.md` và `03-physical-erd.md`.
- [x] Moved ticket to `document/tasks/done/` and unblocked TASK-012.
