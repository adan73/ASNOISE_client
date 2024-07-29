window.onload = () => {
    const messageDataUrl = 'test.json'; // URL to JSON file (data)
    let lastMessageId = 0;
    const currentUser = window.sessionStorage.getItem('UserType'); 
    const username = window.sessionStorage.getItem('userName');
    const textarea = document.querySelector('.chat-footer textarea');
    textarea.value = '';
    textarea.placeholder = 'Ask me Anything......';
    loadMessages(lastMessageId, currentUser);
    setupSendButton(currentUser);
    startMessagePolling(messageDataUrl, lastMessageId, currentUser);
    const logopic = document.getElementById("chatLogo");
    logopic.addEventListener("click", () => {
        if (currentUser === 'doctor') {
            window.location.href = "Doctor_homepage.html"; 
        } else {
            window.location.href = "patientHomePage.html"; 
        }
    });
};


async function loadMessages(lastMessageId, currentUser) {
    try {
        const response = await fetch('test.json');//url to data add 
        const data = await response.json();
        const chatBody = document.querySelector('.chat-body');
        chatBody.innerHTML = '';
        if (data.messages.length === 0) {
            const noMessagesElement = document.createElement('p');
            noMessagesElement.textContent = 'You have no messages yet';
            chatBody.appendChild(noMessagesElement);
        } else {
            data.messages.forEach(message => {
                appendMessage(chatBody, message, currentUser);
                lastMessageId = Math.max(lastMessageId, message.id);
            });
        }
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        const chatBody = document.querySelector('.chat-body');
        const noChat = document.createElement('p');
        noChat.textContent = 'Error fetching chat history.';
        chatBody.appendChild(noChat);
    }
}

function appendMessage(chatBody, message, currentUser) {
    const messageElement = document.createElement('div');
    const imgElement = document.createElement('img');
    const messageContent = document.createElement('p');
    let doctorimg ='' ; 
    let patientimg = '';
    if (currentUser === 'patient') {
        doctorimg = sessionStorage.getItem('patient-doc-img');
        patientimg = sessionStorage.getItem('userPatientImg');
    }
    else {
        doctorimg = `./images/${sessionStorage.getItem('doctorPhoto')}`;
        if ((JSON.parse(window.sessionStorage.getItem("patientData"))).photo) {
            patientimg = `./images/${(JSON.parse(window.sessionStorage.getItem("patientData"))).photo}`;
        }
        else {
            patientimg = './images/user_first_profile.jpg';
        }
    }
    imgElement.classList.add('user-icon');
    imgElement.src = message.sender === 'doctor' ? doctorimg : patientimg;
    imgElement.alt = message.sender === 'doctor' ? 'dr Photo' : 'patient Photo';
    messageContent.textContent = message.chat;

    if (message.sender === currentUser) {
        messageElement.className = 'userPatient';
        messageElement.appendChild(messageContent);
        messageElement.appendChild(imgElement);
    } else {
        messageElement.className = 'userDoc';
        messageElement.appendChild(imgElement);
        messageElement.appendChild(messageContent);
    }

    chatBody.appendChild(messageElement);
}

function setupSendButton(currentUser) {
    const sendButton = document.querySelector('.sending-icon .fa-paper-plane');
    const textarea = document.querySelector('.chat-footer textarea');

    sendButton.addEventListener('click', () => {
        const messageText = textarea.value.trim();
        if (messageText) {
            sendMessage(messageText, currentUser);
            textarea.value = '';
            textarea.placeholder = 'Ask me Anything......';
        }
    });

    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
            textarea.placeholder = 'Ask me Anything......';
        }
    });
}

function sendMessage(text, currentUser) {
    if (currentUser === 'doctor') {
        saveMessage(((JSON.parse(window.sessionStorage.getItem("patientData"))).patient_id),text,currentUser);
    }
    else {
        saveMessage(window.sessionStorage.getItem('patientId'),text,currentUser);
    }
    const chatBody = document.querySelector('.chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
}
async function saveMessage(patientId ,text, currentUser)
{
    const patient_id = patientId;
    const sender = currentUser;
    const chat = text;
    try {/// add the url in the fetch next line to save in the database
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({patient_id,sender,chat})
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }
        const data = await response.json();

        if (data.success) {
            console.log('Sending message:', text);
            const chatBody = document.querySelector('.chat-body');
            appendMessage(chatBody, { sender: currentUser, chat: text }, currentUser);
            chatBody.scrollTop = chatBody.scrollHeight;
        } else {
            console.error('Error during sending message:', error);
            const chatBody = document.querySelector('.chat-body');
            const errormessage = document.createElement('div');
            const icon = document.createElement('i');
            icon.className = 'fa fa-exclamation-circle';
            errormessage.appendChild(icon);
            errormessage.className = 'ErrorChat';
            chatBody.appendChild(errormessage);
            appendMessage(errormessage, { sender: currentUser, chat: text }, currentUser);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    } catch (error) {
        console.error('Error during saving message:', error);
        const chatBody = document.querySelector('.chat-body');
        const errormessage = document.createElement('p');
        const icon = document.createElement('i');
        icon.className = 'fa fa-exclamation-circle';
        errormessage.appendChild(icon);
        errormessage.className = 'ErrorChat';
        chatBody.appendChild(errormessage);
        appendMessage(errormessage, { sender: currentUser, chat: text }, currentUser);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

function startMessagePolling(messageDataUrl, lastMessageId, currentUser) {
    setInterval(() => {
        fetch(messageDataUrl)
            .then(response => response.json())
            .then(data => {
                const chatBody = document.querySelector('.chat-body');
                const newMessages = data.messages.filter(message => message.id > lastMessageId);

                if (newMessages.length > 0) {
                    newMessages.forEach(message => {
                        appendMessage(chatBody, message, currentUser);
                        lastMessageId = Math.max(lastMessageId, message.id);
                    });
                    chatBody.scrollTop = chatBody.scrollHeight;
                }
            })
            .catch(error => console.error('Error polling messages:', error));
    }, 5000);
}