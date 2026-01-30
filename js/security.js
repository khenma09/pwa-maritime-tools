/**
 * Security utility class for handling common security operations.
 * Centralizes input sanitization and other security functions.
 */
class Security {
    /**
     * Escapes HTML special characters to prevent XSS.
     * @param {string|number} str - The input string to escape.
     * @returns {string} The escaped string safe for HTML insertion.
     */
    static escapeHTML(str) {
        if (str === null || str === undefined) {
            return '';
        }
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
}

// Make it available globally
window.Security = Security;
