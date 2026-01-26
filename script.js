// Add fade-in effect on page load
function addFadeInEffect() {
	window.addEventListener("load", function () {
		let container = document.querySelector(".container");
		if (container) {
			container.classList.add("fade-in");
		}
	});
}

// Show alert after the fade-in effect
function showAlertOnLoad() {
	// Only show alert on specific pages if needed, currently seems global but controlled by where script.js is included
	// Check if showAlert exists (it comes from custom-modal.js)
	window.addEventListener("load", function () {
		if (typeof showAlert === "function") {
			showAlert(
				"This site is still in development phase, you may login with any details for now and press the Login button in order to proceed with the test.",
				"Welcome to Maritime Tools"
			);
		}
	});
}

// Handle form submission for login.html
function handleLoginFormSubmit() {
	const loginForm = document.getElementById("loginForm");

	if (!loginForm) return;

	loginForm.addEventListener("submit", function (event) {
		event.preventDefault();
		console.log("Login form submitted, redirecting to quiz.html");
		window.location.href = "quiz.html";
	});
}

// Handle form submission for createAccount.html
function handleCreateAccountFormSubmit() {
	const name = document.getElementById("name");
	const username = document.getElementById("username");
	const password = document.getElementById("password");
	const email = document.getElementById("email");
	const contactNumber = document.getElementById("contactNumber");
	const dob = document.getElementById("dob");

	// Ensure we are on the create account page before attaching listeners
	if (!name) return;

	const submitBtn = document.querySelector("input[type=submit]");

	if (!submitBtn) return;

	submitBtn.addEventListener("click", function (event) {
		event.preventDefault();

		// Do NOT store sensitive personal data or credentials on the client.
		// Just clear the form and show a success message for demo purposes.
		if (name) name.value = "";
		if (username) username.value = "";
		if (password) password.value = "";
		if (email) email.value = "";
		if (contactNumber) contactNumber.value = "";
		if (dob) dob.value = "";

		if (typeof showAlert === "function") {
			showAlert("Account created successfully!", "Success");
		}
	});
}

// Dropdown interaction
function handleDropdownInteraction() {
	var dropdown = document.getElementsByClassName("dropdown-btn");
	var i;

	for (i = 0; i < dropdown.length; i++) {
		dropdown[i].addEventListener("click", function () {
			this.classList.toggle("active");
			var dropdownContent = this.nextElementSibling;
			if (dropdownContent.style.display === "block") {
				dropdownContent.style.display = "none";
			} else {
				dropdownContent.style.display = "block";
			}
		});
	}
}

// Call the functions to execute when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
	addFadeInEffect();
	showAlertOnLoad();
	handleLoginFormSubmit();
	handleCreateAccountFormSubmit();
	handleDropdownInteraction();
});
