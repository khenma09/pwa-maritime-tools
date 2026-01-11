## 2024-05-22 - Stored XSS in Leaderboard
**Vulnerability:** Found a Stored Cross-Site Scripting (XSS) vulnerability in `js/leaderboard.js` where the `age` field from `localStorage` was inserted into `innerHTML` without sanitization.
**Learning:** Even internal data sources like `localStorage` must be treated as untrusted, as they can be manipulated by other users (shared device scenario) or malicious scripts. Numeric fields should not be assumed safe if inserted as strings.
**Prevention:** Always escape data before inserting into `innerHTML`, regardless of the expected data type. Use `textContent` where possible, or consistent `escapeHTML` utilities for template literals.
