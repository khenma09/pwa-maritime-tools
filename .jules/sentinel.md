## 2023-10-27 - Stored XSS in Leaderboard
**Vulnerability:** User age was interpolated directly into the leaderboard HTML without sanitization: `td class="name-cell">${safeName} ${entry.age ? "(" + entry.age + ")" : ""}</td>`. This allowed XSS execution if the age value in localStorage was compromised or manipulated.
**Learning:** Even calculated values (like age from DOB) should be sanitized if they are stored and retrieved from client-side storage, as the storage mechanism (localStorage) is not tamper-proof and can be modified by the user or other scripts. Centralized security utilities are crucial to prevent missed escape calls.
**Prevention:**
1. Centralized `escapeHTML` logic in `js/security.js`.
2. All data rendering to DOM via `innerHTML` must use the centralized sanitization function.
3. Adopted a "Defense in Depth" approach by escaping all variable inputs to HTML, even those assumed to be safe types.
