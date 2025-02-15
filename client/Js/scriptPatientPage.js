let patient = null;
window.onload = () => {
   printProfilePic();
   initializePage();
  const removeBtn = document.getElementById("trash-icon");
  removeBtn.onclick = removePatient;
  const chatbtn = document.getElementById("contact-patient");
  chatbtn.addEventListener("click", () => window.location.href = "chatpage.html");
 
  loadtratmentData();
  LoadTreatmentList();
};

async function initializePage() {
  BuildCalendar();
  try {
    let data;
    if (!window.sessionStorage.getItem("patientData")) {
      const response = await fetch("https://asnoise-4.onrender.com/api/patients/Allpatients");
      data = await response.json();
      window.sessionStorage.setItem("patients", JSON.stringify(data.patients));
      const p = data.find((patient) => patient.id === patientData.patient_id);
      if (!p) {
        console.error("patient not found");
        return;
      }
      data = p;
    } else {
      data = JSON.parse(window.sessionStorage.getItem("patientData"));
    }
    initializeInfo(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function get_improvement(){
  const patient_id =window.sessionStorage.getItem("patientId");
  try{
    const response = await fetch(`https://asnoise-4.onrender.com/api/improvement/${patient_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      
  data.improvement.forEach((improvement) => {
    window.sessionStorage.setItem('patientTarget', improvement.target);
    window.sessionStorage.setItem('patientCurrent',improvement.current);
  });
    }
    else{
      window.sessionStorage.setItem('patientTarget', 0);
      window.sessionStorage.setItem('patientCurrent',0);
    }
  }catch (error) {
    console.error('Error fetching data:', error);
    const activityInfo = document.getElementById('schedule');
    activityInfo.innerHTML = '';
    const noActivity = document.createElement('p');
    noActivity.textContent = `Error fetching activities: ${error.message}`;
    activityInfo.appendChild(noActivity);
  }

}

function initializeInfo(p) {
  patient = p;

  window.sessionStorage.setItem("patientData", JSON.stringify(patient));
  document.getElementById("profile-picture").src = `./images/${patient.photo}`;
  document.getElementById("profile-picture").alt = patient.name;
  document.getElementById("name").textContent = `${patient.first_name} ${patient.last_name}`;
  document.getElementById("age").textContent = patient.age;
  document.getElementById("adhd-stage").textContent = patient.adhdStage;

  document.getElementById("id").textContent = patient.patient_id;
  document.getElementById("hmo").textContent = patient.hmo;
  document.getElementById("email").textContent = patient.email;
  document.getElementById("phone").textContent = patient.phone;
  document.getElementById("address").textContent = patient.address;

  window.sessionStorage.setItem('patientId', patient.patient_id);


  const treatmentMethods = document.querySelector(".methods ul");
  patient.treatment?.methods?.forEach((method) => {
    const li = document.createElement("li");
    li.textContent = method;
    treatmentMethods.appendChild(li);
  });
  get_improvement();

  const current = window.sessionStorage.getItem('patientCurrent');
  const target = window.sessionStorage.getItem('patientTarget');
  Buildchart(current, target);
}

function Buildchart(current, target) {
  const chrt = document.getElementById("chartId").getContext("2d");
  const chartId = new Chart(chrt, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          label: "improvment",
          data: [current, target],
          backgroundColor: ["#7FB6A2", "#D3F0E6"],
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        tooltip: {
          enabled: false,
        },
        datalabels: {
          color: function (context) {
            var value = context.dataset.data[context.dataIndex];
            return value === target ? "#646464" : "#FFFFFF";
          },
          anchor: "center",
          align: "center",
          formatter: (value) => value,
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: [ChartDataLabels],
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
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      dateCell.dataset.date = formattedDate;

      dateCell.addEventListener("click", () => {
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
    const username = sessionStorage.getItem('userName');
    const response = await fetch(`https://asnoise-4.onrender.com/api/activity/${username}/${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    const activityInfo = document.getElementById('schedule');
    activityInfo.innerHTML = "";

    if (data.success) {
      const tbody = document
        .getElementById("timetable")
        .getElementsByTagName("tbody")[0];

      for (let hour = 0; hour < 24; hour++) {
        const time = (hour < 10 ? "0" : "") + hour + ":00";
        const row = `<tr><td>${time}</td><td></td></tr>`;
        tbody.innerHTML += row;
      }

      data.activity.forEach(activity => {
        const row = Array.from(tbody.getElementsByTagName("tr")).find((row) => {
          const timeCell = row.getElementsByTagName("td")[0].innerText;
          let currentTime = activity.time;
          if (currentTime.length === 4) {
            currentTime = "0" + currentTime;
          }

          return timeCell === currentTime;
        });

        if (row) {
          const activityCell = row.getElementsByTagName("td")[1];
          const eventRow = `<div class="event schedule-table">${activity.the_activity}</div>`;
          activityCell.innerHTML = eventRow;
          activityCell.style.backgroundColor = "#a8c2be";
        }
      });
      activityInfo.appendChild(ul);
    } else {
      const noActivity = document.createElement('p');
      noActivity.classList.add("no_activity_text");
      noActivity.textContent = 'No activity for this day.';
      activityInfo.appendChild(noActivity);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    const activityInfo = document.getElementById('schedule');
    activityInfo.innerHTML = '';
    const noActivity = document.createElement('p');
    noActivity.textContent = `Error fetching activities: ${error.message}`;
    activityInfo.appendChild(noActivity);
  }
}


async function removePatient() {
  const patient_id = window.sessionStorage.getItem("patientId");
  if (!patient_id) {
    console.error('No patient_id found in sessionStorage');
    return; 
  }

  try {
    const response = await fetch(`https://asnoise-4.onrender.com/api/patients/${patient_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patient_id })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Patient deleted successfully:', result.message);
      window.location.href = "Doctor_homepage.html";
    } else {
      console.error('Failed to delete patient:', result.error);
      document.getElementById('profile-img').innerHTML = '<p>Error deleting patient</p>';
    }
  } catch (error) {
    console.error('Error deleting patient:', error);
    document.getElementById('profile-img').innerHTML = '<p>Error deleting patient</p>';
  }
}


async function printProfilePic() {
  const username = window.sessionStorage.getItem('userName');
  try {
    const response = await fetch(`https://asnoise-4.onrender.com/api/users/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const profilePicDiv = document.getElementById('profile_img');
    if (data.success && data.photo) {
      const imgElement = document.createElement('img');
      imgElement.classList.add('profile-pic')
      imgElement.src = `./images/${data.photo}`;
      imgElement.alt = "Profile Picture";
      window.sessionStorage.setItem('doctorPhoto', data.photo);
      profilePicDiv.innerHTML = '';
      profilePicDiv.appendChild(imgElement);
      const userName = data.first_name;
      window.sessionStorage.setItem('doctorFirstName', data.first_name);
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
    console.error('Error fetching profile picture:', username);
    document.getElementById('profile-img').innerHTML = '<p>Error loading profile picture</p>';
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const showFormBtn = document.getElementById('editIcon');
  const treatmenAddForm = document.getElementById('treatmenAddForm');
  const cancelBtn = document.getElementById('cancel1');
  const saveBtn = document.getElementById('save1');


  function showForm() {
    treatmenAddForm.style.display = 'block';

  }

  function hideForm() {
    treatmenAddForm.style.display = 'none';

  }

  showFormBtn.onclick = showForm;
  cancelBtn.onclick = hideForm;
  saveBtn.addEventListener('click', function () {
    addMethode();
    hideForm();
    LoadTreatmentList();

  });

});


async function loadtratmentData() {
  const formData = JSON.parse(
    window.sessionStorage.getItem("patientData") ?? "{}"
  );

  if (Object.keys(formData).length === 0) {
    window.location.href = "Doctor_homepage.html";
    return;
  }

  document.getElementById("name_t").value = [formData.first_name + " " + formData.last_name] ?? "";
  document.getElementById("id_t").value = formData.patient_id ?? "";

}

async function addMethode() {
  const patient_id = window.sessionStorage.getItem('patientId');
  const method = document.getElementById("Methode").value;
  try {
    const response = await fetch('https://asnoise-4.onrender.com/api/treatment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patient_id, method })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    hideForm();
  } catch (error) {
    console.error('Error fetching data:', error);
    const activityInfo = document.getElementById('activity');
    const noActivity = document.createElement('p');
    noActivity.textContent = `Error fetching activities: ${error.message}`;
    activityInfo.appendChild(noActivity);
  }

}


async function LoadTreatmentList() {
  const patient_id = window.sessionStorage.getItem('patientId');
  try {
    const response = await fetch(`https://asnoise-4.onrender.com/api/treatment/${patient_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const ul = document.getElementById('treatmentList');
    ul.innerHTML = '';

    if (data.success) {
      data.treatments.forEach(treatments => {
        const li = document.createElement('li');
        li.textContent = treatments.method;
        ul.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    const ul = document.getElementById('treatmentList');
    ul.innerHTML = '<li>This patient don`t have treatment methods</li>';
  }
}

