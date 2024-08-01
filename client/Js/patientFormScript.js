window.onload = () => {
  loadFormData();

  document.getElementById("image").oninput = function (event) {
    previewImage();
  };
  printProfilePic();
  document.getElementById("save").onclick = () => savePatientInfo();
};


function loadFormData() {
  const formData = JSON.parse(
    window.sessionStorage.getItem("patientData") ?? "{}"
  );

  if (Object.keys(formData).length === 0) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("first_name").value = formData.first_name ?? "";
  document.getElementById("last_name").value = formData.last_name ?? "";
  document.getElementById("age").value = formData.age ?? "";
  document.getElementById("stage").value = formData.adhdStage ?? "";
  document.getElementById("id").value = formData.patient_id ?? "";
  document.getElementById("email").value = formData.email ?? "";
  document.getElementById("phone").value = formData.phone ?? "";
  document.getElementById("address").value = formData.address ?? "";
  document.getElementById("hmo").value = formData.hmo ?? "";
  window.sessionStorage.setItem('patient_photo', formData.photo,);
  const previewImage = document.getElementById("preview-image");
  previewImage.src = `./images/${formData.photo}` ?? "";
  previewImage.style.display = formData.photo ? "block" : "none";
}
async function savePatientInfo() {
  const formData = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    age: document.getElementById("age").value,
    adhdStage: document.getElementById("stage").value,
    patient_id: document.getElementById("id").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    hmo: document.getElementById("hmo").value,
    photo: window.sessionStorage.getItem('patient_photo'),
    doctor: window.sessionStorage.getItem('doctorFirstName'),
    doctor_photo: window.sessionStorage.getItem('doctorPhoto')
  };

  window.sessionStorage.setItem("patientData", JSON.stringify(formData));

  let patients = JSON.parse(window.sessionStorage.getItem("patients")) || [];
  const patientIndex = patients.findIndex(
    (patient) => patient.patient_id === formData.patient_id
  );

  if (patientIndex !== -1) {
    patients[patientIndex] = formData;
  } else {
    patients.push(formData);
  }

  window.sessionStorage.setItem("patients", JSON.stringify(patients));

  try {
    const response = await fetch(`https://asnoise-4.onrender.com/api/patients/${formData.patient_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Patient updated successfully:', result);
    window.location.href = "patientPage.html";
  } catch (error) {
    console.error('Error updating patient:', error);
    alert('Failed to update patient info');
  }
}


function previewImage() {
  const imgInput = document.getElementById("image");
  const img = imgInput.files[0];
  if (!img) {
    return;
  }

  const previewImage = document.getElementById("preview-image");
  previewImage.src = URL.createObjectURL(img);
  previewImage.style.display = "block";
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
