// ============================================
// LEFTLANE.IO - ADMIN PANEL FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // AUTHENTICATION CHECK
    // ============================================
    
    // Check if user is authenticated before loading admin functionality
    if (!requireAuth()) {
        return; // Exit if not authenticated
    }
    
    // Update user display
    const userEmailElement = document.getElementById('admin-user-email');
    if (userEmailElement && window.supabaseAuth) {
        const { data } = window.supabaseAuth.getUser();
        if (data.user) {
            userEmailElement.textContent = data.user.email;
        }
    }
    
    // Configuration
    const SUPABASE_URL = 'https://mohluzgrkwpcccyzgoyw.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaGx1emdya3dwY2NjeXpnb3l3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYxNDk3OCwiZXhwIjoyMDc3MTkwOTc4fQ.JEl6tuhNf6EM-2gj8GtaEzVLRC8BJlCjLInhDycL62c';
    
    // State
    let currentSection = 'dashboard';
    let editingPost = null;
    let editingCategory = null;
    
    // DOM Elements
    const loadingOverlay = document.getElementById('loading-overlay');
    const adminNavBtns = document.querySelectorAll('.admin-nav-btn');
    const adminSections = document.querySelectorAll('.admin-section');
    
    // Modal elements
    const postModal = document.getElementById('post-editor-modal');
    const categoryModal = document.getElementById('category-editor-modal');
    const postForm = document.getElementById('post-form');
    const categoryForm = document.getElementById('category-form');
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function showLoading() {
        loadingOverlay.classList.add('active');
    }
    
    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }
    
    function showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0c71c3'};
            color: white;
            border-radius: var(--radius-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    // ============================================
    // API FUNCTIONS
    // ============================================
    
    async function apiRequest(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
                }
            };
            
            if (body) {
                options.body = JSON.stringify(body);
            }
            
            const response = await fetch(`${SUPABASE_URL}/rest/v1${endpoint}`, options);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    async function loadDashboardStats() {
        try {
            const [posts, categories, subscribers] = await Promise.all([
                apiRequest('/blog_posts?select=count'),
                apiRequest('/blog_categories?select=count'),
                apiRequest('/newsletter_subscribers?select=count')
            ]);
            
            const postsCount = posts[0]?.count || 0;
            const categoriesCount = categories[0]?.count || 0;
            const subscribersCount = subscribers[0]?.count || 0;
            
            // Calculate total views
            const viewsData = await apiRequest('/blog_posts?select=view_count');
            const totalViews = viewsData.reduce((sum, post) => sum + (post.view_count || 0), 0);
            
            document.getElementById('dashboard-posts').textContent = postsCount;
            document.getElementById('dashboard-views').textContent = totalViews.toLocaleString();
            document.getElementById('dashboard-categories').textContent = categoriesCount;
            document.getElementById('dashboard-subscribers').textContent = subscribersCount;
            
            document.getElementById('total-posts').textContent = postsCount;
            document.getElementById('total-views').textContent = totalViews > 1000 ? `${Math.floor(totalViews / 1000)}K` : totalViews;
            
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            showMessage('Error loading dashboard statistics', 'error');
        }
    }
    
    async function loadRecentPosts() {
        try {
            const posts = await apiRequest('/blog_posts?select=*,blog_categories(name)&order=created_at.desc&limit=5');
            
            const recentPostsContainer = document.getElementById('recent-posts');
            
            if (posts.length === 0) {
                recentPostsContainer.innerHTML = '<p>No posts yet. Create your first post!</p>';
                return;
            }
            
            recentPostsContainer.innerHTML = posts.map(post => `
                <div class="recent-post-item">
                    <div class="recent-post-info">
                        <h4>${post.title}</h4>
                        <p>${post.blog_categories?.name || 'Uncategorized'} • ${formatDate(post.created_at)}</p>
                    </div>
                    <span class="recent-post-status status-${post.status}">${post.status}</span>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading recent posts:', error);
        }
    }
    
    async function loadPosts() {
        try {
            const posts = await apiRequest('/blog_posts?select=*,blog_categories(name)&order=created_at.desc');
            
            const postsTableBody = document.getElementById('posts-table-body');
            
            if (posts.length === 0) {
                postsTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 2rem;">
                            No posts yet. Create your first post!
                        </td>
                    </tr>
                `;
                return;
            }
            
            postsTableBody.innerHTML = posts.map(post => `
                <tr>
                    <td>
                        <strong>${post.title}</strong>
                        ${post.featured ? '<span style="color: var(--secondary-color); font-size: 0.875rem;"> ⭐ Featured</span>' : ''}
                    </td>
                    <td>${post.blog_categories?.name || 'Uncategorized'}</td>
                    <td><span class="recent-post-status status-${post.status}">${post.status}</span></td>
                    <td>${post.view_count || 0}</td>
                    <td>${formatDate(post.published_at || post.created_at)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="editPost(${post.id})">✏️</button>
                            <button class="btn-icon btn-delete" onclick="deletePost(${post.id})">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
        } catch (error) {
            console.error('Error loading posts:', error);
            showMessage('Error loading posts', 'error');
        }
    }
    
    async function loadCategories() {
        try {
            const categories = await apiRequest('/blog_categories?select=*&order=name.asc');
            
            const categoriesGrid = document.getElementById('categories-grid');
            
            if (categories.length === 0) {
                categoriesGrid.innerHTML = '<p>No categories yet. Create your first category!</p>';
                return;
            }
            
            // Get post counts for each category
            const categoryStats = await Promise.all(
                categories.map(async (category) => {
                    const posts = await apiRequest(`/blog_posts?category_id=eq.${category.id}&select=count`);
                    return {
                        ...category,
                        postCount: posts[0]?.count || 0
                    };
                })
            );
            
            categoriesGrid.innerHTML = categoryStats.map(category => `
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-color" style="background-color: ${category.color}"></div>
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="editCategory(${category.id})">✏️</button>
                            <button class="btn-icon btn-delete" onclick="deleteCategory(${category.id})">🗑️</button>
                        </div>
                    </div>
                    <h3 class="category-name">${category.name}</h3>
                    <p class="category-description">${category.description || 'No description'}</p>
                    <div class="category-stats">
                        <span>${category.postCount} posts</span>
                        <span>Created ${formatDate(category.created_at)}</span>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading categories:', error);
            showMessage('Error loading categories', 'error');
        }
    }
    
    async function loadTags() {
        try {
            const tags = await apiRequest('/blog_tags?select=*&order=name.asc');
            
            const tagsCloud = document.getElementById('tags-cloud');
            
            if (tags.length === 0) {
                tagsCloud.innerHTML = '<p>No tags yet. Tags will appear here when you create posts.</p>';
                return;
            }
            
            // Get usage count for each tag
            const tagStats = await Promise.all(
                tags.map(async (tag) => {
                    const usage = await apiRequest(`/blog_post_tags?tag_id=eq.${tag.id}&select=count`);
                    return {
                        ...tag,
                        usageCount: usage[0]?.count || 0
                    };
                })
            );
            
            tagsCloud.innerHTML = tagStats.map(tag => `
                <div class="tag-item">
                    <span class="tag-name">${tag.name}</span>
                    <span class="tag-count">${tag.usageCount}</span>
                    <button class="btn-icon btn-delete" onclick="deleteTag(${tag.id})" style="margin-left: 0.5rem;">🗑️</button>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading tags:', error);
            showMessage('Error loading tags', 'error');
        }
    }
    
    async function loadSubscribers() {
        try {
            const subscribers = await apiRequest('/newsletter_subscribers?select=*&order=subscribed_at.desc');
            
            const subscribersTableBody = document.getElementById('subscribers-table-body');
            
            if (subscribers.length === 0) {
                subscribersTableBody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 2rem;">
                            No subscribers yet.
                        </td>
                    </tr>
                `;
                return;
            }
            
            subscribersTableBody.innerHTML = subscribers.map(subscriber => `
                <tr>
                    <td>${subscriber.email}</td>
                    <td>${formatDate(subscriber.subscribed_at)}</td>
                    <td><span class="recent-post-status status-${subscriber.status}">${subscriber.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon btn-delete" onclick="deleteSubscriber(${subscriber.id})">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
        } catch (error) {
            console.error('Error loading subscribers:', error);
            showMessage('Error loading subscribers', 'error');
        }
    }
    
    // ============================================
    // SECTION MANAGEMENT
    // ============================================
    
    function showSection(sectionName) {
        // Update navigation
        adminNavBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            }
        });
        
        // Update sections
        adminSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${sectionName}-section`) {
                section.classList.add('active');
            }
        });
        
        currentSection = sectionName;
        
        // Load section data
        loadSectionData(sectionName);
    }
    
    function loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                loadDashboardStats();
                loadRecentPosts();
                break;
            case 'posts':
                loadPosts();
                break;
            case 'categories':
                loadCategories();
                break;
            case 'tags':
                loadTags();
                break;
            case 'subscribers':
                loadSubscribers();
                break;
        }
    }
    
    // ============================================
    // MODAL MANAGEMENT
    // ============================================
    
    function showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // ============================================
    // CRUD OPERATIONS
    // ============================================
    
    async function savePost(formData) {
        try {
            showLoading();
            
            if (editingPost) {
                await apiRequest(`/blog_posts?id=eq.${editingPost.id}`, 'PATCH', formData);
                showMessage('Post updated successfully!', 'success');
            } else {
                await apiRequest('/blog_posts', 'POST', formData);
                showMessage('Post created successfully!', 'success');
            }
            
            hideModal(postModal);
            loadPosts();
            if (currentSection === 'dashboard') {
                loadDashboardStats();
                loadRecentPosts();
            }
            
        } catch (error) {
            console.error('Error saving post:', error);
            showMessage('Error saving post: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    async function saveCategory(formData) {
        try {
            showLoading();
            
            if (editingCategory) {
                await apiRequest(`/blog_categories?id=eq.${editingCategory.id}`, 'PATCH', formData);
                showMessage('Category updated successfully!', 'success');
            } else {
                await apiRequest('/blog_categories', 'POST', formData);
                showMessage('Category created successfully!', 'success');
            }
            
            hideModal(categoryModal);
            loadCategories();
            if (currentSection === 'dashboard') {
                loadDashboardStats();
            }
            
        } catch (error) {
            console.error('Error saving category:', error);
            showMessage('Error saving category: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    // Navigation
    adminNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
        });
    });
    
    // New post button
    document.getElementById('new-post-btn')?.addEventListener('click', function() {
        editingPost = null;
        document.getElementById('modal-title').textContent = 'New Post';
        postForm.reset();
        
        // Set default values
        document.getElementById('post-status').value = 'draft';
        document.getElementById('post-published-at').value = '';
        
        showModal(postModal);
    });
    
    // New category button
    document.getElementById('new-category-btn')?.addEventListener('click', function() {
        editingCategory = null;
        document.getElementById('category-modal-title').textContent = 'New Category';
        categoryForm.reset();
        document.getElementById('category-color').value = '#0c71c3';
        showModal(categoryModal);
    });
    
    // Modal close buttons
    document.getElementById('close-modal')?.addEventListener('click', function() {
        hideModal(postModal);
    });
    
    document.getElementById('close-category-modal')?.addEventListener('click', function() {
        hideModal(categoryModal);
    });
    
    document.getElementById('cancel-post')?.addEventListener('click', function() {
        hideModal(postModal);
    });
    
    document.getElementById('cancel-category')?.addEventListener('click', function() {
        hideModal(categoryModal);
    });
    
    // Close modals on background click
    [postModal, categoryModal].forEach(modal => {
        modal?.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });
    
    // Form submissions
    postForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            featured_image_url: formData.get('featured_image_url') || null,
            category_id: formData.get('category_id') ? parseInt(formData.get('category_id')) : null,
            status: formData.get('status'),
            featured: formData.has('featured'),
            published_at: formData.get('published_at') || null
        };
        
        savePost(data);
    });
    
    categoryForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            color: formData.get('color')
        };
        
        saveCategory(data);
    });
    
    // Auto-generate slugs
    document.getElementById('post-title')?.addEventListener('input', function() {
        const slug = slugify(this.value);
        document.getElementById('post-slug').value = slug;
    });
    
    document.getElementById('category-name')?.addEventListener('input', function() {
        const slug = slugify(this.value);
        document.getElementById('category-slug').value = slug;
    });
    
    // ============================================
    // GLOBAL FUNCTIONS (for onclick handlers)
    // ============================================
    
    window.showSection = showSection;
    
    window.editPost = async function(postId) {
        try {
            showLoading();
            const posts = await apiRequest(`/blog_posts?id=eq.${postId}`);
            const post = posts[0];
            
            if (!post) {
                showMessage('Post not found', 'error');
                return;
            }
            
            editingPost = post;
            document.getElementById('modal-title').textContent = 'Edit Post';
            
            // Populate form
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-slug').value = post.slug;
            document.getElementById('post-excerpt').value = post.excerpt || '';
            document.getElementById('post-content').value = post.content;
            document.getElementById('post-featured-image').value = post.featured_image_url || '';
            document.getElementById('post-category').value = post.category_id || '';
            document.getElementById('post-status').value = post.status;
            document.getElementById('post-featured').checked = post.featured;
            
            if (post.published_at) {
                const date = new Date(post.published_at);
                document.getElementById('post-published-at').value = date.toISOString().slice(0, 16);
            }
            
            showModal(postModal);
            
        } catch (error) {
            console.error('Error loading post:', error);
            showMessage('Error loading post', 'error');
        } finally {
            hideLoading();
        }
    };
    
    window.deletePost = async function(postId) {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        try {
            showLoading();
            await apiRequest(`/blog_posts?id=eq.${postId}`, 'DELETE');
            showMessage('Post deleted successfully!', 'success');
            loadPosts();
            if (currentSection === 'dashboard') {
                loadDashboardStats();
                loadRecentPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            showMessage('Error deleting post', 'error');
        } finally {
            hideLoading();
        }
    };
    
    window.editCategory = async function(categoryId) {
        try {
            showLoading();
            const categories = await apiRequest(`/blog_categories?id=eq.${categoryId}`);
            const category = categories[0];
            
            if (!category) {
                showMessage('Category not found', 'error');
                return;
            }
            
            editingCategory = category;
            document.getElementById('category-modal-title').textContent = 'Edit Category';
            
            // Populate form
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-slug').value = category.slug;
            document.getElementById('category-description').value = category.description || '';
            document.getElementById('category-color').value = category.color;
            
            showModal(categoryModal);
            
        } catch (error) {
            console.error('Error loading category:', error);
            showMessage('Error loading category', 'error');
        } finally {
            hideLoading();
        }
    };
    
    window.deleteCategory = async function(categoryId) {
        if (!confirm('Are you sure you want to delete this category? Posts in this category will become uncategorized.')) return;
        
        try {
            showLoading();
            await apiRequest(`/blog_categories?id=eq.${categoryId}`, 'DELETE');
            showMessage('Category deleted successfully!', 'success');
            loadCategories();
            if (currentSection === 'dashboard') {
                loadDashboardStats();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            showMessage('Error deleting category', 'error');
        } finally {
            hideLoading();
        }
    };
    
    window.deleteTag = async function(tagId) {
        if (!confirm('Are you sure you want to delete this tag?')) return;
        
        try {
            showLoading();
            await apiRequest(`/blog_tags?id=eq.${tagId}`, 'DELETE');
            showMessage('Tag deleted successfully!', 'success');
            loadTags();
        } catch (error) {
            console.error('Error deleting tag:', error);
            showMessage('Error deleting tag', 'error');
        } finally {
            hideLoading();
        }
    };
    
    window.deleteSubscriber = async function(subscriberId) {
        if (!confirm('Are you sure you want to remove this subscriber?')) return;
        
        try {
            showLoading();
            await apiRequest(`/newsletter_subscribers?id=eq.${subscriberId}`, 'DELETE');
            showMessage('Subscriber removed successfully!', 'success');
            loadSubscribers();
            if (currentSection === 'dashboard') {
                loadDashboardStats();
            }
        } catch (error) {
            console.error('Error removing subscriber:', error);
            showMessage('Error removing subscriber', 'error');
        } finally {
            hideLoading();
        }
    };
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    // Load initial section
    showSection('dashboard');
    
    console.log('Admin panel initialized successfully');
    
});
