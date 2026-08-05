---
name: generate-weekly-report
description: >
  Builds the weekly stakeholder report from source metrics. Use when the user
  asks for "this week's report" or the weekly-report cron fires. Does not send
  or post it — see notify-report-ready for delivery.
---

# generate-weekly-report

One of three skills that replace `bad-skill.md`'s single do-everything spec:
this one only builds the report. Delivery (email, Slack) is a separate
skill's responsibility, declared below under "Composes with".

## Responsibility

Build the weekly stakeholder report from this week's source metrics.

## Inputs

- `metrics/this-week.json` — the source data
- `templates/weekly-report.md` — the report template

## Outputs

- `reports/YYYY-Www.md` — the rendered report, ready to hand off

## Composes with

Invoked by the weekly-report cron. Its output is consumed by
`notify-report-ready` (not yet built — queued alongside this fixture), which
handles email and Slack delivery. Does not invoke either channel itself.

## Failing check

```bash
test -s reports/$(date +%G-W%V).md
```
