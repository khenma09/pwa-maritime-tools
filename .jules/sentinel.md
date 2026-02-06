## 2026-02-06 - [Stored XSS via Age Field]
**Vulnerability:** The leaderboard display logic assumed the `age` field was a safe number and did not escape it before rendering. Since the data source is `localStorage`, which is client-modifiable, an attacker could inject malicious HTML.
**Learning:** Security assumptions about data types (e.g., "age is always a number") are dangerous when the data source is untrusted or modifiable.
**Prevention:** Apply output encoding/escaping to ALL variables inserted into HTML contexts, regardless of their expected type or source.
