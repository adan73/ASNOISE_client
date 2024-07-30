window.onload = () => {
  printProfilePic();
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
        const photo = 'new_patient.png';
        const doctor =window.sessionStorage.getItem('doctorFirstName');
        const doctor_photo = window.sessionStorage.getItem('doctorPhoto');

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
              body: JSON.stringify({first_name,last_name,patient_id,hmo,adhdStage, age, career,address, phone, email, photo ,doctor,doctor_photo })
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

document.addEventListener('DOMContentLoaded', () => {
  const hmoSelect = document.getElementById('HMO');
  if (!hmoSelect) {
    console.error('Select element with id "HMO" not found');
    return;
  }
  const fetchHMOOptions = async () => {
    try {
      const response = await fetch('https://asnoise-4.onrender.com/api/hospitals');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        hmoSelect.innerHTML = '';
        data.forEach(item => {
          const option = document.createElement('option');
          const hospitalInfo = `${item.name || 'Unknown'}, ${item.street_address || 'N/A'}`;
          option.value = hospitalInfo;
          option.textContent = hospitalInfo;
          hmoSelect.appendChild(option);
        });
      } else {
        console.error('Expected an array of hospitals, but received:', data);
      }
    } catch (error) {
      console.error('Error fetching HMO options:', error.message);
    }
  };
  fetchHMOOptions();
});

