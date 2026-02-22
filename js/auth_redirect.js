// js/auth_redirect.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Checks auth + role, then calls the appropriate callback.
 * @param {"admin"|"student"|"any"} requiredRole - who is allowed on this page
 * @param {Function} onAllowed - runs when the user has access
 */
export function requireRole(requiredRole, onAllowed) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data().role : "student";

    if (requiredRole === "admin" && role !== "admin") {
      // Student tried to access admin page
      window.location.href = "/index.html";
      return;
    }

    if (requiredRole === "student" && role !== "student") {
      // Admin tried to access student page
      window.location.href = "/admin_index.html";
      return;
    }

    onAllowed(user, role);
  });
}