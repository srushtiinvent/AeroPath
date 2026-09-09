# Quick Test Guide

## Test the Fixed Signup Flow

### Option 1: Test with Demo Mode (No Firebase/Backend Required)
1. Open `frontend/index.html` in your browser
2. Look at the **green debug panel** in the bottom-right corner (shows real-time logs)
3. Click **"Sign up"**
4. Fill the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Tagline: `Travel Enthusiast` (optional)
5. Click **"Sign Up"** button
6. ✅ You should now see the **Dashboard** with 3 cards:
   - ✈ My Flights
   - 🎫 Boarding Passes
   - 📍 Travel Stats
7. The debug panel should show: `"Demo signup successful, showing dashboard"`

### Option 2: Test with Real Firebase + Backend

#### Prerequisites:
- Firebase project created (see SETUP_GUIDE.md)
- Firebase credentials added to `frontend/script.js`
- Backend running: `cd backend && npm run dev`
- PostgreSQL database configured

1. Update `firebaseConfig` in `frontend/script.js` with your Firebase credentials
2. Start backend: `npm run dev` (in `backend/` folder)
3. Open `frontend/index.html`
4. The debug panel should show: `"Firebase initialized successfully"`
5. Click **"Sign up"** and fill the form
6. Debug panel will show each step:
   - `"Signup button clicked"`
   - `"Sending signup request to Firebase..."`
   - `"Firebase user created: <uid>"`
   - `"Profile updated, syncing with backend..."`
   - `"Getting Firebase ID token..."`
   - `"Calling http://127.0.0.1:4000/api/auth/sync..."`
   - `"User synced successfully"`
   - `"Demo signup successful, showing dashboard"`

---

## Debug Panel

Look at the **green terminal-style panel** in the bottom-right corner:

```
[16:45:23] INFO: Page loaded
[16:45:23] INFO: Checking Firebase auth state...
[16:45:24] INFO: Firebase not initialized, showing login form
[16:45:30] INFO: Signup button clicked
[16:45:30] INFO: Firebase not initialized, using demo mode
...
```

**Red text** = Error  
**Yellow text** = Warning  
**Green text** = Info

---

## Troubleshooting

### Dashboard doesn't appear after signup
1. Check the **debug panel** for error messages
2. Common issues:
   - **Firebase not initialized**: Add your Firebase config to `script.js`
   - **Backend not running**: Start with `npm run dev` in `backend/`
   - **Network error**: Check browser console (F12) for CORS errors

### Error: "Failed to fetch"
- Backend is not running or not accessible
- Check: `http://127.0.0.1:4000` in your browser (should show `{"ok":true}`)

### Error: "Email already registered"
- Use a different email address
- Or clear localStorage: `localStorage.clear()` in console

### Dashboard looks broken/empty
- This is demo mode (works without backend)
- Styling should still work - check CSS is loading

---

## Next: Backend Setup (Optional)

To test with real database + Firebase:

1. Go to `SETUP_GUIDE.md` for step-by-step instructions
2. Create Firebase project
3. Create Neon/Supabase database
4. Configure `.env` in `backend/`
5. Run: `npx prisma migrate dev --name init`
6. Start backend: `npm run dev`

---

## What Happens in Each Mode

### Demo Mode (No Firebase)
- ✅ Signup works locally  
- ✅ Dashboard shows
- ❌ Data doesn't persist (cleared on page refresh)
- ❌ No backend connection

### Real Mode (Firebase + Backend)
- ✅ Signup creates real Firebase user
- ✅ Data synced to PostgreSQL
- ✅ Persists across sessions
- ✅ Login works
