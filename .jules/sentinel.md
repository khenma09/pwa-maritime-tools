## 2024-03-24 - Stored XSS in Leaderboard

**Vulnerability:**
A stored Cross-Site Scripting (XSS) vulnerability was identified in `js/leaderboard.js`. The `age` field retrieved from `localStorage` (which originates from `sessionStorage` and user input) was being injected into the DOM using `innerHTML` without prior sanitization.

The vulnerable code was:
```javascript
row.innerHTML = `... <td class="name-cell">${safeName} ${entry.age ? `(${entry.age})` : ""}</td> ...`;
```

While `entry.name` and `entry.category` were escaped, `entry.age` was overlooked, likely because it is typically expected to be a number. However, since the data store (`localStorage`) is untrusted, an attacker could manually inject a malicious payload.

**Learning:**
Always treat data from client-side storage (`localStorage`, `sessionStorage`, cookies) as untrusted user input. Even if the application logic *tries* to ensure data validity (e.g., calculating age from date), the storage medium itself can be manipulated.

**Prevention:**
1.  **Output Encoding:** Always encode data before inserting it into the DOM, especially when using `innerHTML`.
2.  **Use `textContent`:** When possible, use `textContent` instead of `innerHTML` to set text content, as it automatically handles escaping.
3.  **Sanitize All Fields:** Apply the `escapeHTML` helper (or a robust sanitization library) to *all* variable data interpolated into HTML strings, not just obvious string fields.
