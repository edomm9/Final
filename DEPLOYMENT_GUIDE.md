# 🚀 Full Stack Deployment Guide - Fayda Visitor Access System

This guide provides comprehensive steps for deploying both the frontend (Vercel) and backend (Render) of your Fayda Visitor Access System.

## 🔧 Key Fixes Applied (from previous iteration)

### 1. Frontend Configuration System
- ✅ Replaced Next.js-style environment variables with vanilla JS configuration
- ✅ Added automatic environment detection (localhost vs production)
- ✅ Implemented proper URL construction with `CONFIG.getApiUrl()`
- ✅ Added comprehensive error handling and debugging

### 2. Backend Configuration
- ✅ Updated OIDC credentials to match your new CLIENT_ID
- ✅ Fixed CORS settings for proper cross-origin requests
- ✅ Enhanced error responses with detailed messages

### 3. Debugging and Monitoring
- ✅ Added connection testing on application startup
- ✅ Comprehensive logging system with `CONFIG.log()`
- ✅ Better error messages for troubleshooting

## 📋 Pre-Deployment Checklist

### General
- [ ] **Git Repository**: Ensure your project is pushed to a Git repository (e.g., GitHub, GitLab, Bitbucket).
- [ ] **Render Account**: Create an account on Render.com.
- [ ] **Vercel Account**: Create an account on Vercel.com.

### Backend (Django)
- [ ] **Database**: Decide if you'll use Render's managed PostgreSQL or another database. This guide assumes Render's PostgreSQL.
- [ ] **Environment Variables**: Have your `DJANGO_SECRET_KEY`, `CLIENT_ID`, `PRIVATE_KEY_JWK`, and other VeriFayda credentials ready.

### Frontend (HTML/CSS/JS)
- [ ] **Vercel Project**: Be ready to connect your frontend repository to Vercel.

## 🛠️ Step-by-Step Deployment

### Step 1: Deploy Backend to Render (Django REST API)

1.  **Create a new Web Service on Render**:
    *   Go to your Render Dashboard.
    *   Click "New" -> "Web Service".
    *   Connect your Git repository where your `fayda-visitor-system` project is located.
    *   Select the `backend` directory as the **Root Directory**.

2.  **Configure Web Service Settings**:
    *   **Name**: Choose a unique name (e.g., `fayda-backend`).
    *   **Region**: Select a region close to your users.
    *   **Branch**: `main` (or your primary branch).
    *   **Runtime**: `Python 3` (Render will detect `Python 3.11` from `Dockerfile`).
    *   **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
        *   *Note*: This command will run migrations on every deploy. For production, you might want to separate `migrate` into a manual step or a separate "job" on Render.
    *   **Start Command**: `gunicorn visitor_system.wsgi:application --bind 0.0.0.0:$PORT`
        *   *Note*: Render automatically provides the `$PORT` environment variable.
    *   **Instance Type**: `Free` (for testing, upgrade for production).

3.  **Set Environment Variables on Render**:
    *   Go to the "Environment" tab for your new web service.
    *   Add the following environment variables. **Crucially, replace placeholders with your actual values.**
        *   `DJANGO_SECRET_KEY`: Generate a strong, random key (e.g., using `secrets.token_urlsafe(50)` in Python).
        *   `DEBUG`: `False` (for production).
        *   `ALLOWED_HOSTS`: Your Render service's public domain (e.g., `fayda-backend.onrender.com`). You'll find this URL after the first successful deploy. Also include `localhost,127.0.0.1` for local testing.
        *   `CORS_ALLOWED_ORIGINS`: This will be your **Vercel frontend URL** (e.g., `https://your-vercel-app.vercel.app`). For local development, also include `http://localhost:8080,http://localhost:3000`.
        *   `CLIENT_ID`: `crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0`
        *   `REDIRECT_URI`: This will be your **Vercel frontend URL** + `/checkin.html` (e.g., `https://your-vercel-app.vercel.app/checkin.html`).
        *   `PRIVATE_KEY_JWK`: The base64 encoded JWK string from your `.env.example`.
        *   `TOKEN_ENDPOINT`: `https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token`
        *   `AUTHORIZATION_ENDPOINT`: `https://esignet.ida.fayda.et/authorize`
        *   `USERINFO_ENDPOINT`: `https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo`
        *   `CLIENT_ASSERTION_TYPE`: `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`
        *   **Database URL (PostgreSQL)**:
            *   Go to "New" -> "PostgreSQL" in Render.
            *   Create a new PostgreSQL database.
            *   Once created, copy its "Internal Connection String" and set it as `DATABASE_URL` in your web service's environment variables.
            *   **Important**: Uncomment the `DATABASE_URL` section in `backend/visitor_system/settings.py` and ensure it uses `dj_database_url.parse(config('DATABASE_URL'))` if you're using `dj_database_url` (which is common for Django on Render). If not, ensure your `DATABASES` setting is configured to read from `DATABASE_URL`.

4.  **Initial Deployment**:
    *   Click "Create Web Service". Render will start the build and deployment process.
    *   Monitor the logs. If migrations fail, you might need to run them manually via a Render Shell or Job.

5.  **Create Superuser (after successful deploy)**:
    *   Once the service is deployed, go to the "Shell" tab in Render for your web service.
    *   Run: `python manage.py createsuperuser`
    *   Follow the prompts to create an admin user for the Django admin panel.

6.  **Verify Backend API**:
    *   Find your Render service's public URL (e.g., `https://fayda-backend.onrender.com`).
    *   Test an endpoint in your browser or with `curl`: `https://fayda-backend.onrender.com/api/hosts/`
    *   You should see a JSON response (even if empty or requiring authentication), not a 404 or connection error.

### Step 2: Deploy Frontend to Vercel (HTML/CSS/JS)

1.  **Update `frontend/js/config.js`**:
    *   **Crucially**, now that you have your Render backend URL, update `API_BASE_URL` in `frontend/js/config.js` to point to your deployed Render backend.
    *   Also, update `OIDC.REDIRECT_URI` to your Vercel app's public URL.
    *   Example:
        \`\`\`javascript
        const CONFIG = {
          API_BASE_URL: "https://YOUR_RENDER_APP.onrender.com/api", // Your actual Render URL
          OIDC: {
            REDIRECT_URI: "https://YOUR_VERCEL_APP.vercel.app/checkin.html", // Your actual Vercel URL
            // ...
          },
          // ...
        }
        \`\`\`

2.  **Push changes to your repository**:
    \`\`\`bash
    git add .
    git commit -m "Update frontend config with Render and Vercel URLs"
    git push origin main
    \`\`\`

3.  **Connect repository to Vercel**:
    *   Go to your Vercel Dashboard.
    *   Click "Add New..." -> "Project".
    *   Import your Git repository.
    *   **Configure Project**:
        *   **Root Directory**: Select `frontend`.
        *   **Build Command**: Leave empty (or `npm install` if you add npm dependencies later).
        *   **Output Directory**: `.` (or leave empty, Vercel usually detects HTML projects).
        *   **Install Command**: Leave empty.

4.  **Deploy**: Vercel will automatically build and deploy your frontend.

### Step 3: Test End-to-End Flow

1.  **Visit your Vercel app's public URL** (e.g., `https://your-vercel-app.vercel.app`).
2.  **Open your browser's Developer Tools** (F12) and go to the "Console" and "Network" tabs.
3.  **Go to the Check-In page** (`/checkin.html`).
4.  **Observe the console**: You should see `[Fayda Visitor System]` debug messages indicating successful API connection tests and host loading.
5.  **Enter a test Fayda ID** (e.g., `3126894653473958`).
6.  **Proceed with VeriFayda authentication**: You should be redirected to VeriFayda, authenticate, and then be redirected back to your app with visitor data displayed.
7.  **Complete the check-in process**.
8.  **Test other pages**: Check-out, Dashboard, and Host Management.

## 🔍 Troubleshooting

### Common Issues

1.  **Backend 500 Errors on Render**:
    *   Check Render logs for detailed Django traceback.
    *   Ensure `DJANGO_SECRET_KEY` is set.
    *   Verify `DATABASE_URL` is correctly configured and the database is accessible.
    *   Run `python manage.py migrate` via Render Shell if migrations weren't applied.

2.  **CORS Errors (Frontend cannot access Backend)**:
    *   **Most common issue**: `CORS_ALLOWED_ORIGINS` in your Render backend's environment variables **must** exactly match your Vercel frontend's public URL (including `https://`).
    *   Ensure there are no trailing slashes where they shouldn't be.

3.  **VeriFayda Authentication Fails**:
    *   Verify `CLIENT_ID` and `REDIRECT_URI` are identical in both your Render backend's environment variables and your Vercel frontend's `config.js`.
    *   Ensure the `REDIRECT_URI` registered with VeriFayda (if applicable) matches your Vercel URL.
    *   Check the `PRIVATE_KEY_JWK` is correctly set in Render.

4.  **Frontend "Failed to load hosts" or similar API errors**:
    *   Double-check `API_BASE_URL` in `frontend/js/config.js` points to the correct Render backend URL.
    *   Verify the Render backend is actually running and accessible.

### Logs and Monitoring

-   **Render Logs**: Access your web service logs in the Render dashboard for backend errors.
-   **Vercel Logs**: Access your frontend deployment logs in the Vercel dashboard for build issues.
-   **Browser Developer Console**: Crucial for frontend JavaScript errors and network requests. Look for `[Fayda Visitor System]` messages.

## ✅ Success Indicators

- [ ] Backend API responds at `/api/hosts/` with JSON
- [ ] Frontend loads without console errors
- [ ] API connection test shows status 200
- [ ] OIDC flow redirects to VeriFayda correctly
- [ ] Visitor data displays after authentication
- [ ] Check-in completes successfully

## 🆘 Emergency Rollback

If deployment fails:

1.  **Revert to working commit**:
    \`\`\`bash
    git revert HEAD
    git push origin main
    \`\`\`

2.  **Check Render logs** for specific error messages
3.  **Verify environment variables** are correctly set
4.  **Test locally first** before redeploying

## 📞 Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Check Render logs for backend errors
3. Verify all URLs in config files are correct
4. Test API endpoints directly with curl
5. Ensure environment variables are properly set

---

**Built with ❤️ for secure visitor management using VeriFayda 2.0**
