const form = document.getElementById('register-form');
const errorMsgs = Array.from(document.querySelectorAll('.error-msg'));

form.addEventListener('submit', submitForm);
form.elements.password2.addEventListener('keyup', checkMatching);

function checkMatching(e) {
	const password = form.elements.password.value;
	const password2 = e.target;
	const err = password2.nextElementSibling;

	if (password2.value !== password) {
		err.classList.add('invalid-feedback');
		err.innerHTML = "Passwords don't match";

		password2.classList.add('is-invalid');
	} else {
		password2.classList.remove('is-invalid');
		password2.classList.add('is-valid');

		err.classList.remove('invalid-feedback');
		err.classList.add('valid-feedback');
		err.innerHTML = 'Passwords match';
	}
}

function clearErrors() {
	errorMsgs.map((err) => {
		err.previousElementSibling.classList.remove('is-invalid');
		err.previousElementSibling.classList.remove('is-valid');
		err.classList.remove('invalid-feedback');
		err.innerHTML = '';
	});
}

function showError(msg, err) {
	msg.classList.add('invalid-feedback');
	msg.innerHTML = err.msg;
	msg.previousElementSibling.classList.add('is-invalid');
}

function showErrors(errors) {
	errors.map((err) => {
		const msg = errorMsgs.find((msg) => msg.dataset.input === err.param);

		showError(msg, err);
	});
}

async function submitForm(e) {
	try {
		e.preventDefault();

		clearErrors();

		const token = e.target.elements._csrf.value;

		const firstName = e.target.elements.firstName.value;
		const lastName = e.target.elements.lastName.value;
		const email = e.target.elements.email.value;
		const password = e.target.elements.password.value;
		const password2 = e.target.elements.password2.value;

		let errors = [];

		if (!firstName) {
			errors.push({ param: 'firstName', msg: 'Please enter your first name' });
		}

		if (!lastName) {
			errors.push({ param: 'lastName', msg: 'Please enter your last name' });
		}

		if (!email) {
			errors.push({
				param: 'email',
				msg: 'Please enter a valid email address',
			});
		}

		if (!password) {
			errors.push({ param: 'password', msg: 'Please enter a password' });
		}

		if (!password2) {
			errors.push({
				param: 'password2',
				msg: 'Please enter confirm your password',
			});
		}

		if (errors.length > 0) {
			showErrors(errors);
			return;
		}

		const res = await fetch(e.target.action, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'CSRF-Token': token,
			},
			body: JSON.stringify({ firstName, lastName, email, password, password2 }),
		});

		const data = await res.json();

		if (res.status === 400) {
			showErrors(data.errors);

			return;
		}

		window.location.href = '/auth/login';
	} catch (err) {
		console.error(err);

		alert('An unexpected error occurred');
	}
}
