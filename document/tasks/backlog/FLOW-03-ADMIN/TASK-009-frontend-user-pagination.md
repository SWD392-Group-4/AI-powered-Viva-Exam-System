---
id: TASK-009
title: Integrate Paginated User Directory and Filtering in Frontend
flow: FLOW-03-ADMIN
step_in_flow: Step 2 of 3 (Frontend Integration)
assigned_to: frontend-dev
reviewer: tech-lead
status: TODO
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/04-ui-ux-design/page-maps/admin.md
  - docs/tasks/backlog/FLOW-03-ADMIN/TASK-008-backend-user-pagination.md
outputs:
  - aives-frontend/src/pages/AdminUsersPage.tsx
  - aives-frontend/src/services/userService.js
dependencies:
  - docs/tasks/backlog/FLOW-03-ADMIN/TASK-008-backend-user-pagination.md
---

# Task: [TASK-009] Integrate Paginated User Directory and Filtering in Frontend

## 1. Flow Context
- **Target Flow**: [FLOW-03-ADMIN](file:///docs/tasks/BOARD.md#flow-03-admin)
- **Position in Flow**: Step 2 of 3.
- **Previous Step**: [TASK-008](file:///docs/tasks/backlog/FLOW-03-ADMIN/TASK-008-backend-user-pagination.md).
- **Next Step Triggered**: [TASK-010](file:///docs/tasks/backlog/FLOW-03-ADMIN/TASK-010-qa-user-pagination-verification.md).

## 2. Acceptance Criteria (Product Owner)
- [ ] Connect `AdminUsersPage.tsx` table to server-side paginated API.
- [ ] Implement search debounce input (300ms) for name/email/id lookup.
- [ ] Role filter dropdown (`Tất cả`, `Sinh viên`, `Giảng viên`, `Quản trị viên`) and Status filter (`Tất cả`, `Đang hoạt động`, `Bị vô hiệu hóa`).
- [ ] Pagination controls: Previous, Next, Page numbers, and records per page selector.

## 3. Technical Constraints (Tech Lead)
- Handle loading state with spinner / table skeleton.
- Verify build with `npm run build`.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None

## 5. Work Execution Checklist (Assignee: frontend-dev)
- [ ] Update `userService.js` to accept `page`, `size`, `search`, `role`, `active`.
- [ ] Wire table state in `AdminUsersPage.tsx`.
- [ ] Verify build with `npm run build`.
- [ ] Move ticket to review and notify `tech-lead`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [ ] UI performance verified without unnecessary re-renders.
- [ ] Unblock TASK-010.
