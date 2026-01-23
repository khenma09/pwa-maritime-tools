## 2026-01-23 - XSS in Leaderboard Age Field
**Vulnerability:** Found a Stored XSS vulnerability in `leaderboard.js` where the `age` field retrieved from `sessionStorage` was rendered directly into `innerHTML` without escaping.
**Learning:** Even fields that seem numeric (like age) can be vectors for XSS if they come from trusted storage (`sessionStorage`) that can be manipulated or if the upstream validation is bypassed. Also, duplicated security logic (like `escapeHTML` in multiple files) leads to inconsistencies where some fields are escaped and others are forgotten.
**Prevention:** Centralize security functions (like `js/security.js`) and ensure ALL dynamic data inserted into `innerHTML` is passed through these functions. Prefer `textContent` when possible.
