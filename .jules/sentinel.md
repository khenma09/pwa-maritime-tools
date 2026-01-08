## 2024-05-23 - Stored XSS in Leaderboard
**Vulnerability:** User data stored in `localStorage` was being rendered directly into the DOM via `innerHTML` without escaping, allowing for Stored XSS if the storage was tampered with.
**Learning:** Even in client-side only apps using `localStorage`, data should be treated as untrusted because it can be manipulated by the user or other scripts.
**Prevention:** Always escape all variables interpolated into HTML strings, even if they are expected to be numbers or simple types. Used `escapeHTML` on all fields.