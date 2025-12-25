# Authentication Troubleshooting Guide

## Issue: Cannot signup/login to the website

### Possible Causes & Solutions:

## 1. **Supabase Email Configuration**

By default, Supabase requires email confirmation. This means:
- After signup, users receive an email with a confirmation link
- They MUST click the link before they can log in
- Until confirmed, login will fail with "Invalid credentials"

### Solution A: Disable Email Confirmation (Development Only)
1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project (`syhetmgqefvekyifwctk`)
3. Navigate to **Authentication** → **Providers** → **Email**
4. **Disable "Confirm email"** checkbox
5. Save changes

### Solution B: Check Email (Production Approach)
1. After signup, check the email inbox
2. Click the confirmation link in the email
3. Then try logging in

---

## 2. **Google OAuth Not Configured**

The "Continue with Google" button requires additional setup:

### Steps to Configure Google OAuth:
1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Find **Google** provider
3. Enable it
4. You need to create a Google Cloud Project:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://syhetmgqefvekyifwctk.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase
6. Save

**For now, use email/password signup instead** if Google OAuth is not configured.

---

## 3. **CORS and Redirect URL Configuration**

### Configure Site URL in Supabase:
1. Go to **Authentication** → **URL Configuration**
2. Add your development URL: `http://localhost:5174`
3. Add your production URL when deployed
4. Save

---

## 4. **Check Supabase Connection**

The environment variables are already set in `.env`:
```
VITE_SUPABASE_URL=https://syhetmgqefvekyifwctk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Open browser console (F12) to check for errors:
- If you see "Missing Supabase environment variables" → restart dev server
- If you see CORS errors → add URL to Supabase configuration
- If you see "Invalid credentials" → email might not be confirmed

---

## 5. **Testing Authentication**

### Test Signup:
1. Go to http://localhost:5174/signup
2. Fill in the form with a valid email
3. Submit
4. **Check email inbox** for confirmation (if enabled)
5. Click confirmation link (if required)
6. Go to http://localhost:5174/login
7. Enter same credentials
8. Should redirect to /dashboard

### Test Login:
1. Go to http://localhost:5174/login
2. Use credentials from signup
3. Should redirect to /dashboard on success

---

## 6. **Common Error Messages**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid login credentials" | Email not confirmed OR wrong password | Check email for confirmation link |
| "Email not confirmed" | Email confirmation enabled | Click link in email |
| "User already registered" | Trying to signup with existing email | Use login instead |
| Network error | Supabase URL wrong or offline | Check .env file |
| CORS error | URL not whitelisted | Add URL to Supabase dashboard |

---

## 7. **Quick Fix: Bypass Email Confirmation**

If you just want to test quickly during development:

1. Go to Supabase Dashboard
2. **Authentication** → **Email Templates**
3. Copy the confirmation URL pattern
4. OR disable email confirmation entirely (Authentication → Providers → Email)

---

## 8. **Verify Supabase Project Status**

Check if your Supabase project is active:
1. Go to https://app.supabase.com
2. Select project
3. Check if database is running (should show green status)
4. Check if there are any billing issues (free tier limits)

---

## Current Status:

✅ Environment variables configured
✅ Supabase client initialized  
✅ Forms and validation working
✅ Text colors updated for better contrast (#292929 on white background)
⚠️ Email confirmation may be required
⚠️ Google OAuth needs configuration

## Recommended Next Steps:

1. **Disable email confirmation** in Supabase (quickest fix for development)
2. Test signup with a real email address
3. Check browser console for any errors
4. Configure Google OAuth later (optional)

---

## Browser Console Commands (for debugging):

Open browser console (F12) and run:

```javascript
// Check if Supabase is initialized
console.log(supabase)

// Check current session
supabase.auth.getSession().then(console.log)

// Check current user
supabase.auth.getUser().then(console.log)
```

---

Your application is running at: **http://localhost:5174/**

Try signing up now and check your email for confirmation!
