/**
 * Security Utilities
 * Centralized security functions for input sanitization and validation.
 */

window.Security = (function() {
    return {
        /**
         * Escapes HTML special characters to prevent XSS attacks.
         * @param {string} str - The string to escape.
         * @returns {string} The escaped string.
         */
        escapeHTML: function(str) {
            if (str === null || str === undefined) return "";
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }
    };
})();
