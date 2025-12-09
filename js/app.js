document.addEventListener("DOMContentLoaded", function () {
	const questionNumber = document.querySelector(".question-number");
	const questionText = document.querySelector(".question-text");
	const optionContainer = document.querySelector(".option-container");
	const answersIndicatorContainer =
		document.querySelector(".answers-indicator");
	const homeBox = document.querySelector(".home-box");
	const quizBox = document.querySelector(".quiz-box");
	const resultBox = document.querySelector(".result-box");
	let questionLimit = 5; // default value, will be updated based on user input
	let questionCounter = 0;
	let currentQuestion;
	let availableQuestions = [];
	let availableOptions = [];
	let correctAnswers = 0;
	let attempt = 0;
	let userAnswers = []; // Track user answers for review
	let selectedCategory = "All Categories"; // Track selected category
	let categoryQuestions = []; // Store questions for selected category

	// push the questions into availableQuestions Array based on selected category
	function setAvailableQuestions() {
		// Get questions for selected category
		if (selectedCategory === "All Categories") {
			categoryQuestions = [...quiz];
		} else {
			categoryQuestions = quiz.filter((q) => q.category === selectedCategory);
		}

		const totalQuestion = categoryQuestions.length;
		for (let i = 0; i < totalQuestion; i++) {
			availableQuestions.push(categoryQuestions[i]);
		}
	}

	// set question number and question and options
	function getNewQuestion() {
		// Disable the Next button until an answer is selected
		const nextBtn = document.querySelector(".next-question-btn button");
		if (nextBtn) {
			nextBtn.disabled = true;
			nextBtn.style.opacity = "0.5";
			nextBtn.style.cursor = "not-allowed";
		}

		// set question number
		questionNumber.innerHTML =
			"Question " + (questionCounter + 1) + " of " + questionLimit;

		// set question text
		// get random question
		const questionIndex =
			availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
		currentQuestion = questionIndex;
		questionText.innerHTML = currentQuestion.q;
		// get the position of 'questionIndex' from the availableQuestion Array
		const index1 = availableQuestions.indexOf(questionIndex);
		// remove the 'questionIndex' from the availableQuestion Array, so that the question does not repeat
		availableQuestions.splice(index1, 1);
		// show question img if 'img' property exists
		if (currentQuestion.hasOwnProperty("img")) {
			const img = document.createElement("img");
			img.src = currentQuestion.img;
			questionText.appendChild(img);
		}

		// set options
		// get the length of options
		const optionLen = currentQuestion.options.length;
		// push options into availableOptions Array
		for (let i = 0; i < optionLen; i++) {
			availableOptions.push(i);
		}
		optionContainer.innerHTML = "";
		let animationDelay = 0.15;
		// create options in html
		for (let i = 0; i < optionLen; i++) {
			// random option
			const optonIndex =
				availableOptions[Math.floor(Math.random() * availableOptions.length)];
			// get the position of 'optonIndex' from the availableOptions Array
			const index2 = availableOptions.indexOf(optonIndex);
			// remove the  'optonIndex' from the availableOptions Array , so that the option does not repeat
			availableOptions.splice(index2, 1);
			const option = document.createElement("div");
			option.innerHTML = currentQuestion.options[optonIndex];
			option.id = optonIndex;
			option.style.animationDelay = animationDelay + "s";
			animationDelay = animationDelay + 0.15;
			option.className = "option";
			optionContainer.appendChild(option);
			option.addEventListener("click", () => getResult(option));
		}
		console.log(availableQuestions);
		console.log(availableOptions);
		questionCounter++;
	}

	// get the result of current attempt question
	function getResult(element) {
		const id = parseInt(element.getAttribute("id"));
		// check if the user has already selected an answer for this question
		if (element.classList.contains("already-answered")) {
			return;
		}
		// get all options for the current question
		const optionLen = optionContainer.children.length;
		for (let i = 0; i < optionLen; i++) {
			optionContainer.children[i].classList.add("already-answered");
			if (parseInt(optionContainer.children[i].id) === currentQuestion.answer) {
				optionContainer.children[i].classList.add("correct");
			}
		}
		// Track user answer
		userAnswers.push({
			question: currentQuestion.q,
			options: currentQuestion.options,
			userAnswer: id,
			correctAnswer: currentQuestion.answer,
			isCorrect: id === currentQuestion.answer,
		});
		// check if the selected option is correct or wrong
		if (id === currentQuestion.answer) {
			element.classList.add("correct");
			updateAnswerIndicator("correct");
			correctAnswers++;
		} else {
			element.classList.add("wrong");
			updateAnswerIndicator("wrong");

			// Show background images with smooth animation when answer is incorrect
			const bgLeft = document.getElementById("bg-img-left");
			const bgRight = document.getElementById("bg-img-right");
			if (bgLeft) {
				bgLeft.style.display = "block";
				setTimeout(() => {
					bgLeft.style.opacity = "0.85";
					bgLeft.style.transform = "translateY(-50%) scale(1)";
				}, 10);
			}
			if (bgRight) {
				bgRight.style.display = "block";
				setTimeout(() => {
					bgRight.style.opacity = "0.85";
					bgRight.style.transform = "translateY(-50%) scale(1)";
				}, 10);
			}
		}
		attempt++;

		// Enable the Next button after an answer is selected
		const nextBtn = document.querySelector(".next-question-btn button");
		if (nextBtn) {
			nextBtn.disabled = false;
			nextBtn.style.opacity = "1";
			nextBtn.style.cursor = "pointer";
		}
	}

	// make all the options unclickable once the user select a option (RESTRICT THE USER TO CHANGE THE OPTION AGAIN)
	function unclickableOptions() {
		const optionLen = optionContainer.children.length;
		for (let i = 0; i < optionLen; i++) {
			optionContainer.children[i].classList.add("already-answered");
		}
	}

	function answersIndicator() {
		const answerIndicatorContainer = document.getElementById(
			"answer-indicator-container"
		);
		if (answerIndicatorContainer) {
			answerIndicatorContainer.innerHTML = html;
		}

		answersIndicatorContainer.innerHTML = "";
		const totalQuestion = questionLimit;
		for (let i = 0; i < totalQuestion; i++) {
			const indicator = document.createElement("div");
			answersIndicatorContainer.appendChild(indicator);
		}
	}
	function updateAnswerIndicator(markType) {
		if (answersIndicatorContainer !== null) {
			answersIndicatorContainer.children[questionCounter - 1].classList.add(
				markType
			);
		}
	}

	function next() {
		if (questionCounter === questionLimit) {
			quizOver();
		} else {
			// Hide background images with smooth animation when moving to next question
			const bgLeft = document.getElementById("bg-img-left");
			const bgRight = document.getElementById("bg-img-right");
			if (bgLeft) {
				bgLeft.style.opacity = "0";
				bgLeft.style.transform = "translateY(-50%) scale(0.95)";
				setTimeout(() => {
					bgLeft.style.display = "none";
				}, 500);
			}
			if (bgRight) {
				bgRight.style.opacity = "0";
				bgRight.style.transform = "translateY(-50%) scale(0.95)";
				setTimeout(() => {
					bgRight.style.display = "none";
				}, 500);
			}

			// Reset unclickable options before getting the new question
			const optionLen = optionContainer.children.length;
			for (let i = 0; i < optionLen; i++) {
				optionContainer.children[i].classList.remove("already-answered");
				optionContainer.children[i].classList.remove("correct");
				optionContainer.children[i].classList.remove("wrong");
			}
			getNewQuestion();
		}
	}

	function quizOver() {
		// hide quiz Box
		quizBox.classList.add("hide");
		// show result Box
		resultBox.classList.remove("hide");
		const quizResultContainer = document.getElementById(
			"quiz-result-container"
		);
		if (quizResultContainer) {
			quizResultContainer.innerHTML = html;
		}

		quizResult();
	}
	// get the quiz Result
	function quizResult() {
		resultBox.querySelector(".total-question").innerHTML = questionLimit;
		document.getElementById("attempted-questions").innerHTML = attempt;
		document.getElementById("correct-answers").innerHTML = correctAnswers;
		document.getElementById("wrong-answers").innerHTML =
			attempt - correctAnswers;
		const percentage = (correctAnswers / questionLimit) * 100;
		document.getElementById("percentage").innerHTML =
			percentage.toFixed(2) + "%";
	}

	function resetQuiz() {
		questionCounter = 0;
		correctAnswers = 0;
		attempt = 0;
		availableQuestions = [];
		userAnswers = [];
	}

	function tryAgainQuiz() {
		// hide the resultBox
		resultBox.classList.add("hide");
		// show the quizBox
		quizBox.classList.remove("hide");
		resetQuiz();
		startQuiz();
	}

	function goToHome() {
		// hide result Box
		resultBox.classList.add("hide");
		// redirect to login.html
		window.location.href = "login.html";
		resetQuiz();
	}

	function reviewAnswers() {
		// Store quiz data in sessionStorage for the review page
		sessionStorage.setItem(
			"quizData",
			JSON.stringify({
				userAnswers: userAnswers,
				attempt: attempt,
				correctAnswers: correctAnswers,
				percentage: ((correctAnswers / questionLimit) * 100).toFixed(2),
				questionLimit: questionLimit,
			})
		);
		// Redirect to review page
		window.location.href = "review.html";
	}

	// #### STARTING POINT ####

	function startQuiz() {
		// Get selected category
		const categorySelect = document.getElementById("category-select");
		selectedCategory = categorySelect.value;

		// Get questions for selected category
		let categoryQuestionPool;
		if (selectedCategory === "All Categories") {
			categoryQuestionPool = quiz;
		} else {
			categoryQuestionPool = quiz.filter(
				(q) => q.category === selectedCategory
			);
		}

		// Get user input for question count
		const questionCountInput = document.getElementById("question-count");
		const userQuestionCount = parseInt(questionCountInput.value);

		// Validate user input
		const totalAvailableQuestions = categoryQuestionPool.length;
		const minimumQuestions = 5;

		// Check if category has enough questions
		if (totalAvailableQuestions < minimumQuestions) {
			alert(
				`This category only has ${totalAvailableQuestions} questions. Please select a different category or choose "All Categories".`
			);
			return;
		}

		if (userQuestionCount && userQuestionCount > 0) {
			// Enforce minimum of 5 questions
			if (userQuestionCount < minimumQuestions) {
				alert(`Please enter at least ${minimumQuestions} questions.`);
				return; // Stop quiz from starting
			}
			// Use user input, but cap it at total available questions
			questionLimit = Math.min(userQuestionCount, totalAvailableQuestions);
		} else {
			// If no input or invalid, use all questions
			questionLimit = totalAvailableQuestions;
		}

		// hide home box
		homeBox.classList.add("hide");
		// show quiz Box
		quizBox.classList.remove("hide");

		// first we will set all questions in availableQuestions Array
		setAvailableQuestions();
		// second we will call getNewQuestion(); function
		getNewQuestion();
		// to create indicator of answers
		answersIndicator();
	}

	// Function to update question count based on category
	function updateCategoryInfo() {
		const categorySelect = document.getElementById("category-select");
		const selectedCat = categorySelect.value;

		let categoryQuestionCount;
		if (selectedCat === "All Categories") {
			categoryQuestionCount = quiz.length;
		} else {
			categoryQuestionCount = quiz.filter(
				(q) => q.category === selectedCat
			).length;
		}

		// Update category count display
		const categoryCountElement = document.getElementById("category-count");
		if (categoryCountElement) {
			categoryCountElement.innerHTML = categoryQuestionCount;
		}

		// Update total available questions display
		const totalAvailableElement = homeBox.querySelector(
			".total-available-questions"
		);
		if (totalAvailableElement) {
			totalAvailableElement.innerHTML = categoryQuestionCount;
		}

		// Set max attribute on input field
		const questionCountInput = document.getElementById("question-count");
		if (questionCountInput) {
			questionCountInput.setAttribute("max", categoryQuestionCount);
		}
	}

	window.onload = function () {
		// Initialize category info
		updateCategoryInfo();

		// Add event listener for category change
		const categorySelect = document.getElementById("category-select");
		if (categorySelect) {
			categorySelect.addEventListener("change", updateCategoryInfo);
		}
	};

	// Add event listeners
	const startBtn = document.querySelector(".start-quiz-btn");
	const nextBtn = document.querySelector(".next-question-btn button");
	const restartBtn = document.querySelector("#restart-btn");
	const homeBtn = document.querySelector("#home-btn");
	const reviewBtn = document.querySelector("#review-btn");

	// Add focus/blur listeners for accessibility (replace inline handlers)
	const categorySelectEl = document.getElementById("category-select");
	const questionCountEl = document.getElementById("question-count");

	if (categorySelectEl) {
		categorySelectEl.addEventListener("focus", () => {
			categorySelectEl.classList.add("focused");
		});
		categorySelectEl.addEventListener("blur", () => {
			categorySelectEl.classList.remove("focused");
		});
	}

	if (questionCountEl) {
		questionCountEl.addEventListener("focus", () => {
			questionCountEl.classList.add("focused");
		});
		questionCountEl.addEventListener("blur", () => {
			questionCountEl.classList.remove("focused");
		});
	}

	if (startBtn) startBtn.addEventListener("click", startQuiz);
	if (nextBtn) nextBtn.addEventListener("click", next);
	if (restartBtn) restartBtn.addEventListener("click", tryAgainQuiz);
	if (homeBtn) homeBtn.addEventListener("click", goToHome);
	if (reviewBtn) reviewBtn.addEventListener("click", reviewAnswers);
});
