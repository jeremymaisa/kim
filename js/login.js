// js/login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const form = document.querySelector("form");
const loginBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.querySelector("input[type='email']").value.trim();
  const password = form.querySelector("input[type='password']").value.trim();

  if (!email || !password) {
    showMessage("Please enter your email and password.", "error");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Logged in:", user.email);
    showMessage("Login successful! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "index.html"; // direct to index page
    }, 1500);
  } catch (error) {
    console.error("Login error:", error.code);
    showMessage(getFriendlyError(error.code), "error");
    loginBtn.disabled = false;
    loginBtn.textContent = "LOG IN";
  }
});

function getFriendlyError(code) {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support.";
    default:
      return "Login failed. Please try again.";
  }
}

function showMessage(msg, type) {
  let el = document.getElementById("auth-message");
  if (!el) {
    el = document.createElement("p");
    el.id = "auth-message";
    el.style.cssText = `
      margin-top: 10px;
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      padding: 8px 12px;
      border-radius: 6px;
    `;
    form.after(el);
  }
  el.textContent = msg;
  el.style.color = type === "success" ? "#155724" : "#721c24";
  el.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
  el.style.border = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;
}