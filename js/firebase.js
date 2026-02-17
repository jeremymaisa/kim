// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBtHGPj_mS1L9CkVqQ72fsbo3uD9CDEqqg",
    authDomain: "kimm-423ca.firebaseapp.com",
    projectId: "kimm-423ca",
    storageBucket: "kimm-423ca.firebasestorage.app",
    messagingSenderId: "813756854374",
    appId: "1:813756854374:web:3c44decb02c6d983f2fda7",
    measurementId: "G-YXERPTYVXT"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);