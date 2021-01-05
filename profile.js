const calendarPage = document.querySelector('.calander-page');

calendarPage.addEventListener('click', () => {
	window.location.href = 'calendar.html';
});

const authRef = firebase.auth();
authRef.onAuthStateChanged(function (user) {
	if (user) {
		console.log('Display name onAuthStateChanged : ' + user.displayName);
		updateUserData();
	} else {
		window.location.href = 'index.html';
	}
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
