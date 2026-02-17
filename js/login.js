import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// ╔══════════════════════════════════════════╗
// ║  Replace with your own Firebase config   ║
// ╚══════════════════════════════════════════╝
const firebaseConfig = {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Redirect to dashboard if already logged in
onAuthStateChanged(auth, user => {
    if (user) window.location.href = "dashboard.html";
});

// ── Helper refs ──
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
const toastIco = document.getElementById('toast-icon');
const spinner  = document.getElementById('spinner');
const btnText  = document.getElementById('btnText');
const loginBtn = document.getElementById('loginBtn');

function showToast(msg, type = 'error') {
    toast.className = `toast ${type}`;
    toastMsg.textContent = msg;
    toastIco.className = type === 'error'
        ? 'fa-solid fa-circle-exclamation'
        : 'fa-solid fa-circle-check';
}

function setLoading(on) {
    loginBtn.disabled     = on;
    spinner.style.display = on ? 'block' : 'none';
    btnText.textContent   = on ? 'Signing in…' : 'LOG IN';
}

function friendlyError(code) {
    const map = {
        'auth/user-not-found':        'No account found with this email.',
        'auth/wrong-password':         'Incorrect password. Please try again.',
        'auth/invalid-email':          'Please enter a valid email address.',
        'auth/invalid-credential':     'Email or password is incorrect.',
        'auth/too-many-requests':      'Too many attempts. Try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] || 'Something went wrong. Please try again.';
}

// ── Login submit ──
document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showToast('Please fill in all fields.');
        return;
    }

    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Login successful! Redirecting…', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1200);
    } catch (err) {
        showToast(friendlyError(err.code));
    } finally {
        setLoading(false);
    }
});

// ── Show / hide password ──
const pwInput = document.getElementById('password');
document.getElementById('togglePw').addEventListener('click', () => {
    const isText = pwInput.type === 'text';
    pwInput.type = isText ? 'password' : 'text';
    document.querySelector('#togglePw i').className =
        isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
});

// ── Forgot password ──
document.getElementById('forgotBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    if (!email) {
        showToast('Enter your email above first, then click "Forgot password".');
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        showToast('Reset email sent! Check your inbox.', 'success');
    } catch (err) {
        showToast(friendlyError(err.code));
    }
});