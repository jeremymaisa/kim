// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtHGPj_mS1L9CkVqQ72fsbo3uD9CDEqqg",
  authDomain: "kimm-423ca.firebaseapp.com",
  projectId: "kimm-423ca",
  storageBucket: "kimm-423ca.firebasestorage.app",
  messagingSenderId: "813756854374",
  appId: "1:813756854374:web:3c44decb02c6d983f2fda7",
  measurementId: "G-YXERPTYVXT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);