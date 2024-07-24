window.onload = () => {
    const userName = window.sessionStorage.getItem('userName');
    
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = userName ? userName : 'Guest'; 
    }

    PrintPatientsList();
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
  