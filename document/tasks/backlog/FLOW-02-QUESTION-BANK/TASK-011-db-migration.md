---
id: TASK-011
title: Database Migrations for Course Hierarchy, Shared Questions, and MongoDB Audit Log Setup
flow: FLOW-02-QUESTION-BANK
step_in_flow: Step 2 of 5 (Database Migration & Entities)
assigned_to: backend-dev
reviewer: tech-lead
status: PENDING_DEPENDENCY
created_at: 2026-10-24
updated_at: 2026-10-24
inputs:
  - document/ERD/03-physical-erd.md
  - document/05-api-specs/openapi-spec.yaml
outputs:
  - aives-backend/src/main/resources/db/migration/
  - aives-backend/src/main/java/.../entity/
  - aives-backend/src/main/java/.../document/AcademicAuditLog.java
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
- [ ] Flyway SQL Migration trên PostgreSQL:
  - Tạo bảng `courses` (id, course_code UNIQUE, name, description).
  - Tạo bảng `course_lecturers` (courses_id, users_id, UNIQUE pair).
  - Tạo bảng `chapters` (id, courses_id, name, order_no, description).
  - Tạo bảng `materials` (id, chapters_id, uploaded_by, title, file_url, file_type, file_size, rag_status).
  - Cập nhật bảng `rubrics`: Thêm FK `courses_id` với ràng buộc UNIQUE, thêm cột `is_locked BOOLEAN DEFAULT FALSE`.
  - Cập nhật bảng `questions`: Bỏ cột `rubrics_id`, thêm `chapters_id`, thêm `created_by`, đổi cột bloom thành `difficulty VARCHAR(20) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))`.
  - Cập nhật bảng `viva_exams`: Thêm FK `courses_id`.
- [ ] JPA Entities:
  - Cập nhật các entity classes Java tương ứng theo chuẩn Hibernate/JPA.
- [ ] MongoDB Configuration & Document:
  - Cấu hình Spring Data MongoDB kết nối cụm MongoDB.
  - Tạo document entity `AcademicAuditLog` mapping với collection `academic_audit_logs`.

## 3. Technical Constraints (Tech Lead)
- Không làm mất mát dữ liệu hiện có trong database dev.
- Các migration script phải viết theo chuẩn Flyway versioning (`V...__...sql`).
- Cấm để lộ mật khẩu kết nối database trong code; dùng biến môi trường.

## 4. Blocker & PO Clarification Section
- Status: PENDING_DEPENDENCY (Chờ hoàn tất TASK-010)

## 5. Work Execution Checklist (Assignee: backend-dev)
- [ ] Tạo file Flyway migration.
- [ ] Cập nhật/tạo mới các JPA Entity classes.
- [ ] Tạo Mongo Document `AcademicAuditLog` và MongoRepository.
- [ ] Bàn giao cho TASK-012.
