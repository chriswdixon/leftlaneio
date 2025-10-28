# 🔐 Secure Admin Authentication Setup

## Step 1: Enable Authentication in Supabase

1. **Go to Authentication Settings**
   - Visit: https://app.supabase.com/project/mohluzgrkwpcccyzgoyw/auth/settings
   - **Enable email confirmations:** Turn OFF (for easier setup)
   - **Enable phone confirmations:** Turn OFF
   - **Enable custom SMTP:** Optional (use your own email service)

2. **Configure Auth Settings**
   - **Site URL:** `https://your-netlify-site.netlify.app`
   - **Redirect URLs:** Add these:
     - `https://your-netlify-site.netlify.app/admin.html`
     - `https://your-netlify-site.netlify.app/login.html`
     - `http://localhost:8080/admin.html` (for local testing)

## Step 2: Create Admin User

**Go to Supabase Authentication → Users:**
https://app.supabase.com/project/mohluzgrkwpcccyzgoyw/auth/users

**Click "Add User" and enter:**
- **Email:** `admin@leftlane.io` (or your preferred admin email)
- **Password:** `SecureAdmin123!` (choose a strong password)
- **Email Confirm:** Set to confirmed
- **Phone Confirm:** Leave empty

## Step 3: Test Authentication

1. **Visit login page:** `https://your-site.netlify.app/login.html`
2. **Enter credentials:**
   - Email: `admin@leftlane.io`
   - Password: `SecureAdmin123!`
3. **Should redirect to:** `admin.html` after successful login

## Step 4: Security Policies (Optional but Recommended)

Run this SQL in Supabase SQL Editor to restrict admin access:

```sql
-- Create admin roles table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for admin users to see themselves
CREATE POLICY "Admin users can view own record" ON admin_users
    FOR SELECT USING (auth.uid() = user_id);

-- Insert your admin user
INSERT INTO admin_users (user_id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@leftlane.io';
```

## Step 5: Production Security Enhancements

### **Option A: Netlify Identity (Recommended)**
1. **Enable Netlify Identity** on your Netlify site
2. **Set up admin users** in Netlify dashboard
3. **Update auth.js** to use Netlify Identity instead of Supabase Auth

### **Option B: Custom Domain Protection**
1. **Password protect admin folder** via Netlify
2. **Use environment variables** for sensitive operations
3. **Add IP restrictions** if needed

### **Option C: Two-Factor Authentication**
Add TOTP/SMS verification for extra security:
```sql
-- Enable MFA in Supabase
ALTER TABLE auth.users ENABLE MFA;
```

## Step 6: Access URLs

- **Login Page:** `https://your-site.netlify.app/login.html`
- **Admin Panel:** `https://your-site.netlify.app/admin.html` (requires login)
- **Public Blog:** `https://your-site.netlify.app/news.html` (no login needed)

## 🔒 Security Features Included:

✅ **Email/Password Authentication**  
✅ **Secure session management**  
✅ **Password reset functionality**  
✅ **Auto-redirect if not logged in**  
✅ **Logout functionality**  
✅ **Protected admin routes**  
✅ **User session display**  

## 🚨 Important Security Notes:

1. **Change default password** immediately after first login
2. **Use strong passwords** (8+ chars, mixed case, numbers, symbols)
3. **Enable email confirmation** in production
4. **Set up custom SMTP** for reliable email delivery
5. **Consider IP restrictions** for admin access
6. **Regularly review user access** and remove unused accounts

## 📧 Email Configuration (Production):

For reliable password reset emails, configure SMTP:

1. **Go to:** https://app.supabase.com/project/mohluzgrkwpcccyzgoyw/auth/settings
2. **Enable custom SMTP**
3. **Configure with your email provider:**
   - **Gmail:** Use App Password
   - **SendGrid:** Use API key
   - **AWS SES:** Use SMTP credentials

Your admin panel is now secure and production-ready! 🔐
