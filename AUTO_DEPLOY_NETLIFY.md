# Enable Auto-Deploy from GitHub to Netlify

## 🎯 What This Does

Once set up, every time you push changes to GitHub, Netlify will:
- ✅ Automatically detect the changes
- ✅ Rebuild your site
- ✅ Deploy the new version
- ✅ Update in seconds

**No more manual drag & drop!**

---

## 📋 Prerequisites

Before you start:
- ✅ Code is pushed to GitHub
- ✅ Have a Netlify account (free)
- ✅ Have GitHub account

---

## 🚀 Step-by-Step Setup

### Step 1: Open Netlify Dashboard

Go to: https://app.netlify.com

---

### Step 2: Add New Site from Git

1. In your Netlify dashboard, click **"Add new site"**
2. Select **"Import an existing project"**
3. Click **"Deploy with GitHub"** (or GitLab/Bitbucket if you use those)

---

### Step 3: Authorize Netlify

1. You'll be redirected to GitHub
2. Click **"Authorize Netlify"**
3. You may be asked for permissions:
   - ✅ **Required**: Access repositories
   - ✅ **Optional**: Email (for build notifications)
4. Click **"Authorize"**

---

### Step 4: Select Your Repository

1. You'll see a list of your GitHub repositories
2. Find and click on **`leftlaneio`** (or whatever you named it)
3. Select **"Connect to GitHub"**

---

### Step 5: Configure Build Settings

Netlify will auto-detect your settings, but you may need to verify:

**Build command:** `(Leave empty - this is a static site)`

**Publish directory:** `./` (or just leave empty if your HTML is in root)

**Branch to deploy:** `main` (or `master`)

**Note:** Since your `index.html` is in the root of the repository, Netlify will handle it automatically.

---

### Step 6: Deploy!

1. Click **"Deploy site"**
2. Netlify will start building
3. You'll see a build log
4. In ~30 seconds, your site will be live!

---

### Step 7: Get Your URL

After deployment completes:
- You'll get a random URL like: `https://random-name-123.netlify.app`
- Your site is LIVE! 🎉

---

## 🔄 Auto-Deploy is Now Active!

From now on:
1. Make changes to your code
2. `git add .`
3. `git commit -m "Your changes"`
4. `git push`

**Netlify will automatically:**
- Detect the push
- Rebuild your site
- Deploy in ~30 seconds
- Your site updates automatically!

---

## 🎨 Customize Site Name

You can change the random URL to something cleaner:

1. In Netlify dashboard, click your site
2. Go to **"Site settings"**
3. Scroll to **"Site details"**
4. Click **"Change site name"**
5. Enter something like: `leftlane-landing`
6. Your URL becomes: `https://leftlane-landing.netlify.app`

---

## 🔔 Enable Build Notifications

Get notified when deploys fail:

1. Site settings
2. Scroll to **"Build & deploy"** → **"Notifications"**
3. Enable email or Slack notifications

---

## 📧 Set Up Form Email Notifications

Even though auto-deploy is set up, you need to configure form emails:

1. In Netlify dashboard, click your site
2. Go to **"Forms"** tab
3. Click on **"contact"** form
4. Click **"Settings"**
5. Toggle **"Email notifications"** ON
6. Enter your email address
7. Click **"Save"**

Now you'll get emails when someone submits the contact form!

---

## 🌐 Add Custom Domain

Connect your `leftlane.io` domain:

1. In Netlify dashboard, click your site
2. Go to **"Domain settings"**
3. Click **"Add custom domain"**
4. Enter: `leftlane.io`
5. Click **"Verify"**
6. Netlify will show DNS records
7. Add these records at your domain registrar
8. Wait 5-60 minutes for DNS to propagate

---

## 🎯 What Happens When You Push

**The Flow:**
```
You: git push → GitHub
     ↓
GitHub detects change
     ↓
Triggers Netlify webhook
     ↓
Netlify pulls latest code
     ↓
Builds your site
     ↓
Deploys (30 seconds)
     ↓
Site updates! 🎉
```

---

## ✅ Benefits of Auto-Deploy

**Before (Manual):**
- Make changes
- Drag & drop to Netlify
- Wait for upload
- Site updates

**After (Auto):**
- Make changes
- `git push`
- Done! ✨

**Plus:**
- ✅ History of all deployments
- ✅ Rollback to any previous version
- ✅ Preview URLs for pull requests
- ✅ Team collaboration
- ✅ Backup in GitHub

---

## 🛠️ Advanced: Branch Previews

Netlify can also preview other branches:

1. Make a new branch: `git checkout -b feature/new-design`
2. Make changes
3. Push: `git push origin feature/new-design`
4. Netlify creates a preview URL for that branch!
5. Share the preview URL with your team
6. If good, merge to main → auto-deploys

---

## 📊 Viewing Deploys

See all your deployments:

1. Click on your site in Netlify
2. Go to **"Deploys"** tab
3. See list of all deployments
4. Click any deploy to see build log
5. Click **"Publish deploy"** to rollback to that version

---

## 🔍 Build Logs

If something goes wrong:

1. Deploys tab
2. Click on the failed deploy
3. View build log
4. See error messages
5. Fix locally
6. Push again

---

## 🎯 Summary

**What you did:**
1. Connected GitHub to Netlify
2. Enabled auto-deploy
3. Configured form notifications

**What this means:**
- ✅ Every push = auto-deploy
- ✅ No manual steps
- ✅ Deployment history
- ✅ Easy rollbacks
- ✅ Team collaboration

**From now on:**
- Just `git push` and your site updates automatically!

---

## 🚨 Troubleshooting

**Build fails?**
- Check build logs in Netlify
- Make sure HTML files are in the root
- Check `.gitignore` isn't excluding important files

**Form not working?**
- Verify `netlify` attribute is in the form tag
- Check Forms tab in Netlify
- Enable email notifications

**Not auto-deploying?**
- Check Netlify is connected to correct branch (main)
- Verify GitHub webhook is set up
- Check repository is public or Netlify has access

---

**You're all set! Push to GitHub and watch Netlify auto-deploy! 🚀**

