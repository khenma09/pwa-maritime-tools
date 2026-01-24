document.addEventListener("DOMContentLoaded", function () {
	// Ensure Security module is loaded
	if (!window.Security) {
		console.error("Security module not loaded");
		throw new Error("Security module is required");
	}

	const quizData = JSON.parse(sessionStorage.getItem("quizData"));

	if (!quizData || !quizData.userAnswers) {
		document.getElementById("incorrect-questions").innerHTML =
			"<p class='no-data-message'>No review data available. Please complete the quiz first.</p>";
		return;
	}

	// Determine score class based on percentage
	const percentage = parseFloat(quizData.percentage);
	let scoreClass = "high";
	if (percentage < 50) {
		scoreClass = "low";
	} else if (percentage < 75) {
		scoreClass = "medium";
	}

	// Display summary
	const summaryDiv = document.getElementById("summary");
	summaryDiv.innerHTML = `
		<div class="summary-grid">
			<div class="summary-card total">
				<div class="stats-label">Total Questions</div>
				<div class="stats-number">${quizData.questionLimit}</div>
			</div>

			<div class="summary-card attempted">
				<div class="stats-label">Attempted</div>
				<div class="stats-number">${quizData.attempt}</div>
			</div>

			<div class="summary-card correct">
				<div class="stats-label">✓ Correct</div>
				<div class="stats-number">${quizData.correctAnswers}</div>
			</div>

			<div class="summary-card wrong">
				<div class="stats-label">✗ Wrong</div>
				<div class="stats-number">${quizData.attempt - quizData.correctAnswers}</div>
			</div>
		</div>

		<div class="percentage-card">
			<div class="stats-label">Your Score</div>
			<div class="score-number ${scoreClass}">${quizData.percentage}%</div>
			<div class="note-small">Review your answers below to improve!</div>
		</div>
	`;

	// Function to render questions based on filter
	function renderQuestions(filter = "all") {
		const reviewDiv = document.getElementById("incorrect-questions");
		let html = "";

		quizData.userAnswers.forEach((answer, index) => {
			const isCorrect = answer.isCorrect;

			// Apply filter
			if (filter === "correct" && !isCorrect) return;
			if (filter === "incorrect" && isCorrect) return;

			const statusClass = isCorrect ? "correct-answer" : "incorrect-answer";
			const statusBadge = isCorrect
				? '<span class="status-badge correct">✓ CORRECT</span>'
				: '<span class="status-badge incorrect">✗ INCORRECT</span>';

			html += `
				<div class="question-accordion" data-correct="${isCorrect}">
					<div class="question-header ${statusClass}" data-index="${index}">
						<div class="question-title">
							<span class="question-number">Q${index + 1}:</span>
							${Security.escapeHTML(answer.question)}
							${statusBadge}
						</div>
						<div class="expand-icon" id="icon-${index}">▼</div>
					</div>
					<div class="question-content" id="content-${index}">
			`;

			answer.options.forEach((option, optionIndex) => {
				let className = "option-review";
				let optionLabel = "";

				if (optionIndex === answer.correctAnswer) {
					className += " correct";
					optionLabel = "✓ Correct Answer: ";
				} else if (optionIndex === answer.userAnswer && !isCorrect) {
					className += " incorrect";
					optionLabel = "✗ Your Answer: ";
				} else if (optionIndex === answer.userAnswer && isCorrect) {
					optionLabel = "✓ Your Answer: ";
				}

				html += `<div class="${className}">
						${optionLabel}${Security.escapeHTML(option)}
					</div>`;
			});

			html += `
					</div>
				</div>
			`;
		});

		reviewDiv.innerHTML = html;
	}

	// Initial render - show all questions
	renderQuestions("all");

	// Make renderQuestions available globally
	window.renderQuestions = renderQuestions;
	window.quizData = quizData;

	// Hook up filter buttons with event listeners
	const correctBtn = document.getElementById("filter-correct");
	const incorrectBtn = document.getElementById("filter-incorrect");

	if (correctBtn)
		correctBtn.addEventListener("click", () => filterQuestions("correct"));
	if (incorrectBtn)
		incorrectBtn.addEventListener("click", () => filterQuestions("incorrect"));

	// Add delegation for question header toggles
	const reviewDiv = document.getElementById("incorrect-questions");
	if (reviewDiv) {
		reviewDiv.addEventListener("click", function (e) {
			const header = e.target.closest(".question-header");
			if (!header) return;
			const idx = header.getAttribute("data-index");
			if (idx !== null) toggleQuestion(parseInt(idx, 10));
		});
	}
});

// Toggle accordion function
function toggleQuestion(index) {
	const content = document.getElementById(`content-${index}`);
	const icon = document.getElementById(`icon-${index}`);

	if (content.classList.contains("show")) {
		content.classList.remove("show");
		icon.classList.remove("expanded");
	} else {
		content.classList.add("show");
		icon.classList.add("expanded");
	}
}

// Filter questions function
function filterQuestions(filter) {
	const correctBtn = document.getElementById("filter-correct");
	const incorrectBtn = document.getElementById("filter-incorrect");

	// Check if we're toggling off the same filter
	const isTogglingOff =
		(filter === "correct" && correctBtn.classList.contains("active")) ||
		(filter === "incorrect" && incorrectBtn.classList.contains("active"));

	// Reset all buttons (remove any active/correct/incorrect classes)
	[correctBtn, incorrectBtn].forEach((btn) => {
		if (!btn) return;
		btn.classList.remove("active", "correct", "incorrect");
	});

	// If toggling off, show all questions
	if (isTogglingOff) {
		window.renderQuestions("all");
		return;
	}

	// Activate selected button by adding semantic classes
	let activeBtn;
	if (filter === "correct") activeBtn = correctBtn;
	else if (filter === "incorrect") activeBtn = incorrectBtn;

	if (activeBtn) {
		activeBtn.classList.add("active");
		if (filter === "correct") activeBtn.classList.add("correct");
		if (filter === "incorrect") activeBtn.classList.add("incorrect");
	}

	// Render questions with the selected filter
	window.renderQuestions(filter);
}
