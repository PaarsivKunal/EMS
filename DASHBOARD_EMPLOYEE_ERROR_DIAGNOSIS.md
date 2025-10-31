# Dashboard Employee Error Diagnosis

**URL:** `https://paarsiv-ems.onrender.com/dashboard-employee`  
**Date:** January 27, 2025

---

## Potential Issues Identified

### 1. **Inconsistent API Base URL Usage** 🔴 **CRITICAL**

**Problem:** The `DashboardEmployee` component uses inconsistent API endpoint paths.

**Location:** `vite_client/src/Employee/Dashboard/DashboardEmployee.jsx`

**Issue:**
- Line 103: Uses absolute path `/api/v1/employee/payroll/current`
- Line 134: Uses absolute path `/api/v1/both/profile-details/upcoming-birthdays`
- But other calls use `BOTH_ATTENDANCE_ENDPOINT`, `EMPLOYEE_LEAVE_ENDPOINT`, etc. from constants

**The Problem:**
- `axiosInstance` has `baseURL: API_BASE_URL` which defaults to `http://localhost:5000/api`
- When you call `axiosInstance.get('/api/v1/...')`, it creates: `http://localhost:5000/api/api/v1/...` ❌

**Fix Required:**
```javascript
// Current (WRONG):
const payrollRes = await axiosInstance.get('/api/v1/employee/payroll/current');
const birthdaysRes = await axiosInstance.get('/api/v1/both/profile-details/upcoming-birthdays');

// Should be:
const payrollRes = await axiosInstance.get('/v1/employee/payroll/current');
// OR better, use the constants:
const payrollRes = await axiosInstance.get(`${BOTH_PAYROLL_ENDPOINT}/current`);
```

---

### 2. **Authentication Issues** 🟡

**Potential Problems:**
- JWT cookie not being sent (CORS/credentials issue)
- Cookie expired
- User not authenticated
- Wrong authentication middleware

**Check:**
- Browser DevTools → Network tab → Check if requests have cookies
- Check if 401 Unauthorized errors appear
- Verify `withCredentials: true` is set in axiosInstance ✅ (already set)

---

### 3. **CORS Configuration** 🟡

**Check:**
- `server/server.js` - CORS origin matches frontend URL
- `FRONTEND_URL` environment variable set correctly
- Cookies are being sent cross-domain

---

### 4. **Missing API Endpoints** ✅

All required endpoints exist:
- ✅ `/api/v1/both/attendance/get-logs` - Route exists
- ✅ `/api/v1/employee/payroll/current` - Route exists
- ✅ `/api/v1/employee/leave/get-my-leaves` - Route exists
- ✅ `/api/v1/both/project-task/all-tasks` - Route exists
- ✅ `/api/v1/both/profile-details/upcoming-birthdays` - Route exists

---

### 5. **Frontend Build/Deployment** 🟡

**Check:**
- Frontend is properly built: `npm run build` in `vite_client/`
- Built files are in `server/public/`
- `index.html` exists in `server/public/`
- Static assets are being served correctly

---

## 🔧 Recommended Fixes

### Fix #1: Update DashboardEmployee API Calls

Update the inconsistent API endpoint calls:

```javascript
// Line 103: Change from
const payrollRes = await axiosInstance.get('/api/v1/employee/payroll/current');
// To:
const payrollRes = await axiosInstance.get('/v1/employee/payroll/current');

// Line 134: Change from
const birthdaysRes = await axiosInstance.get('/api/v1/both/profile-details/upcoming-birthdays');
// To:
const birthdaysRes = await axiosInstance.get('/v1/both/profile-details/upcoming-birthdays');
```

**OR better:** Use the constants that are already imported.

---

### Fix #2: Verify axiosInstance Base URL Configuration

Check `vite_client/src/api/axiosInstance.js`:
- Production should use: `https://ems-v6j5.onrender.com/api` (or your backend URL)
- Not `http://localhost:5000/api`

Update if needed:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://ems-v6j5.onrender.com/api'  // Your backend URL
    : 'http://localhost:5000/api');
```

---

## 📋 Debugging Steps

### Step 1: Check Browser Console
1. Open `https://paarsiv-ems.onrender.com/dashboard-employee`
2. Open DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests

### Step 2: Check Network Requests
Look for:
- 401 Unauthorized → Authentication issue
- 404 Not Found → Wrong endpoint or route not registered
- 500 Internal Server Error → Backend error
- CORS errors → CORS configuration issue

### Step 3: Verify Cookies
- Application tab → Cookies
- Should see `jwt` cookie
- Should see `csrfToken` cookie

### Step 4: Check Backend Logs
- Look for errors in backend server logs
- Check if requests are reaching the server

---

## 🚀 Quick Fix Script

Run this to check and fix the API endpoint issues:

1. Update `DashboardEmployee.jsx` to use consistent endpoints
2. Verify `axiosInstance` base URL is correct for production
3. Rebuild frontend: `cd vite_client && npm run build`
4. Copy to server: `npm run copy-to-server` (or manually)
5. Restart backend server
6. Test the dashboard again

---

## Expected Error Messages

Based on the code, you might see:

1. **"Failed to load employee information"** → `fetchEmployeeOwnInfo()` failed
2. **"Please log in to access the dashboard"** → No user in Redux store
3. **Network errors** → API endpoint issues or CORS
4. **401 Unauthorized** → Authentication cookie missing or expired

---

## ✅ Verification Checklist

- [ ] Frontend built and deployed
- [ ] `index.html` exists in `server/public/`
- [ ] All API routes registered in `server.js`
- [ ] CORS configured correctly
- [ ] `FRONTEND_URL` env var set correctly
- [ ] `VITE_API_URL` or `VITE_API_BASE_URL` set correctly
- [ ] Cookies are being sent (check browser)
- [ ] User is authenticated (check Redux store)

---

**Next Steps:** Apply Fix #1 immediately, then verify the error is resolved.

