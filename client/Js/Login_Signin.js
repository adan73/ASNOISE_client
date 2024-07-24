document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signinForm = document.getElementById('signin-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Validate input
            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }

            try {
                const response = await fetch('https://asnoise-4.onrender.com/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                console.log('Login response:', data);

                if (data.success) {
                    window.sessionStorage.setItem('userName', username);
                    if (data.user_type === 'doctor') {
                        window.location.href = 'index.html';
                    } else {
                        window.location.href = 'patientside.html';
                    }
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('Username or Password are invalid.');
            }
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission
            
            const first_name = document.getElementById('firstname').value;
            const last_name = document.getElementById('lastname').value;
            const users_id = document.getElementById('id').value;
            const username = document.getElementById('username').value;
            const user_password = document.getElementById('password').value;
            const email = document.getElementById('email').value;
            const profile_image = 'user_first_profile.jpg';
            const user_type = document.getElementById('user_type').value;

            // Validate input
            if (!users_id || !first_name || !last_name || !user_password || !email || !username || !user_type) {
                alert('Please fill all the requested data.');
                return;
            }

            try {
                const response = await fetch('https://asnoise-4.onrender.com/api/users/addUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ users_id, first_name, last_name, user_password, email, profile_image, username, user_type })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const data = await response.json();

                if (data.success) {
                    window.sessionStorage.setItem('userName', username);
                    if(user_type === 'doctor')
                    window.location.href = 'index.html';
                    else{
                        window.location.href = 'patienside.html';  
                    }
                } else {
                    alert(data.error || 'Sign in failed');
                }
            } catch (error) {
                console.error('Error during signin:', error);
                alert('Username or Email or Id is already exist. Please try again.');
            }
        });
    }
});
