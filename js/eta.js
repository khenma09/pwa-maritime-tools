document.addEventListener("DOMContentLoaded", function () {
	// Get form elements
	const etaForm = document.getElementById("etaForm");
	const calculateBtn = document.getElementById("calculateBtn");
	const clearBtn = document.getElementById("clearBtn");
	const resultsContainer = document.getElementById("results");
	const errorMessage = document.getElementById("errorMessage");

	// Debug: Check if elements exist
	console.log("Form:", etaForm);
	console.log("Calculate Button:", calculateBtn);
	console.log("Results Container:", resultsContainer);

	if (!calculateBtn || !etaForm || !resultsContainer) {
		console.error("Critical elements not found in DOM");
		return;
	}

	// Set current datetime as default
	const now = new Date();
	const defaultDateTime = now.toISOString().slice(0, 16);
	document.getElementById("departureTime").value = defaultDateTime;

	// Input field references
	const inputs = {
		departurePort: document.getElementById("departurePort"),
		departureTime: document.getElementById("departureTime"),
		departureTimeZone: document.getElementById("departureTimeZone"),
		arrivalPort: document.getElementById("arrivalPort"),
		arrivalTimeZone: document.getElementById("arrivalTimeZone"),
		distance: document.getElementById("distance"),
		averageSpeed: document.getElementById("averageSpeed"),
		weatherFactor: document.getElementById("weatherFactor"),
		portDelay: document.getElementById("portDelay"),
		canalDelay: document.getElementById("canalDelay"),
		notes: document.getElementById("notes"),
	};

	// Validate inputs
	function validateInputs() {
		const distance = parseFloat(inputs.distance.value);
		const averageSpeed = parseFloat(inputs.averageSpeed.value);

		// Clear previous errors
		errorMessage.classList.remove("show");
		errorMessage.textContent = "";

		// Validate distance
		if (isNaN(distance) || distance <= 0) {
			showError("Please enter a valid distance greater than 0");
			return false;
		}

		// Validate speed
		if (isNaN(averageSpeed) || averageSpeed <= 0) {
			showError("Please enter a valid average speed greater than 0");
			return false;
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
			const averageSpeed = parseFloat(inputs.averageSpeed.value);
			const weatherFactor = parseFloat(inputs.weatherFactor.value) || 0;
			const portDelay = parseFloat(inputs.portDelay.value) || 0;
			const canalDelay = parseFloat(inputs.canalDelay.value) || 0;
			const departureTimeZoneOffset = parseFloat(
				inputs.departureTimeZone.value
			);
			const arrivalTimeZoneOffset = parseFloat(inputs.arrivalTimeZone.value);

			console.log("Inputs:", {
				departureTime,
				distance,
				averageSpeed,
				weatherFactor,
				portDelay,
				canalDelay,
			});

			// Calculate steaming time (sailing time in hours)
			const steamingTimeHours = distance / averageSpeed;

			// Calculate total delays
			const totalDelays = weatherFactor + portDelay + canalDelay;

			// Calculate total transit time
			const totalTransitHours = steamingTimeHours + totalDelays;

			// Calculate ETA (arrival in local time of departure)
			const etaDate = new Date(
				departureTime.getTime() + totalTransitHours * 3600000
			);

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
				averageSpeed,
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

		// Update calculation breakdown
		const formulaText = `T = D ÷ S = ${distance.toFixed(
			2
		)} ÷ ${avgSpeed.toFixed(2)} = ${steamingTime.toFixed(2)} hours`;
		document.getElementById("formulaDisplay").textContent = formulaText;

		const hoursText = `${steamingTime.toFixed(2)} hours × 1 day/24 hours = ${(
			steamingTime / 24
		).toFixed(2)} days`;
		document.getElementById("hoursDisplay").textContent = hoursText;

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
				inputs.departureTimeZone.value = data.departureTimeZone;
			if (data.arrivalTimeZone)
				inputs.arrivalTimeZone.value = data.arrivalTimeZone;
			if (data.notes) inputs.notes.value = data.notes;
		} catch (e) {
			console.warn("Could not load saved calculator data");
		}
	}

	// Save form data on input change
	const formInputs = etaForm.querySelectorAll("input, select");
	formInputs.forEach((input) => {
		input.addEventListener("change", function () {
			// Don't save departure time (as it would be stale)
			if (this.id === "departureTime") return;

			const dataToSave = {
				departurePort: inputs.departurePort.value,
				arrivalPort: inputs.arrivalPort.value,
				distance: inputs.distance.value,
				averageSpeed: inputs.averageSpeed.value,
				weatherFactor: inputs.weatherFactor.value,
				portDelay: inputs.portDelay.value,
				canalDelay: inputs.canalDelay.value,
				departureTimeZone: inputs.departureTimeZone.value,
				arrivalTimeZone: inputs.arrivalTimeZone.value,
				notes: inputs.notes.value,
			};
			localStorage.setItem("etaCalculatorData", JSON.stringify(dataToSave));
		});
	});
});
