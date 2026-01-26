## 2026-01-26 - [Credential Exposure in URL via GET Method]
**Vulnerability:** The login form used `method="GET"`, causing credentials to be exposed in the URL query parameters if the JavaScript interception failed or was bypassed.
**Learning:** HTML forms handling sensitive data must never use `GET`, even if JavaScript is intended to handle the submission. JavaScript execution is not guaranteed (e.g., errors, blocking).
**Prevention:** Always use `method="POST"` for forms with sensitive data as a fail-safe, or remove the `action` attribute if purely client-side.

## 2026-01-26 - [Client-Side Form Hijacking via Script Injection]
**Vulnerability:** A generic query selector (`input[type=submit]`) in a global script (`script.js`) hijacked the login form's submit button, preventing login and exposing a regression.
**Learning:** Global scripts that run on multiple pages must strictly scope their element selectors to the specific page context (e.g., checking for page-specific IDs) to avoid unintended side effects on other pages.
**Prevention:** Always verify the existence of page-specific elements (like `document.getElementById('unique-page-id')`) before attaching global event listeners to generic elements.
