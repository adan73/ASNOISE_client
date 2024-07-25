window.onload = () => {
    const userName = window.sessionStorage.getItem('userName');
    
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = userName ? userName : 'Guest'; 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const first_name = document.getElementById("fname").value;
        const last_name = document.getElementById("lname").value;
        const patient_id = document.getElementById("id").value;
        const hmo = document.getElementById("HMO").value;
        const adhdStage = document.getElementById("ADHD").value;
        const age = document.getElementById("Age").value;
        const phone = document.getElementById("Phone").value;
        const email = document.getElementById("email").value;
        const career = document.getElementById("Career").value;
        const address = document.getElementById("Address").value;
        const photo = 'https://cdn-icons-png.freepik.com/512/3686/3686930.png';

        if (!first_name || !last_name || !patient_id || !hmo || !adhdStage || !age || !phone || !email || !career || !address) {
            alert("Please fill out all required fields.");
            return; 
        }
        try {
          const response = await fetch('https://asnoise-4.onrender.com/api/patients/addPatient', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({first_name,last_name,patient_id,hmo,adhdStage, age, career,address, phone, email, photo})
          });
      
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Network response was not ok: ${errorText}`);
          }
    
          const data = await response.json();
      
          if (data.success) {
              window.location.href = "Doctor_homepage.html";
          } else {
              alert("Failed to add patient.");
          }
      } catch (error) {
          console.error('Error during adding:', error);
          alert(`An error occurred while adding the patient: ${error.message}`);
      }
      
    });
});