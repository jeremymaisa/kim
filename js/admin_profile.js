  import { auth, db } from "/js/firebase.js";
  import { signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
  import { requireRole } from "/js/auth_redirect.js";

  requireRole("admin", (user) => {
    const displayName = document.getElementById("displayName");
    if (displayName) displayName.innerText = user.displayName || user.email;
  });

  // ✅ Expose functions to window so onclick= in HTML can access them
  window.previewImage = function (event) {
    const reader = new FileReader();
    reader.onload = function () {
      const output = document.getElementById("imagePreview");
      const icon   = document.getElementById("defaultIcon");
      output.style.backgroundImage    = `url('${reader.result}')`;
      output.style.backgroundSize     = "cover";
      output.style.backgroundPosition = "center";
      if (icon) icon.style.display = "none";
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  window.saveProfile = function () {
    const user  = document.getElementById("username").value;
    const fname = document.getElementById("firstName").value;
    const lname = document.getElementById("lastName").value;
    document.getElementById("displayName").innerText = fname + " " + lname;
    alert("Profile successfully updated!\nNew Username: " + user);
  };

  window.confirmLogout = async function () {
    if (confirm("Log out of ICCTory?")) {
      try {
        await signOut(auth);
        window.location.href = "/login.html";
      } catch (error) {
        console.error("Logout error:", error);
        alert("Failed to log out. Please try again.");
      }
    }
  };