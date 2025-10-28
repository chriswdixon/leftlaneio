# Push LeftLane.io to GitHub

## ✅ Local Git Repository Ready

Your code is already committed locally. Now push it to GitHub!

---

## 🚀 Push to GitHub (Choose One)

### Option 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `leftlaneio` (or any name you prefer)
3. Description: "LeftLane.io landing page with Netlify Forms"
4. Choose: Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have files)
6. Click "Create repository"

7. Then run these commands in your terminal:

```bash
cd /Users/chrisdixon/Documents/GitHub/forge/leftlane.io

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/leftlaneio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Option 2: If Repository Already Exists

If you already created the GitHub repository:

```bash
cd /Users/chrisdixon/Documents/GitHub/forge/leftlane.io

# Add your existing remote
git remote add origin https://github.com/YOUR_USERNAME/leftlaneio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📦 What Will Be Pushed

- ✅ `index.html` - Main landing page
- ✅ `styles.css` - Styling
- ✅ `script.js` - JavaScript with Netlify Forms
- ✅ `logo.svg` - Logo (placeholder)
- ✅ `.gitignore` - Git ignore rules
- ✅ All documentation files

**Total:** 15 files

---

## 🔗 After Pushing to GitHub

You can then:

1. **Deploy to Netlify from GitHub** (recommended):
   - Connect GitHub to Netlify
   - Auto-deploys on every commit
   - Professional workflow

2. **Deploy manually:**
   - Drag & drop to Netlify
   - Or use Netlify CLI

---

## 📝 Quick Commands Reference

```bash
# View current status
git status

# View commit history
git log

# Push updates
git push

# Add new changes
git add .
git commit -m "Your message"
git push
```

---

## 🎯 Next Steps

After pushing to GitHub:

1. Go to Netlify
2. Add new site → Import from Git
3. Connect GitHub
4. Select your `leftlaneio` repository
5. Deploy!

Netlify will automatically:
- Deploy on every commit
- Build your site
- Set up the contact form
- Provide a URL

---

Ready to push? Create the GitHub repository and follow the commands above!

