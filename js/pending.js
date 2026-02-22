// js/student_pending.js
import { auth, db } from "./firebase.js";
import { requireRole } from "./auth_redirect.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

requireRole("student", (user) => {
  loadMyPapers(user.uid);
});

function loadMyPapers(uid) {
  const container = document.getElementById("pendingList");

  // ✅ Filter by UID — student only sees their own papers
  const q = query(
    collection(db, "research"),
    where("status", "==", "pending"),
    where("uploadedUID", "==", uid)   // 👈 matches uploadedUID saved during upload
  );

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = `<p class="empty-msg">No pending papers at the moment.</p>`;
      return;
    }
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      const date = d.createdAt?.toDate().toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      }) || "—";

      const row = document.createElement("div");
      row.className = "request-row";
      row.innerHTML = `
        <span class="col-user">${d.uploadedBy || "—"}</span>
        <span class="col-title"><a href="${d.fileURL}" target="_blank">${d.title}</a></span>
        <span class="col-date">${date}</span>
        <span class="col-status"><span class="badge badge-pending">Pending</span></span>
      `;
      container.appendChild(row);
    });
  });
}