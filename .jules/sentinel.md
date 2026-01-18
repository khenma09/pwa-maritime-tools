# Sentinel's Journal

## 2023-10-27 - Stored XSS in Client-Side Leaderboard
**Vulnerability:** Stored Cross-Site Scripting (XSS) vulnerability in `leaderboard.js` where user age retrieved from `localStorage` was rendered without sanitization.
**Learning:** In this serverless PWA architecture, `localStorage` acts as the primary database. Developers may mistakenly treat it as a trusted source because "we put the data there". However, `localStorage` is fully accessible to the client and can be manipulated by malicious actors or scripts, making it an untrusted input source.
**Prevention:** Treat all data from `localStorage` (and `sessionStorage`) as untrusted user input. Apply strict output encoding (e.g., `escapeHTML`) before rendering any stored data into the DOM.
