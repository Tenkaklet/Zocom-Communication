$(() => {
	$('.ui.dropdown').dropdown();

	// *** the below code will cause the modal to open. Will fix it!


	$('.add-course').on('click', () => {
		$('.ui.modal.create-school').modal('show');
	})
	$('.ui.checkbox').checkbox();

	$('.ui.form#add-school-form')
		.form({
			fields: {
				"school-title": 'empty',
				"school-description": 'empty',
			}
		});

	if ($('.courses').length === 0) {
		const notification = document.createElement('p');
		notification.innerText = 'Add a school!';
		$('.courses').html(notification);
	}


	// * Declaring Calendar
	var Calendar = tui.Calendar;

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

	// ** Initilazing Calendar
	var cal = new Calendar('#calendar', {
		defaultView: 'month',
		taskView: true,
		template: templates,
		useDetailPopup: true,
		scheduleView: true,
		month: {
			workweek: true
		}
	});

	cal.on({
		'beforeCreateSchedule': function (e) {
			console.log('beforeCreateSchedule', e);
			// open a creation popup
			$('.ui.modal.create-calendar').modal('show');
			$('#course-start-date').calendar();
			$('#course-end-date').calendar();
			// here it gets the details from firebase
			// then close guide element(blue box from dragging or clicking days)
			e.guide.clearGuideElement();
		}
	});

	cal.on('clickSchedule', event => {
		console.log(event);
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

	// *** Retrieve all data (schools) associated wtih user
	database.ref(`users/${user_uid}`).once('value', school => {
		const data = school.val();

		const x = Object.keys(data).reduce((res, key) => {
			return res.concat(data[key])
		}, []);

		console.log(x);

		// const schools = snapshotToArray(school);
		x.forEach(value => {
			const schoolList = `
			<div class="item">
				<i class="dropdown icon"></i>
				<span class="text">${value.title}</span>
				<div class="right menu">
				<div class="item view-calendar" data-calendar="${value.title}">View</div>
				<div class="item delete-calendar" data-calendar="${value.title}">Delete</div>
				</div>
			</div>
			`;

			$('.courses').append(schoolList);
			$('#school-dropdown').append(new Option(value.title, value.title));
		});

		// *** View Calendar button
		document.querySelectorAll('.view-calendar').forEach(element => {
			element.addEventListener('click', e => {
				const school = e.target.dataset.calendar;
				database.ref(`users/${user_uid}/${school}`).once('value', value => {
					console.log(value.val());
					const data = value.val();
					$('.course-list').html(data.description);
					localStorage.setItem('selected_school', data.title);
					localStorage.setItem('calendarId', data.calendarId); //? this could be redundant.
					const course = data.title;
					showCalendar(course);
				});
			});
		});
	});

	const showCalendar = course => {
		database.ref(`users/${user_uid}/${course}/calendars`).once('value', value => {
			const calendar = snapshotToArray(value);
			cal.clear();


			cal.createSchedules(calendar, true);
			cal.render();
		});
	};

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

	// ** Firebase Data to Array
	function snapshotToArray(snapshot) {
		var returnArr = [];
		snapshot.forEach(function (childSnapshot) {
			var item = childSnapshot.val();
			item.key = childSnapshot.key;
			returnArr.push(item);
		});
		return returnArr;
	};







	const todayBtn = document.querySelector('.today');
	const previousMonthBtn = document.querySelector('.previous-month');
	const nextMonthBtn = document.querySelector('.next-month');
	const courseForm = document.querySelector('#course-form');
	const courseTitle = document.querySelector('#course-title');
	const courseDescription = document.querySelector('#course-description');
	const courseStartDate = document.querySelector('#course-start-date');
	const courseEndDate = document.querySelector('#course-end-date');
	const addDayCheckbox = document.querySelector('#check-all-day');
	const schoolTitle = document.querySelector('#school-title');
	const schoolDescription = document.querySelector('#school-description');
	// ** this form is to create a course with firebase
	const addSchoolForm = document.querySelector('#add-school-form');
	const schoolDropDown = document.querySelector('#school-dropdown');




	// *** This form makes a new course to the database
	addSchoolForm.addEventListener('submit', e => {
		e.preventDefault();

		if ($('.ui.form#add-school-form').form('is valid')) {

			database.ref(`users/${user_uid}/${schoolTitle.value}`).set({
				calendarId: schoolTitle.value.toLowerCase().replace(/\s/g, ''),
				description: schoolDescription.value,
				title: schoolTitle.value
			});

			$('.ui.modal.create-school').modal('hide');
			alert(`${schoolTitle.value} Added!`);
			// FIXME: this should be async
			location.reload();

		}
	});

	courseForm.addEventListener('submit', e => {
		e.preventDefault();
		console.log(courseTitle.value, courseDescription.value, moment(new Date(courseStartDate.value)).format(), schoolDropDown.value, moment(new Date(courseEndDate.value)).format(), addDayCheckbox.checked);

		$('.ui.form#course-form')
			.form({
				fields: {
					"school-dropdown": 'empty',
					"course-title": 'empty',
					"course-description": 'empty',
					"course-start-date": 'empty',
					"course-end-date": 'empty',

				}
			});
		if ($('.ui.form#course-form').form('is valid')) {
			console.log('Ok');
			database.ref(`users/${user_uid}/${schoolDropDown.value}/calendars`).push({
				id: courseTitle.value.toLowerCase().replace(/\s/g, ''),
				calendarId: schoolDropDown.value.toLowerCase().replace(/\s/g, ''),
				title: courseTitle.value,
				start: moment($('#course-start-date').calendar('get date')).format(),
				end: moment($('#course-end-date').calendar('get date')).format(),
				body: courseDescription.value,
				category: 'time',
				isAllDay: addDayCheckbox.checked,
			});


			courseTitle.value = '';
			courseDescription.value = '';
			courseStartDate.value = '';
			schoolDropDown.value = '';
			courseEndDate.value = '';
			addDayCheckbox.checked = '';


			$('.ui.modal.create-calendar').modal('hide');
		} else {
			alert('Please fill in all fields');
		}


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

	const dayViewBtn = document.querySelector('.day-view');
	const weekViewBtn = document.querySelector('.week-view');
	const monthViewBtn = document.querySelector('.month-view');

	dayViewBtn.addEventListener('click', () => {
		cal.changeView('day', true);
	});

});

