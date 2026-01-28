/**
 * Security utilities for the application.
 * Follows 'Fail-Closed' pattern: if this object is missing,
 * dependent scripts should fail rather than render insecurely.
 */
const Security = {
    /**
     * Escapes HTML special characters to prevent XSS.
     * @param {string} str - The input string to escape.
     * @returns {string} The escaped string.
     */
    escapeHTML: function(str) {
        if (str === null || str === undefined) {
            return "";
        }
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
};

// Expose to window for global access
window.Security = Security;
