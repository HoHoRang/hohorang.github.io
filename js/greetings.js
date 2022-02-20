const loginForm = document.getElementById("login-form");
const loginInput = document.getElementById("login-input");
const greeting = document.getElementById("greeting");

const HIDDEN_CLASS = "hidden";
const USER_NAME = "username"

function handleLogin(event) {
    event.preventDefault();
    loginForm.classList.add(HIDDEN_CLASS);
    const userName = loginInput.value;
    localStorage.setItem(USER_NAME, userName);
    paintGreeting(userName);
}

function paintGreeting(userName) {
    greeting.innerText = `Hello ${userName}!`;
    greeting.classList.remove(HIDDEN_CLASS);
}

const savedUserName = localStorage.getItem(USER_NAME);

if(savedUserName === null) {
    loginForm.classList.remove(HIDDEN_CLASS);
    loginForm.addEventListener("submit", handleLogin);
} else {
    paintGreeting(savedUserName);
}