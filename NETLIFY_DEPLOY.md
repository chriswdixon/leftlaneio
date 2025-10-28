# Deploy LeftLane.io to Netlify - Step by Step

Your site is now **100% ready for Netlify deployment** with a working contact form!

## ✅ What's Configured

- ✓ HTML structure ready
- ✓ CSS styling complete
- ✓ JavaScript interactivity
- ✓ **Netlify Forms integration** (form will work immediately!)
- ✓ Spam protection (honeypot)
- ✓ Form validation
- ✓ Responsive design

## 🚀 Deploy in 5 Minutes

### Step 1: Go to Netlify
Visit: https://app.netlify.com

### Step 2: Sign Up (Free)
- Click "Sign up"
- Use GitHub, Google, or Email
- It's 100% free forever

### Step 3: Deploy Your Site
**Option A: Drag & Drop (Easiest)**
1. Open your file explorer
2. Navigate to `/Users/chrisdixon/Documents/GitHub/forge/leftlane.io`
3. Drag the entire `leftlane.io` folder onto Netlify
4. Your site is live! 🎉

**Option B: Deploy via Netlify CLI**
```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Deploy from leftlane.io directory
cd leftlane.io
netlify deploy --prod
```

### Step 4: Set Up Contact Form Email Notifications

1. Go to your Netlify dashboard
2. Click on your site
3. Go to **Forms** tab
4. Click on your form (named "contact")
5. Click **Settings**
6. Enable **Email notifications**
7. Enter your email address
8. Click **Save**

**That's it!** You'll now receive emails when someone submits the contact form.

### Step 5: Add Custom Domain (leftlane.io)

1. In Netlify dashboard, click **Domain settings**
2. Click **Add custom domain**
3. Enter: `leftlane.io`
4. Click **Verify**

**Netlify will show you DNS records to add:**

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add:

**Option 1: A Records** (for apex domain)
```
Type: A
Name: @
Value: (IP addresses Netlify provides)
```

**Option 2: CNAME** (for www subdomain)
```
Type: CNAME
Name: www
Value: (your-site-name.netlify.app)
```

### Step 6: Wait for DNS Propagation
- Usually 5-60 minutes
- Check with: https://dnschecker.org

### Step 7: Done!
Your site is live at **leftlane.io** with:
- ✅ Working contact form
- ✅ SSL certificate (automatic)
- ✅ Fast global CDN
- ✅ Email notifications

---

## 📋 Checklist

Before deploying:
- [ ] Logo replaced with actual LeftLane.io logo (optional, can do later)
- [ ] Colors updated to match your brand (optional, can do later)
- [ ] Contact email updated in the form email notifications
- [ ] Test the form locally (optional)

After deploying:
- [ ] Test the contact form
- [ ] Check email notifications are working
- [ ] Add custom domain
- [ ] Update DNS records
- [ ] Test on mobile devices

---

## 🎯 What You Get for Free

**Netlify Free Tier Includes:**
- ✅ 100GB bandwidth/month (plenty for a landing page)
- ✅ 300 build minutes/month
- ✅ **100 form submissions/month** (contact form)
- ✅ Spam filtering
- ✅ Email notifications
- ✅ Form data access in dashboard
- ✅ Custom domain support
- ✅ SSL/HTTPS (automatic)
- ✅ Global CDN
- ✅ Instant rollbacks
- ✅ Form submission history

**If you exceed limits:**
- Netlify Pro: $19/month (unlimited forms, 1,000 build minutes)
- Or stick with free tier (probably plenty for your needs)

---

## 📧 Managing Form Submissions

### View Submissions:
1. Go to Netlify dashboard
2. Click on your site
3. Click **Forms** tab
4. Click on "contact" form
5. See all submissions

### Export Submissions:
1. In Forms tab
2. Click **Export** button
3. Download as CSV

### Email Notifications:
- Configured in Step 4 above
- You'll get an email for each submission
- Form data included in email

---

## 🔄 Updating Your Site

**After making changes:**

**Option 1: Drag & Drop Again**
1. Make changes locally
2. Drag folder onto Netlify again
3. Site updates automatically

**Option 2: Git Integration (Recommended for team)**
1. Push to GitHub
2. Connect GitHub to Netlify
3. Auto-deploys on every commit

---

## 🛠️ Optional: Connect to GitHub

For automatic deployments:

1. Push your code to GitHub
2. In Netlify: **Add new site** → **Import an existing project**
3. Select **GitHub**
4. Choose your repository
5. Netlify auto-detects settings
6. Click **Deploy**
7. Netlify will auto-deploy on every push

---

## 🎨 Customize Before/After Deploy

**Before deploying** (best):
- Update logo in `logo.svg`
- Update colors in `styles.css`
- Customize any text in `index.html`

**After deploying** (also fine):
- Make changes locally
- Drag & drop again to update

---

## 📊 Form Limits

Your contact form includes:
- **100 free submissions/month** (Netlify free tier)
- Spam protection (built-in)
- Email notifications
- Form data stored in Netlify dashboard

**If you need more:**
- Netlify Pro: $19/month (unlimited)
- Or add Formspree as backup

---

## 🆘 Troubleshooting

**Form not working?**
- Make sure you deployed to Netlify
- Check Forms tab in Netlify dashboard
- Ensure `netlify` attribute is in form tag

**Not receiving emails?**
- Check spam folder
- Verify email in Netlify Forms settings
- Check "Email notifications" is enabled

**DNS not working?**
- Wait 5-60 minutes for propagation
- Use https://dnschecker.org to check
- Verify DNS records are correct

---

## 🎉 You're All Set!

Your LeftLane.io landing page is ready to deploy with:
- ✅ All HTML, CSS, JavaScript files
- ✅ Working contact form with Netlify Forms
- ✅ Spam protection
- ✅ Responsive design
- ✅ Professional appearance
- ✅ Custom domain support
- ✅ Free SSL certificate
- ✅ Fast global CDN

**Estimated deployment time:** 5-10 minutes

**Cost:** $0 (free hosting + free form handling)

**Next steps:** 
1. Deploy to Netlify
2. Add custom domain
3. Set up email notifications
4. Start receiving contact form submissions!

---

Need help? Check:
- Netlify docs: https://docs.netlify.com
- Netlify Forms docs: https://docs.netlify.com/forms/setup/

