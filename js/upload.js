// js/upload.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// =============================================
// 🔧 YOUR CLOUDINARY VALUES
const CLOUDINARY_CLOUD_NAME    = "dfndi4mbt";
const CLOUDINARY_UPLOAD_PRESET = "upload";
// =============================================

const getCurrentUser = () => new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();
    resolve(user);
  });
});

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "../login.html";
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

// Form elements
const form        = document.querySelector(".upload-form");
const confirmBtn  = document.querySelector(".confirm-btn");
const progressBox = document.getElementById("progress-box");
const progressBar = document.getElementById("progress-fill");
const progressPct = document.getElementById("progress-pct");
const messageEl   = document.getElementById("upload-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    showMessage("You must be logged in to upload.", "error");
    window.location.href = "../login.html";
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
  progressBox.style.display = "block";
  progressPct.textContent   = "0%";
  progressBar.style.width   = "0%";

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const uploadURL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`;

    const cloudinaryData = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          progressBar.style.width = pct + "%";
          progressPct.textContent = pct + "%";
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          // ⚠️ Log the full error response so we can see exactly what's wrong
          console.error("Cloudinary error response:", xhr.responseText);
          reject(new Error("Cloudinary error: " + xhr.status + " — " + xhr.responseText));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
      xhr.open("POST", uploadURL);
      xhr.send(formData);
    });

    let fileURL = cloudinaryData.secure_url;

    await addDoc(collection(db, "research"), {
      title,
      authors,
      department,
      schoolYear,
      fileURL,
      fileName:   file.name,
      uploadedBy: currentUser.displayName || currentUser.email,
      userId:     currentUser.uid,
      status:     "pending",
      createdAt:  serverTimestamp()
    });

    progressBar.style.width = "100%";
    progressPct.textContent = "100%";

    setTimeout(() => {
      progressBox.style.display = "none";
      showMessage("Research submitted! It is now pending review.", "success");
      form.reset();
      customText.textContent = "No file chosen, yet.";
      confirmBtn.disabled    = false;
      confirmBtn.textContent = "Confirm & Submit";
    }, 500);

  } catch (err) {
    console.error("Upload error:", err);
    progressBox.style.display = "none";
    showMessage("Upload failed: " + err.message, "error");
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