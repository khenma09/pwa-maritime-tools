/**
 * Security Utility Functions
 * Centralized security logic to prevent XSS and other vulnerabilities.
 */

(function(global) {
    // Create a namespace for security utilities
    const Security = {
        /**
         * Escapes HTML special characters to prevent XSS.
         * @param {string|number} str - The input string to escape.
         * @returns {string} The escaped string.
         */
        escapeHTML: function(str) {
            if (str === null || str === undefined) {
                return '';
            }
            return String(str).replace(/[&<>"']/g, function(m) {
                switch (m) {
                    case '&': return '&amp;';
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '"': return '&quot;';
                    case "'": return '&#39;';
                    default: return m;
                }
            });
        }
    };

    // Expose to global scope
    global.Security = Security;

    // Also expose escapeHTML directly if preferred, or keep it namespaced.
    global.escapeHTML = Security.escapeHTML;

})(window);
