export function requireRole(requiredRole, onAllowed) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data().role : "student";

    if (role !== requiredRole) {
      if (role === "admin") {
        window.location.href = "/admin/admin_index.html";  // ✅
      } else {
        window.location.href = "/index.html";              // ✅
      }
      return;
    }

    onAllowed(user, role);
  });
}