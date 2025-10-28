// ============================================
// LEFTLANE.IO - BLOG FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration
    const SUPABASE_URL = 'https://mohluzgrkwpcccyzgoyw.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaGx1emdya3dwY2NjeXpnb3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTQ5NzgsImV4cCI6MjA3NzE5MDk3OH0.roks081S2ViNcGCgqm98gfapXlQHbA42jBgm1VieLe4';
    
    // State
    let currentCategory = 'all';
    let currentPage = 1;
    let currentSort = 'newest';
    let searchQuery = '';
    let isLoading = false;
    
    // DOM Elements
    const featuredPostsContainer = document.getElementById('featured-posts');
    const postsGridContainer = document.getElementById('posts-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categoryFilters = document.querySelectorAll('.filter-btn');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // ============================================
    // API FUNCTIONS
    // ============================================
    
    async function fetchBlogPosts(options = {}) {
        const {
            featured = false,
            category = 'all',
            search = '',
            sort = 'newest',
            page = 1,
            limit = 6
        } = options;
        
        try {
            let url = `${SUPABASE_URL}/rest/v1/blog_posts?select=*,blog_categories(name,slug,color),blog_post_tags(blog_tags(name,slug))`;
            
            // Filters
            const filters = [];
            filters.push('status=eq.published');
            
            if (featured) {
                filters.push('featured=eq.true');
            }
            
            if (category !== 'all') {
                filters.push(`blog_categories.slug=eq.${category}`);
            }
            
            if (search) {
                filters.push(`or=(title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%)`);
            }
            
            // Add filters to URL
            if (filters.length > 0) {
                url += '&' + filters.join('&');
            }
            
            // Sorting
            switch (sort) {
                case 'newest':
                    url += '&order=published_at.desc';
                    break;
                case 'oldest':
                    url += '&order=published_at.asc';
                    break;
                case 'popular':
                    url += '&order=view_count.desc';
                    break;
            }
            
            // Pagination
            const offset = (page - 1) * limit;
            url += `&limit=${limit}&offset=${offset}`;
            
            const response = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    }
    
    async function incrementViewCount(postId) {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    view_count: 'view_count + 1'
                })
            });
        } catch (error) {
            console.error('Error incrementing view count:', error);
        }
    }
    
    async function subscribeToNewsletter(email) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    email: email,
                    subscribed_at: new Date().toISOString()
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            return false;
        }
    }
    
    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    
    function renderFeaturedPost(post) {
        const categoryColor = post.blog_categories?.color || '#0c71c3';
        const categoryName = post.blog_categories?.name || 'Uncategorized';
        const tags = post.blog_post_tags?.map(pt => pt.blog_tags.name).join(', ') || '';
        
        return `
            <article class="featured-post" data-post-id="${post.id}">
                <div class="featured-post-image">
                    ${post.featured_image_url ? 
                        `<img src="${post.featured_image_url}" alt="${post.title}" loading="lazy">` :
                        '<div class="placeholder-icon">📰</div>'
                    }
                </div>
                <div class="featured-post-content">
                    <div class="featured-post-meta">
                        <span class="category-badge" style="background-color: ${categoryColor}">
                            ${categoryName}
                        </span>
                        <span class="post-date">${formatDate(post.published_at)}</span>
                        <span class="read-time">${calculateReadTime(post.content)} min read</span>
                    </div>
                    <h3 class="featured-post-title">${post.title}</h3>
                    <p class="featured-post-excerpt">${post.excerpt || truncateText(stripHtml(post.content), 150)}</p>
                    <a href="#" class="read-more-btn" data-post-id="${post.id}">
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </a>
                </div>
            </article>
        `;
    }
    
    function renderPostCard(post) {
        const categoryColor = post.blog_categories?.color || '#0c71c3';
        const categoryName = post.blog_categories?.name || 'Uncategorized';
        const tags = post.blog_post_tags?.map(pt => pt.blog_tags.name) || [];
        
        return `
            <article class="post-card" data-post-id="${post.id}">
                <div class="post-card-image">
                    ${post.featured_image_url ? 
                        `<img src="${post.featured_image_url}" alt="${post.title}" loading="lazy">` :
                        '<div class="placeholder-icon">📄</div>'
                    }
                </div>
                <div class="post-card-content">
                    <div class="post-card-meta">
                        <span class="category-badge" style="background-color: ${categoryColor}">
                            ${categoryName}
                        </span>
                        <span class="post-date">${formatDate(post.published_at)}</span>
                        <span class="read-time">${calculateReadTime(post.content)} min read</span>
                    </div>
                    <h3 class="post-card-title">${post.title}</h3>
                    <p class="post-card-excerpt">${post.excerpt || truncateText(stripHtml(post.content), 120)}</p>
                    ${tags.length > 0 ? `
                        <div class="post-tags">
                            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </article>
        `;
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = stripHtml(content).split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
    
    function stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
    
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    function showMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0c71c3'};
            color: white;
            border-radius: var(--radius-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // LOAD FUNCTIONS
    // ============================================
    
    async function loadFeaturedPosts() {
        try {
            const posts = await fetchBlogPosts({ featured: true, limit: 3 });
            
            if (posts.length === 0) {
                featuredPostsContainer.innerHTML = `
                    <div class="no-posts-message">
                        <h3>No featured posts yet</h3>
                        <p>Check back soon for featured content!</p>
                    </div>
                `;
                return;
            }
            
            featuredPostsContainer.innerHTML = posts.map(renderFeaturedPost).join('');
        } catch (error) {
            console.error('Error loading featured posts:', error);
            featuredPostsContainer.innerHTML = `
                <div class="error-message">
                    <h3>Unable to load featured posts</h3>
                    <p>Please try refreshing the page.</p>
                </div>
            `;
        }
    }
    
    async function loadPosts(append = false) {
        if (isLoading) return;
        
        isLoading = true;
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';
        
        try {
            const posts = await fetchBlogPosts({
                category: currentCategory,
                search: searchQuery,
                sort: currentSort,
                page: currentPage,
                limit: 6
            });
            
            if (posts.length === 0 && !append) {
                postsGridContainer.innerHTML = `
                    <div class="no-posts-message">
                        <h3>No posts found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                `;
                loadMoreBtn.style.display = 'none';
                return;
            }
            
            const postsHtml = posts.map(renderPostCard).join('');
            
            if (append) {
                postsGridContainer.innerHTML += postsHtml;
            } else {
                postsGridContainer.innerHTML = postsHtml;
            }
            
            // Show/hide load more button
            if (posts.length < 6) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Error loading posts:', error);
            if (!append) {
                postsGridContainer.innerHTML = `
                    <div class="error-message">
                        <h3>Unable to load posts</h3>
                        <p>Please try refreshing the page.</p>
                    </div>
                `;
            }
            showMessage('Error loading posts. Please try again.', 'error');
        } finally {
            isLoading = false;
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Load More Posts';
        }
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    // Category filtering
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryFilters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            currentPage = 1;
            loadPosts();
        });
    });
    
    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = this.value.trim();
            currentPage = 1;
            loadPosts();
        }, 500);
    });
    
    // Sort functionality
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        currentPage = 1;
        loadPosts();
    });
    
    // Load more functionality
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        loadPosts(true);
    });
    
    // Post click handlers
    document.addEventListener('click', function(e) {
        const postCard = e.target.closest('.post-card, .featured-post');
        const readMoreBtn = e.target.closest('.read-more-btn');
        
        if (postCard && !readMoreBtn) {
            const postId = postCard.dataset.postId;
            openPost(postId);
        } else if (readMoreBtn) {
            e.preventDefault();
            const postId = readMoreBtn.dataset.postId;
            openPost(postId);
        }
    });
    
    // Newsletter subscription
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            const success = await subscribeToNewsletter(email);
            
            if (success) {
                showMessage('Successfully subscribed to our newsletter!', 'success');
                emailInput.value = '';
            } else {
                showMessage('Subscription failed. Please try again.', 'error');
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        });
    }
    
    // ============================================
    // POST VIEWER (Modal or separate page)
    // ============================================
    
    function openPost(postId) {
        // For now, we'll show an alert. In a full implementation,
        // you'd open a modal or navigate to a separate post page
        incrementViewCount(postId);
        showMessage('Post viewer coming soon! Post ID: ' + postId, 'info');
        
        // TODO: Implement full post viewer
        // This could be a modal or a separate page (post.html?id=123)
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    // Load initial content
    loadFeaturedPosts();
    loadPosts();
    
    console.log('Blog system initialized successfully');
});
