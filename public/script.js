const socket = io('http://localhost:3000');
const msgContainer = document.getElementById('msg-cont');
const msgForm = document.getElementById('snd-cont');
const messageInput = document.getElementById('msg-inp');

// Prompts user for name (will be replaced by login screen)
const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);

// Adds message written onto html page in the specified container
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
})

// On user connect, adds user's name and connected message
socket.on('user-connected', data => {
    appendMessage(`${name} connected`);
})

// When user disconnects message with user name is displayed
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
})

// Listens to submit button and handles data from form
msgForm.addEventListener('submit', event => {
    event.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
})

// Function for adding new div and append received data into them
function appendMessage(message) {
    const msgElement = document.createElement('div');
    msgElement.innerText = message;
    msgContainer.append(msgElement);
}