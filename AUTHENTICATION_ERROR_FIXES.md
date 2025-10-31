# Authentication & API Endpoint Error Fixes

**Date:** January 27, 2025  
**Issues Fixed:** 401 Unauthorized and 404 Not Found errors

---

## Issues Identified

### 1. **401 Unauthorized Errors** 🔴
- `/api/v1/both/profile-details/get-my-details`
- `/api/v1/both/attendance/get-logs`

**Root Cause:** 
- Some components using raw `axios` instead of `axiosInstance`
- `axiosInstance` has `withCredentials: true` configured automatically
- CSRF tokens not being sent for state-changing requests

### 2. **404 Not Found Errors** 🟡
- `/api/v1/both/notification/unread-count`
- `/api/v1/both/notification/user-notifications`

**Root Cause:**
- Using `/api/v1/...` paths with `axiosInstance` that already has `/api` in baseURL
- Creates double `/api/api/v1/...` URLs

---

## Fixes Applied

### ✅ Fix #1: Updated axiosInstance.js
- Added CSRF token interceptor for POST/PUT/PATCH/DELETE requests
- Added 401 error handler to redirect to login
- Improved error handling

### ✅ Fix #2: Updated NotificationDropdown.jsx
- Changed from raw `axios` to `axiosInstance`
- Fixed API paths from `/api/v1/...` to `/v1/...`
- Removed redundant `withCredentials: true` (already in axiosInstance)

### ✅ Fix #3: Updated employeeDetailsSlice.js
- Changed import from `axios` to `axiosInstance`
- Updated `fetchEmployeeOwnInfo` to use `axiosInstance` properly
- Handles full URL constants by extracting path portion

### ✅ Fix #4: Updated DashboardEmployee.jsx (already done)
- Fixed inconsistent API endpoint paths

---

## What These Fixes Do

1. **CSRF Token Handling**: Automatically adds CSRF token header for state-changing requests
2. **Cookie Handling**: Ensures `withCredentials: true` is set for all requests
3. **Error Handling**: Automatically redirects to login on 401 errors
4. **Path Consistency**: Uses correct relative paths that work with axiosInstance baseURL

---

## Next Steps

1. **Rebuild Frontend:**
   ```bash
   cd vite_client
   npm run build
   npm run copy-to-server
   ```

2. **Restart Backend Server**

3. **Test:**
   - Login as employee
   - Navigate to `/dashboard-employee`
   - Check browser console for errors
   - Verify API calls are successful

---

## Expected Behavior After Fix

✅ All API calls use `axiosInstance` with proper credentials  
✅ CSRF tokens automatically added for POST/PUT/PATCH/DELETE  
✅ 401 errors redirect to login automatically  
✅ All API paths are correct (no double `/api` in URLs)  
✅ Cookies are sent with all requests

---

## Still Need to Check

If errors persist after rebuild:

1. **Check JWT Cookie:**
   - Browser DevTools → Application → Cookies
   - Should see `jwt` cookie from `ems-v6j5.onrender.com` or your backend domain
   - Should be `httpOnly`, `secure`, `sameSite`

2. **Check CORS Configuration:**
   - Backend `FRONTEND_URL` should match frontend domain
   - `CROSS_SITE_COOKIES=true` if on different domains

3. **Check Authentication:**
   - User role should be 'employee' in JWT token
   - Token should not be expired

---

**Status:** ✅ All fixes applied, ready for rebuild and testing.

