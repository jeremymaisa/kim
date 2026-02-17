import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

  if (!user) {

    // Force redirect and block back button access
    window.location.replace("/login.html");

  }

});