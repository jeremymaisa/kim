// js/sign-up.js
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const form = document.querySelector("form");
const submitBtn = document.getElementById("submit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Basic validation
  if (!email || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Signing up...";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User registered:", user.email);
    showMessage("Account created successfully! Redirecting to login...", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    console.error("Sign-up error:", error.code);
    showMessage(getFriendlyError(error.code), "error");
    submitBtn.disabled = false;
    submitBtn.textContent = "SIGN UP";
  }
});

function getFriendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
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