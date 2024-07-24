let patient = null;
window.onload = () => {
  initializePage();
  const removeBtn = document.getElementById("trash-icon");
  removeBtn.onclick = removePatient;
};

async function initializePage() {
  BuildCalendar();
  try {
    let data;
    if (!window.sessionStorage.getItem("patientData")) {
      const response = await fetch("data/patients_data.json");
      data = await response.json();
      window.sessionStorage.setItem("patients", JSON.stringify(data.patients));
      const p = data.find((patient) => patient.id === "234567891");
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

function initializeInfo(p) {
  patient = p;

  window.sessionStorage.setItem("patientData", JSON.stringify(patient));
  document.getElementById("profile-picture").src = patient.photo;
  document.getElementById("profile-picture").alt = patient.name;
  document.getElementById("name").textContent = patient.name;
  document.getElementById("age").textContent = patient.age;
  document.getElementById("adhd-stage").textContent = patient.adhdStage;

  document.getElementById("id").textContent = patient.id;
  document.getElementById("hmo").textContent = patient.hmo;
  document.getElementById("email").textContent = patient.email;
  document.getElementById("phone").textContent = patient.phone;
  document.getElementById("address").textContent = patient.address;

  const treatmentMethods = document.querySelector(".methods ul");
  patient.treatment?.methods?.forEach((method) => {
    const li = document.createElement("li");
    li.textContent = method;
    treatmentMethods.appendChild(li);
  });
  const current = patient.treatment?.improvement?.current ?? 0;
  const target = patient.treatment?.improvement?.target ?? 0;
  Buildchart(current, target);

  if (patient.dailyActivity?.events?.length) {
    const tbody = document
      .getElementById("timetable")
      .getElementsByTagName("tbody")[0];

    for (let hour = 0; hour < 24; hour++) {
      const time = (hour < 10 ? "0" : "") + hour + ":00";
      const row = `<tr><td>${time}</td><td></td></tr>`;
      tbody.innerHTML += row;
    }

    patient.dailyActivity.events.forEach((event) => {
      const { time, description } = event;

      const row = Array.from(tbody.getElementsByTagName("tr")).find((row) => {
        const timeCell = row.getElementsByTagName("td")[0].innerText;
        let currentTime = time;
        if (currentTime.length === 4) {
          currentTime = "0" + currentTime;
        }

        return timeCell === currentTime;
      });

      if (row) {
        const activityCell = row.getElementsByTagName("td")[1];
        const eventRow = `<div class="event schedule-table">${description}</div>`;
        activityCell.innerHTML = eventRow;
        activityCell.style.backgroundColor = "#a8c2be";
      }
    });
  }
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

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
    weekdays.forEach((day) => {
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
      calendarDates.appendChild(dateCell);
    }
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

function removePatient() {
  const patients = JSON.parse(window.sessionStorage.getItem("patients"));
  const filtered = patients.filter((p) => p.id !== patient.id);

  window.sessionStorage.setItem("patients", JSON.stringify(filtered));
  window.sessionStorage.removeItem("patientData");

  window.location.href = "index.html";
}
