## 2023-10-27 - [Duplicate Sanitization Logic]
**Vulnerability:** XSS vulnerability potential due to duplicated and locally-scoped `escapeHTML` functions in multiple JS files.
**Learning:** Manual implementation of security functions leads to inconsistency and maintenance risks.
**Prevention:** Centralize security logic in a dedicated module (e.g., `js/security.js`) and enforce its use globally.
