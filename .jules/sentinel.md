## 2026-01-29 - Centralized Client-Side Sanitization
**Vulnerability:** Potential XSS due to duplicated and ad-hoc `escapeHTML` functions in multiple JavaScript files (`leaderboard.js`, `review.js`).
**Learning:** In a client-side only architecture where data is persisted in `localStorage` or `sessionStorage`, trust boundaries are blurry. Input sanitization MUST happen consistently at the point of rendering. Duplicating sanitization logic leads to maintenance gaps where new features might implement it incorrectly or forget it entirely.
**Prevention:** Implement a centralized `Security` utility module (e.g., `js/security.js`) that exposes standardized sanitization methods. Enforce its usage across the entire codebase for any dynamic HTML generation.
