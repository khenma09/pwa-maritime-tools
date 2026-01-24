/**
 * centralized security module
 * Handles input sanitization and other security-related functions.
 */

class Security {
    /**
     * Escapes HTML characters to prevent XSS attacks.
     * @param {any} str - The input to escape.
     * @returns {string} - The escaped string.
     */
    static escapeHTML(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
}

// Expose Security class globally
window.Security = Security;
