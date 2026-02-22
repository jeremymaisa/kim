// js/auth_redirect.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export function requireRole(requiredRole, onAllowed) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data().role : "student";

    if (role !== requiredRole) {
      // Redirect to the right dashboard based on their actual role
      if (role === "admin") {
        window.location.href = "/admin/admin_index.html"; // ✅ lowercase
      } else {
        window.location.href = "/index.html";
      }
      return;
    }

    onAllowed(user, role);
  });
}