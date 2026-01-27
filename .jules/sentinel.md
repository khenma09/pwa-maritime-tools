## 2026-01-27 - [Decentralized Sanitization Logic]
**Vulnerability:** Inconsistent or missing input sanitization due to code duplication across multiple files.
**Learning:** Maintaining separate sanitization functions (`escapeHTML`) in multiple files (`leaderboard.js`, `review.js`) increases the risk of inconsistencies and makes it harder to update security logic globally.
**Prevention:** Centralize security-critical functions (like sanitization) into a single, globally accessible utility (`js/security.js`) and enforce its usage across the application.
