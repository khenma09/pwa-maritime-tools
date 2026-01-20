# Sentinel's Journal

## 2025-02-28 - Unescaped Numeric Fields in HTML Construction
**Vulnerability:** XSS via unescaped `age` field in `leaderboard.js`.
**Learning:** Developers often assume numeric fields like `age` are safe and don't need escaping, but in a client-side app where storage can be manipulated, even "numeric" fields can contain malicious strings.
**Prevention:** Always escape ALL data interpolated into HTML strings, regardless of the expected data type. Use a template engine or safe DOM methods (textContent) when possible instead of `innerHTML`.
