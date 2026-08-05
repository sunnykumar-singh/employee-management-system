# Tooling

- Use react-hook-form for every form. Confidence: 0.95
- Shell commands run under Windows cmd.exe — bash-isms like heredocs fail; use `-m` flags or single-line commands for git. Confidence: 0.8
- Uses conventional commit messages (e.g., "feat: ...") for feature commits. Confidence: 0.6
- react-hook-form code must be React-Compiler-safe: avoid `watch()` in render paths, prefer `getValues()`/`setValue()` so lint/build pass without compiler warnings. Confidence: 0.6
- Validate all form fields with react-hook-form (required, format patterns, min-length, confirm-match) and surface inline error messages. Confidence: 0.6
