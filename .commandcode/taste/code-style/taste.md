# Code style

- Follow the existing naming conventions in the codebase. Confidence: 0.9
- Preserve styling consistency with the existing UI. Confidence: 0.9
- Keep components reusable. Confidence: 0.9
- Prefers lean admin pages — removes non-essential columns/fields (e.g., author, audience) but keeps the filter panel on list pages (search, date range, department, status). Confidence: 0.7
- Keeps table row actions minimal — only the essential actions (View, Edit, Delete), trimming extra action buttons like Publish/Send; keep remaining buttons evenly spaced. Confidence: 0.8
- Filter panels should be a single horizontal row (Search → Department → Status → Date → Reset) matching the Attendance/Leave modules' layout, wrapping responsively on smaller screens; restyle without changing functionality. Confidence: 0.7
