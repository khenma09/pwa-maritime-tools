// Handle form submission for start.html (Name and Age login)
document.addEventListener('DOMContentLoaded', function() {
	const startForm = document.getElementById('startForm');

	if (!startForm) return;

	startForm.addEventListener('submit', function(event) {
		event.preventDefault();

		// Get the form values
		const userName = document.getElementById('userName').value.trim();
		const userAge = document.getElementById('userAge').value;

		// Validate inputs
		if (!userName) {
			alert('Please enter your name');
			return;
		}

		if (!userAge || userAge < 1 || userAge > 120) {
			alert('Please enter a valid age (1-120)');
			return;
		}

		// Store user information in sessionStorage
		sessionStorage.setItem('userName', userName);
		sessionStorage.setItem('userAge', userAge);

		console.log('User info stored:', { name: userName, age: userAge });

		// Redirect to quiz page
		window.location.href = 'quiz.html';
	});
});
