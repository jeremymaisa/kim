onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/login.html";
    return;
  }
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const role = userDoc.exists() ? userDoc.data().role : "student";

  if (role === "admin") {
    window.location.href = "/admin/admin_index.html";  // ✅
  }
});