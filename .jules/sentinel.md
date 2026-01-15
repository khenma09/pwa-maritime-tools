## 2026-01-15 - Manual HTML Construction Risks
**Vulnerability:** Stored XSS in Leaderboard (Age field) due to missing manual escaping.
**Learning:** The codebase relies on manual `escapeHTML` calls when constructing HTML strings. This is fragile as it's easy to miss a field (like `age`).
**Prevention:** Use `textContent` where possible, or ensure strictly all data interpolated into HTML strings is passed through escaping functions. Consider a safer templating mechanism.
