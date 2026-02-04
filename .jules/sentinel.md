## 2023-10-27 - Implicit Trust in Numeric Fields Leading to Stored XSS
**Vulnerability:** Identified Stored Cross-Site Scripting (XSS) in `js/leaderboard.js`. Fields `age`, `correctAnswers`, and `totalQuestions` retrieved from `localStorage` were inserted directly into the DOM without escaping.
**Learning:** The code assumed these fields would always be numeric because they are numbers in the application flow. However, `localStorage` can be manipulated by attackers or malicious scripts, allowing arbitrary strings to be injected.
**Prevention:** Treat all data from external sources (including client-side storage) as untrusted strings. Apply HTML escaping to EVERY variable interpolated into HTML templates, even if it "should" be a number.
