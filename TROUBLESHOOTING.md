# Troubleshooting Guide

## Login Error: ERR_CONNECTION_REFUSED

If you're getting `ERR_CONNECTION_REFUSED` when trying to log in, follow these steps:

### For Development Mode

1. **Check if backend server is running:**
   ```powershell
   cd server
   npm run dev
   ```
   Server should start on `http://localhost:5000`

2. **Verify backend is accessible:**
   Open browser and visit: `http://localhost:5000`
   Should see: `{"success":true,"message":"API is running...","version":"1.0.0"}`

3. **Check frontend vite dev server:**
   ```powershell
   cd vite_client
   npm run dev
   ```
   Frontend should start on `http://localhost:5173`

4. **Verify vite proxy configuration:**
   Check `vite_client/vite.config.js` has proxy configured:
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true,
         secure: false,
       }
     }
   }
   ```

### For Production Build

If you built the app and it's trying to connect to localhost:

1. **Rebuild with production mode:**
   ```powershell
   cd vite_client
   npm run build
   ```

2. **Check build output:**
   The build should show production URLs in the console

3. **Verify environment detection:**
   Open browser console and check the API base URL logs

### Quick Fix: Force Production Backend URL

If you want to use production backend even in development, create `vite_client/.env.local`:

```bash
VITE_API_URL=https://ems-v6j5.onrender.com/api
VITE_API_BASE_URL=https://ems-v6j5.onrender.com/api/v1
```

This will override the auto-detection.

### Common Issues

**Issue:** Server running but still getting connection refused
- Check if server is on a different port
- Check firewall/antivirus blocking connections
- Try `http://127.0.0.1:5000` instead of `localhost:5000`

**Issue:** Vite proxy not working
- Restart vite dev server after changing config
- Check browser console for proxy errors
- Verify no CORS issues from backend

**Issue:** Production build still using localhost
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check if `import.meta.env.PROD` is true in production build

