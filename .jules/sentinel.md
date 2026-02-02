## 2026-02-02 - Inconsistent Output Encoding in Leaderboard
**Vulnerability:** Stored XSS in `leaderboard.js` where `entry.age` was rendered without escaping, while `name` and `category` were escaped.
**Learning:** Incomplete application of manual escaping functions. The assumption that `age` is numeric led to bypassing security checks.
**Prevention:** Always escape all user-controlled data before rendering to DOM.
