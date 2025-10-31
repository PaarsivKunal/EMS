# Environment Variables Guide

## 📋 Quick Reference

### Backend Environment Variables (Required in Production)

Set these in your backend hosting platform (Render, Railway, etc.):

```bash
# === REQUIRED ===
FRONTEND_URL=https://paarsiv-ems.onrender.com
CROSS_SITE_COOKIES=true
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here

# === OPTIONAL (with defaults) ===
PORT=5000
JWT_EXPIRE=7d
DOMAIN=

# === EMAIL CONFIGURATION (for password reset) ===
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@paarsiv.com

# === FILE UPLOAD ===
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# === RATE LIMITING ===
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables (Optional - Code Has Defaults)

**Note:** The frontend code already defaults to `https://ems-v6j5.onrender.com` in production, so environment variables are **optional**. Only create if you need to override.

Create `vite_client/.env.production` if needed:

```bash
# Optional - only if you want to override the default backend URL
VITE_API_URL=https://ems-v6j5.onrender.com/api
VITE_API_BASE_URL=https://ems-v6j5.onrender.com/api/v1
```

---

## 🔧 Detailed Configuration

### Backend (`server/.env` or Render Environment Variables)

#### **Critical (Must Set):**

| Variable | Value | Purpose |
|----------|-------|---------|
| `FRONTEND_URL` | `https://paarsiv-ems.onrender.com` | Allows CORS from frontend, used in password reset emails |
| `CROSS_SITE_COOKIES` | `true` | Required for cookies to work across different domains |
| `NODE_ENV` | `production` | Enables production optimizations and security |
| `MONGO_URI` | Your MongoDB connection string | Database connection |
| `JWT_SECRET` | A long random string | Used to sign/verify JWT tokens |

#### **Recommended:**

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port (Render may override this) |
| `JWT_EXPIRE` | `7d` | JWT token expiration (7 days) |
| `DOMAIN` | (empty) | Cookie domain if using custom domain |
| `MAX_FILE_SIZE` | `5242880` | Max upload size in bytes (5MB) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |

#### **Email Configuration (Required for password reset):**

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP server |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_USER` | `your_email@gmail.com` | SMTP username |
| `EMAIL_PASS` | Your app password | SMTP password (use app password for Gmail) |
| `EMAIL_USERNAME` | `your_email@gmail.com` | Alternative email username field |
| `EMAIL_PASSWORD` | Your app password | Alternative email password field |
| `EMAIL_FROM` | `noreply@paarsiv.com` | "From" address for emails |

---

### Frontend (`vite_client/.env.production`)

**Note:** Environment variables are **OPTIONAL** because the code already defaults to the correct backend URL in production.

#### **Optional Override Variables:**

| Variable | Default (in code) | Purpose |
|----------|-------------------|---------|
| `VITE_API_URL` | `https://ems-v6j5.onrender.com/api` | Axios base URL for API calls |
| `VITE_API_BASE_URL` | `https://ems-v6j5.onrender.com/api/v1` | Full API base URL for endpoints |

**When to set these:**
- ✅ If you want to use a different backend URL
- ✅ If you're testing with a staging backend
- ❌ **Not needed** if using default production backend (`https://ems-v6j5.onrender.com`)

---

## 🚀 Render.com Setup Instructions

### Backend Service on Render:

1. Go to your backend service dashboard
2. Navigate to **Environment** tab
3. Add these environment variables:

```bash
FRONTEND_URL=https://paarsiv-ems.onrender.com
CROSS_SITE_COOKIES=true
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/paarsiv_hr?retryWrites=true&w=majority
JWT_SECRET=generate_a_long_random_string_here_at_least_32_characters
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@paarsiv.com
```

### Frontend Service on Render:

1. Go to your frontend service dashboard
2. Navigate to **Environment** tab
3. **Optional:** Add environment variables (if you need to override):

```bash
# Only if you want to override the default backend URL
VITE_API_URL=https://ems-v6j5.onrender.com/api
VITE_API_BASE_URL=https://ems-v6j5.onrender.com/api/v1
```

**Note:** Most likely you don't need these since the code defaults to the correct backend URL.

---

## 🔐 Security Best Practices

### JWT_SECRET
- Use a long random string (at least 32 characters)
- Generate with: `openssl rand -base64 32`
- Never commit to git

### MongoDB URI
- Use connection string from MongoDB Atlas or your MongoDB provider
- Include authentication credentials
- Use environment variable, never hardcode

### Email Password
- For Gmail, use an **App Password** (not your regular password)
- Generate in: Google Account → Security → 2-Step Verification → App passwords

---

## ✅ Verification Checklist

After setting environment variables:

**Backend:**
- [ ] `FRONTEND_URL` is set to `https://paarsiv-ems.onrender.com`
- [ ] `CROSS_SITE_COOKIES=true` is set
- [ ] `NODE_ENV=production` is set
- [ ] `MONGO_URI` is valid and accessible
- [ ] `JWT_SECRET` is set and strong
- [ ] Email credentials are correct (test password reset)

**Frontend:**
- [ ] No `.env.production` needed (uses code defaults)
- [ ] OR set `VITE_API_URL` and `VITE_API_BASE_URL` if overriding

---

## 🧪 Testing Environment Variables

### Test Backend CORS:
```bash
curl -H "Origin: https://paarsiv-ems.onrender.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://ems-v6j5.onrender.com/api/v1/admin/auth/login
```

### Test Frontend API Connection:
Open browser console on `https://paarsiv-ems.onrender.com` and check network requests point to `https://ems-v6j5.onrender.com`

---

## 📝 Summary

**Backend:** Must set `FRONTEND_URL`, `CROSS_SITE_COOKIES`, `NODE_ENV`, `MONGO_URI`, `JWT_SECRET` at minimum.

**Frontend:** No environment variables required (code has defaults). Only set if you need to override the backend URL.

