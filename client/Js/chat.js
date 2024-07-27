window.onload = () => {
    const messageDataUrl = 'test.json'; // URL to JSON file (data)
    let lastMessageId = 0;
    const currentUser = 'patient'; // Change this based on user type (doctor, patient)

    const textarea = document.querySelector('.chat-footer textarea');
    textarea.value = '';
    textarea.placeholder = 'Ask me Anything......';

    loadMessages(lastMessageId, currentUser);
    setupSendButton(currentUser);
    startMessagePolling(messageDataUrl, lastMessageId, currentUser);
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
    //replace the photos paths 
    imgElement.classList.add('user-icon');
    imgElement.src = message.sender === 'doctor' ? 'images/doctor-image.jpg' : 'images/patient-image.jpg';
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
    // Replace with actual sending logic to save the message, update the data in database
    console.log('Sending message:', text);

    const chatBody = document.querySelector('.chat-body');
    appendMessage(chatBody, { sender: currentUser, chat: text }, currentUser);
    chatBody.scrollTop = chatBody.scrollHeight;
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