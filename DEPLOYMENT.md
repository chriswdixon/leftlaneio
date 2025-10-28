# LeftLane.io - Deployment Guide

## Quick Start

Your new LeftLane.io landing page is ready! Here's what you have:

```
leftlane.io/
├── index.html          # Main page
├── styles.css          # All styling
├── script.js           # Interactive features
├── logo.svg            # Logo (placeholder - needs replacing)
├── README.md           # Documentation
├── CUSTOMIZATION.md    # Customization guide
└── DEPLOYMENT.md       # This file
```

## Preview Locally

### Option 1: Python (if available)
```bash
cd leftlane.io
python3 -m http.server 8080
```
Then open: http://localhost:8080

### Option 2: Node.js (if available)
```bash
cd leftlane.io
npx serve .
```

### Option 3: PHP (if available)
```bash
cd leftlane.io
php -S localhost:8080
```

### Option 4: Just open the file
Simply double-click `index.html` in your file browser (some features may not work)

## Before Deploying

Make sure to:

- [ ] **Replace the logo**: Update `logo.svg` with your actual LeftLane.io logo
- [ ] **Update colors**: Extract colors from current leftlane.io and update CSS variables in `styles.css`
- [ ] **Customize content**: Edit text in `index.html` to match your needs
- [ ] **Update contact email**: Change `contact@leftlane.io` to your actual email
- [ ] **Test locally**: Preview on different devices before deploying

## Deployment Options

### 1. Netlify (Recommended - Free)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Drag and drop the `leftlane.io` folder
4. Done! Your site is live

### 2. Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Import Project"
4. Upload the `leftlane.io` folder
5. Deploy!

### 3. GitHub Pages (Free)
1. Create a new repository on GitHub
2. Upload all files from `leftlane.io` folder
3. Go to Settings → Pages
4. Select source branch and folder
5. Your site will be at: `username.github.io/repository-name`

### 4. Traditional Web Host
1. Access your web hosting via FTP/SFTP
2. Upload all files from `leftlane.io` folder
3. Point your domain to the folder
4. Done!

### 5. AWS S3 + CloudFront
1. Create an S3 bucket
2. Upload files to bucket
3. Enable static website hosting
4. (Optional) Set up CloudFront for CDN
5. Done!

## Custom Domain Setup

If you want to use `leftlane.io` domain:

1. Deploy to your hosting service
2. Add custom domain in hosting settings
3. Update DNS records:
   - Add A record pointing to hosting IP, or
   - Add CNAME record pointing to hosting provider

### DNS Example (Netlify)
```
Type: CNAME
Name: @
Value: your-site.netlify.app
```

## Next Steps

1. **Integrate contact form** (important!)
   - The form currently shows a success message
   - Add backend integration or use service like Formspree
   - See `script.js` for commented integration code

2. **Add Google Analytics** (optional)
   ```html
   <!-- Add to <head> in index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. **SEO Optimization**
   - Already has meta description in `<head>`
   - Add Open Graph tags for social sharing
   - Submit to Google Search Console

4. **Performance**
   - Already optimized for speed
   - No heavy dependencies
   - Fast loading

## Files Overview

### index.html
- Complete page structure
- Hero section with call-to-action
- 4 service cards
- Contact form
- Footer

### styles.css
- Modern, responsive design
- CSS variables for easy customization
- Mobile-friendly breakpoints
- Smooth animations

### script.js
- Mobile menu toggle
- Smooth scrolling navigation
- Form validation
- Scroll animations
- Accessibility improvements

## Support

For customization help, see `CUSTOMIZATION.md`

For general info, see `README.md`

## Checklist

Before going live:
- [ ] Logo replaced with actual LeftLane.io logo
- [ ] Colors match current leftlane.io brand
- [ ] Contact email updated
- [ ] All text content customized
- [ ] Tested on mobile devices
- [ ] Tested on desktop browsers
- [ ] Contact form integration (backend or service)
- [ ] DNS/proxy settings configured
- [ ] HTTPS enabled
- [ ] 404 page created (optional)

---

**Your new LeftLane.io landing page is ready to go live! 🚀**

