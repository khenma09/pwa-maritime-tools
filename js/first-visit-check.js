(function () {
	// Check if onboarding has been completed
	const onboardingComplete = localStorage.getItem("onboardingComplete");

	// If this is first visit (no onboarding completed), redirect to onboarding
	if (!onboardingComplete) {
		// Prevent redirect loop - only redirect from index.html
		const currentPage = window.location.pathname;
		if (
			currentPage.endsWith("index.html") ||
			currentPage.endsWith("/") ||
			currentPage === ""
		) {
			window.location.href = "onboarding.html";
		}
	}
})();
