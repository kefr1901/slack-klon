document.getElementById("send_btn").addEventListener("click", function(){
    let inputname = document.getElementById("nameinput").value;
    let chat = document.getElementById("textinput").value;

var newchat = document.createElement('p');
newchat.innerHTML = chat;

let table = document.getElementById('content');
//let person = document.getElementById("p");

//person.appendChild(inputname);
table.appendChild(newchat);

});



