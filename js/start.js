// Handle form submission for start.html (Name and Age login)
document.addEventListener('DOMContentLoaded', function() {
	const startForm = document.getElementById('startForm');

	if (!startForm) return;

	startForm.addEventListener('submit', function(event) {
		event.preventDefault();

		// Get the form values
		const userName = document.getElementById('userName').value.trim();
		const userDob = document.getElementById('userDob').value;

		// Validate inputs
		if (!userName) {
			alert('Please enter your name');
			return;
		}

		if (!userDob) {
			alert('Please enter your date of birth');
			return;
		}

		// Validate date of birth is not in the future
		const dobDate = new Date(userDob);
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

		if (dobDate >= today) {
			alert('Date of birth cannot be today or in the future');
			return;
		}

		// Validate person is not too old (e.g., max 120 years)
		const maxAge = 120;
		const minDate = new Date();
		minDate.setFullYear(minDate.getFullYear() - maxAge);

		if (dobDate < minDate) {
			alert('Please enter a valid date of birth');
			return;
		}

		// Store user information in sessionStorage
		sessionStorage.setItem('userName', userName);
		sessionStorage.setItem('userDob', userDob);

		console.log('User info stored:', { name: userName, dob: userDob });

		// Redirect to quiz page
		window.location.href = 'quiz.html';
	});
});
