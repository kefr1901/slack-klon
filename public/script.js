const socket = io();
const msgContainer = document.getElementById('msg-cont');
const msgForm = document.getElementById('snd-cont');
const messageInput = document.getElementById('msg-inp');
const roomCont = document.getElementById('room-cont');
const loginCont = document.getElementById('formLogin');


/*socket.on('room-created', room => {
    console.log("THISROOM", room);
    const roomElement = document.createElement('div');4
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`;
    roomLink.innerText = 'join';
    roomCont.append(roomElement);
    roomCont.append(roomLink);
})*/

/*msgForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`${name}: ${message}`);
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
})*/

let userId = document.cookie.replace('user=', '');
let name;
//hämtar användarnamnet från databasen sparat som en cookie för att få ut "rätt" namn från DB
fetch('chat/user/' + userId).then(res => res.json()).then(user => {
    room = roomName;
    name = user.username;
    appendMessage(name + " " + ' has joined the chat!');
    socket.emit('new-room', room, name);
})


// Adds message written onto html page in the specified container
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
    console.log("HERE", data.name);
});

// On user connect, adds user's name and connected message
socket.on('user-connected', name => {
    appendMessage(`${name} connected to the chat!`);
});

// When user disconnects message with user name is displayed
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected from the chat!`);
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#snd-btn').addEventListener('click', e => {
        e.preventDefault();
        console.log("scrollToBottom KÖÖÖÖRS");
        socket.emit('send-chat-message', roomName, document.querySelector('#msg-inp').value);
        appendMessage("You: " + document.querySelector('#msg-inp').value);
        var element = document.getElementById("msg-cont");
        element.scrollIntoView(false);
    });
});

function appendMessage(message) {
    const msgElement = document.createElement('p');
    msgElement.innerText = message;
    msgContainer.append(msgElement);
};