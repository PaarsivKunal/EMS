# Deployment Configuration Notes

## URLs
- **Frontend:** https://paarsiv-ems.onrender.com
- **Backend:** https://ems-v6j5.onrender.com

This document tracks all places where the URLs need to be configured.

## ✅ Already Updated

### Backend Configuration

1. **`server/env.example`**
   - ✅ `FRONTEND_URL=https://paarsiv-ems.onrender.com`
   - ✅ `CROSS_SITE_COOKIES=true` (required for cross-domain cookies)

2. **`server/server.js`**
   - ✅ CORS configuration uses `process.env.FRONTEND_URL` in production
   - ✅ Added validation to warn if `FRONTEND_URL` is missing in production

3. **`server/controllers/forgetPassword/forgotPasswordController.js`**
   - ✅ Uses `process.env.FRONTEND_URL` for password reset links

## Required Actions for Production Deployment

### 1. Set Environment Variables in Your Backend Host (Render/Railway/etc.)

When deploying your backend, make sure to set these **required** environment variables:

```bash
# === REQUIRED ===
FRONTEND_URL=https://paarsiv-ems.onrender.com
CROSS_SITE_COOKIES=true
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here

# === EMAIL (Required for password reset) ===
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@paarsiv.com

# === OPTIONAL (have defaults) ===
PORT=5000
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Frontend Environment Variables (Production)

**✅ GOOD NEWS:** No environment variables needed! The frontend code automatically uses `https://ems-v6j5.onrender.com` in production mode.

**Optional:** Only create `vite_client/.env.production` if you need to override the default backend URL:

```bash
VITE_API_URL=https://ems-v6j5.onrender.com/api
VITE_API_BASE_URL=https://ems-v6j5.onrender.com/api/v1
```

## Configuration Files Updated

- ✅ `server/env.example` - Updated with production frontend URL
- ✅ `server/server.js` - Enhanced CORS with validation
- ✅ `vite_client/.env.example` - Created with API URL examples

## Testing

After deployment, verify:

1. **CORS:** Frontend can make API requests from `https://paarsiv-ems.onrender.com`
2. **Cookies:** Authentication cookies are sent/received correctly (check SameSite=None)
3. **Password Reset:** Reset email links point to the correct frontend URL
4. **API Calls:** All API calls from frontend reach the backend successfully

## Notes

- The frontend uses relative API paths (`/api`) by default, which works when served from the same domain
- If backend is on a different domain, set `VITE_API_URL` in frontend environment
- CSRF protection requires cookies with `SameSite=None` and `Secure=true` for cross-domain

