
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'var(--white)';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = 'var(--shadow)';
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Modal functionality
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(loginModal);
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(registerModal);
        });
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Form submissions
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const question = document.getElementById('question').value;
            const category = document.getElementById('category').value;
            
            // Check if user is logged in (in real app, check authentication)
            const isLoggedIn = false; // This would come from your auth system
            
            if (!isLoggedIn) {
                alert('Please login to ask a question');
                openModal(loginModal);
                return;
            }
            
            // In a real app, you would send this to your backend
            console.log('Question submitted:', { question, category });
            
            alert('Question submitted successfully! An admin will respond soon.');
            questionForm.reset();
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // This is a simulation - in real app, call your API
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    closeModal(loginModal);
                    alert('Login successful!');
                    // Update UI for logged in user
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // This is a simulation - in real app, call your API
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                if (response.ok) {
                    closeModal(registerModal);
                    alert('Registration successful! Please login.');
                } else {
                    alert('Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
    
    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
