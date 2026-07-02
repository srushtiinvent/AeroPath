// ===== FIREBASE CONFIGURATION =====
// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_PROJECT.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let auth = null;
try {
  const app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth(app);
} catch (err) {
  console.warn('Firebase not initialized. Please add Firebase credentials to script.js');
}

// Backend API URL
const API_BASE_URL = 'http://127.0.0.1:4000/api';

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    attachThemeToggle();
    
    // Check Firebase auth state
    if (auth) {
      auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          syncUserAndShowDashboard(firebaseUser);
        } else {
          showLoginForm();
        }
      });
    } else {
      console.error('Firebase not initialized. Cannot check auth state.');
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

function switchToSignup(e) {
    e.preventDefault();
    clearErrors();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function switchToLogin(e) {
    e.preventDefault();
    clearErrors();
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    attachLoginListener();
}

function showSignupForm() {
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
    
    if (!auth) {
        showLoginError('Firebase not initialized. Check console for details.');
        return;
    }
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
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
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            syncUserAndShowDashboard(userCredential.user);
        })
        .catch((error) => {
            console.error('Login error:', error);
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
    
    if (!auth) {
        showSignupError('Firebase not initialized. Check console for details.');
        return;
    }
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const tagline = document.getElementById('signupTagline').value.trim();
    
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
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update display name
            return userCredential.user.updateProfile({
                displayName: name
            }).then(() => userCredential.user);
        })
        .then((user) => {
            syncUserAndShowDashboard(user);
        })
        .catch((error) => {
            console.error('Signup error:', error);
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
        return;
    }
    
    try {
        // Get ID token
        const idToken = await firebaseUser.getIdToken();
        
        // Call backend sync endpoint
        const response = await fetch(`${API_BASE_URL}/auth/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.error || 'Failed to sync user');
        }
        
        const data = await response.json();
        const user = data.user;
        
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
        console.error('Sync error:', error);
        showLoginError(`Failed to sync user: ${error.message}`);
        document.getElementById('loginBtn').textContent = 'Login';
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('signupBtn').textContent = 'Sign Up';
        document.getElementById('signupBtn').disabled = false;
    }
}
