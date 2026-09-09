// ===== DEBUG LOGGING (RUNS FIRST) =====
const debugLogs = [];

function logDebug(msg, level = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${msg}`;
  debugLogs.push(logEntry);
  console.log(logEntry);
  updateDebugPanel();
}

function updateDebugPanel() {
  const debugPanel = document.getElementById('debugPanel');
  if (debugPanel) {
    debugPanel.innerHTML = debugLogs.slice(-10).map(log => `<div class="debug-log">${log}</div>`).join('');
    debugPanel.scrollTop = debugPanel.scrollHeight;
  }
}

function createDebugPanel() {
  const existing = document.getElementById('debugPanel');
  if (existing) existing.remove();

  const panel = document.createElement('div');
  panel.id = 'debugPanel';
  panel.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 300px;
    max-height: 200px;
    background: rgba(0,0,0,0.8);
    color: #0f0;
    font-size: 11px;
    font-family: monospace;
    padding: 10px;
    border-radius: 4px;
    overflow-y: auto;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,255,0,0.3);
  `;
  document.body.appendChild(panel);
  updateDebugPanel();
}

// ===== FIREBASE CONFIGURATION =====
// TODO: Replace with your Firebase config from Firebase Console
// (Project Settings -> General -> Your apps -> SDK setup and configuration)
const firebaseConfig = {
  apiKey: "AIzaSyBF4VP_DRZZfHE8SWQhjDJhNzZ_THnLuaY",
  authDomain: "aeropath-e8e19.firebaseapp.com",
  projectId: "aeropath-e8e19",
  storageBucket: "aeropath-e8e19.firebasestorage.app",
  messagingSenderId: "723497947207",
  appId: "1:723497947207:web:37df779a15c91aef66e162",
  measurementId: "G-NMH27EE0F1"
};

// Initialize Firebase
let auth = null;
let firebaseInitialized = false;

if (firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
  try {
    const app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth(app);
    firebaseInitialized = true;
    logDebug('Firebase initialized successfully');
  } catch (err) {
    logDebug('Firebase init error: ' + err.message, 'error');
  }
} else {
  logDebug('Firebase config not set. Using demo mode.', 'warn');
}

// Backend API URL
const API_BASE_URL = 'http://127.0.0.1:4000/api';

// ===== APP INIT (this block was missing — nothing ran on page load without it) =====
window.addEventListener('DOMContentLoaded', () => {
    createDebugPanel();
    logDebug('App starting...');
    applyTheme();
    attachThemeToggle();

    if (firebaseInitialized && auth) {
        auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                logDebug(`Existing session found: ${firebaseUser.email}`);
                syncUserAndShowDashboard(firebaseUser);
            } else {
                showLoginForm();
            }
        });
    } else {
        logDebug('Firebase not initialized on load, showing login form', 'warn');
        showLoginForm();
    }
});

function applyTheme() {
    const savedTheme = localStorage.getItem('aeropath_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    document.body.classList.toggle('dark-mode', isDark);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.textContent = isDark ? '☀️' : '🌙';
    }
}

function attachThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('aeropath_theme', isDark ? 'dark' : 'light');
        toggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// switchToSignup/switchToLogin now delegate to showSignupForm/showLoginForm
// so the button listeners actually get (re)attached every time you switch forms.
function switchToSignup(e) {
    e.preventDefault();
    showSignupForm();
}

function switchToLogin(e) {
    e.preventDefault();
    showLoginForm();
}

function showLoginForm() {
    clearErrors();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    attachLoginListener();
}

function showSignupForm() {
    clearErrors();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    attachSignupListener();
}

function showDashboard(user) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    document.getElementById('userGreeting').textContent = `Welcome back, ${user.name}!`;
    attachLogoutListener();
}

function clearErrors() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('signupError').textContent = '';
    document.getElementById('signupError').classList.remove('show');
}

function showLoginError(message) {
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function showSignupError(message) {
    const errorEl = document.getElementById('signupError');
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function attachLoginListener() {
    const loginBtn = document.getElementById('loginBtn');

    // Remove any existing listeners by cloning
    const newLoginBtn = loginBtn.cloneNode(true);
    loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);

    const updatedBtn = document.getElementById('loginBtn');
    updatedBtn.addEventListener('click', handleLogin);

    document.getElementById('loginEmail').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('loginPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
}

function attachSignupListener() {
    const signupBtn = document.getElementById('signupBtn');

    // Remove any existing listeners by cloning
    const newSignupBtn = signupBtn.cloneNode(true);
    signupBtn.parentNode.replaceChild(newSignupBtn, signupBtn);

    const updatedBtn = document.getElementById('signupBtn');
    updatedBtn.addEventListener('click', handleSignup);

    document.getElementById('signupName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSignup();
    });
    document.getElementById('signupEmail').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSignup();
    });
    document.getElementById('signupPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSignup();
    });
}

function attachLogoutListener() {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function handleLogin() {
    clearErrors();
    logDebug('Login button clicked');

    if (!firebaseInitialized) {
        showLoginError('Firebase not configured. Add your Firebase credentials to script.js.');
        logDebug('Firebase not initialized, showing error', 'warn');
        return;
    }

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    logDebug(`Login attempt: ${email}`);

    // Validation
    if (!email || !password) {
        showLoginError('Please enter email and password');
        return;
    }

    if (!email.includes('@')) {
        showLoginError('Please enter a valid email');
        return;
    }

    // Show loading state
    document.getElementById('loginBtn').textContent = 'Logging in...';
    document.getElementById('loginBtn').disabled = true;
    logDebug('Sending login request to Firebase...');

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            logDebug(`Firebase login successful: ${userCredential.user.uid}`);
            syncUserAndShowDashboard(userCredential.user);
        })
        .catch((error) => {
            logDebug(`Firebase login failed: ${error.code} - ${error.message}`, 'error');
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                showLoginError('Email or password incorrect');
            } else {
                showLoginError(`Login failed: ${error.message}`);
            }
            document.getElementById('loginBtn').textContent = 'Login';
            document.getElementById('loginBtn').disabled = false;
        });
}

function handleSignup() {
    clearErrors();
    logDebug('Signup button clicked');

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const tagline = document.getElementById('signupTagline').value.trim();

    logDebug(`Signup attempt: ${name} (${email})`);

    // Validation
    if (!name || !email || !password) {
        showSignupError('Please fill in all required fields');
        return;
    }

    if (name.length < 2) {
        showSignupError('Name must be at least 2 characters');
        return;
    }

    if (!email.includes('@')) {
        showSignupError('Please enter a valid email');
        return;
    }

    if (password.length < 6) {
        showSignupError('Password must be at least 6 characters');
        return;
    }

    // Show loading state
    document.getElementById('signupBtn').textContent = 'Creating account...';
    document.getElementById('signupBtn').disabled = true;

    if (!firebaseInitialized) {
        logDebug('Firebase not initialized, using demo mode', 'warn');
        // Demo mode - just show dashboard
        setTimeout(() => {
            const demoUser = {
                id: 'demo-user-' + Date.now(),
                email: email,
                name: name,
                tagline: tagline || 'Travel Enthusiast',
                avatarInitials: name.split(' ').map(p => p[0]).join('').toUpperCase()
            };
            localStorage.setItem('aeropath_user', JSON.stringify(demoUser));
            logDebug('Demo signup successful, showing dashboard');
            document.getElementById('signupBtn').textContent = 'Sign Up';
            document.getElementById('signupBtn').disabled = false;
            showDashboard(demoUser);
        }, 500);
        return;
    }

    logDebug('Sending signup request to Firebase...');
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            logDebug(`Firebase user created: ${userCredential.user.uid}`);
            // Update display name
            return userCredential.user.updateProfile({
                displayName: name
            }).then(() => userCredential.user);
        })
        .then((user) => {
            logDebug('Profile updated, syncing with backend...');
            syncUserAndShowDashboard(user);
        })
        .catch((error) => {
            logDebug(`Firebase signup failed: ${error.code} - ${error.message}`, 'error');
            if (error.code === 'auth/email-already-in-use') {
                showSignupError('Email already registered');
            } else if (error.code === 'auth/weak-password') {
                showSignupError('Password is too weak. Use at least 6 characters.');
            } else {
                showSignupError(`Signup failed: ${error.message}`);
            }
            document.getElementById('signupBtn').textContent = 'Sign Up';
            document.getElementById('signupBtn').disabled = false;
        });
}

function handleLogout() {
    if (auth) {
        auth.signOut().then(() => {
            localStorage.removeItem('aeropath_user');

            // Clear all form fields
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            document.getElementById('signupName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
            document.getElementById('signupTagline').value = '';

            clearErrors();
            showLoginForm();
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    } else {
        localStorage.removeItem('aeropath_user');
        clearErrors();
        showLoginForm();
    }
}

// ===== SYNC USER WITH BACKEND =====
async function syncUserAndShowDashboard(firebaseUser) {
    if (!firebaseUser) {
        showLoginError('User not found');
        logDebug('No Firebase user provided', 'error');
        return;
    }

    logDebug(`Syncing user: ${firebaseUser.email}`);

    try {
        // Get ID token
        logDebug('Getting Firebase ID token...');
        const idToken = await firebaseUser.getIdToken();

        // Call backend sync endpoint
        logDebug(`Calling ${API_BASE_URL}/auth/sync...`);
        const response = await fetch(`${API_BASE_URL}/auth/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });

        logDebug(`Backend response: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.error || `Backend error: ${response.status}`);
        }

        const data = await response.json();
        const user = data.user;

        logDebug(`User synced successfully: ${user.id}`);

        // Store user info locally
        localStorage.setItem('aeropath_user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            tagline: user.tagline || '',
            avatarInitials: user.avatarInitials || ''
        }));

        // Reset button states
        document.getElementById('loginBtn').textContent = 'Login';
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('signupBtn').textContent = 'Sign Up';
        document.getElementById('signupBtn').disabled = false;

        // Show dashboard
        showDashboard({
            name: user.name,
            email: user.email,
            tagline: user.tagline || ''
        });
    } catch (error) {
        logDebug(`Sync failed: ${error.message}`, 'error');
        console.error('Sync error:', error);

        // If backend is not reachable, fall back to local storage
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
            logDebug('Backend unreachable, using local storage mode', 'warn');
            const user = {
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email,
                tagline: ''
            };
            localStorage.setItem('aeropath_user', JSON.stringify(user));
            showDashboard(user);
            showLoginError('(Using demo mode - backend not running)');
        } else {
            showLoginError(`Failed to sync user: ${error.message}`);
        }

        document.getElementById('loginBtn').textContent = 'Login';
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('signupBtn').textContent = 'Sign Up';
        document.getElementById('signupBtn').disabled = false;
    }
}