document.addEventListener("DOMContentLoaded", function () {
	// Get form elements
	const etaForm = document.getElementById("etaForm");
	const calculateBtn = document.getElementById("calculateBtn");
	const clearBtn = document.getElementById("clearBtn");
	const resultsContainer = document.getElementById("results");
	const errorMessage = document.getElementById("errorMessage");
	const modeRadios = document.querySelectorAll('input[name="calcMode"]');
	const modeOptions = document.querySelectorAll(".mode-option");

	if (!calculateBtn || !etaForm || !resultsContainer) {
		console.error("Critical elements not found in DOM");
		return;
	}

	// Custom Dropdown Functionality
	function initCustomDropdowns() {
		const dropdowns = document.querySelectorAll(".custom-dropdown");

		dropdowns.forEach((dropdown) => {
			const trigger = dropdown.querySelector(".dropdown-trigger");
			const options = dropdown.querySelectorAll(".dropdown-option");
			const valueDisplay = dropdown.querySelector(".dropdown-value");

			if (!trigger) return;

			// Toggle dropdown on click
			trigger.addEventListener("click", (e) => {
				e.stopPropagation();
				closeAllDropdowns();
				dropdown.classList.toggle("open");
			});

			// Select option on click
			options.forEach((option) => {
				option.addEventListener("click", () => {
					// Update selected state
					options.forEach((opt) => opt.classList.remove("selected"));
					option.classList.add("selected");

					// Update display value
					valueDisplay.textContent = option.textContent;

					// Close dropdown
					dropdown.classList.remove("open");
				});
			});
		});

		// Close dropdowns when clicking outside
		document.addEventListener("click", closeAllDropdowns);
	}

	function closeAllDropdowns() {
		document.querySelectorAll(".custom-dropdown.open").forEach((d) => {
			d.classList.remove("open");
		});
	}

	function getDropdownValue(dropdownName) {
		const dropdown = document.querySelector(
			`[data-dropdown="${dropdownName}"]`
		);
		const selected = dropdown?.querySelector(".dropdown-option.selected");
		return selected?.dataset.value || "0";
	}

	function setDropdownValue(dropdownName, value) {
		const dropdown = document.querySelector(
			`[data-dropdown="${dropdownName}"]`
		);
		if (!dropdown) return;

		const options = dropdown.querySelectorAll(".dropdown-option");
		const valueDisplay = dropdown.querySelector(".dropdown-value");

		options.forEach((option) => {
			if (option.dataset.value === value) {
				options.forEach((opt) => opt.classList.remove("selected"));
				option.classList.add("selected");
				if (valueDisplay) {
					valueDisplay.textContent = option.textContent;
				}
			}
		});
	}

	// Initialize custom dropdowns
	initCustomDropdowns();

	// Set current datetime as default
	const now = new Date();
	const defaultDateTime = now.toISOString().slice(0, 16);
	document.getElementById("departureTime").value = defaultDateTime;

	// Default target arrival: 3 days after departure for convenience
	const defaultArrival = new Date(now.getTime() + 72 * 3600000);
	const targetArrivalInput = document.getElementById("targetArrivalTime");
	if (targetArrivalInput) {
		targetArrivalInput.value = defaultArrival.toISOString().slice(0, 16);
	}

	// Input field references
	const inputs = {
		departurePort: document.getElementById("departurePort"),
		departureTime: document.getElementById("departureTime"),
		arrivalPort: document.getElementById("arrivalPort"),
		targetArrivalTime: document.getElementById("targetArrivalTime"),
		distance: document.getElementById("distance"),
		averageSpeed: document.getElementById("averageSpeed"),
		weatherFactor: document.getElementById("weatherFactor"),
		portDelay: document.getElementById("portDelay"),
		canalDelay: document.getElementById("canalDelay"),
		notes: document.getElementById("notes"),
	};

	// Validate inputs
	function getMode() {
		const checked = document.querySelector('input[name="calcMode"]:checked');
		return checked ? checked.value : "eta";
	}

	function updateModeUI() {
		const mode = getMode();
		const isSpeedMode = mode === "speed";

		// Toggle active styling on labels
		modeOptions.forEach((opt) => {
			opt.classList.toggle("active", opt.querySelector("input").checked);
		});

		// Show/hide relevant inputs
		const speedOnly = document.querySelectorAll(".speed-only");
		const etaOnly = document.querySelectorAll(".eta-only");

		speedOnly.forEach((el) => {
			el.style.display = isSpeedMode ? "block" : "none";
		});
		etaOnly.forEach((el) => {
			el.style.display = isSpeedMode ? "none" : "block";
			if (el.tagName === "INPUT") {
				el.required = !isSpeedMode;
			}
		});

		if (inputs.targetArrivalTime) {
			inputs.targetArrivalTime.required = isSpeedMode;
		}

		// Update title and description
		const titleEl = document.getElementById("calcTitle");
		const descEl = document.getElementById("calcDescription");
		if (titleEl) {
			titleEl.textContent = isSpeedMode
				? "Calculate Required Speed"
				: "Calculate Estimated Time of Arrival (ETA)";
		}
		if (descEl) {
			descEl.textContent = isSpeedMode
				? "Enter departure time, target arrival time, distance, and delays to calculate the required speed"
				: "Enter vessel information to calculate ETA based on distance, speed, and operational factors";
		}

		// Button text for clarity
		if (calculateBtn) {
			calculateBtn.textContent = isSpeedMode
				? "📊 Calculate Required Speed"
				: "📊 Calculate ETA";
		}

		// Show/hide result cards based on mode
		const speedResultCard = document.querySelectorAll(
			".result-card.speed-only"
		);
		const etaResultCard = document.querySelectorAll(".result-card.eta-only");
		speedResultCard.forEach(
			(card) => (card.style.display = isSpeedMode ? "block" : "none")
		);
		etaResultCard.forEach(
			(card) => (card.style.display = isSpeedMode ? "none" : "block")
		);

		// Hide results and errors when toggling modes
		resultsContainer.classList.remove("show");
		errorMessage.classList.remove("show");
	}

	function validateInputs() {
		const distance = parseFloat(inputs.distance.value);
		const averageSpeed = parseFloat(inputs.averageSpeed.value);
		const mode = getMode();
		const isSpeedMode = mode === "speed";

		// Clear previous errors
		errorMessage.classList.remove("show");
		errorMessage.textContent = "";

		// Validate distance
		if (isNaN(distance) || distance <= 0) {
			showError("Please enter a valid distance greater than 0");
			return false;
		}

		// Validate speed when in ETA mode
		if (!isSpeedMode) {
			if (isNaN(averageSpeed) || averageSpeed <= 0) {
				showError("Please enter a valid average speed greater than 0");
				return false;
			}
		}

		// Validate target arrival when in speed mode
		if (isSpeedMode) {
			if (!inputs.targetArrivalTime.value) {
				showError("Please select a target arrival (ETA) time");
				return false;
			}
		}

		// Validate departure time
		if (!inputs.departureTime.value) {
			showError("Please select a departure time");
			return false;
		}

		return true;
	}

	// Show error message
	function showError(message) {
		errorMessage.textContent = "⚠️ " + message;
		errorMessage.classList.add("show");
		resultsContainer.classList.remove("show");
	}

	// Calculate ETA
	function calculateETA() {
		console.log("calculateETA function called");

		if (!validateInputs()) {
			console.log("Validation failed");
			return;
		}

		try {
			// Get input values
			const departureTime = new Date(inputs.departureTime.value);
			const distance = parseFloat(inputs.distance.value);
			const averageSpeedInput = parseFloat(inputs.averageSpeed.value);
			const weatherFactor = parseFloat(inputs.weatherFactor.value) || 0;
			const portDelay = parseFloat(inputs.portDelay.value) || 0;
			const canalDelay = parseFloat(inputs.canalDelay.value) || 0;
			const departureTimeZoneOffset = parseFloat(
				getDropdownValue("departureTimeZone")
			);
			const arrivalTimeZoneOffset = parseFloat(
				getDropdownValue("arrivalTimeZone")
			);
			const targetArrivalInput = inputs.targetArrivalTime.value
				? new Date(inputs.targetArrivalTime.value)
				: null;
			const mode = getMode();
			const isSpeedMode = mode === "speed";

			console.log("Inputs:", {
				departureTime,
				distance,
				averageSpeedInput,
				weatherFactor,
				portDelay,
				canalDelay,
				targetArrivalInput,
			});

			// Calculate steaming time (sailing time in hours)
			let steamingTimeHours;
			let avgSpeed = averageSpeedInput;
			let etaDate;

			// Calculate total delays
			const totalDelays = weatherFactor + portDelay + canalDelay;

			if (isSpeedMode) {
				// Compute required speed to hit target arrival
				const depTimeGMT = new Date(
					departureTime.getTime() - departureTimeZoneOffset * 3600000
				);
				const targetArrivalGMT = new Date(
					targetArrivalInput.getTime() - arrivalTimeZoneOffset * 3600000
				);

				const totalWindowHours =
					(targetArrivalGMT.getTime() - depTimeGMT.getTime()) / 3600000;
				steamingTimeHours = totalWindowHours - totalDelays;

				if (steamingTimeHours <= 0) {
					showError(
						"Insufficient transit time after delays. Adjust ETA or delays."
					);
					return;
				}

				avgSpeed = distance / steamingTimeHours;

				// For downstream formatting, reconstruct ETA as departure-local time
				const etaTimeGMT = targetArrivalGMT; // already GMT
				etaDate = new Date(
					etaTimeGMT.getTime() + departureTimeZoneOffset * 3600000
				);
			} else {
				steamingTimeHours = distance / avgSpeed;

				// Calculate total transit time
				const totalTransitHours = steamingTimeHours + totalDelays;

				// Calculate ETA (arrival in local time of departure)
				etaDate = new Date(
					departureTime.getTime() + totalTransitHours * 3600000
				);
			}

			// Total transit hours common
			const totalTransitHours = steamingTimeHours + totalDelays;

			console.log("Calculation Results:", {
				steamingTimeHours,
				totalDelays,
				totalTransitHours,
				etaDate,
			});

			// Format results with detailed breakdown
			formatResults(
				departureTime,
				distance,
				avgSpeed,
				steamingTimeHours,
				weatherFactor,
				portDelay,
				canalDelay,
				totalDelays,
				totalTransitHours,
				etaDate,
				departureTimeZoneOffset,
				arrivalTimeZoneOffset
			);

			// Show results
			resultsContainer.classList.add("show");
			errorMessage.classList.remove("show");
			console.log("Results displayed");
		} catch (error) {
			console.error("Error in calculateETA:", error);
			showError("An error occurred during calculation: " + error.message);
		}
	}

	// Format and display results
	function formatResults(
		depTime,
		distance,
		avgSpeed,
		steamingTime,
		weatherFactor,
		portDelay,
		canalDelay,
		totalDelays,
		totalTransitHours,
		etaTime,
		depTimeZoneOffset,
		arrTimeZoneOffset
	) {
		// Convert hours to days, hours and minutes format
		const formatDaysHoursMinutes = (hours) => {
			const days = Math.floor(hours / 24);
			const remainingHours = hours % 24;
			const h = Math.floor(remainingHours);
			const m = Math.round((remainingHours - h) * 60);

			let result = "";
			if (days > 0) result += days + "d ";
			if (h > 0 || days > 0) result += h + "h ";
			result += m + "m";
			return result.trim();
		};

		// Convert hours to hours and minutes format (for delays)
		const formatHours = (hours) => {
			const h = Math.floor(hours);
			const m = Math.round((hours - h) * 60);
			if (h === 0 && m === 0) return "None";
			return h + "h " + m + "m";
		};

		// Format date and time
		const formatDateTime = (date) => {
			const options = {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			};
			return date.toLocaleDateString("en-US", options);
		};

		// Format time in HHmm format (maritime standard)
		const formatMaritimeTime = (date) => {
			const hours = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");
			return hours + minutes + "H";
		};

		// Calculate GMT times
		const depTimeGMT = new Date(
			depTime.getTime() - depTimeZoneOffset * 3600000
		);
		const etaTimeGMT = new Date(
			etaTime.getTime() - depTimeZoneOffset * 3600000
		);
		const etaTimeLocal = new Date(
			etaTimeGMT.getTime() + arrTimeZoneOffset * 3600000
		);

		// Update main result cards
		document.getElementById("distanceDisplay").textContent =
			distance.toFixed(2);
		document.getElementById("speedDisplay").textContent = avgSpeed.toFixed(2);
		document.getElementById("steamingTime").textContent =
			formatDaysHoursMinutes(steamingTime);
		document.getElementById("totalDelay").textContent =
			formatHours(totalDelays);
		document.getElementById("totalTime").textContent =
			formatDaysHoursMinutes(totalTransitHours);

		// Arrival ETA (in arrival local time)
		const arrivalEtaEl = document.getElementById("arrivalEta");
		if (arrivalEtaEl) {
			arrivalEtaEl.textContent =
				formatDateTime(etaTimeLocal) +
				" (" +
				formatMaritimeTime(etaTimeLocal) +
				")";
		}

		// Required Speed (speed mode only)
		const requiredSpeedEl = document.getElementById("requiredSpeed");
		if (requiredSpeedEl) {
			requiredSpeedEl.textContent = avgSpeed.toFixed(2);
		}

		// Update calculation breakdown
		// Mode-specific breakdown
		const mode = getMode();
		const isSpeedMode = mode === "speed";

		if (isSpeedMode) {
			// Speed mode breakdown
			const speedFormulaText = `S = D ÷ T = ${distance.toFixed(
				2
			)} ÷ ${steamingTime.toFixed(2)} = ${avgSpeed.toFixed(2)} knots`;
			const speedFormulaEl = document.getElementById("speedFormulaDisplay");
			if (speedFormulaEl) speedFormulaEl.textContent = speedFormulaText;

			const availableText = `Total window: ${totalTransitHours.toFixed(
				2
			)} hours - Delays: ${totalDelays.toFixed(
				2
			)} hours = ${steamingTime.toFixed(2)} hours available for steaming`;
			const availableEl = document.getElementById("availableTimeDisplay");
			if (availableEl) availableEl.textContent = availableText;
		} else {
			// ETA mode breakdown
			const formulaText = `T = D ÷ S = ${distance.toFixed(
				2
			)} ÷ ${avgSpeed.toFixed(2)} = ${steamingTime.toFixed(2)} hours`;
			document.getElementById("formulaDisplay").textContent = formulaText;

			const hoursText = `${steamingTime.toFixed(2)} hours × 1 day/24 hours = ${(
				steamingTime / 24
			).toFixed(2)} days`;
			document.getElementById("hoursDisplay").textContent = hoursText;
		}

		const days = Math.floor(steamingTime / 24);
		const remainingHours = steamingTime % 24;
		const h = Math.floor(remainingHours);
		const m = Math.round((remainingHours - h) * 60);
		const conversionText = `${steamingTime.toFixed(
			2
		)} hours = ${days} days, ${h} hours, ${m} minutes`;
		document.getElementById("conversionDisplay").textContent = conversionText;

		const depDisplay = `Dep. LT: ${formatDateTime(
			depTime
		)}\nDep. GMT: ${formatDateTime(depTimeGMT)}\nZone: UTC ${
			depTimeZoneOffset >= 0 ? "+" : ""
		}${depTimeZoneOffset}`;
		document.getElementById("departureDisplay").textContent = depDisplay;

		const arrDisplay = `Arr. GMT: ${formatDateTime(
			etaTimeGMT
		)}\nArr. LT: ${formatDateTime(etaTimeLocal)}\nZone: UTC ${
			arrTimeZoneOffset >= 0 ? "+" : ""
		}${arrTimeZoneOffset}`;
		document.getElementById("arrivalDisplay").textContent = arrDisplay;

		// Update timeline
		document.getElementById("depPort").textContent =
			inputs.departurePort.value || "Port of Departure";
		document.getElementById("depTime").textContent =
			formatDateTime(depTime) + " (" + formatMaritimeTime(depTime) + ")";
		document.getElementById("sailDur").textContent =
			formatDaysHoursMinutes(steamingTime);
		document.getElementById("delayDur").textContent =
			totalDelays > 0
				? `Weather: ${formatHours(weatherFactor)} + Port: ${formatHours(
						portDelay
				  )} + Transit: ${formatHours(canalDelay)}`
				: "None";
		document.getElementById("arrPort").textContent =
			inputs.arrivalPort.value || "Port of Arrival";
		document.getElementById("arrTime").textContent =
			formatDateTime(etaTimeLocal) +
			" (" +
			formatMaritimeTime(etaTimeLocal) +
			")";
	}

	// Event listeners
	updateModeUI();
	modeRadios.forEach((radio) => {
		radio.addEventListener("change", updateModeUI);
	});

	if (calculateBtn) {
		calculateBtn.addEventListener("click", function (e) {
			e.preventDefault();
			console.log("Calculate button clicked");
			calculateETA();
		});
	} else {
		console.error("Calculate button not found");
	}

	clearBtn.addEventListener("click", function () {
		resultsContainer.classList.remove("show");
		errorMessage.classList.remove("show");
		// Reset form
		etaForm.reset();
		// Reset departure time to current
		const now = new Date();
		const defaultDateTime = now.toISOString().slice(0, 16);
		document.getElementById("departureTime").value = defaultDateTime;
		// Reset target arrival time to +3 days
		const defaultArrival = new Date(now.getTime() + 72 * 3600000);
		if (inputs.targetArrivalTime) {
			inputs.targetArrivalTime.value = defaultArrival
				.toISOString()
				.slice(0, 16);
		}
		// Reset custom dropdowns to UTC/GMT (±0)
		setDropdownValue("departureTimeZone", "0");
		setDropdownValue("arrivalTimeZone", "0");
		// Reset mode to ETA
		const etaRadio = document.getElementById("modeEta");
		if (etaRadio) etaRadio.checked = true;
		updateModeUI();
	});

	// Allow Enter key to trigger calculation
	etaForm.addEventListener("keypress", function (e) {
		if (e.key === "Enter") {
			calculateETA();
		}
	});

	// Load saved form data if available
	const savedData = localStorage.getItem("etaCalculatorData");
	if (savedData) {
		try {
			const data = JSON.parse(savedData);
			if (data.departurePort) inputs.departurePort.value = data.departurePort;
			if (data.arrivalPort) inputs.arrivalPort.value = data.arrivalPort;
			if (data.distance) inputs.distance.value = data.distance;
			if (data.averageSpeed) inputs.averageSpeed.value = data.averageSpeed;
			if (data.weatherFactor) inputs.weatherFactor.value = data.weatherFactor;
			if (data.portDelay) inputs.portDelay.value = data.portDelay;
			if (data.canalDelay) inputs.canalDelay.value = data.canalDelay;
			if (data.departureTimeZone)
				setDropdownValue("departureTimeZone", data.departureTimeZone);
			if (data.arrivalTimeZone)
				setDropdownValue("arrivalTimeZone", data.arrivalTimeZone);
			if (data.notes) inputs.notes.value = data.notes;
			if (data.targetArrivalTime && inputs.targetArrivalTime)
				inputs.targetArrivalTime.value = data.targetArrivalTime;
			if (data.calcMode && data.calcMode === "speed") {
				const speedRadio = document.getElementById("modeSpeed");
				if (speedRadio) speedRadio.checked = true;
				updateModeUI();
			}
		} catch (e) {
			console.warn("Could not load saved calculator data");
		}
	}

	// Save form data on input change
	function saveFormData() {
		const dataToSave = {
			departurePort: inputs.departurePort.value,
			arrivalPort: inputs.arrivalPort.value,
			distance: inputs.distance.value,
			averageSpeed: inputs.averageSpeed.value,
			weatherFactor: inputs.weatherFactor.value,
			portDelay: inputs.portDelay.value,
			canalDelay: inputs.canalDelay.value,
			departureTimeZone: getDropdownValue("departureTimeZone"),
			arrivalTimeZone: getDropdownValue("arrivalTimeZone"),
			notes: inputs.notes.value,
			targetArrivalTime: inputs.targetArrivalTime
				? inputs.targetArrivalTime.value
				: "",
			calcMode: getMode(),
		};
		localStorage.setItem("etaCalculatorData", JSON.stringify(dataToSave));
	}

	const formInputs = etaForm.querySelectorAll("input");
	formInputs.forEach((input) => {
		input.addEventListener("change", function () {
			// Don't save departure time (as it would be stale)
			if (this.id === "departureTime") return;
			saveFormData();
		});
	});

	// Save when dropdown selection changes
	document.querySelectorAll(".custom-dropdown .dropdown-option").forEach((option) => {
		option.addEventListener("click", saveFormData);
	});
});
