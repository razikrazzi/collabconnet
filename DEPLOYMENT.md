# Deployment Guide

To deploy this project successfully, follow these steps:

## 1. Backend (Render)
I have added a `render.yaml` file in the root directory.
*   Log in to [Render](https://render.com).
*   Go to **Blueprints** and click **New Blueprint Instance**.
*   Select this repository.
*   Render will automatically detect the settings.
*   **Environment Variables**: You will need to provide:
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secret key for JWT (Render can generate one for you).
    *   `ALLOWED_ORIGIN`: Set this to your frontend URL once it's deployed in Vercel (e.g., `https://your-app.vercel.app`).
    *   Cloudinary credentials (if used in `server/.env`).

## 2. Frontend (Vercel)
I have added a `vercel.json` in the `client/` directory for proper SPA routing.
*   Log in to [Vercel](https://vercel.com).
*   Click **Add New** -> **Project**.
*   Select this repository.
*   **Root Directory**: Set this to `client`.
*   **Framework Preset**: Change this to **Vite** (The error "react-scripts: command not found" means this is currently set incorrectly to Create React App).
*   **Build Command**: Ensure it says `npm run build` or `vite build`.
*   **Output Directory**: Ensure it says `dist`.
*   **Environment Variables**:
    *   `VITE_API_URL`: Set this to your backend URL on Render (e.g., `https://your-api.onrender.com`).

## 3. Important Note
Your frontend code has hardcoded `localhost:5001` URLs. To make it work in production, it's highly recommended to use environment variables.
I have attempted to update the URLs to look for `VITE_API_URL`.

