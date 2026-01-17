# Sentinel Security Journal

## 2023-10-27 - Stored XSS in Leaderboard

**Vulnerability:** Stored Cross-Site Scripting (XSS) vulnerability in `js/leaderboard.js`.
The application renders user-supplied data (specifically the `age` field) directly into the DOM using `innerHTML` without prior sanitization. While other fields like `name` and `category` were escaped, `age` was overlooked, likely because it was expected to be a number. However, since the data source (`localStorage`) can be manipulated by the user (or potentially other vectors), this creates a vulnerability where arbitrary HTML/JS can be executed.

**Learning:** Data type assumptions are a security risk. Even if a variable is named `age` or `quantity`, do not assume it is a safe number when rendering it to the DOM, especially if it comes from an untrusted source like `localStorage`, URL parameters, or user input. In a weakly-typed language like JavaScript, "numbers" can easily be strings containing malicious payloads.

**Prevention:**
1.  **Always Escape on Output:** Treat *all* data inserted into HTML as unsafe. Escape every variable interpolated into an HTML string, regardless of its expected type.
2.  **Use `textContent` where possible:** Prefer setting `textContent` over `innerHTML` when not rendering actual HTML structure.
3.  **Sanitize early:** Validate data types at the boundaries (e.g., when reading from storage or input). If `age` must be a number, parse it as one (`parseInt`) or validate it before using it.
