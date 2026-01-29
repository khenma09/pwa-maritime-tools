/**
 * Security Utility
 * Centralized security functions for input sanitization and validation.
 */
const Security = {
    /**
     * Escapes HTML special characters to prevent XSS attacks.
     * @param {string} str - The input string to escape.
     * @returns {string} The escaped string.
     */
    escapeHTML: function (str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
};

// Expose globally
window.Security = Security;
