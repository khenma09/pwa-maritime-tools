/**
 * Security Module
 * Centralizes security functions to prevent vulnerabilities like XSS.
 */

class Security {
    /**
     * Escapes HTML special characters to prevent XSS attacks.
     * @param {string} str - The string to escape.
     * @returns {string} - The escaped string.
     */
    static escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    /**
     * Alias for escapeHTML.
     * @param {string} str - The string to sanitize.
     * @returns {string} - The sanitized string.
     */
    static sanitize(str) {
        return this.escapeHTML(str);
    }
}

// Make globally available
window.Security = Security;
