const socket = io('http://localhost:3000');
const msgContainer = document.getElementById('msg-cont');
const msgForm = document.getElementById('snd-cont');
const messageInput = document.getElementById('msg-inp');
const roomCont = document.getElementById('room-cont');

<<<<<<< HEAD


let userId = document.cookie.replace('user=', '');

let name;

fetch('/user/' + userId).then(res => res.json()).then(user => {
    console.log(user);
    name = user.username;
    appendMessage(name + " " + ' has joined');
    socket.emit('new-user', name);
})
=======
if (msgForm != null) {
    // Prompts user for name (will be replaced by login screen)
    const name = prompt('What is your name?');
    appendMessage('You joined');
    socket.emit('new-user', roomName, name);

    // Listens to submit button and handles data from form
    msgForm.addEventListener('submit', event => {
        event.preventDefault();
        const message = messageInput.value;
        appendMessage(`You: ${message}`);
        socket.emit('send-chat-message', roomName, message);
        messageInput.value = '';
    })
}

/*socket.on('room-created', room => {
    const roomElement = document.createElement('div');
    roomElement.innderText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`;
    roomLink.innerText = 'join';
    roomCont.append(roomElement);
    roomCont.append(roomLink);
})*/
>>>>>>> 84b99313a5f2f6cad2d4168a35ac0411c8f7e883

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



// Function for adding new div and append received data into them
function appendMessage(message) {
    const msgElement = document.createElement('div');
    msgElement.innerText = message;
    msgContainer.append(msgElement);
}