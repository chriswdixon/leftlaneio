# LeftLane.io Landing Page - Customization Guide

This guide will help you customize the landing page to match your existing LeftLane.io branding.

## 🎨 Updating Colors

To update the color scheme to match your current website, edit the CSS variables at the top of `styles.css`:

### Find Your Current Colors

1. Visit your existing leftlane.io website
2. Use browser DevTools to inspect the colors:
   - Right-click on any element → Inspect
   - Look for background colors, text colors, and accent colors
3. Note down the hex codes (e.g., `#6366f1`)

### Update CSS Variables

Open `styles.css` and find this section at the top:

```css
:root {
    /* Primary Colors */
    --primary-color: #6366f1;          /* Main brand color */
    --primary-dark: #4f46e5;           /* Darker shade for hover states */
    --primary-light: #818cf8;          /* Lighter shade for subtle elements */
    --secondary-color: #8b5cf6;        /* Secondary/accent color */
    
    /* Background */
    --background-color: #ffffff;        /* Page background */
    --background-alt: #f9fafb;          /* Alternate sections background */
    
    /* Text Colors */
    --text-primary: #1f2937;           /* Main text color */
    --text-secondary: #6b7280;         /* Secondary text */
}
```

Replace the hex codes with your actual brand colors.

### Update Background Gradient

The hero section uses a gradient background. To match your current site:

1. Find the `.background` class in `styles.css`
2. Update the gradient:

```css
.background {
    background: linear-gradient(135deg, YOUR_COLOR_1 0%, YOUR_COLOR_2 100%);
    /* or use a solid color: */
    /* background: #YOUR_COLOR; */
}
```

## 🖼️ Replacing the Logo

### Step 1: Get Your Logo File

1. Download your current logo from your website or design files
2. Convert to SVG format if possible (best quality)
   - Use tools like: Figma, Illustrator, or online SVG converters

### Step 2: Replace the File

1. Copy your logo file to the `leftlane.io` folder
2. Rename it to `logo.svg` (or keep original name)
3. Update the reference in `index.html`

#### If keeping original filename:

In `index.html`, find all instances of:
```html
<img src="logo.svg" alt="LeftLane.io Logo">
```

And replace with your filename:
```html
<img src="your-logo.svg" alt="LeftLane.io Logo">
```

### Step 3: Adjust Logo Size

If your logo looks too big or small, adjust in `styles.css`:

```css
.logo img {
    height: 40px;  /* Adjust this value */
    width: auto;
}
```

## 📄 Customizing Content

All text content is in `index.html`. Simply edit the text directly.

### Key Areas to Customize:

1. **Hero Title** (line ~40):
```html
<h1 class="hero-title">Strategic Technology Solutions with AI Integration</h1>
```

2. **Service Descriptions** (lines ~60-120):
Each service card has a title and description that you can customize.

3. **Contact Information** (lines ~150-160):
```html
<p>contact@leftlane.io</p>
```

4. **Footer** (lines ~200+):
Update copyright and footer links.

## 🎭 Additional Styling Options

### Adjust Spacing

In `styles.css`, find the spacing variables:
```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
```

### Change Font

The site uses Inter font. To change:

1. Update Google Fonts link in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:weight@400;600;700&display=swap" rel="stylesheet">
```

2. Update font family variable in `styles.css`:
```css
--font-family: 'YOUR_FONT', sans-serif;
```

### Modify Animations

To adjust animation speeds, find these in `styles.css`:
```css
--transition-fast: 150ms;
--transition-base: 250ms;
--transition-slow: 350ms;
```

## 📝 Quick Reference

| Element | File | What to Change |
|---------|------|----------------|
| Colors | `styles.css` | CSS variables (lines 5-20) |
| Logo | `logo.svg` or `index.html` | Replace SVG file or update image src |
| Hero text | `index.html` | Lines 40-50 |
| Services | `index.html` | Lines 60-120 |
| Contact info | `index.html` | Lines 150-160 |
| Footer | `index.html` | Lines 200+ |

## 🚀 Next Steps

1. ✅ Update colors to match your brand
2. ✅ Replace placeholder logo with actual logo
3. ✅ Customize all text content
4. ✅ Test on different devices
5. ✅ Deploy to your hosting service

## 💡 Tips

- **Test responsiveness**: Use browser DevTools to test on different screen sizes
- **Check contrast**: Ensure text is readable over backgrounds
- **Optimize images**: Keep logo file size small for fast loading
- **Browser compatibility**: Test in Chrome, Firefox, Safari, and Edge

## 🆘 Need Help?

If you need assistance customizing the page:
1. Check this guide first
2. Review the README.md for general information
3. Test changes locally before deploying

---

**Quick Start Checklist:**

- [ ] Extract colors from current site
- [ ] Update CSS color variables
- [ ] Replace logo file
- [ ] Update contact email
- [ ] Customize service descriptions
- [ ] Test on mobile and desktop
- [ ] Deploy to hosting

