$(() => {
	$('.ui.dropdown').dropdown();
	$('.new-cal-btn').on('click', () => {
		$('.ui.modal.create-calendar').modal('show');
	});
	$('.ui.checkbox').checkbox();


	// * Declaring Calendar
	var Calendar = tui.Calendar;

	// ** Initilazing Calendar
	var cal = new Calendar('#calendar', {
		defaultView: 'month',
		taskView: true,
		template: templates,
		useCreationPopup: true,
		useDetailPopup: true,
		scheduleView: true,
		month: {
			workweek: true
		}
	});

	// localstorage of user Id:
	const user_uid = localStorage.getItem('user_uid');
	// retrieve database information
	const database = firebase.database();

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			// user is signed in...
			var uid = user.uid;
		} else {
			window.location.href = 'index.html';
		}
	});


	database.ref(`users/${user_uid}`).on('value', value => {
		const data = value.val();
		console.log(data);
	});

	const profilePageBtn = document.querySelector('.profile-page');
	profilePageBtn.addEventListener('click', () => {
		window.location.href = 'profile.html';
	});

	const logoutBtn = document.querySelector('.logout');
	logoutBtn.addEventListener('click', e => {
		firebase.auth().signOut().then(() => {
			localStorage.clear();
			window.location.href = 'index.html';
		}).catch((error) => {
			// An error happened.
		});
	});




	// register templates
	var templates = {
		popupIsAllDay: function () {
			return 'All Day';
		},
		popupStateFree: function () {
			return 'Free';
		},
		popupStateBusy: function () {
			return 'Busy';
		},
		titlePlaceholder: function () {
			return 'Subject';
		},
		locationPlaceholder: function () {
			return 'Location';
		},
		startDatePlaceholder: function () {
			return 'Start date';
		},
		endDatePlaceholder: function () {
			return 'End date';
		},
		popupSave: function () {
			return 'Save';
		},
		popupUpdate: function () {
			return 'Update';
		},
		popupDetailDate: function (isAllDay, start, end) {
			var isSameDate = moment(start).isSame(end);
			var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm a';

			if (isAllDay) {
				return moment(start).format('YYYY.MM.DD') + (isSameDate ? '' : ' - ' + moment(end).format('YYYY.MM.DD'));
			}

			return (moment(start).format('YYYY.MM.DD hh:mm a') + ' - ' + moment(end).format(endFormat));
		},
		popupDetailLocation: function (schedule) {
			return 'Location : ' + schedule.location;
		},
		popupDetailUser: function (schedule) {
			return 'User : ' + (schedule.attendees || []).join(', ');
		},
		popupDetailState: function (schedule) {
			return 'State : ' + schedule.state || 'Busy';
		},
		popupDetailRepeat: function (schedule) {
			return 'Repeat : ' + schedule.recurrenceRule;
		},
		popupDetailBody: function (schedule) {
			return 'Body : ' + schedule.body;
		},
		popupEdit: function () {
			return 'Edit';
		},
		popupDelete: function () {
			return 'Delete';
		}
	};


	const todayBtn = document.querySelector('.today');
	const previousMonthBtn = document.querySelector('.previous-month');
	const nextMonthBtn = document.querySelector('.next-month');
	const courseForm = document.querySelector('#course-form');
	const courseTitle = document.querySelector('#course-title');
	const courseDescription = document.querySelector('#course-description');
	const courseStartDate = document.querySelector('#course-start-date');
	const courseEndDate = document.querySelector('#course-end-date');
	const typeOfCourse = document.querySelector('#type-of-course');
	const addDayCheckbox = document.querySelector('#check-all-day');

	courseForm.addEventListener('submit', e => {
		e.preventDefault();
		console.log(courseTitle.value, courseDescription.value, moment(new Date(courseStartDate.value)).format(), moment(new Date(courseEndDate.value)).format(), typeOfCourse.value, addDayCheckbox.checked);

		database.ref(`users/${user_uid}`).push({
			id: courseTitle.value.toLowerCase().replace(/\s/g, ''),
			calendarId: courseTitle.value.toLowerCase().replace(/\s/g, ''),
			title: courseTitle.value,
			start: moment(new Date(courseStartDate.value)).format(),
			end: moment(new Date(courseEndDate.value)).format(),
			body: courseDescription.value,
			category: 'time',
			isAllDay: addDayCheckbox.checked
		});



		// cal.createSchedules([
		// {
		// 	id: '3',
		// 	calendarId: '1',
		// 	title: courseTitle.value,
		// 	start: moment(new Date(courseStartDate.value)).format(),
		// 	end: moment(new Date(courseEndDate.value)).format(),
		// 	body: courseDescription.value,
		// 	category: 'time',
		// 	// isAllDay: true
		// }
		// ]);

		$('.ui.modal.create-calendar').modal('hide');

	});

	todayBtn.addEventListener('click', () => {
		cal.today();
		document.querySelector('.time-span.previous').innerHTML = moment(cal.getDateRangeStart()._date).format('MMMM D YYYY');
		document.querySelector('.time-span.next').innerHTML = moment(cal.getDateRangeEnd()._date).format('MMMM D YYYY');
	});

	previousMonthBtn.addEventListener('click', () => {
		cal.prev();
		document.querySelector('.time-span.previous').innerHTML = moment(cal.getDateRangeStart()._date).format('MMMM D YYYY');
		document.querySelector('.time-span.next').innerHTML = moment(cal.getDateRangeEnd()._date).format('MMMM D YYYY');
	});

	nextMonthBtn.addEventListener('click', () => {
		cal.next();
		document.querySelector('.time-span.previous').innerHTML = moment(cal.getDateRangeStart()._date).format('MMMM D YYYY');
		document.querySelector('.time-span.next').innerHTML = moment(cal.getDateRangeEnd()._date).format('MMMM D YYYY');
	});

	document.querySelector('.time-span.previous').innerHTML = moment(cal.getDateRangeStart()._date).format('MMMM D YYYY');
	document.querySelector('.time-span.next').innerHTML = moment(cal.getDateRangeEnd()._date).format('MMMM D YYYY');

});

