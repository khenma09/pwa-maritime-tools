/**
 * Custom Dropdown Component - JavaScript
 * Unified dropdown functionality for all pages
 * Provides accessible, keyboard-navigable custom dropdowns
 */

(function () {
	"use strict";

	/**
	 * Initialize all custom dropdowns on the page
	 */
	function initCustomDropdowns() {
		const dropdowns = document.querySelectorAll(".custom-dropdown");

		dropdowns.forEach((dropdown) => {
			// Skip if already initialized
			if (dropdown.dataset.initialized === "true") return;

			const trigger = dropdown.querySelector(".dropdown-trigger");
			const menu = dropdown.querySelector(".dropdown-menu");
			const options = dropdown.querySelectorAll(".dropdown-option");
			const valueDisplay = dropdown.querySelector(".dropdown-value");
			const dropdownName = dropdown.dataset.dropdown;

			if (!trigger || !menu) return;

			// Create hidden input for form submission if it doesn't exist
			let hiddenInput = dropdown.querySelector('input[type="hidden"]');
			if (!hiddenInput && dropdownName) {
				hiddenInput = document.createElement("input");
				hiddenInput.type = "hidden";
				hiddenInput.name = dropdownName;
				hiddenInput.id = dropdownName;
				dropdown.appendChild(hiddenInput);
			}

			// Toggle dropdown on click
			trigger.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();

				const isOpen = dropdown.classList.contains("open");
				closeAllDropdowns();

				if (!isOpen) {
					dropdown.classList.add("open");
					// Focus first option for keyboard navigation
					const firstOption = menu.querySelector(".dropdown-option");
					if (firstOption) firstOption.focus();
				}
			});

			// Select option on click
			options.forEach((option) => {
				option.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();
					selectOption(dropdown, option);
				});

				// Keyboard navigation for options
				option.addEventListener("keydown", (e) => {
					handleOptionKeydown(e, dropdown, option, options);
				});

				// Make options focusable
				option.setAttribute("tabindex", "-1");
				option.setAttribute("role", "option");
			});

			// Keyboard navigation for trigger
			trigger.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
					e.preventDefault();
					dropdown.classList.add("open");
					const firstOption = menu.querySelector(".dropdown-option");
					if (firstOption) firstOption.focus();
				}
			});

			// Set ARIA attributes
			menu.setAttribute("role", "listbox");
			trigger.setAttribute("aria-haspopup", "listbox");
			trigger.setAttribute("aria-expanded", "false");

			// Mark as initialized
			dropdown.dataset.initialized = "true";

			// Set initial selected value if there's a pre-selected option
			const preSelected = dropdown.querySelector(".dropdown-option.selected");
			if (preSelected && hiddenInput) {
				hiddenInput.value = preSelected.dataset.value || "";
			}
		});
	}

	/**
	 * Select an option in the dropdown
	 */
	function selectOption(dropdown, option) {
		const options = dropdown.querySelectorAll(".dropdown-option");
		const valueDisplay = dropdown.querySelector(".dropdown-value");
		const hiddenInput = dropdown.querySelector('input[type="hidden"]');
		const trigger = dropdown.querySelector(".dropdown-trigger");

		// Update selected state
		options.forEach((opt) => {
			opt.classList.remove("selected");
			opt.setAttribute("aria-selected", "false");
		});
		option.classList.add("selected");
		option.setAttribute("aria-selected", "true");

		// Update display value
		if (valueDisplay) {
			valueDisplay.textContent = option.textContent.trim();
			valueDisplay.classList.remove("dropdown-placeholder");
		}

		// Update hidden input value
		if (hiddenInput) {
			hiddenInput.value = option.dataset.value || "";
		}

		// Close dropdown
		dropdown.classList.remove("open");
		trigger.setAttribute("aria-expanded", "false");

		// Return focus to trigger
		trigger.focus();

		// Dispatch change event
		const event = new CustomEvent("dropdown:change", {
			detail: {
				value: option.dataset.value,
				text: option.textContent.trim(),
				dropdown: dropdown.dataset.dropdown,
			},
			bubbles: true,
		});
		dropdown.dispatchEvent(event);
	}

	/**
	 * Handle keyboard navigation within options
	 */
	function handleOptionKeydown(e, dropdown, currentOption, options) {
		const optionsArray = Array.from(options);
		const currentIndex = optionsArray.indexOf(currentOption);

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				if (currentIndex < optionsArray.length - 1) {
					optionsArray[currentIndex + 1].focus();
				}
				break;

			case "ArrowUp":
				e.preventDefault();
				if (currentIndex > 0) {
					optionsArray[currentIndex - 1].focus();
				}
				break;

			case "Enter":
			case " ":
				e.preventDefault();
				selectOption(dropdown, currentOption);
				break;

			case "Escape":
				e.preventDefault();
				dropdown.classList.remove("open");
				dropdown.querySelector(".dropdown-trigger").focus();
				break;

			case "Home":
				e.preventDefault();
				optionsArray[0].focus();
				break;

			case "End":
				e.preventDefault();
				optionsArray[optionsArray.length - 1].focus();
				break;
		}
	}

	/**
	 * Close all open dropdowns
	 */
	function closeAllDropdowns() {
		document.querySelectorAll(".custom-dropdown.open").forEach((d) => {
			d.classList.remove("open");
			const trigger = d.querySelector(".dropdown-trigger");
			if (trigger) trigger.setAttribute("aria-expanded", "false");
		});
	}

	/**
	 * Get the value of a dropdown by name
	 */
	function getDropdownValue(dropdownName) {
		const dropdown = document.querySelector(
			`[data-dropdown="${dropdownName}"]`
		);
		const selected = dropdown?.querySelector(".dropdown-option.selected");
		return selected?.dataset.value || "";
	}

	/**
	 * Set the value of a dropdown by name
	 */
	function setDropdownValue(dropdownName, value) {
		const dropdown = document.querySelector(
			`[data-dropdown="${dropdownName}"]`
		);
		if (!dropdown) return;

		const options = dropdown.querySelectorAll(".dropdown-option");
		const valueDisplay = dropdown.querySelector(".dropdown-value");
		const hiddenInput = dropdown.querySelector('input[type="hidden"]');

		options.forEach((option) => {
			if (option.dataset.value === value) {
				options.forEach((opt) => opt.classList.remove("selected"));
				option.classList.add("selected");
				if (valueDisplay) {
					valueDisplay.textContent = option.textContent.trim();
					valueDisplay.classList.remove("dropdown-placeholder");
				}
				if (hiddenInput) {
					hiddenInput.value = value;
				}
			}
		});
	}

	/**
	 * Reset a dropdown to its initial state
	 */
	function resetDropdown(dropdownName) {
		const dropdown = document.querySelector(
			`[data-dropdown="${dropdownName}"]`
		);
		if (!dropdown) return;

		const options = dropdown.querySelectorAll(".dropdown-option");
		const valueDisplay = dropdown.querySelector(".dropdown-value");
		const hiddenInput = dropdown.querySelector('input[type="hidden"]');
		const placeholder =
			dropdown.dataset.placeholder ||
			valueDisplay?.dataset.placeholder ||
			"Select";

		options.forEach((opt) => opt.classList.remove("selected"));

		if (valueDisplay) {
			valueDisplay.textContent = placeholder;
			valueDisplay.classList.add("dropdown-placeholder");
		}

		if (hiddenInput) {
			hiddenInput.value = "";
		}
	}

	// Close dropdowns when clicking outside
	document.addEventListener("click", (e) => {
		if (!e.target.closest(".custom-dropdown")) {
			closeAllDropdowns();
		}
	});

	// Close dropdowns on Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			closeAllDropdowns();
		}
	});

	// Initialize on DOM ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initCustomDropdowns);
	} else {
		initCustomDropdowns();
	}

	// Re-initialize when needed (for dynamically added dropdowns)
	window.initCustomDropdowns = initCustomDropdowns;

	// Expose utility functions globally
	window.customDropdown = {
		init: initCustomDropdowns,
		getValue: getDropdownValue,
		setValue: setDropdownValue,
		reset: resetDropdown,
		closeAll: closeAllDropdowns,
	};
})();
