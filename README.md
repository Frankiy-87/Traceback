# Trace Mobile - Local Setup & Firebase Deployment

This project was built in Google AI Studio and is ready for local development and Firebase Hosting.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli): Install via `npm install -g firebase-tools`

## Windows PowerShell Fixes
If you are using PowerShell on Windows and getting "operation not permitted" or "resource busy" errors:

1. **Close VS Code** and any other terminal windows.
2. Open PowerShell as Administrator.
3. Run this "Nuclear Reset" command:
   ```powershell
   Remove-Item -Recurse -Force node_modules, package-lock.json
   npm cache clean --force
   ```
4. Reinstall:
   ```bash
   npm install
   ```

## Alternative Hosting: Vercel (Recommended if Firebase CLI fails)
If you are still having trouble with the Firebase CLI, Vercel is a 1-click alternative for Vite apps.

1. Create a [GitHub repository](https://github.com/new) and push your code.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3. Import your GitHub repo.
4. **Environment Variables**: Add `VITE_FIREBASE_CONFIG` (your config JSON) and `FIREBASE_SERVICE_ACCOUNT_KEY` in settings.
5. Vercel will automatically detect Vite and the `/api` folder. Click **Deploy**.

## Local Setup & Deployment (Option 2: Full-Stack)
This project is configured for **Firebase Hosting + Functions**.

### 1. Local Development
1. **Extract the ZIP** into a folder.
2. **Open the folder** in VS Code.
3. **Install dependencies** (Root & Functions):
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```
4. **Run the development server**:
   ```bash
   # In one terminal:
   npm run dev
   # In another terminal (to test functions locally):
   cd functions && npm run serve
   ```

### 2. Deploying to Firebase
1. **Login to Firebase**: `firebase login`
2. **Initialize Firebase** (if not already linked): `firebase init`
   - Select `Hosting`, `Functions`, and `Firestore`.
   - Select your existing Firebase project.
   - For `Hosting`: Public directory `dist`, Single-page app `Yes`.
   - For `Functions`: Language `TypeScript`.
3. **Build the production app**:
   ```bash
   npm run build
   ```
4. **Deploy Everything**:
   ```bash
   firebase deploy
   ```

## Backend Configuration
When deploying functions, Firebase Admin initializes automatically using the environment's default credentials. No service account JSON is needed for the production cloud functions.

## Environment Variables
Ensure you have your Firebase configuration in `src/lib/firebase.ts` or a `.env` file if you've moved to using process variables.
