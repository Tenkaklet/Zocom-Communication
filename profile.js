const calendarPage = document.querySelector('.calander-page');
const passwordForm = document.querySelector('form');
const authRef = firebase.auth();
const oldPassword = document.querySelector('#old-password');
const newPassword = document.querySelector('#new-password');

calendarPage.addEventListener('click', () => {
	window.location.href = 'calendar.html';
});


passwordForm.addEventListener('submit', e => {
	e.preventDefault();

	authRef.onAuthStateChanged(function (user) {
		if (user) {
			console.log('Display name onAuthStateChanged : ' + user.email);
			updateUserData();
			const creds = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword.value);
			user.reauthenticateWithCredential(creds)
			.then(() => {
				user.updatePassword(newPassword.value).then(function() {
					// Update successful.
					alert('success!');
				  }).catch(function(error) {
					console.log(error);
				  });
			})
			.catch(err => {
				console.log(err);
			});

		} else {
			window.location.href = 'index.html';
		}
	});

});








function updateUserData() {
	var userNow = firebase.auth().currentUser;
	userNow.updateProfile({
		displayName: "Max C",
		photoURL: "https://example.com/jane-q-user/profile.jpg"
	}).then(function () {
		var displayName = userNow.displayName;
		var photoURL = userNow.photoURL;
	}, function (error) {

	});
}
