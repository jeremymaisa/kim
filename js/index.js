// js/index.js
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Get display name, or fall back to the part before @ in their email
    const displayName = user.displayName || user.email.split("@")[0];

    // Update the greeting element
    const greetingEl = document.getElementById("user-greeting");
    if (greetingEl) {
      greetingEl.textContent = `Welcome, ${displayName}!`;
    }
  } else {
    // Not logged in — redirect back to login
    window.location.href = "login.html";
  }
});

// Logout button handler
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}