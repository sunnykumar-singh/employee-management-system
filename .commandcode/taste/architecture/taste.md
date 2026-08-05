# Architecture

- Follow the existing folder structure. Confidence: 0.9
- Follow the same architecture used in the Employees, Departments, Attendance and Leave modules. Confidence: 0.9
- Pagination is applied after search/filtering: currentPage/pageSize state lives in the page component, totalPages and a clamped activePage are derived, and any search, filter, or page-size change resets to page 1. Confidence: 0.8
- Search should be case-insensitive and match across multiple fields (e.g., title, category, department, status), with search state kept in the page component. Confidence: 0.8
- Search and filters work together: filter criteria (department, status, date) combine with the search query via AND logic, and a single Reset clears both search and filter state. Confidence: 0.8
- Filter dropdown options are derived from the data (e.g., "All X" sentinel plus unique values from the list) via useMemo, and the filter UI is fully controlled by page-level state. Confidence: 0.8
- Date filters normalize display dates (e.g., "05 Aug 2026") to the date-input format (YYYY-MM-DD) before comparing. Confidence: 0.7
- Keep state in page components. Confidence: 0.9
- Threads row-action callbacks through explicit prop drilling down the component chain (Page → Table → Row → Actions) rather than using context or global state. Confidence: 0.9
- Delete flows: destructive actions open a confirmation modal (showing the item's name and ID), then on confirm remove the item from page-level state and fire a success toast. Confidence: 0.8
- Uses dedicated modal components (e.g., ViewXModal) for detail views, controlled by page-level state (selected item + open flag). Confidence: 0.8
- Keep the project ready for future Spring Boot + MySQL integration (avoid frontend-only assumptions). Confidence: 0.9
- Build new modules in a UI-only phase first: mock data only, no backend implementation yet (client-side save-to-state handlers and success toasts may still be wired). Confidence: 0.95
- Create/add forms are modal dialogs opened from the page header's "Create/Add" button, controlled by page-level open/close state with a save handler that appends to the module's list state. Confidence: 0.7
