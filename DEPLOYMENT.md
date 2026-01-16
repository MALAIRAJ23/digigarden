# Netlify Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note:** These are optional. The app will work with localStorage fallback if not provided.

### 2. Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 18 or higher

### 3. Required Netlify Plugin
Install the Next.js plugin in Netlify:
- Go to **Plugins** in your Netlify dashboard
- Search for and install `@netlify/plugin-nextjs`

Or it will be auto-installed from `netlify.toml`

## Local Build Test

Before deploying, test the production build locally:

```bash
cd digigarden

# Install dependencies
npm install

# Run production build
npm run build

# Test the production build
npm start
```

## Common Build Issues & Fixes

### Issue 1: "supabaseUrl is required"
**Fixed:** Supabase client now initializes with fallback values and null checks

### Issue 2: Missing exports (getHistory, revertToVersion)
**Fixed:** Added version history functions to `lib/storage.js`

### Issue 3: Build-time environment variable access
**Fixed:** All Supabase calls now check for null client before execution

## Deployment Steps

1. **Push to Git repository**
   ```bash
   git add .
   git commit -m "Fix Netlify build issues"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect Next.js settings

3. **Configure Environment Variables**
   - Add Supabase credentials (optional)
   - Save and trigger redeploy

4. **Deploy**
   - Netlify will automatically build and deploy
   - Monitor build logs for any errors

## Post-Deployment Verification

1. **Test Core Features:**
   - [ ] Homepage loads
   - [ ] Can create notes (localStorage mode)
   - [ ] Can view notes
   - [ ] Search works
   - [ ] Graph visualization works

2. **Test Supabase Integration (if configured):**
   - [ ] Sign up works
   - [ ] Sign in works
   - [ ] Notes sync to cloud
   - [ ] Collections work
   - [ ] Favorites work

## Troubleshooting

### Build fails with module errors
- Clear Netlify cache: **Deploys > Trigger deploy > Clear cache and deploy**
- Check Node version is 18+

### Runtime errors in production
- Check browser console for specific errors
- Verify environment variables are set correctly
- Ensure Supabase project is active (if using cloud features)

### Features not working
- The app works in two modes:
  - **Local mode:** Uses localStorage (no auth required)
  - **Cloud mode:** Uses Supabase (requires env vars and auth)

## Architecture Notes

### Build-Time Safety
- Supabase client returns `null` if env vars missing
- All functions check for null client before Supabase calls
- Falls back to localStorage automatically

### Tree-Shaking
- All exports are named exports (ES modules)
- No side effects in module initialization
- Lazy initialization of Supabase client

### Environment Variables
- `NEXT_PUBLIC_*` prefix makes vars available client-side
- Build succeeds even without these variables
- Runtime gracefully handles missing configuration

## Support

If issues persist:
1. Check Netlify build logs for specific errors
2. Verify all files are committed to Git
3. Test production build locally first
4. Review this checklist again

## Quick Deploy Command

```bash
# From project root
cd digigarden
npm install
npm run build  # Must succeed with no errors
git add .
git commit -m "Ready for Netlify deployment"
git push
```

Then trigger deploy in Netlify dashboard.
