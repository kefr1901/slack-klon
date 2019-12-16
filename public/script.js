const socket = io();
const msgContainer = document.getElementById('msg-cont');
const msgForm = document.getElementById('snd-cont');
const messageInput = document.getElementById('msg-inp');


let userId = document.cookie.replace('user=', '');
let name;

fetch('chat/user/' + userId).then(res => res.json()).then(user => {
    console.log(user);
    name = user.username;
    appendMessage(name + " " + ' has joined');
    socket.emit('new-user', name);
})

// Adds message written onto html page in the specified container
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
})

// On user connect, adds user's name and connected message
socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
})

// When user disconnects message with user name is displayed
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#snd-btn').addEventListener('click', e => {
        e.preventDefault();
        socket.emit('send-chat-message', document.querySelector('#msg-inp').value);
        appendMessage(document.querySelector('#msg-inp').value);
    })
})

function appendMessage(message) {
    const msgElement = document.createElement('p');
    msgElement.innerText = message;
    msgContainer.append(msgElement);
};
