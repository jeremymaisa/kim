// js/upload.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";

const storage = getStorage();
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

  // ✅ Using IDs now — no more null errors
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

  const storageRef = ref(storage, `research/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on("state_changed",
    (snapshot) => {
      const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressFill.style.width = pct + "%";
      progressPct.textContent  = pct + "%";
    },
    (error) => {
      console.error("Upload error:", error);
      progressBox.style.display = "none";
      uploadMsg.textContent         = "❌ Upload failed. Please try again.";
      uploadMsg.style.display       = "block";
      uploadMsg.style.color         = "#721c24";
      uploadMsg.style.backgroundColor = "#f8d7da";
      uploadMsg.style.border        = "1px solid #f5c6cb";
    },
    async () => {
      const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

      await addDoc(collection(db, "research"), {
        title:       title,
        authors:     authors,
        dept:        dept,
        year:        year,
        fileURL:     fileURL,
        uploadedBy:  currentUser.email,
        uploadedUID: currentUser.uid,
        status:      "pending",
        createdAt:   serverTimestamp()
      });

      progressBox.style.display     = "none";
      uploadMsg.textContent         = "✅ Uploaded successfully! Awaiting admin approval.";
      uploadMsg.style.display       = "block";
      uploadMsg.style.color         = "#155724";
      uploadMsg.style.backgroundColor = "#d4edda";
      uploadMsg.style.border        = "1px solid #c3e6cb";
      form.reset();
      fileText.textContent = "No file chosen, yet.";
    }
  );
});