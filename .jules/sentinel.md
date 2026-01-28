## 2026-01-28 - [Centralized Input Sanitization]
**Vulnerability:** Duplicate and potentially inconsistent `escapeHTML` functions in multiple JavaScript files.
**Learning:** In decentralized client-side applications, security logic (like input sanitization) is often copy-pasted, leading to maintenance issues and potential gaps if one instance is missed or flawed.
**Prevention:** Centralize all security functions in a dedicated `js/security.js` module and enforce its usage across the application using strict code reviews or linting rules.
