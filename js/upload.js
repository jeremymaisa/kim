// js/upload.js
import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    window.location.href = "../login.html";
  }
});

// File chooser
const realFile     = document.getElementById("real-file");
const customBtn    = document.getElementById("custom-button");
const customText   = document.getElementById("custom-text");

customBtn.addEventListener("click", () => realFile.click());

realFile.addEventListener("change", () => {
  const file = realFile.files[0];
  customText.textContent = file ? file.name : "No file chosen, yet.";
});

// Form submit
const form = document.querySelector(".upload-form");
const confirmBtn = document.querySelector(".confirm-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    showMessage("You must be logged in to upload.", "error");
    return;
  }

  const title      = form.querySelectorAll(".custom-input")[0].value.trim();
  const authors    = form.querySelectorAll(".custom-input")[1].value.trim();
  const department = form.querySelectorAll(".custom-input")[2].value;
  const schoolYear = form.querySelectorAll(".custom-input")[3].value;
  const file       = realFile.files[0];

  if (!title || !authors || !file) {
    showMessage("Please fill in all fields and choose a file.", "error");
    return;
  }

  confirmBtn.disabled = true;
  confirmBtn.textContent = "Uploading...";

  try {
    // 1. Upload file to Firebase Storage
    const fileRef = ref(storage, `research/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        confirmBtn.textContent = `Uploading... ${pct}%`;
      },
      (error) => {
        console.error(error);
        showMessage("File upload failed. Try again.", "error");
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Confirm & Submit";
      },
      async () => {
        // 2. Get download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // 3. Save metadata to Firestore with status "pending"
        await addDoc(collection(db, "research"), {
          title,
          authors,
          department,
          schoolYear,
          fileURL:     downloadURL,
          fileName:    file.name,
          uploadedBy:  currentUser.displayName || currentUser.email,
          userId:      currentUser.uid,
          status:      "pending",
          createdAt:   serverTimestamp()
        });

        showMessage("Research submitted successfully! It is now pending review.", "success");
        form.reset();
        customText.textContent = "No file chosen, yet.";
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Confirm & Submit";
      }
    );
  } catch (err) {
    console.error(err);
    showMessage("Something went wrong. Please try again.", "error");
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Confirm & Submit";
  }
});

function showMessage(msg, type) {
  let el = document.getElementById("upload-message");
  if (!el) {
    el = document.createElement("p");
    el.id = "upload-message";
    el.style.cssText = `
      margin-top: 14px;
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      padding: 10px 14px;
      border-radius: 8px;
    `;
    form.after(el);
  }
  el.textContent = msg;
  el.style.color           = type === "success" ? "#155724" : "#721c24";
  el.style.backgroundColor = type === "success" ? "#d4edda"  : "#f8d7da";
  el.style.border          = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;
}