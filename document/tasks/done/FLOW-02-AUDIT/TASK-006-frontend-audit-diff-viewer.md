---
id: TASK-006
title: Enhance Admin Audit Log Viewer with Structured Diff Inspection
flow: FLOW-02-AUDIT
step_in_flow: Step 2 of 3 (Frontend Integration)
assigned_to: frontend-dev
reviewer: tech-lead
status: DONE
created_at: 2026-10-25
updated_at: 2026-10-26
inputs:
  - docs/04-ui-ux-design/page-maps/admin.md
  - docs/tasks/done/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md
outputs:
  - aives-frontend/src/pages/AdminAuditLogsPage.tsx
  - aives-frontend/src/services/systemService.ts
dependencies:
  - docs/tasks/done/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md
---

# Task: [TASK-006] Enhance Admin Audit Log Viewer with Structured Diff Inspection

## 1. Flow Context
- **Target Flow**: [FLOW-02-AUDIT](file:///docs/tasks/BOARD.md#flow-02-audit)
- **Position in Flow**: Step 2 of 3.
- **Previous Step**: [TASK-005](file:///docs/tasks/done/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md).
- **Next Step Triggered**: [TASK-007](file:///docs/tasks/backlog/FLOW-02-AUDIT/TASK-007-qa-audit-verification.md).

## 2. Acceptance Criteria (Product Owner)
- [x] Admin can inspect detailed `old_value` and `new_value` in an interactive modal or expandable table row on `AdminAuditLogsPage.tsx`.
- [x] Format JSON strings with syntax highlighting or clear key-value comparison.
- [x] Support filter controls by Actor ID, Action type, and Entity Name.
- [x] Handle empty logs cleanly with informative empty-state UI.

## 3. Technical Constraints (Tech Lead)
- Use Lucide icons and Tailwind tokens consistent with the design system.
- Ensure `npm run build` passes with zero type errors.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None

## 5. Work Execution Checklist (Assignee: frontend-dev)
- [x] Add diff viewer modal and accordion inline diff row in `AdminAuditLogsPage.tsx`.
- [x] Implement structured key-value comparison (+Added, -Removed, ~Modified, =Same) with line numbers and token highlight.
- [x] Wire filter dropdowns (Actor, Action, Entity, Date range) and search inputs to query params in `systemService.ts`.
- [x] Add server/client-side pagination controls and customizable page sizes (10, 20, 50).
- [x] Verify build with `npm run build` and `oxlint`.
- [x] Move ticket to review and notify `tech-lead`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [x] UI/UX verified against `docs/04-ui-ux-design/page-maps/admin.md`.
- [x] Clean zero-error production build (`npm run build`).
- [x] Move ticket to `docs/tasks/done/` and unblock TASK-007 for verification. (Signed-off: 2026-10-26)
