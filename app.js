// const calendar = tui.Calendar;
const form = document.querySelector('form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const loading = document.querySelector('.loading');

form.addEventListener('submit', e => {
	e.preventDefault();
	firebase.auth().signInWithEmailAndPassword(email.value, password.value)
		.then((user) => {
			loading.classList.add('active');
			const database = firebase.database();
			database.ref('users/' + user.user.uid).set({
				username: null,
				email: email.value,
				profile_picture: null,
				courses: []
			});

			localStorage.setItem('user_uid', user.user.uid);
			setTimeout(() => {
				window.location.href = 'calendar.html';
			}, 3000);
		})
		.catch((error) => {
			var errorMessage = error.message;
			document.querySelector('.error.message').innerHTML = '';
			const li = document.createElement('li');
			const list = document.createElement('ul');
			list.className = 'list';
			document.querySelector('.error.message').append(list);
			li.innerText = errorMessage;
			document.querySelector('.error.message').style.display = 'block';
			document.querySelector('.error.message .list').append(li);
		});
});

