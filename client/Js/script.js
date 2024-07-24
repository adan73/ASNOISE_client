window.onload = () => {
    const userName = window.sessionStorage.getItem('userName');
    
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = userName ? userName : 'Guest'; 
    }

    PrintPatientsList();
    BuildCalendar();
};

function PrintPatientsList() {
    fetch("https://asnoise-4.onrender.com/api/patients/Allpatients")
      .then((response) => response.json())
      .then((data) => {
        loadJSONData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
  
  function loadJSONData(data) {
    const personInfo = document.getElementById("result");
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
    
  if (!window.sessionStorage.getItem("result")) {
    window.sessionStorage.setItem("result", JSON.stringify(data.patients));
  }
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
      const response = await fetch('https://asnoise-4.onrender.com/api/activity/getDateActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({selectedDate })
      });
  
      const data = await response.json();
  
      const activityInfo = document.getElementById('activity');
      const ul = document.createElement('ul');
      activityInfo.innerHTML = ""; // Clear previous activities
  
      if (data.error) {
        const noActivity = document.createElement('p');
        noActivity.textContent = 'Error fetching activities.';
        activityInfo.appendChild(noActivity);
      } else if (data.length === 0) {
        // Handle the case where there are no activities for the selected date
        const noActivity = document.createElement('p');
        noActivity.classList.add("no_activity_text")
        noActivity.textContent = 'No activity for this day.';
        activityInfo.appendChild(noActivity);
      } else {
        // Display the activities
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
      noActivity.textContent = 'Error fetching activities.';
      activityInfo.appendChild(noActivity);
    }
  }
 
  