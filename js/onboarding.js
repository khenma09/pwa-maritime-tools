document.addEventListener("DOMContentLoaded", function () {
	const slides = document.querySelectorAll(".onboarding-slide");
	const indicators = document.querySelectorAll(".indicator");
	const btnNext = document.getElementById("btnNext");
	const btnSkip = document.getElementById("btnSkip");
	const btnGetStarted = document.getElementById("btnGetStarted");

	let currentSlide = 0;
	const totalSlides = slides.length;

	// Touch handling for swipe
	let touchStartX = 0;
	let touchEndX = 0;

	function updateSlide(newIndex, direction = "next") {
		if (newIndex < 0 || newIndex >= totalSlides) return;

		// Update previous slide
		slides[currentSlide].classList.remove("active");
		slides[currentSlide].classList.add(direction === "next" ? "prev" : "");
		indicators[currentSlide].classList.remove("active");

		// Update current slide
		currentSlide = newIndex;
		slides[currentSlide].classList.remove("prev");
		slides[currentSlide].classList.add("active");
		indicators[currentSlide].classList.add("active");

		// Update buttons on last slide
		if (currentSlide === totalSlides - 1) {
			btnNext.style.display = "none";
			btnSkip.style.display = "none";
			btnGetStarted.style.display = "block";
		} else {
			btnNext.style.display = "block";
			btnSkip.style.display = "block";
			btnGetStarted.style.display = "none";
		}
	}

	function nextSlide() {
		if (currentSlide < totalSlides - 1) {
			updateSlide(currentSlide + 1, "next");
		}
	}

	function prevSlide() {
		if (currentSlide > 0) {
			updateSlide(currentSlide - 1, "prev");
		}
	}

	function completeOnboarding() {
		localStorage.setItem("onboardingComplete", "true");
	}

	// Event listeners
	btnNext.addEventListener("click", nextSlide);

	btnSkip.addEventListener("click", function () {
		completeOnboarding();
		window.location.href = "createAccount.html";
	});

	btnGetStarted.addEventListener("click", function () {
		completeOnboarding();
	});

	// Indicator clicks
	indicators.forEach((indicator, index) => {
		indicator.addEventListener("click", function () {
			const direction = index > currentSlide ? "next" : "prev";
			updateSlide(index, direction);
		});
	});

	// Touch/swipe support
	document.addEventListener(
		"touchstart",
		function (e) {
			touchStartX = e.changedTouches[0].screenX;
		},
		{ passive: true }
	);

	document.addEventListener(
		"touchend",
		function (e) {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		},
		{ passive: true }
	);

	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swipe left - next
				nextSlide();
			} else {
				// Swipe right - prev
				prevSlide();
			}
		}
	}

	// Keyboard navigation
	document.addEventListener("keydown", function (e) {
		if (e.key === "ArrowRight" || e.key === " ") {
			nextSlide();
		} else if (e.key === "ArrowLeft") {
			prevSlide();
		}
	});
});
