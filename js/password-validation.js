/**
 * Password Validation
 * Rules:
 * - Minimum 8 characters
 * - Maximum 22 characters
 * - Allows: uppercase, lowercase, numbers, special characters
 * - Disallows: spaces
 */

const PASSWORD_RULES = {
	minLength: 8,
	maxLength: 22,
	pattern: /^\S{8,22}$/, // No spaces, 8-22 characters
};

/**
 * Validates a password against the defined rules
 * @param {string} password - The password to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
function validatePassword(password) {
	if (!password) {
		return { isValid: false, message: "Password is required" };
	}

	if (password.includes(" ")) {
		return { isValid: false, message: "Password cannot contain spaces" };
	}

	if (password.length < PASSWORD_RULES.minLength) {
		return {
			isValid: false,
			message: `Password must be at least ${PASSWORD_RULES.minLength} characters`,
		};
	}

	if (password.length > PASSWORD_RULES.maxLength) {
		return {
			isValid: false,
			message: `Password cannot exceed ${PASSWORD_RULES.maxLength} characters`,
		};
	}

	return { isValid: true, message: "" };
}

/**
 * Sets up password validation on an input element
 * @param {HTMLInputElement} inputElement - The password input element
 */
function setupPasswordValidation(inputElement) {
	if (!inputElement) return;

	// Create error message element if it doesn't exist
	let errorElement =
		inputElement.parentElement.querySelector(".password-error");
	if (!errorElement) {
		errorElement = document.createElement("span");
		errorElement.className = "password-error";
		errorElement.style.cssText =
			"color: #ef4444; font-size: 12px; margin-top: 4px; display: block;";
		inputElement.parentElement.appendChild(errorElement);
	}

	// Prevent spaces from being typed
	inputElement.addEventListener("keydown", function (e) {
		if (e.key === " ") {
			e.preventDefault();
		}
	});

	// Real-time validation on input
	inputElement.addEventListener("input", function () {
		const validation = validatePassword(this.value);

		if (!validation.isValid && this.value.length > 0) {
			errorElement.textContent = validation.message;
			this.style.borderColor = "rgba(239, 68, 68, 0.8)";
		} else {
			errorElement.textContent = "";
			this.style.borderColor = "";
		}
	});

	// Validation on blur
	inputElement.addEventListener("blur", function () {
		const validation = validatePassword(this.value);

		if (!validation.isValid && this.value.length > 0) {
			errorElement.textContent = validation.message;
			this.style.borderColor = "rgba(239, 68, 68, 0.8)";
		} else if (validation.isValid) {
			this.style.borderColor = "rgba(34, 197, 94, 0.8)";
			errorElement.textContent = "";
		}
	});
}

// Initialize validation when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
	const passwordInput = document.getElementById("password");
	if (passwordInput) {
		setupPasswordValidation(passwordInput);

		// Add form submit validation
		const form = passwordInput.closest("form");
		if (form) {
			form.addEventListener("submit", function (e) {
				const validation = validatePassword(passwordInput.value);
				if (!validation.isValid) {
					e.preventDefault();
					const errorElement =
						passwordInput.parentElement.querySelector(".password-error");
					if (errorElement) {
						errorElement.textContent = validation.message;
					}
					passwordInput.style.borderColor = "rgba(239, 68, 68, 0.8)";
					passwordInput.focus();
				}
			});
		}
	}

	// Also handle confirm password fields if they exist
	const confirmPasswordInput = document.getElementById("confirmPassword");
	if (confirmPasswordInput) {
		setupPasswordValidation(confirmPasswordInput);
	}

	// Handle new password fields (for password reset)
	const newPasswordInput = document.getElementById("newPassword");
	if (newPasswordInput) {
		setupPasswordValidation(newPasswordInput);
	}
});
