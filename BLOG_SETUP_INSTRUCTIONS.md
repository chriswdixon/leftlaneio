# 🚀 Blog System Setup Instructions

## Step 1: Create Blog Tables in Supabase

Go to your Supabase SQL Editor: https://app.supabase.com/project/mohluzgrkwpcccyzgoyw/sql/new

Copy and paste this SQL (in separate executions):

### 1. Create Tables
```sql
-- Categories table
CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#0c71c3',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    author_name VARCHAR(255) DEFAULT 'LeftLane.io Team',
    author_email VARCHAR(255) DEFAULT 'contact@leftlane.io',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE blog_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-tags relationship
CREATE TABLE blog_post_tags (
    post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);
```

### 2. Enable Row Level Security
```sql
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
```

### 3. Create Security Policies
```sql
-- Public read access to published content
CREATE POLICY "Public can read published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read categories" ON blog_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read tags" ON blog_tags
    FOR SELECT USING (true);

CREATE POLICY "Public can read post tags for published posts" ON blog_post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE blog_posts.id = blog_post_tags.post_id 
            AND blog_posts.status = 'published'
        )
    );

-- Admin access (authenticated users can do everything)
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories" ON blog_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tags" ON blog_tags
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage post tags" ON blog_post_tags
    FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter subscribers
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage subscribers" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Create Indexes for Performance
```sql
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);
```

### 5. Insert Sample Data
```sql
-- Sample categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Technology', 'technology', 'Latest tech trends and insights', '#0c71c3'),
('AI & Machine Learning', 'ai-ml', 'Artificial Intelligence and ML updates', '#10b981'),
('Web Development', 'web-dev', 'Frontend and backend development tips', '#8b5cf6'),
('Business Strategy', 'business', 'Strategic insights for digital transformation', '#f59e0b'),
('Case Studies', 'case-studies', 'Real-world project examples and outcomes', '#ef4444');

-- Sample tags
INSERT INTO blog_tags (name, slug) VALUES
('React', 'react'),
('Node.js', 'nodejs'),
('AI', 'ai'),
('Automation', 'automation'),
('Cloud', 'cloud'),
('Security', 'security'),
('Performance', 'performance'),
('Mobile', 'mobile'),
('API', 'api'),
('DevOps', 'devops');

-- Sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, featured, published_at) VALUES
(
    'Accelerating Digital Transformation with AI-Powered Solutions',
    'ai-powered-digital-transformation',
    'Discover how artificial intelligence is revolutionizing business processes and driving unprecedented efficiency gains.',
    '<h2>The AI Revolution in Business</h2><p>Businesses are experiencing a paradigm shift as AI technologies become more accessible and powerful. At LeftLane.io, we''ve witnessed firsthand how companies can leverage AI to streamline operations, enhance customer experiences, and drive innovation.</p><h3>Key Benefits We''ve Observed</h3><ul><li>Automated workflow optimization</li><li>Predictive analytics for better decision-making</li><li>Enhanced customer personalization</li><li>Reduced operational costs</li></ul><p>Our recent projects have shown up to 40% efficiency improvements when AI is properly integrated into existing systems.</p>',
    (SELECT id FROM blog_categories WHERE slug = 'ai-ml'),
    'published',
    true,
    NOW() - INTERVAL '2 days'
),
(
    'Modern Web Development: Building Scalable Applications',
    'modern-web-development-scalable-apps',
    'Learn about the latest web development practices that ensure your applications can grow with your business needs.',
    '<h2>Scalability from Day One</h2><p>Building applications that scale requires careful planning and the right technology choices. Here''s our approach to creating robust, scalable web applications.</p><h3>Technology Stack Considerations</h3><ul><li>Microservices architecture</li><li>Cloud-native deployment</li><li>API-first design</li><li>Progressive enhancement</li></ul><p>We''ve helped companies handle traffic spikes of 10x without system failures by implementing these principles.</p>',
    (SELECT id FROM blog_categories WHERE slug = 'web-dev'),
    'published',
    false,
    NOW() - INTERVAL '5 days'
),
(
    'Case Study: Transforming Legacy Systems for Fortune 500 Client',
    'legacy-system-transformation-case-study',
    'A deep dive into how we modernized a 20-year-old system while maintaining business continuity.',
    '<h2>The Challenge</h2><p>Our client had a mission-critical system built in 2003 that was becoming increasingly difficult to maintain and scale. The system processed millions of transactions daily and any downtime would cost millions.</p><h3>Our Approach</h3><ul><li>Gradual migration strategy</li><li>Zero-downtime deployment</li><li>Comprehensive testing protocols</li><li>Staff training and documentation</li></ul><h3>Results</h3><ul><li>99.99% uptime maintained during migration</li><li>50% reduction in processing time</li><li>$2M annual savings in maintenance costs</li><li>Enhanced security and compliance</li></ul>',
    (SELECT id FROM blog_categories WHERE slug = 'case-studies'),
    'published',
    true,
    NOW() - INTERVAL '1 week'
);
```

### 6. Link Posts to Tags
```sql
-- Link AI post to tags
INSERT INTO blog_post_tags (post_id, tag_id) VALUES
((SELECT id FROM blog_posts WHERE slug = 'ai-powered-digital-transformation'), (SELECT id FROM blog_tags WHERE slug = 'ai')),
((SELECT id FROM blog_posts WHERE slug = 'ai-powered-digital-transformation'), (SELECT id FROM blog_tags WHERE slug = 'automation')),
((SELECT id FROM blog_posts WHERE slug = 'ai-powered-digital-transformation'), (SELECT id FROM blog_tags WHERE slug = 'cloud'));

-- Link web dev post to tags
INSERT INTO blog_post_tags (post_id, tag_id) VALUES
((SELECT id FROM blog_posts WHERE slug = 'modern-web-development-scalable-apps'), (SELECT id FROM blog_tags WHERE slug = 'react')),
((SELECT id FROM blog_posts WHERE slug = 'modern-web-development-scalable-apps'), (SELECT id FROM blog_tags WHERE slug = 'nodejs')),
((SELECT id FROM blog_posts WHERE slug = 'modern-web-development-scalable-apps'), (SELECT id FROM blog_tags WHERE slug = 'api')),
((SELECT id FROM blog_posts WHERE slug = 'modern-web-development-scalable-apps'), (SELECT id FROM blog_tags WHERE slug = 'performance'));

-- Link case study post to tags
INSERT INTO blog_post_tags (post_id, tag_id) VALUES
((SELECT id FROM blog_posts WHERE slug = 'legacy-system-transformation-case-study'), (SELECT id FROM blog_tags WHERE slug = 'cloud')),
((SELECT id FROM blog_posts WHERE slug = 'legacy-system-transformation-case-study'), (SELECT id FROM blog_tags WHERE slug = 'security')),
((SELECT id FROM blog_posts WHERE slug = 'legacy-system-transformation-case-study'), (SELECT id FROM blog_tags WHERE slug = 'devops'));
```

## ✅ Verification

After running all the SQL, verify in Supabase:
1. Go to **Table Editor**
2. You should see: `blog_categories`, `blog_posts`, `blog_tags`, `blog_post_tags`, `newsletter_subscribers`
3. Check that sample data is populated

## 🎉 Ready!

Once you've run all this SQL, your blog system database will be ready and the frontend will work!
