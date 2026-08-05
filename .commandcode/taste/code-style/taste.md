# Code style

- Follow the existing naming conventions in the codebase. Confidence: 0.9
- Preserve styling consistency with the existing UI. Confidence: 1.0
- Keep components reusable. Confidence: 0.9
- Prefers lean admin pages — removes non-essential columns/fields (e.g., author, audience) but keeps the filter panel on list pages (search, date range, department, status). Confidence: 0.7
- Keeps table row actions minimal — only the essential actions (View, Edit, Delete), trimming extra action buttons like Publish/Send; keep remaining buttons evenly spaced. Confidence: 0.8
- Filter panels should be a single horizontal row (Search → Department → Status → Date → Reset) matching the Attendance/Leave modules' layout, wrapping responsively on smaller screens; restyle without changing functionality. Confidence: 0.7
- Detail/view modals follow a consistent structure: sticky header with title + close (X) button, two-column grid body with label-above-value fields, and a footer with a single primary Close button. Confidence: 0.6
- Prefers card-based layouts (no tables) for settings and non-list pages — clean card sections reusing the project's design tokens. Confidence: 0.7
- Prefers visually balanced card grids: cards in the same row should be equal height and neatly aligned, with action buttons (e.g., Save Changes) pinned to the same vertical position via flex flex-col + mt-auto footers. Confidence: 0.65
- Password inputs should include show/hide visibility toggles (eye/eye-off icons) with accessible aria-labels, ideally via a small reusable PasswordField component. Confidence: 0.5
- Uses modern toggle switches (role="switch") for boolean/settings toggles rather than checkboxes. Confidence: 0.65
