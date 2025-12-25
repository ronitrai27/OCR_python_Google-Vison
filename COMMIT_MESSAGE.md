feat: Add production deployment config with environment-based API routing

# Major Changes

## 🎯 Environment Configuration System
- Created centralized API configuration (`frontend/src/config/api.js`)
- Added environment-specific config files:
  - `.env.development` (localhost:5000)
  - `.env.production` (production backend URL)
  - `.env.example` (template with documentation)
- Updated all API calls to use environment variables instead of hardcoded URLs

## 🚀 Vercel Deployment Configuration
- Added `vercel.json` for frontend SPA routing
- Added `backend/vercel.json` for Python backend deployment
- Enhanced `vite.config.js` with:
  - Environment variable loading
  - Development proxy configuration
  - Production build optimization
  - Code splitting for vendors

## 🔧 Updated Files
### Frontend
- `src/services/ocrService.js` - Use centralized API config
- `src/pages/DisputedLandsPage.jsx` - Use env variable for API URL
- `src/pages/TranslationFeaturePage.jsx` - Use env variable for API URL
- `vite.config.js` - Enhanced with env loading and build config
- `package.json` - Added vercel-build script

### Backend
- `.env.example` - Added CORS_ORIGINS and all required variables
- `vercel.json` - Vercel deployment configuration

## 📚 Documentation
- `DEPLOYMENT.md` - Comprehensive deployment guide
  - Vercel, Railway, and Render instructions
  - Environment variable setup
  - Post-deployment checklist
  - Troubleshooting guide
  
- `QUICK_DEPLOY.md` - Quick reference for deployment
  - Step-by-step environment setup
  - Immediate deployment instructions
  
- `PR_TEMPLATE.md` - Detailed PR description template
  - All features documented
  - Testing checklist
  - Security considerations

## 🔑 Key Benefits
- ✅ **Single-point configuration** - Change API URL in one place
- ✅ **Environment-aware** - Automatic dev/prod switching
- ✅ **Production-ready** - Vercel configs included
- ✅ **CORS configured** - Secure cross-origin requests
- ✅ **Beginner-friendly docs** - Complete deployment guides

## 🧪 Testing
- ✅ Tested local development (localhost:5000)
- ✅ Verified environment variable loading
- ✅ Build process successful
- ✅ All API calls use dynamic URLs

## 📋 Deployment Checklist
- [ ] Deploy backend to Railway/Render
- [ ] Get backend URL (e.g., https://backend.railway.app)
- [ ] Update `frontend/.env.production` with backend URL
- [ ] Add VITE_API_URL to Vercel environment variables
- [ ] Add CORS_ORIGINS to backend environment variables
- [ ] Deploy frontend to Vercel
- [ ] Test end-to-end functionality

## 🔐 Security
- Environment variables properly configured
- CORS restricted to specific origins
- No hardcoded credentials
- .env files in .gitignore

---

This resolves the deployment configuration issue and makes the application
production-ready with proper environment management.
