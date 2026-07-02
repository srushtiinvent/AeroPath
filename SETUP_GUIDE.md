# AeroPath Setup Guide

## Prerequisites
- Node.js installed
- A Firebase project (free tier available)
- PostgreSQL database (via Neon or Supabase)

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `AeroPath`
4. Choose a region
5. Accept terms and click **"Create project"**

---

## Step 2: Enable Firebase Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Select **"Email/Password"** provider
4. Toggle **"Enable"** and click **"Save"**

---

## Step 3: Get Firebase Web Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"</> Web"** (if not already created)
4. Copy the config object that looks like:

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

5. Update `frontend/script.js` with your config (replace the `firebaseConfig` object at the top)

---

## Step 4: Create a PostgreSQL Database

### Option A: Using Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub or email
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)
5. Create `.env` file in `backend/` folder:

```env
DATABASE_URL=postgresql://user:password@host:5432/aeropath?schema=public
FIREBASE_SERVICE_ACCOUNT={}
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
PORT=4000
NODE_ENV=development
```

### Option B: Using Supabase

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to **Settings → Database** and copy the connection string
4. Create `.env` file in `backend/` (same as above)

---

## Step 5: Get Firebase Admin Service Account

This is needed for the backend to authenticate requests:

1. In Firebase Console, go to **Project Settings → Service Accounts**
2. Click **"Generate New Private Key"**
3. A JSON file will download
4. Either:
   - **Option A**: Copy the entire JSON content and set it as env var (escape quotes):
     ```bash
     export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
     ```
   - **Option B**: Save the JSON file and set the path:
     ```env
     GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
     ```

---

## Step 6: Set Up Backend

### Install Dependencies

```bash
cd backend
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will create all tables in your database.

---

## Step 7: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
AeroPath backend listening on 4000
```

---

## Step 8: Test the Frontend

1. Open `frontend/index.html` in your browser (or use a local server)
2. Click **"Sign up"**
3. Fill in the form:
   - Full name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Tagline: `Travel Enthusiast` (optional)
4. Click **"Sign Up"**

You should see the dashboard if everything is set up correctly.

---

## Troubleshooting

### "Firebase not initialized" Error

- **Solution**: Make sure you updated `firebaseConfig` in `frontend/script.js` with your actual Firebase credentials

### "Cannot connect to backend" Error

- **Solution**: Make sure backend is running (`npm run dev` in the `backend/` folder)
- Check that port 4000 is not blocked
- Make sure `API_BASE_URL` in `script.js` is `http://127.0.0.1:4000/api`

### "Failed to sync user" Error

- **Solution**: 
  - Check backend console for errors
  - Make sure `.env` has correct `DATABASE_URL` and `FIREBASE_SERVICE_ACCOUNT`
  - Verify database credentials

### Database Connection Error

- **Solution**:
  - Verify `.env` file has correct `DATABASE_URL`
  - Test connection: `psql <DATABASE_URL>`
  - Make sure database is running (Neon/Supabase)

---

## Environment Variables

Create `backend/.env` with these variables:

```env
# Database (from Neon or Supabase)
DATABASE_URL=postgresql://user:password@host:5432/aeropath?schema=public

# Firebase Admin Service Account (JSON as string or path to file)
FIREBASE_SERVICE_ACCOUNT={}
# OR
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json

# Firebase Storage Bucket
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Server Port
PORT=4000
NODE_ENV=development
```

---

## API Endpoints

Once backend is running, these endpoints are available:

- `POST /api/auth/sync` - Sync Firebase user with backend database
- `GET /api/trips/home` - Get upcoming flights
- `GET /api/flights/:id/details` - Get flight details
- `POST /api/profile/countries` - Add visited country

All endpoints require Firebase ID token in `Authorization: Bearer <token>` header.

---

## Next Steps

After setup is complete:
- [x] Users can sign up with Firebase
- [x] Backend syncs user data to PostgreSQL
- [ ] Build flight list UI
- [ ] Build flight details UI
- [ ] Build profile/stats UI

