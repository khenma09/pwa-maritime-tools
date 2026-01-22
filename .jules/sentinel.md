# Sentinel's Journal

## 2023-10-27 - Centralized Input Sanitization
**Vulnerability:** Duplicate and potentially inconsistent `escapeHTML` implementations across multiple JavaScript files (`leaderboard.js`, `review.js`). A missing `js/security.js` file (referenced in memory) meant no centralized security context existed.
**Learning:** Copy-pasting security functions (like input sanitization) leads to maintenance nightmares. If a flaw is found in the regex, you have to fix it everywhere.
**Refinement (Fail-Closed):** Initially, I implemented a "Fail-Open" fallback (`window.Security ? ... : entry.name`). This was a mistake. If the security module fails to load, the application should not default to the insecure state. I refactored it to "Fail-Closed" by removing the fallback. Now, if `Security` is missing, the script throws an error and stops rendering, which is safer than rendering XSS.
**Prevention:** Implemented a centralized `js/security.js` module exposing `window.Security.escapeHTML`. Refactored `leaderboard.js` and `review.js` to use this single source of truth without fallback. Verified that XSS vectors are neutralized and that the app fails securely if the module is missing.
