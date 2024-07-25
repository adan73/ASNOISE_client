window.onload = () => {
    printprofailpic();
    PrintPatientsList();
    BuildCalendar();
    build_the_progress();
    print_x();
    print_patient_age_for_digram();
};
async function PrintPatientsList() {
  
  const username =window.sessionStorage.getItem('doctorFirstName');
  const photo = window.sessionStorage.getItem('doctorPhoto');
  try {
    const response = await fetch('https://asnoise-4.onrender.com/api/patients/getDoctorPatients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username , photo})
    });
    const data = await response.json();
    loadJSONData(data);
    } catch (error) {
    console.error('Error fetching profile picture:', error);
    document.getElementById('profile-img').innerHTML = '<p>Error loading profile picture</p>';
    }
  }
  
  function loadJSONData(data) {
    const personInfo = document.getElementById("patient");
    personInfo.innerHTML = ''; 
  
    const ul = document.createElement("ul");
  
    data.patients.forEach((patient) => {
      const li = document.createElement("li");
      li.classList.add("patient-li");
      const img = document.createElement("img");
      img.classList.add("patione-img");
      
         
      img.src =  patient.photo ;
      img.alt = patient.first_name;

      const patientName = document.createElement("div");
      patientName.classList.add("patient-name");
      patientName.textContent = `${patient.first_name} ${patient.last_name}`; 
  
      li.appendChild(img);
      li.appendChild(patientName);
  
      li.onclick = () => {
        window.sessionStorage.setItem("patientData", JSON.stringify(patient));
        window.location.href = "patientPage.html";
      };
  
      ul.appendChild(li);
    });
  
    personInfo.appendChild(ul);
    
  if (!window.sessionStorage.getItem("patient")) {
    window.sessionStorage.setItem("patient", JSON.stringify(data.patients));
  }
  }

  function build_the_progress() {
    const yAxisContainer = document.querySelector(".y-axis");
  
    var x = 0;
    for (let i = 100; i >= 10; i -= 10) {
      if (i == 100) {
        const ytitle = document.createElement("span");
        ytitle.textContent = "Progress";
        ytitle.classList.add("y-title");
        yAxisContainer.appendChild(ytitle);
      }
  
      const yAxisLine = document.createElement("div");
      yAxisLine.classList.add("y-axis-line");
  
      const yAxisNumber = document.createElement("span");
      yAxisNumber.textContent = i;
      yAxisNumber.classList.add("y-axis-number");
  
      yAxisLine.appendChild(yAxisNumber);
      yAxisContainer.appendChild(yAxisLine);
      if (i == 10) {
        const xtitle = document.createElement("span");
        xtitle.textContent = "months";
        xtitle.classList.add("x-title");
        yAxisContainer.appendChild(xtitle);
      }
    }
  }
  
  function print_x() {
    const monthsContainer = document.querySelector(".months");
    const resultsContainer = document.querySelector(".results");
    const color = ["#003D32", "#00665F", "#35978F"];
    const months = ["January", "February", "March"];
    const results = {
      January: [178, 30, 90],
      February: [30, 209, 259],
      March: [209, 120, 90],
    };
  
    months.forEach((month) => {
      const monthDiv = document.createElement("div");
      monthDiv.textContent = month;
      monthDiv.classList.add("month");
      monthsContainer.appendChild(monthDiv);
  
      const monthResults = document.createElement("div");
      monthResults.classList.add("month-results");
  
      results[month].forEach((result, index) => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result");
        resultDiv.style.height = `${result}px`;
        resultDiv.style.backgroundColor = color[index % color.length];
        monthResults.appendChild(resultDiv);
      });
  
      resultsContainer.appendChild(monthResults);
    });
  }
  
  function print_patient_age_for_digram() {
    const Patientage = document.querySelector(".patient-age");
    const colors = ["#003D32", "#00665F", "#35978F"];
    const ages = ["0-12", "12-25", "25+"];
  
    const titleDiv = document.createElement("div");
    titleDiv.textContent = "Patient Age";
    titleDiv.classList.add("text-age");
    Patientage.appendChild(titleDiv);
  
    ages.forEach((age, index) => {
      const ageContainer = document.createElement("div");
      ageContainer.classList.add("age-container");
  
      const ageBox = document.createElement("div");
      ageBox.classList.add("age-box");
      ageBox.style.backgroundColor = colors[index];
  
      const ageText = document.createElement("div");
      ageText.classList.add("text-age");
      ageText.textContent = age;
  
      ageContainer.appendChild(ageBox);
      ageContainer.appendChild(ageText);
  
      Patientage.appendChild(ageContainer);
    });
  }
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

async function printprofailpic() {
  const username = window.sessionStorage.getItem('userName');
  try {
    const response = await fetch('https://asnoise-4.onrender.com/api/users/getUserFirstNameAndPhotoAndId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username})
    });

    const data = await response.json();
    const profilePicDiv = document.getElementById('profile_img');
    if (data.success && data.photo) {
      const imgElement = document.createElement('img');
      imgElement.classList.add('profile-pic')
      imgElement.src = data.photo; 
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
      imgElement1.alt = "Profile Picture";
      profilePicDiv.appendChild(imgElement1);
      const userNameElement = document.getElementById('user-name');
       userNameElement.textContent = 'Guest'; 
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    document.getElementById('profile-img').innerHTML = '<p>Error loading profile picture</p>';
  }
}
