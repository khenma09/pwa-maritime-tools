/**
 * Custom Modal Alert System
 * Replaces browser alerts with styled modals matching the purple theme
 */

class CustomModal {
	constructor() {
		this.overlay = null;
		this.modal = null;
	}

	/**
	 * Initialize modal elements in the DOM
	 */
	init() {
		// Check if overlay already exists
		const existingOverlay = document.querySelector(".custom-modal-overlay");
		if (existingOverlay) {
			this.overlay = existingOverlay;
			this.modal = existingOverlay.querySelector(".custom-modal");
			return;
		}

		// Create overlay if it doesn't exist
		const overlay = document.createElement("div");
		overlay.className = "custom-modal-overlay";
		overlay.innerHTML = `
			<div class="custom-modal">
				<div class="modal-content">
					<h2 class="modal-title" id="modalTitle">Alert</h2>
					<p class="modal-message" id="modalMessage">Message</p>
				</div>
				<div class="modal-buttons" id="modalButtons">
					<button class="modal-btn modal-btn-primary" data-action="ok">OK</button>
				</div>
			</div>
		`;
		document.body.appendChild(overlay);
		this.overlay = overlay;
		this.modal = overlay.querySelector(".custom-modal");
	}

	/**
	 * Show alert with single OK button
	 * @param {string} message - Alert message
	 * @param {string} title - Alert title (optional)
	 */
	alert(message, title = "Alert") {
		return new Promise((resolve) => {
			this.show(message, title, ["ok"], () => resolve(true));
		});
	}

	/**
	 * Show confirmation dialog with OK and Cancel buttons
	 * @param {string} message - Confirmation message
	 * @param {string} title - Dialog title (optional)
	 */
	confirm(message, title = "Confirm") {
		return new Promise((resolve) => {
			this.show(message, title, ["cancel", "ok"], (action) => {
				resolve(action === "ok");
			});
		});
	}

	/**
	 * Internal method to show modal
	 * @private
	 */
	show(message, title, buttons, callback) {
		if (!this.overlay) this.init();

		// Set content
		document.getElementById("modalTitle").textContent = title;
		document.getElementById("modalMessage").textContent = message;

		// Clear and set buttons
		const buttonsContainer = document.getElementById("modalButtons");
		buttonsContainer.innerHTML = "";

		buttons.forEach((btnType) => {
			const button = document.createElement("button");
			button.className = `modal-btn ${
				btnType === "ok" ? "modal-btn-primary" : "modal-btn-secondary"
			}`;
			button.textContent = btnType === "ok" ? "OK" : "Cancel";
			button.setAttribute("data-action", btnType);

			button.addEventListener("click", () => {
				this.hide();
				callback(btnType);
			});

			buttonsContainer.appendChild(button);
		});

		// Show overlay and modal
		this.overlay.classList.add("show");

		// Focus primary button for accessibility
		buttonsContainer.querySelector('[data-action="ok"]')?.focus();

		// Close on overlay click (only if there's a cancel button)
		const closeOnOverlay = (e) => {
			if (e.target === this.overlay && buttons.includes("cancel")) {
				this.hide();
				callback("cancel");
				this.overlay.removeEventListener("click", closeOnOverlay);
			}
		};
		this.overlay.addEventListener("click", closeOnOverlay);

		// Close on ESC key (only if there's a cancel button)
		const closeOnEsc = (e) => {
			if (e.key === "Escape" && buttons.includes("cancel")) {
				this.hide();
				callback("cancel");
				document.removeEventListener("keydown", closeOnEsc);
			}
		};
		document.addEventListener("keydown", closeOnEsc);
	}

	/**
	 * Hide modal
	 * @private
	 */
	hide() {
		if (this.overlay) {
			this.overlay.classList.remove("show");
		}
	}
}

// Initialize when DOM is ready
let customModal = null;

function initializeCustomModal() {
	if (!customModal) {
		customModal = new CustomModal();
		customModal.init();
	}
}

// Ensure initialization happens when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeCustomModal);
} else {
	// DOM is already loaded
	initializeCustomModal();
}

/**
 * Global function replacements for alert/confirm
 * Can be called like: showAlert("Message") or showConfirm("Message").then(result => {...})
 */
window.showAlert = function (message, title = "Alert") {
	if (!customModal) initializeCustomModal();
	return customModal.alert(message, title);
};

window.showConfirm = function (message, title = "Confirm") {
	if (!customModal) initializeCustomModal();
	return customModal.confirm(message, title);
};
