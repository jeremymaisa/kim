// js/upload.js
import { auth, db, storage } from "../js/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    window.location.href = "../login.html";
  }
});

// File chooser
const realFile   = document.getElementById("real-file");
const customBtn  = document.getElementById("custom-button");
const customText = document.getElementById("custom-text");

customBtn.addEventListener("click", () => realFile.click());

realFile.addEventListener("change", () => {
  const file = realFile.files[0];
  customText.textContent = file ? file.name : "No file chosen, yet.";
});

// Form submit
const form        = document.querySelector(".upload-form");
const confirmBtn  = document.querySelector(".confirm-btn");
const progressBox = document.getElementById("progress-box");
const progressBar = document.getElementById("progress-fill");
const progressPct = document.getElementById("progress-pct");
const messageEl   = document.getElementById("upload-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    showMessage("You must be logged in to upload.", "error");
    return;
  }

  const inputs     = form.querySelectorAll(".custom-input");
  const title      = inputs[0].value.trim();
  const authors    = inputs[1].value.trim();
  const department = inputs[2].value;
  const schoolYear = inputs[3].value;
  const file       = realFile.files[0];

  if (!title || !authors || !file) {
    showMessage("Please fill in all fields and choose a file.", "error");
    return;
  }

  hideMessage();
  confirmBtn.disabled    = true;
  confirmBtn.textContent = "Uploading...";

  // Show progress bar as indeterminate (animating) while uploading
  progressBox.style.display = "block";
  progressPct.textContent   = "Uploading...";
  progressBar.style.width   = "30%";
  progressBar.style.transition = "none";

  // Animate bar slowly to 90% while waiting
  setTimeout(() => {
    progressBar.style.transition = "width 8s ease";
    progressBar.style.width      = "90%";
  }, 100);

  try {
    // uploadBytes instead of uploadBytesResumable — simpler, no CORS issues
    const fileRef = ref(storage, `research/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);

    // Done — jump to 100%
    progressBar.style.transition = "width 0.3s ease";
    progressBar.style.width      = "100%";
    progressPct.textContent      = "100%";

    const downloadURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, "research"), {
      title,
      authors,
      department,
      schoolYear,
      fileURL:    downloadURL,
      fileName:   file.name,
      uploadedBy: currentUser.displayName || currentUser.email,
      userId:     currentUser.uid,
      status:     "pending",
      createdAt:  serverTimestamp()
    });

    setTimeout(() => {
      progressBox.style.display = "none";
      showMessage("Research submitted! It is now pending review.", "success");
      form.reset();
      customText.textContent = "No file chosen, yet.";
      confirmBtn.disabled    = false;
      confirmBtn.textContent = "Confirm & Submit";
    }, 500);

  } catch (err) {
    console.error("Upload error:", err.code, err.message);
    progressBox.style.display = "none";
    showMessage("Upload failed: " + (err.message || "Please check your connection."), "error");
    confirmBtn.disabled    = false;
    confirmBtn.textContent = "Confirm & Submit";
  }
});

function showMessage(msg, type) {
  messageEl.textContent           = msg;
  messageEl.style.display         = "block";
  messageEl.style.color           = type === "success" ? "#155724" : "#721c24";
  messageEl.style.backgroundColor = type === "success" ? "#d4edda"  : "#f8d7da";
  messageEl.style.border          = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;
}

function hideMessage() {
  messageEl.style.display = "none";
}