## 2026-02-05 - [Leaderboard Stored XSS]
**Vulnerability:** Stored XSS in `leaderboard.js` where user `age` was interpolated into `innerHTML` without escaping.
**Learning:** Even fields expected to be numeric (like age) must be treated as untrusted strings when reading from client-side storage, as storage can be manipulated or contain non-numeric data.
**Prevention:** Always escape all variables before inserting them into `innerHTML` or use `textContent`/`innerText` where possible.
