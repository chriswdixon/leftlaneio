# LeftLane.io Landing Page

A modern, responsive landing page for LeftLane.io showcasing services in website development, custom application development with AI integration, web application overhaul, and fractional CTO advisory.

## Features

- **Modern Design**: Clean, professional design with gradient backgrounds
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth scrolling, animations, and interactive form
- **Contact Form**: Functional contact form with validation
- **Fast & Lightweight**: Optimized for performance with minimal dependencies

## Services Showcased

1. **Website Development and Custom Hosting**
   - Responsive, user-friendly websites
   - Secure and scalable hosting solutions

2. **Custom Application Development with AI Integration**
   - Bespoke applications with AI functionality
   - Intelligent user experiences

3. **Web Application Overhaul and Consulting**
   - Comprehensive revamping services
   - Performance optimization and security improvements

4. **Fractional CTO Advisory with AI Focus**
   - Strategic technology guidance
   - AI integration consulting

## File Structure

```
leftlane.io/
├── index.html      # Main HTML file
├── styles.css      # Styling and responsive design
├── script.js       # Interactive features and form handling
├── logo.svg        # Logo file (placeholder - replace with actual logo)
└── README.md       # This file
```

## Customization

### Colors
Edit the CSS variables in `styles.css` to match your brand colors:

```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
    --secondary-color: #8b5cf6;
    /* ... more colors ... */
}
```

### Logo
Replace `logo.svg` with your actual logo file. Ensure it:
- Is in SVG format for scalability
- Has a transparent background if needed
- Is approximately 40px in height

### Background
The background uses a gradient effect. To change it, edit the `.background` class in `styles.css`:

```css
.background {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Content
All content can be edited directly in `index.html`. The structure includes:
- Hero section with title and call-to-action
- Services section with 4 service cards
- Contact form section
- Footer

## Deployment

### Simple Deployment
Upload all files to your web server:
- `index.html`
- `styles.css`
- `script.js`
- `logo.svg`

### Using a Static Site Host
Popular options include:
- **Netlify**: Drag and drop the `leftlane.io` folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Push to a repository and enable Pages

## Contact Form Integration

The contact form currently uses a placeholder submission handler. To integrate with a backend:

1. Set up an API endpoint to receive form submissions
2. Uncomment and modify the fetch code in `script.js`:

```javascript
fetch('/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
})
```

Or use a service like:
- **Formspree**: Easy form handling
- **SendGrid**: Email delivery
- **Custom API**: Build your own backend

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- No external dependencies (except Google Fonts)
- Optimized CSS and JavaScript
- Fast loading times
- Smooth animations and transitions

## License

© 2025 LeftLane.io LLC. All Rights Reserved.

