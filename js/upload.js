// js/upload.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// ✅ Your Cloudinary credentials — replace these with your actual values
const CLOUDINARY_CLOUD_NAME = "dfndi4mbt";   // e.g. "icctory"
const CLOUDINARY_UPLOAD_PRESET = "upload"; // e.g. "icctory_unsigned"

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }
  currentUser = user;
});

const customBtn = document.getElementById("custom-button");
const realFile  = document.getElementById("real-file");
const fileText  = document.getElementById("custom-text");
const form      = document.querySelector(".upload-form");

customBtn.addEventListener("click", () => realFile.click());
realFile.addEventListener("change", () => {
  fileText.textContent = realFile.files[0]?.name || "No file chosen, yet.";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("You must be logged in to upload.");
    return;
  }

  const title   = document.getElementById("researchTitle").value.trim();
  const authors = document.getElementById("researchAuthors").value.trim();
  const dept    = document.getElementById("researchDept").value;
  const year    = document.getElementById("researchYear").value;
  const file    = realFile.files[0];

  if (!title || !authors || !file) {
    alert("Please fill in all fields and choose a file.");
    return;
  }

  const progressBox  = document.getElementById("progress-box");
  const progressFill = document.getElementById("progress-fill");
  const progressPct  = document.getElementById("progress-pct");
  const uploadMsg    = document.getElementById("upload-message");

  progressBox.style.display = "block";
  uploadMsg.style.display   = "none";

  try {
    // ✅ Step 1 — Upload file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "research"); // optional: organizes files in Cloudinary

    // Use XMLHttpRequest so we can track upload progress
    const fileURL = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          progressFill.style.width = pct + "%";
          progressPct.textContent  = pct + "%";
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url); // ✅ This is the Cloudinary file URL
        } else {
          reject(new Error("Cloudinary upload failed: " + xhr.statusText));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
      xhr.send(formData);
    });

    // ✅ Step 2 — Save metadata + Cloudinary URL to Firestore
    await addDoc(collection(db, "research"), {
      title:       title,
      authors:     authors,
      dept:        dept,
      year:        year,
      fileURL:     fileURL,           // Cloudinary URL
      uploadedBy:  currentUser.email,
      uploadedUID: currentUser.uid,
      status:      "pending",
      createdAt:   serverTimestamp()
    });

    // ✅ Success
    progressBox.style.display       = "none";
    uploadMsg.textContent           = "✅ Uploaded successfully! Awaiting admin approval.";
    uploadMsg.style.display         = "block";
    uploadMsg.style.color           = "#155724";
    uploadMsg.style.backgroundColor = "#d4edda";
    uploadMsg.style.border          = "1px solid #c3e6cb";
    form.reset();
    fileText.textContent = "No file chosen, yet.";

  } catch (error) {
    console.error("Upload error:", error);
    progressBox.style.display       = "none";
    uploadMsg.textContent           = "❌ Upload failed. Please try again.";
    uploadMsg.style.display         = "block";
    uploadMsg.style.color           = "#721c24";
    uploadMsg.style.backgroundColor = "#f8d7da";
    uploadMsg.style.border          = "1px solid #f5c6cb";
  }
});