document.addEventListener("DOMContentLoaded", function () {
	const leaderboardBody = document.getElementById("leaderboard-body");
	const leaderboardTable = document.getElementById("leaderboard-table");
	const backBtn = document.getElementById("back-btn");
	const clearLeaderboardBtn = document.getElementById("clear-leaderboard-btn");
	const noDataMessage = document.getElementById("no-data-message");

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
				const wasOpen = dropdown.classList.contains("open");
				closeAllDropdowns();
				if (!wasOpen) {
					dropdown.classList.add("open");
				}
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

					// Trigger filter update
					displayLeaderboard();
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
		return selected?.dataset.value || "";
	}

	// Get leaderboard data from localStorage
	function getLeaderboardData() {
		const data = localStorage.getItem("quizLeaderboard");
		return data ? JSON.parse(data) : [];
	}

	// Save leaderboard data to localStorage
	function saveLeaderboardData(data) {
		localStorage.setItem("quizLeaderboard", JSON.stringify(data));
	}

	// Filter and sort leaderboard data
	function filterAndSortData(data) {
		let filtered = [...data];

		// Filter by category
		const selectedCategory = getDropdownValue("category");
		if (selectedCategory && selectedCategory !== "All Categories") {
			filtered = filtered.filter(
				(entry) => entry.category === selectedCategory
			);
		}

		// Sort data
		const sortBy = getDropdownValue("sort") || "score";
		filtered.sort((a, b) => {
			if (sortBy === "score") {
				// Sort by score (descending), then by date (most recent first)
				if (b.percentage !== a.percentage) {
					return b.percentage - a.percentage;
				}
				return new Date(b.date) - new Date(a.date);
			} else if (sortBy === "recent") {
				// Sort by date (most recent first)
				return new Date(b.date) - new Date(a.date);
			} else if (sortBy === "questions") {
				// Sort by number of questions (descending)
				if (b.totalQuestions !== a.totalQuestions) {
					return b.totalQuestions - a.totalQuestions;
				}
				return b.percentage - a.percentage;
			}
			return 0;
		});

		return filtered;
	}

	// Get score class for styling
	function getScoreClass(percentage) {
		if (percentage >= 80) return "score-high";
		if (percentage >= 50) return "score-medium";
		return "score-low";
	}

	// Format date
	function formatDate(dateString) {
		const date = new Date(dateString);
		const options = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return date.toLocaleDateString("en-US", options);
	}

	// Calculate and display stats
	function displayStats(data) {
		const totalQuizzesEl = document.getElementById("total-quizzes");
		const topScoreEl = document.getElementById("top-score");

		if (data.length === 0) {
			totalQuizzesEl.textContent = "0";
			topScoreEl.textContent = "0%";
			return;
		}

		// Total quizzes
		totalQuizzesEl.textContent = data.length;

		// Top score
		const topScore = Math.max(...data.map((entry) => entry.percentage));
		topScoreEl.textContent = topScore.toFixed(1) + "%";
	}

	// Display leaderboard
	function displayLeaderboard() {
		const allData = getLeaderboardData();
		const filteredData = filterAndSortData(allData);

		// Display stats based on filtered data
		displayStats(filteredData);

		// Clear table
		leaderboardBody.innerHTML = "";

		// Check if there's no data to display (either no data at all or filtered data is empty)
		if (allData.length === 0 || filteredData.length === 0) {
			if (leaderboardTable) leaderboardTable.style.display = "none";
			if (noDataMessage) {
				noDataMessage.classList.remove("hide");
				noDataMessage.style.display = "block";
			}
			return;
		}

		// Hide the no-data message when there's data to display
		if (noDataMessage) {
			noDataMessage.classList.add("hide");
			noDataMessage.style.display = "none";
		}

		// Show table with data
		if (leaderboardTable) leaderboardTable.style.display = "table";

		// Populate table
		filteredData.forEach((entry, index) => {
			const row = document.createElement("tr");

			// Add rank class for top 3
			if (index < 3) {
				row.classList.add("top-3", `rank-${index + 1}`);
			}

			// Escape potentially unsafe text fields
			const escapeHTML = (str) =>
				String(str)
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#39;");

			const safeName = escapeHTML(entry.name);
			const safeCategory = escapeHTML(entry.category);

			row.innerHTML = `
				<td class="rank-cell">${index + 1}</td>
				<td class="name-cell">${safeName} ${entry.age ? `(${entry.age})` : ""}</td>
				<td class="score-cell ${getScoreClass(
					entry.percentage
				)}">${entry.percentage.toFixed(1)}%</td>
				<td>${entry.correctAnswers}/${entry.totalQuestions}</td>
				<td><span class="category-badge">${safeCategory}</span></td>
				<td class="date-cell">${formatDate(entry.date)}</td>
			`;

			leaderboardBody.appendChild(row);
		});
	}

	// Initialize custom modal
	const customModal = new CustomModal();
	customModal.init();

	// Clear leaderboard
	async function clearLeaderboard() {
		const confirmed = await customModal.confirm(
			"Are you sure you want to clear the entire leaderboard? This action cannot be undone.",
			"Clear Leaderboard"
		);
		if (confirmed) {
			localStorage.removeItem("quizLeaderboard");
			displayLeaderboard();
			await customModal.alert(
				"Leaderboard has been cleared successfully!",
				"Success"
			);
		}
	}

	// Event listeners
	if (clearLeaderboardBtn) {
		clearLeaderboardBtn.addEventListener("click", clearLeaderboard);
	}

	// Initialize custom dropdowns
	initCustomDropdowns();

	// Initial display
	displayLeaderboard();
});
