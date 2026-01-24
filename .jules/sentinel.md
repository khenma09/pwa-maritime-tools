## 2026-01-24 - Type Confusion in Sanitization
**Vulnerability:** Sanitization functions that fail to coerce input to string can be bypassed by passing non-string types (e.g., Arrays) which are then implicitly converted to strings during template interpolation.
**Learning:** `typeof str !== 'string'` checks are dangerous in sanitizers because they allow non-string inputs to pass through unescaped.
**Prevention:** Always explicitly coerce inputs to string (e.g., `String(input)`) at the beginning of any sanitization function.
