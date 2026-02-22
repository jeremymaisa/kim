// js/sign-up.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const form      = document.querySelector("form");
const submitBtn = document.getElementById("submit");

// ✅ Change this to whatever secret key you want for admin registration
const ADMIN_SECRET_KEY = "icctory_admin_2024";

let selectedRole = "student"; // default

// ✅ Role toggle
window.setRole = function (role) {
  selectedRole = role;
  document.getElementById("btnStudent").classList.toggle("active", role === "student");
  document.getElementById("btnAdmin").classList.toggle("active", role === "admin");

  // Show/hide admin key field
  const adminKeyGroup = document.getElementById("adminKeyGroup");
  adminKeyGroup.style.display = role === "admin" ? "block" : "none";
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name     = document.getElementById("name").value.trim();
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  // ✅ If registering as admin, verify the secret key
  if (selectedRole === "admin") {
    const adminKey = document.getElementById("adminKey").value.trim();
    if (adminKey !== admin) {
      showMessage("Invalid admin secret key. Please try again.", "error");
      return;
    }
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Signing up...";

  try {
    // 1. Create Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Save display name
    await updateProfile(user, { displayName: name });

    // 3. ✅ Save role to Firestore — uses selectedRole (student or admin)
    await setDoc(doc(db, "users", user.uid), {
      name:      name,
      email:     email,
      role:      selectedRole,   // 👈 saves whichever role was selected
      createdAt: new Date()
    });

    console.log("User registered:", user.email, "| Role:", selectedRole);
    showMessage(
      `Account created! Welcome, ${name}. Redirecting to login...`,
      "success"
    );

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
  el.textContent           = msg;
  el.style.color           = type === "success" ? "#155724" : "#721c24";
  el.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
  el.style.border          = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;
}