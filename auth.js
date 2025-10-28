// ============================================
// LEFTLANE.IO - AUTHENTICATION SYSTEM
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration
    const SUPABASE_URL = 'https://mohluzgrkwpcccyzgoyw.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaGx1emdya3dwY2NjeXpnb3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTQ5NzgsImV4cCI6MjA3NzE5MDk3OH0.roks081S2ViNcGCgqm98gfapXlQHbA42jBgm1VieLe4';
    
    // Simple Supabase client setup
    const supabase = {
        auth: {
            async signInWithPassword(credentials) {
                const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('supabase_auth_token', data.access_token);
                    localStorage.setItem('supabase_user', JSON.stringify(data.user));
                    return { data: { user: data.user }, error: null };
                } else {
                    return { data: null, error: data };
                }
            },
            
            async signOut() {
                localStorage.removeItem('supabase_auth_token');
                localStorage.removeItem('supabase_user');
                return { error: null };
            },
            
            async resetPasswordForEmail(email) {
                const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                return response.ok ? { error: null } : { error: data };
            },
            
            async updateUser(attributes) {
                const token = localStorage.getItem('supabase_auth_token');
                if (!token) return { error: { message: 'Not authenticated' } };
                
                const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(attributes)
                });
                
                const data = await response.json();
                return response.ok ? { data: { user: data }, error: null } : { data: null, error: data };
            },
            
            getUser() {
                const token = localStorage.getItem('supabase_auth_token');
                const user = localStorage.getItem('supabase_user');
                
                if (token && user) {
                    return { data: { user: JSON.parse(user) }, error: null };
                }
                return { data: { user: null }, error: null };
            }
        }
    };
    
    // DOM Elements
    const loadingOverlay = document.getElementById('loading-overlay');
    const authMessage = document.getElementById('auth-message');
    const loginForm = document.getElementById('login-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login-link');
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function showLoading() {
        loadingOverlay?.classList.add('active');
    }
    
    function hideLoading() {
        loadingOverlay?.classList.remove('active');
    }
    
    function showMessage(message, type = 'info') {
        if (!authMessage) return;
        
        authMessage.textContent = message;
        authMessage.className = `auth-message show ${type}`;
        
        // Auto-hide after 5 seconds for success/info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                authMessage.classList.remove('show');
            }, 5000);
        }
    }
    
    function hideMessage() {
        authMessage?.classList.remove('show');
    }
    
    function showForm(formToShow) {
        const forms = [loginForm, forgotPasswordForm, resetPasswordForm];
        forms.forEach(form => {
            if (form) {
                form.classList.add('hidden');
            }
        });
        
        if (formToShow) {
            formToShow.classList.remove('hidden');
        }
        
        hideMessage();
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function getPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    }
    
    // ============================================
    // AUTHENTICATION FUNCTIONS
    // ============================================
    
    async function handleLogin(email, password) {
        try {
            showLoading();
            hideMessage();
            
            if (!isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                throw new Error(error.message || 'Login failed');
            }
            
            showMessage('Login successful! Redirecting to admin panel...', 'success');
            
            // Redirect to admin panel after short delay
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    async function handleForgotPassword(email) {
        try {
            showLoading();
            hideMessage();
            
            if (!isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            
            if (error) {
                throw new Error(error.message || 'Failed to send reset email');
            }
            
            showMessage('Password reset email sent! Check your inbox.', 'success');
            
            // Switch back to login form after delay
            setTimeout(() => {
                showForm(loginForm);
            }, 3000);
            
        } catch (error) {
            console.error('Password reset error:', error);
            showMessage(error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    async function handlePasswordUpdate(newPassword, confirmPassword) {
        try {
            showLoading();
            hideMessage();
            
            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            if (newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }
            
            if (getPasswordStrength(newPassword) < 3) {
                throw new Error('Password is too weak. Include uppercase, lowercase, numbers, and symbols.');
            }
            
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) {
                throw new Error(error.message || 'Failed to update password');
            }
            
            showMessage('Password updated successfully! You can now log in.', 'success');
            
            // Switch to login form after delay
            setTimeout(() => {
                showForm(loginForm);
            }, 2000);
            
        } catch (error) {
            console.error('Password update error:', error);
            showMessage(error.message, 'error');
        } finally {
            hideLoading();
        }
    }
    
    // ============================================
    // AUTH STATE MANAGEMENT
    // ============================================
    
    function checkAuthState() {
        const { data } = supabase.auth.getUser();
        
        if (data.user) {
            // User is already logged in
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'admin.html';
            }
            return true;
        }
        
        return false;
    }
    
    function requireAuth() {
        const { data } = supabase.auth.getUser();
        
        if (!data.user) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    // Login form submission
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        handleLogin(email, password);
    });
    
    // Forgot password form submission
    forgotPasswordForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('reset-email').value.trim();
        handleForgotPassword(email);
    });
    
    // Reset password form submission
    resetPasswordForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        handlePasswordUpdate(newPassword, confirmPassword);
    });
    
    // Form navigation
    forgotPasswordLink?.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(forgotPasswordForm);
    });
    
    backToLoginLink?.addEventListener('click', function(e) {
        e.preventDefault();
        showForm(loginForm);
    });
    
    // Password strength indicator
    const newPasswordInput = document.getElementById('new-password');
    if (newPasswordInput) {
        // Add password strength indicator
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = '<div class="password-strength-bar"></div>';
        newPasswordInput.parentNode.appendChild(strengthIndicator);
        
        const strengthBar = strengthIndicator.querySelector('.password-strength-bar');
        
        newPasswordInput.addEventListener('input', function() {
            const strength = getPasswordStrength(this.value);
            const strengthClasses = ['weak', 'fair', 'good', 'strong'];
            
            strengthBar.className = 'password-strength-bar';
            if (strength > 0) {
                strengthBar.classList.add(strengthClasses[Math.min(strength - 1, 3)]);
            }
        });
    }
    
    // ============================================
    // URL PARAMETER HANDLING
    // ============================================
    
    // Check for password reset token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('access_token');
    const type = urlParams.get('type');
    
    if (type === 'recovery' && resetToken) {
        // Show password reset form
        showForm(resetPasswordForm);
        showMessage('Enter your new password below.', 'info');
    }
    
    // ============================================
    // GLOBAL FUNCTIONS
    // ============================================
    
    window.logout = async function() {
        try {
            showLoading();
            
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                throw error;
            }
            
            showMessage('Logged out successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Logout error:', error);
            showMessage('Error logging out', 'error');
        } finally {
            hideLoading();
        }
    };
    
    window.requireAuth = requireAuth;
    window.checkAuthState = checkAuthState;
    window.supabaseAuth = supabase.auth;
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    // Check auth state on page load
    if (window.location.pathname.includes('login.html')) {
        checkAuthState();
    }
    
    // Auto-focus first input
    const firstInput = document.querySelector('input[type="email"]');
    if (firstInput) {
        firstInput.focus();
    }
    
    console.log('Authentication system initialized');
    
});
