import { app, analytics } from "./firebase.js";
// Register user

const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const submit = document.getElementById('submit').value;

submit.addEventListener("click", (e) => {
  e.preventDefault();
  alert(5);
});