/**
 * Username Validation
 * Rules:
 * - Minimum 8 characters
 * - Maximum 12 characters
 * - Allows: uppercase, lowercase, numbers, special characters
 * - Disallows: spaces
 */

const USERNAME_RULES = {
	minLength: 8,
	maxLength: 12,
	pattern: /^\S{8,12}$/, // No spaces, 8-12 characters
};

/**
 * Validates a username against the defined rules
 * @param {string} username - The username to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
function validateUsername(username) {
	if (!username) {
		return { isValid: false, message: "Username is required" };
	}

	if (username.includes(" ")) {
		return { isValid: false, message: "Username cannot contain spaces" };
	}

	if (username.length < USERNAME_RULES.minLength) {
		return {
			isValid: false,
			message: `Username must be at least ${USERNAME_RULES.minLength} characters`,
		};
	}

	if (username.length > USERNAME_RULES.maxLength) {
		return {
			isValid: false,
			message: `Username cannot exceed ${USERNAME_RULES.maxLength} characters`,
		};
	}

	return { isValid: true, message: "" };
}

/**
 * Sets up username validation on an input element
 * @param {HTMLInputElement} inputElement - The username input element
 */
function setupUsernameValidation(inputElement) {
	if (!inputElement) return;

	// Create error message element if it doesn't exist
	let errorElement =
		inputElement.parentElement.querySelector(".username-error");
	if (!errorElement) {
		errorElement = document.createElement("span");
		errorElement.className = "username-error";
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
		const validation = validateUsername(this.value);

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
		const validation = validateUsername(this.value);

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
	const usernameInput = document.getElementById("username");
	if (usernameInput) {
		setupUsernameValidation(usernameInput);

		// Add form submit validation
		const form = usernameInput.closest("form");
		if (form) {
			form.addEventListener("submit", function (e) {
				const validation = validateUsername(usernameInput.value);
				if (!validation.isValid) {
					e.preventDefault();
					const errorElement =
						usernameInput.parentElement.querySelector(".username-error");
					if (errorElement) {
						errorElement.textContent = validation.message;
					}
					usernameInput.style.borderColor = "rgba(239, 68, 68, 0.8)";
					usernameInput.focus();
				}
			});
		}
	}
});
