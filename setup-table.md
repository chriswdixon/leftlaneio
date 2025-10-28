# 🚀 Supabase Table Setup for LeftLane.io

## ✅ Your Connection is Working!
- **Project URL**: https://mohluzgrkwpcccyzgoyw.supabase.co
- **API Keys**: Configured correctly
- **Status**: Ready to create the contacts table

## 📋 Quick Setup (30 seconds)

### Step 1: Open Supabase SQL Editor
Click this link: https://app.supabase.com/project/mohluzgrkwpcccyzgoyw/sql/new

### Step 2: Copy & Paste This SQL
```sql
-- Create contacts table for LeftLane.io contact form
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (recommended)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for contact form)
CREATE POLICY "Allow public contact form submissions" ON contacts 
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (for admin dashboard later)
CREATE POLICY "Allow authenticated reads" ON contacts 
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert a test record to verify everything works
INSERT INTO contacts (name, email, subject, message) 
VALUES ('Test User', 'test@example.com', 'Test Subject', 'This is a test message from setup');
```

### Step 3: Click "Run"
- Should see "Success" message
- Table will be created with 1 test record

## 🎯 What This Creates
- ✅ `contacts` table with all required fields
- ✅ Auto-incrementing ID
- ✅ Timestamp tracking
- ✅ Security policies (public can submit, authenticated can read)
- ✅ Test record to verify everything works

## 🚀 After Creating the Table
Your contact form will immediately work with:
- ✅ **Supabase Database** (primary storage - queryable, exportable)
- ✅ **Netlify Forms** (backup + email notifications)

## 🔍 Verify It Works
After running the SQL, you can:
1. Go to **Table Editor** in Supabase
2. See the `contacts` table with the test record
3. Your live contact form will now save to database + Netlify!

---

**Ready to test?** Run the SQL above, then your contact form will be fully database-powered! 🎉
