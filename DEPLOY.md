# Final Deployment Checklist & Guide

This guide covers the final steps to get your **KodBanking** application live.

## 1. Database (Aiven MySQL)
Since you cannot run a database on GitHub Pages or Render's free tier (easily), use a managed database.

1.  **Create Service:**
    *   Go to [Aiven Console](https://console.aiven.io/).
    *   Create a new **MySQL** service (the free tier is sufficient if available, or use a trial).
    *   Wait for the service to be "Running".
2.  **Get Credentials:**
    *   Copy the **Service URI** (looks like `mysql://avnadmin:password@host:port/defaultdb?ssl-mode=REQUIRED`).
    *   Or copy individual fields: Host, Port, User, Password.
3.  **create Tables:**
    *   In Aiven, go to the **Databases** tab (or **Query** tab).
    *   Copy the content of `backend/schema-aiven.sql` from your project.
    *   Paste and run it in the Aiven Query editor to create the `kodusers` and `usertoken` tables.

## 2. Backend (Render)
The backend routes API requests to your database.

1.  **Create Service:**
    *   Go to [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository (`nithinnstech-cyber/kodbanking`).
2.  **Configure:**
    *   **Name:** `kodbanking-backend` (or similar)
    *   **Region:** Any close to you (e.g., Singapore, Frankfurt).
    *   **Branch:** `main`
    *   **Root Directory:** `backend` (Important!)
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
3.  **Environment Variables:**
    *   Scroll down to "Environment Variables" and add:
        *   `DB_HOST`: (from Aiven)
        *   `DB_PORT`: (from Aiven, usually 25530 or similar)
        *   `DB_USER`: `avnadmin`
        *   `DB_PASSWORD`: (from Aiven)
        *   `DB_NAME`: `defaultdb` (or whatever your DB name is)
        *   `JWT_SECRET`: (Any long random string, e.g., `mysecretkey123`)
        *   `PORT`: `3001`
4.  **Deploy:**
    *   Click **Create Web Service**.
    *   Wait for the deployment to finish.
    *   Copy the **onrender.com URL** (e.g., `https://kodbanking-backend.onrender.com`).

## 3. Frontend (GitHub Pages)
Your frontend is configured to be hosted on GitHub Pages.

1.  **Update API URL (If needed):**
    *   If your Render URL is different from `https://kodbanking-fbs8.onrender.com`, update `frontend/src/config.ts`.
    *   Current configured URL: `https://kodbanking-fbs8.onrender.com`
    *   If you changed it, commit and push the change.
2.  **Deploy:**
    *   I have already run the deployment command for you.
    *   Detailed manual command: `cd frontend && npm run deploy`
3.  **Verify:**
    *   Visit: `https://nithinnstech-cyber.github.io/kodbanking/`
    *   Test the **Register** and **Login** flows.

## Troubleshooting
*   **CORS Error:** If the frontend can't talk to the backend, ensure your backend's `index.ts` allows the frontend URL in the `cors` options.
*   **Database Error:** Check the Render logs. If it says "Connect ETIMEDOUT", check your Aiven host and port.
*   **404 on Refresh:** GitHub Pages is a static host. If you refresh a page like `/dashboard` and get 404, this is normal for SPA on GitHub Pages without a hack (using `HashRouter` instead of `BrowserRouter` fixes this, or use a `404.html` redirection trick).
