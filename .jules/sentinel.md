# Sentinel's Journal

## 2026-02-01 - [Stored XSS in Leaderboard]
**Vulnerability:** Found a Stored Cross-Site Scripting (XSS) vulnerability in `js/leaderboard.js`. The `entry.age` field retrieved from `localStorage` was being rendered directly into the HTML string without escaping, while `name` and `category` were properly escaped.
**Learning:** Even when some fields are escaped, inconsistent application of sanitization can leave gaps. Developers might assume certain fields (like "age") will always be numbers and thus safe, but data in `localStorage` can be tampered with or corrupted.
**Prevention:** Apply output encoding (escaping) to ALL dynamic data inserted into the DOM, regardless of the expected data type. Treat all data from `localStorage` as untrusted input.
