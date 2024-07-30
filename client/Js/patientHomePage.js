window.onload = () => {
  printProfilePic();
  const chatIcon = document.getElementById("chat-icon");
  chatIcon.addEventListener("click", () => window.location.href = "chatpage.html");
  BuildCalendar();
  UpdateDRinformation();
  UpdateTreatmentList();
  monitorNotifications();
};
function BuildCalendar() {
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`; // Current date in YYYY-MM-DD format

  const calendarDates = document.getElementById("calendar-dates");
  const monthYearElement = document.querySelector(".month-year");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  PrintTheDaysInMonthCalendar(currentYear, currentMonth);

  prevBtn.addEventListener("click", () => changeMonth(-1));
  nextBtn.addEventListener("click", () => changeMonth(1));

  function PrintTheDaysInMonthCalendar(year, month) {
    monthYearElement.textContent = `${months[month]} ${year}`;
    const wh = document.getElementById("weekday-header");
    wh.innerHTML = "";
    calendarDates.innerHTML = "";
    weekdays.forEach(day => {
      const weekdayElement = document.createElement("div");
      weekdayElement.textContent = day;
      wh.appendChild(weekdayElement);
    });
    printdays(year, month);
  }

  function printdays(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
    for (let i = 0; i < startDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("empty-cell");
      calendarDates.appendChild(emptyCell);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateCell = document.createElement("div");
      dateCell.classList.add("date-cell");
      if (
        i === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth()
      ) {
        dateCell.classList.add("current-date");
      }
      dateCell.textContent = i;
      // Format date as YYYY-MM-DD
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      dateCell.dataset.date = formattedDate;
      
      dateCell.addEventListener("click", () => {
        // Update selected date and highlight
        if (selectedDate) {
          const prevSelected = document.querySelector(`.date-cell[data-date="${selectedDate}"]`);
          if (prevSelected) {
            prevSelected.classList.remove("selected-date");
            if (prevSelected.dataset.date === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`) {
              prevSelected.classList.add("current-date");
            }
          }
        }
        selectedDate = dateCell.dataset.date;
        dateCell.classList.add("selected-date");
        Show_User_Activity(selectedDate);
      });
      calendarDates.appendChild(dateCell);
    }

    // Call Show_User_Activity with the current date
    Show_User_Activity(selectedDate);
  }

  function changeMonth(change) {
    currentMonth += change;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    PrintTheDaysInMonthCalendar(currentYear, currentMonth);
  }
}
async function Show_User_Activity(selectedDate) {
try {
  const date = selectedDate;
  const username = window.sessionStorage.getItem('userName');
  const response = await fetch('https://asnoise-4.onrender.com/api/activity/getDateActivity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, date })
  });

  const data = await response.json();

  const activityInfo = document.getElementById('activity');
  const ul = document.createElement('ul');
  activityInfo.innerHTML = ""; 

  if (data.error) {
    const noActivity = document.createElement('p');
    noActivity.classList.add("no_activity_text");
    noActivity.textContent = 'No activity for this day.';
    activityInfo.appendChild(noActivity);
  } else if (data.length === 0) {
    const noActivity = document.createElement('p');
    noActivity.classList.add("no_activity_text");
    noActivity.textContent = 'No activity for this day.';
    activityInfo.appendChild(noActivity);
  } else {
    data.forEach(activity => {
      const li = document.createElement('li');
      const activitytime = document.createElement('div');
      activitytime.textContent = activity.time;
      activitytime.classList.add('time_text');
      const theActivity = document.createElement('div');
      theActivity.textContent = activity.the_activity;
      theActivity.classList.add('active_text');
      li.appendChild(activitytime);
      li.appendChild(theActivity);
      ul.appendChild(li);
    });
    activityInfo.appendChild(ul);
  }
} catch (error) {
  console.error('Error fetching data:', error);
  const activityInfo = document.getElementById('activity');
  const noActivity = document.createElement('p');
  noActivity.textContent = `Error fetching activities: ${error.message}`;
  activityInfo.appendChild(noActivity);
}
}

async function UpdateTreatmentList() {
  try {
    const response = await fetch('test.json');//dataurl change based on url 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const patientId = window.sessionStorage.getItem('patientId');
    const data = await response.json();
    const patient = data.patients.find(p => p.patient_id === patientId);
    const ul = document.getElementById('treatmentList');
    ul.innerHTML = '';
    if (patient) {
      patient.methods.forEach(method => {
        const li = document.createElement('li');
        li.textContent = method;
        ul.appendChild(li);
      });
    } else {
      const noMethodsElement = document.createElement('li');
      noMethodsElement.textContent = 'No treatment methods found from you Dr.';
      ul.appendChild(noMethodsElement);
    }
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

async function monitorNotifications() {
  while (true) {
    try {
      const notificationBar = document.getElementById("notification_bar");
      notificationBar.innerHTML = '';
      const newNotifications = await checkForNewNotifications();
      if (newNotifications && newNotifications.length > 0) {
        newNotifications.forEach(notification => displayNotification(notification));
      }
      else {
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newP.textContent = "no new notification";
        newDiv.appendChild(newP);
        notificationBar.appendChild(newDiv);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    await delay(5000);
  }
}

/*need to change this function basede on the real login to know if there is a new notification */
async function checkForNewNotifications() {
  return new Promise((resolve) => {
    const notifications = [];

    resolve(notifications);
  });
}

function displayNotification(message) {
  const notificationBar = document.getElementById("notification_bar");
  const newDiv = document.createElement("div");
  const newP = document.createElement("p");
  newP.textContent = message;
  newDiv.appendChild(newP);
  notificationBar.appendChild(newDiv);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function UpdateDRinformation() {
  const patient_id = window.sessionStorage.getItem('patientId');
  try {
    const response = await fetch(`https://asnoise-4.onrender.com/api/patients/${patient_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const doctorName = data.doctor;
    const doctorImage = data.doctor_photo;  
    document.getElementById('DrName').innerHTML = '';
    const imageContainer = document.getElementById('DRimg');
    const newImage = document.createElement('img');
    newImage.alt = 'Dr Image';
    if (doctorName) {
      document.getElementById('DrName').textContent = doctorName;
    }
    if (doctorImage) {
      newImage.src =  `./images/${doctorImage}`; 
      imageContainer.innerHTML = '';
      imageContainer.appendChild(newImage);
      sessionStorage.setItem('patient-doc-img',`./images/${data.doctor_photo}`);
    }
    else {
      newImage.src = "images/user_first_profile.jpg";
      imageContainer.innerHTML = '';
      imageContainer.appendChild(newImage);
      sessionStorage.setItem('patient-doc-img', "images/user_first_profile.jpg");
    }
  }
  catch (error) {
    console.error('Error fetching or processing data:', error);
    const imageContainer = document.getElementById('DRimg');
    const newImage = document.createElement('img');
    newImage.alt = 'Dr Image';
    newImage.src = "images/user_first_profile.jpg";
    imageContainer.innerHTML = '';
    imageContainer.appendChild(newImage);
    sessionStorage.setItem('patient-doc-img', "images/user_first_profile.jpg");
  }
}
async function printProfilePic() {
  const username = window.sessionStorage.getItem('userName');
  try {
    const response = await fetch(`https://asnoise-4.onrender.com/api/users/${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    window.sessionStorage.setItem('patientId', data.id);
    const profilePicDiv = document.getElementById('profile_img');
    if (data.success && data.photo) {
      window.sessionStorage.setItem('userPatientImg',`./images/${data.photo}`);
      const imgElement = document.createElement('img');
      imgElement.classList.add('profile-pic')
      imgElement.src = `./images/${data.photo}`;
      imgElement.alt = "Profile Picture";
      profilePicDiv.innerHTML = '';
      profilePicDiv.appendChild(imgElement);
      const userName =  data.first_name;
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) {
       userNameElement.textContent = userName ? userName : 'Guest'; 
      }
    } else {
      const imgElement1 = document.createElement('img');
      imgElement1.classList.add('profile-pic')
      imgElement1.src = './images/user_first_profile.jpg';
      window.sessionStorage.setItem('userPatientImg','./images/user_first_profile.jpg');
      imgElement1.alt = "Profile Picture";
      profilePicDiv.appendChild(imgElement1);
      const userNameElement = document.getElementById('user-name');
       userNameElement.textContent = 'Guest'; 
    }
  } catch (error) {
    console.error('Error fetching profile picture:',username);
    document.getElementById('profile-img').innerHTML = '<p>Error loading profile picture</p>';
  }
}
