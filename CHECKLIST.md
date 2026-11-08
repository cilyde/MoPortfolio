# Deployment & Release Checklist

Follow this checklist whenever you make changes and want to update GitHub and deploy the latest live build to Vercel.

---

### Step 1: Build (Pre-Commit Check)
Run a local build test to ensure there are no TypeScript or compilation errors before committing.
```bash
npm run build
```

---

### Step 2: Commit
Stage your changes and commit them.
```bash
git add .
git commit -m "Describe your changes"
```
> **Note:** `src/config.ts` is in `.gitignore` and untracked, so your config file will remain safely on your local machine and will not be pushed to GitHub.

---

### Step 3: Push
Push your clean repository to GitHub.
```bash
git push origin main
```

---

### Step 4: Build (Pre-Deploy Verification)
Verify that the production build compiles cleanly before shipping.
```bash
npm run build
```

---

### Step 5: Vercel Deploy
Deploy directly from your machine to Vercel production.
```bash
vercel --prod
```
> **Note:** The Vercel CLI uploads your local workspace files directly (respecting `.vercelignore`), so it includes your local `src/config.ts` during the cloud build.
