// Handle form submission for start.html (Name and Age login)
document.addEventListener("DOMContentLoaded", function () {
	const startForm = document.getElementById("startForm");

	if (!startForm) return;

	startForm.addEventListener("submit", function (event) {
		event.preventDefault();

		// Get the form values
		const userName = document.getElementById("userName").value.trim();
		const userDob = document.getElementById("userDob").value;

		// Validate inputs
		if (!userName) {
			alert("Please enter your name");
			return;
		}

		if (!userDob) {
			alert("Please enter your date of birth");
			return;
		}

		// Validate date of birth is not in the future
		const dobDate = new Date(userDob);
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

		if (dobDate >= today) {
			alert("Date of birth cannot be today or in the future");
			return;
		}

		// Validate person is not too old (e.g., max 120 years)
		const maxAge = 120;
		const minDate = new Date();
		minDate.setFullYear(minDate.getFullYear() - maxAge);

		if (dobDate < minDate) {
			alert("Please enter a valid date of birth");
			return;
		}

		// Store user information in sessionStorage (avoid storing DoB)
		sessionStorage.setItem("userName", userName);

		// Compute age from DoB and store only age
		const computeAge = (dob) => {
			const birthDate = new Date(dob);
			const today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birthDate.getDate())
			) {
				age--;
			}
			return age;
		};
		const userAge = computeAge(userDob);
		sessionStorage.setItem("userAge", String(userAge));

		console.log("User info stored:", { name: userName, age: userAge });

		// Redirect to quiz page
		window.location.href = "quiz.html";
	});
});
