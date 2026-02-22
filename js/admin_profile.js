
import { auth } from "/js/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { requireRole } from "/js/auth_redirect.js";

requireRole("admin", (user) => {
console.log("Admin authenticated:", user.email);

// ✅ Show admin name on profile page
const displayName = document.getElementById("displayName");
if (displayName) displayName.innerText = user.displayName || user.email;
});

// ✅ Preview uploaded image
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

// ✅ Save profile (local display only)
window.saveProfile = function () {
const user   = document.getElementById("username").value;
const fname  = document.getElementById("firstName").value;
const lname  = document.getElementById("lastName").value;
document.getElementById("displayName").innerText = fname + " " + lname;
alert("Profile successfully updated!\nNew Username: " + user);
};

// ✅ Logout using Firebase Auth — clears session properly
window.confirmLogout = async function () {
if (confirm("Log out of ICCTory?")) {
    try {
    await signOut(auth);
    window.location.href = "/login.html"; // ✅ redirect to login after logout
    } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to log out. Please try again.");
    }
}
};
