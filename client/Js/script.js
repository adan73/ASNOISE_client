window.onload = () => {
    printProfilePic();
    PrintPatientsList();
    BuildCalendar();
    build_the_progress();
};

async function PrintPatientsList() {
  
  const doctor =window.sessionStorage.getItem('doctorFirstName');
  const doctor_photo = window.sessionStorage.getItem('doctorPhoto');
  try {
    const response = await fetch(`https://asnoise-4.onrender.com/api/patients/${doctor}/${doctor_photo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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
      
         
      img.src =  `./images/${ patient.photo}`;
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
    const data = [
      { month: "January", values: { "0-12": 178, "12-25": 30, "25+": 90 } },
      { month: "February", values: { "0-12": 30, "12-25": 209, "25+": 259 } },
      { month: "March", values: { "0-12": 209, "12-25": 120, "25+": 90 } }
    ];
  
    const colors = {
      "0-12": "#003D32",
      "12-25": "#00665F",
      "25+": "#35978F"
    };
  
    const margin = { top: 20, right: 150, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3.select(".diagram")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .paddingInner(0.1);
  
    const x1 = d3.scaleBand()
      .domain(Object.keys(data[0].values))
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(Object.values(d.values)))])
      .nice()
      .range([height, 0]);
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));
  
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}`));
  
    svg.selectAll("g.layer")
      .data(data)
      .join("g")
      .attr("class", "layer")
      .attr("transform", d => `translate(${x0(d.month)},0)`)
      .selectAll("rect")
      .data(d => Object.entries(d.values))
      .join("rect")
      .attr("x", d => x1(d[0]))
      .attr("y", d => y(d[1]))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d[1]))
      .attr("fill", d => colors[d[0]]);
  
    const legend = svg.append("g")
      .attr("transform", `translate(${width + 20}, 0)`);
  
    legend.selectAll("rect")
      .data(Object.entries(colors))
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 25)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", d => d[1]);
  
    legend.selectAll("text")
      .data(Object.entries(colors))
      .join("text")
      .attr("x", 30)
      .attr("y", (d, i) => i * 25 + 15)
      .text(d => d[0]);
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
    const response = await fetch(`https://asnoise-4.onrender.com/api/activity/${username}/${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    const activityInfo = document.getElementById('activity');
    const ul = document.createElement('ul');
    activityInfo.innerHTML = ""; 

    if (data.success) {
      data.activity.forEach(activity => {
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
    } else {
      const noActivity = document.createElement('p');
      noActivity.classList.add("no_activity_text");
      noActivity.textContent = 'No activity for this day.';
      activityInfo.appendChild(noActivity);
    }
    } catch (error) {
    console.error('Error fetching data:', error);
    const activityInfo = document.getElementById('activity');
    const noActivity = document.createElement('p');
    noActivity.textContent = `Error fetching activities: ${error.message}`;
    activityInfo.appendChild(noActivity);
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
    const profilePicDiv = document.getElementById('profile_img');
    if (data.success && data.photo) {
      const imgElement = document.createElement('img');
      imgElement.classList.add('profile-pic')
      imgElement.src = `./images/${data.photo}`;
      imgElement.alt = "Profile Picture";
      window.sessionStorage.setItem('doctorPhoto', data.photo);
      profilePicDiv.innerHTML = '';
      profilePicDiv.appendChild(imgElement);
      const userName =  data.first_name;
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
    console.error('Error fetching profile picture:',username);
    document.getElementById('profile-img').innerHTML = '<p>Error loading profile picture</p>';
  }
}
