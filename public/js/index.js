const socket = io();

const messageForm = document.querySelector("form");
const messageInput = document.querySelector("#inputMessage");
const messagesAll = document.querySelector("#messages");

function appendMessage(message){
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messagesAll.append(messageElement)
}


const room = prompt("Which room do you want to join?");
socket.emit("new-room", room);

const name = prompt("What is your name?");
socket.emit("new-user", name);

appendMessage(`${name} joined the room- ${room}!`);

socket.on("chat message", (data) => {
    appendMessage(`${data.name}: ${data.message}`);
});
socket.on("user-connected", (name) => {
    appendMessage(`${name} also joined this room!`)
});
socket.on("user-disconnected", (name) => {
    appendMessage(`${name} left the room!`)
});
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if(message != ""){
        appendMessage(`You: ${message}`);
        console.log(message)
        socket.emit("chat message", message);
        messageInput.value = '';
    }
});

function testSocket(){
    socket.emit("test");
}

socket.on("test2", (data) => {appendMessage(data)})