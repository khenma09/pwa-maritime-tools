## 2026-01-30 - LocalStorage is Untrusted Input
**Vulnerability:** Stored XSS in Leaderboard via `localStorage` injection. The application trusted data read from `localStorage` ("quizLeaderboard"), assuming it was safe because it was written by the app. However, `age` field was not escaped during rendering.
**Learning:** `localStorage` is not a secure storage for trusted data. It can be modified by XSS in other parts of the application or by the user. Data retrieved from client-side storage must be treated as untrusted and sanitized before rendering.
**Prevention:** Always sanitize/escape data read from `localStorage`, `sessionStorage`, or cookies before rendering it to the DOM. Treat it as if it came from an external API.
