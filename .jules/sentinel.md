## 2026-02-03 - Stored XSS in Leaderboard
**Vulnerability:** Unescaped `age` field in `leaderboard.js` allowed Stored XSS via `localStorage`.
**Learning:** Even fields expected to be numeric (like age) must be escaped when rendering to HTML, as the data source (`localStorage`) is untrusted and can be manipulated to contain strings.
**Prevention:** Always escape all variables injected into HTML templates using `escapeHTML`, or use `textContent` where possible. Ensure `escapeHTML` handles non-string inputs gracefully (e.g. `String(input)`).
