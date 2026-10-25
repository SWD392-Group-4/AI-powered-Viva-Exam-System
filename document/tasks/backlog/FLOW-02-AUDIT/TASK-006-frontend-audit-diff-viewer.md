---
id: TASK-006
title: Enhance Admin Audit Log Viewer with Structured Diff Inspection
flow: FLOW-02-AUDIT
step_in_flow: Step 2 of 3 (Frontend Integration)
assigned_to: frontend-dev
reviewer: tech-lead
status: TODO
created_at: 2026-10-25
updated_at: 2026-10-25
inputs:
  - docs/04-ui-ux-design/page-maps/admin.md
  - docs/tasks/backlog/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md
outputs:
  - aives-frontend/src/pages/AdminAuditLogsPage.tsx
  - aives-frontend/src/services/systemService.ts
dependencies:
  - docs/tasks/backlog/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md
---

# Task: [TASK-006] Enhance Admin Audit Log Viewer with Structured Diff Inspection

## 1. Flow Context
- **Target Flow**: [FLOW-02-AUDIT](file:///docs/tasks/BOARD.md#flow-02-audit)
- **Position in Flow**: Step 2 of 3.
- **Previous Step**: [TASK-005](file:///docs/tasks/backlog/FLOW-02-AUDIT/TASK-005-backend-audit-event-triggers.md).
- **Next Step Triggered**: [TASK-007](file:///docs/tasks/backlog/FLOW-02-AUDIT/TASK-007-qa-audit-verification.md).

## 2. Acceptance Criteria (Product Owner)
- [ ] Admin can inspect detailed `old_value` and `new_value` in an interactive modal or expandable table row on `AdminAuditLogsPage.tsx`.
- [ ] Format JSON strings with syntax highlighting or clear key-value comparison.
- [ ] Support filter controls by Actor ID, Action type, and Entity Name.
- [ ] Handle empty logs cleanly with informative empty-state UI.

## 3. Technical Constraints (Tech Lead)
- Use Lucide icons and Tailwind tokens consistent with the design system.
- Ensure `npm run build` passes with zero type errors.

## 4. Blocker & Escalation Section
- Status: CLEAR
- Question / Ambiguity Raised: None

## 5. Work Execution Checklist (Assignee: frontend-dev)
- [ ] Add diff viewer modal or accordion row in `AdminAuditLogsPage.tsx`.
- [ ] Wire filter dropdowns and search inputs to query params.
- [ ] Verify build with `npm run build`.
- [ ] Move ticket to review and notify `tech-lead`.

## 6. Review & Sign-Off (Reviewer: tech-lead)
- [ ] UI/UX verified against `docs/04-ui-ux-design/page-maps/admin.md`.
- [ ] Unblock TASK-007 for verification.
