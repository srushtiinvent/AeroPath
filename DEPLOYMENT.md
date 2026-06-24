# AeroPath Production Deployment Guide

## 📋 Architecture Overview

**AeroPath** is a **distributed, progressive web application (PWA)** deployed across:
- **Frontend**: GitHub Pages (static React SPA, https://srushtiinvent.github.io/AeroPath/)
- **Backend**: Vercel (Node.js/Express API with Prisma ORM)
- **Database**: Neon PostgreSQL (cloud-hosted, US-East-1)
- **Authentication**: JWT tokens (7-day TTL) with bcrypt hashing
- **Offline**: IndexedDB for boarding pass caching

---

## ✅ Frontend Deployment (GitHub Pages)

### Current Status
✅ **Live at**: https://srushtiinvent.github.io/AeroPath/

### How It Works
1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Triggers on push to `main` branch
   - Installs dependencies: `npm ci`
   - Builds frontend: `npm run build`
   - Deploys `dist/` to GitHub Pages via `peaceiris/actions-gh-pages`

2. **Vite Configuration** (`frontend/vite.config.ts`):
   - Base path: `/AeroPath/` (GitHub Pages subdirectory)
   - Dev proxy: Routes `/api/*` → `http://localhost:5000`
   - Production: Uses `VITE_API_URL` env var

### Verification
```bash
# Local build
cd frontend
npm ci
npm run build
# dist/ folder ready for deployment
```

---

## 🚀 Backend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier): https://vercel.com
- Connected GitHub account

### Step 1: Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select GitHub account and `AeroPath` repository
4. Click "Import"

### Step 2: Configure Build Settings
Set these in Vercel's import dialog:
- **Root Directory**: `backend`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Framework**: Node.js (auto-detected)

### Step 3: Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
DATABASE_URL=postgresql://neondb_owner:npg_YN8ZfTS4chkD@ep-morning-salad-at2gwmxo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=aeropath_dev_jwt_secret_2026_secure_minimum_32_chars_production_grade

NODE_ENV=production
```

**⚠️ Production Security**: Generate a new JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy
Click "Deploy" button. Wait ~3 minutes.

### Step 5: Capture Backend URL
After deployment, Vercel provides:
```
Backend URL: https://aeropath-backend-XXXXX.vercel.app
```

### Verify Backend
```bash
# Test health endpoint
curl https://aeropath-backend-XXXXX.vercel.app/api/health
# Expected: {"status":"Backend is running"}

# Test signup
curl -X POST https://aeropath-backend-XXXXX.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@aeropath.dev",
    "password": "SecurePass123!",
    "name": "Test User",
    "tagline": "Travel enthusiast"
  }'
```

---

## 🔗 Connect Frontend to Backend

### Step 1: Create Environment Variable File
```bash
cd frontend
echo "VITE_API_URL=https://aeropath-backend-XXXXX.vercel.app" > .env
```

Replace `XXXXX` with your actual Vercel URL suffix.

### Step 2: Rebuild Frontend
```bash
npm run build
```

### Step 3: Commit and Push
```bash
git add frontend/.env
git commit -m "Configure production API endpoint"
git push origin main
```

GitHub Actions automatically:
1. Detects push to main
2. Builds frontend with `VITE_API_URL` set
3. Deploys to GitHub Pages

### Verify Integration
1. Visit https://srushtiinvent.github.io/AeroPath/
2. Click "Sign up"
3. Enter credentials
4. Verify token stored in localStorage
5. Verify API calls reach backend (check Network tab in DevTools)

---

## 🗄️ Database (Neon PostgreSQL)

### Current Status
✅ **Live**: Neon PostgreSQL in US-East-1

### Connection String
```
postgresql://neondb_owner:npg_YN8ZfTS4chkD@ep-morning-salad-at2gwmxo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Schema Verification
Prisma schema already synced. To verify:
```bash
cd backend
npx prisma studio
# Opens web UI to browse users, trips, flights, etc.
```

---

## 🧪 End-to-End Testing

### Test 1: Full Signup Flow
```bash
# Frontend: https://srushtiinvent.github.io/AeroPath/
1. Click "Sign up" tab
2. Enter:
   - Email: your-email@example.com
   - Password: SecurePass123!
   - Name: Your Name
   - Tagline: Your tagline
3. Click "Create Account"
4. Verify redirected to Home page
5. Check Profile shows correct name & initials
```

### Test 2: Login Flow
```bash
# Frontend: https://srushtiinvent.github.io/AeroPath/
1. Click Logout button
2. Click "Login" tab
3. Enter credentials
4. Verify redirected to Home page
5. Verify profile data restored
```

### Test 3: Data Persistence
```bash
# Backend: Prisma Studio
cd backend
npx prisma studio
# Click "User" table, verify your account exists
# Check UserSettings, VisitedCountry, etc.
```

### Test 4: Offline Mode
```bash
# Frontend
1. Navigate to Boarding Pass Vault
2. Add mock boarding pass (offline via IndexedDB)
3. Open DevTools → Network → Offline
4. Verify boarding pass still displays
5. Go back online, refresh page
6. Verify data persists
```

---

## 🔒 CORS & Security

### Allowed Origins
Backend allows requests from:
- `http://localhost:4173` (local dev frontend)
- `http://localhost:3000` (alternative port)
- `http://127.0.0.1:4173` (localhost IP)
- `https://srushtiinvent.github.io` (GitHub Pages)

### Adding New Origins
To deploy to a different domain:

```typescript
// backend/src/index.ts
const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:3000",
  "http://127.0.0.1:4173",
  "https://srushtiinvent.github.io",
  "https://your-new-domain.com" // Add here
];
```

Then:
```bash
cd backend
npm run build
git add .
git commit -m "Update CORS for new domain"
git push origin main
# Vercel auto-deploys
```

---

## 🐛 Troubleshooting

### Issue: Frontend shows blank page
**Debug steps**:
1. Check browser DevTools → Console for JavaScript errors
2. Check DevTools → Network tab
   - Verify `index.html` loads successfully
   - Check if CSS/JS assets load from correct paths
3. Verify `VITE_API_URL` in frontend/.env
4. Clear browser cache: Cmd+Shift+Delete
5. Verify GitHub Pages is enabled in repository settings

**Solution**: GitHub Pages requires React app to use hash routing. This is configured in `vite.config.ts`.

### Issue: API calls fail (404 or CORS error)
**Debug steps**:
1. Verify backend deployed to Vercel
2. Test backend health: `curl https://aeropath-backend-XXXXX.vercel.app/api/health`
3. Check `VITE_API_URL` matches actual backend URL
4. Verify frontend rebuilt after updating `.env`
5. Check CORS origin in backend logs

**Solution**:
```bash
cd frontend
echo "VITE_API_URL=https://aeropath-backend-XXXXX.vercel.app" > .env
npm run build
git add . && git commit -m "Fix API URL" && git push
```

### Issue: Signup returns 500 error
**Debug steps**:
1. Check Vercel logs: Dashboard → Deployments → Logs
2. Verify DATABASE_URL and JWT_SECRET in Vercel env vars
3. Test locally: `npm run dev` in backend folder

**Solution**: Check that both env vars are set in Vercel and don't have typos.

### Issue: Login token not persisting
**Debug steps**:
1. Check localStorage: DevTools → Application → Local Storage
2. Look for key: `AEROPATH_AUTH_TOKEN`
3. Verify token is valid JWT

**Solution**: Check browser privacy settings; localStorage must be enabled.

---

## 📊 Monitoring & Observability

### Vercel Dashboard
- Visit https://vercel.com/dashboard
- Select AeroPath project
- Monitor:
  - **Deployments**: Build status, logs
  - **Functions**: API endpoint performance
  - **Monitoring**: Response times, error rates

### Neon Dashboard
- Visit https://console.neon.tech
- Monitor:
  - **Connection Pool**: Active connections
  - **Query Logs**: Slow queries
  - **Activity**: Database operations

### Browser DevTools
- **Network Tab**: API latency
- **Performance Tab**: Frontend load time
- **Console**: JavaScript errors
- **Application → Local Storage**: Auth token
- **Application → IndexedDB**: Offline data

---

## 🚨 Rollback Procedure

### Frontend Rollback (GitHub Pages)
```bash
# Find previous commit
git log --oneline

# Revert to previous version
git revert <commit-hash>

# Push (triggers GitHub Actions auto-deploy)
git push origin main
```

### Backend Rollback (Vercel)
1. Go to Vercel Dashboard
2. Select AeroPath project
3. Click "Deployments"
4. Find previous successful deployment
5. Click "..." → "Redeploy"

---

## 📈 Production Checklist

- ✅ Frontend deployed to GitHub Pages
- ✅ Backend ready for Vercel deployment
- ✅ Database connected (Neon PostgreSQL)
- ✅ JWT authentication configured
- ✅ CORS configured for GitHub Pages
- ✅ Environment variables documented
- 🔧 Backend deployed to Vercel (pending)
- 🔧 Frontend .env updated with backend URL (pending)
- ⚠️ TODO: Enable HTTPS redirects
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Set up error tracking (Sentry)
- ⚠️ TODO: Configure CDN caching

---

**Last Updated**: December 2024  
**Frontend Status**: ✅ Live on GitHub Pages  
**Backend Status**: 🔧 Ready for Vercel (pending deployment)  
**Database Status**: ✅ Live on Neon  
**Next Action**: Deploy backend to Vercel → Update frontend .env → Push to trigger redeploy

## 🔌 Connect Frontend to Backend

**Update `frontend/src/services/api.ts`:**

Change the proxy URLs to your deployed backend:

```typescript
const API_BASE_URL = "https://aeropath-backend-XXXXXX.vercel.app";

const apiFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers = {
    ...defaultHeaders,
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${API_BASE_URL}${path}`;  // ← Add this
  
  const response = await fetch(url, { ...init, headers, credentials: "include" });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error ?? response.statusText;
    throw new Error(`API error ${response.status}: ${message}`);
  }
  return response.json();
};
```

---

## ✅ Testing End-to-End

After deployment:

1. **Frontend**: https://srushtiinvent.github.io/AeroPath/
2. **Sign up** with a new email
3. **Verify** data is saved to Neon database
4. **Login** with credentials
5. **Check profile** - initials and name should display

---

## 🔄 Deployment Checklist

- [ ] GitHub Actions workflow is set up (`.github/workflows/deploy.yml`)
- [ ] Vercel backend is deployed
- [ ] Environment variables added to Vercel
- [ ] Frontend API calls updated to deployed backend URL
- [ ] Git commits pushed to trigger GitHub Actions
- [ ] Frontend displays on GitHub Pages
- [ ] Sign up/login working end-to-end
- [ ] User data persisted to Neon database

---

## 🆘 Troubleshooting

**Frontend shows blank page:**
- Check browser DevTools Console (F12)
- Clear browser cache (Ctrl+Shift+Delete)
- Verify vite.config.ts has `base: "/AeroPath/"`

**API calls failing (503, 401):**
- Verify Vercel backend is deployed and running
- Check environment variables in Vercel settings
- Check GitHub Actions logs for build errors

**Database not connecting:**
- Verify DATABASE_URL in Vercel environment
- Test Neon connection: `npx prisma db execute --stdin < schema.sql`

**CORS errors:**
- Add to backend `src/index.ts`:
  ```typescript
  app.use(cors({
    origin: "https://srushtiinvent.github.io",
    credentials: true
  }));
  ```

---

## 📝 Quick Reference

| Component | Status | URL |
|-----------|--------|-----|
| Frontend (GitHub Pages) | ✅ | https://srushtiinvent.github.io/AeroPath/ |
| Backend (Vercel) | 🔧 Setup | https://aeropath-backend-XXXXXX.vercel.app |
| Database (Neon) | ✅ | Connected |

---

## 🎯 Next Steps

1. Push `.github/workflows/deploy.yml` to GitHub
2. Deploy backend to Vercel with env vars
3. Update `frontend/src/services/api.ts` with Vercel URL
4. Push frontend changes
5. GitHub Actions will auto-deploy
6. Visit https://srushtiinvent.github.io/AeroPath/ and test!
