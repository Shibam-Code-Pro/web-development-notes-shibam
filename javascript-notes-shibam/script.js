// DOM Elements
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('searchInput');
const chapterList = document.getElementById('chapterList');

// Sidebar Toggle Functions
function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    if (window.innerWidth < 1024) {
        trapFocus(sidebar);
        closeSidebar.focus();
    }
    setTimeout(() => {
        sidebar.classList.add('slide-in');
    }, 10);
}

function closeSidebarFunc() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    if (window.innerWidth < 1024) {
        hamburger.focus();
    }
}

function toggleSidebar() {
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    if (isOpen) {
        closeSidebarFunc();
    } else {
        openSidebar();
    }
}

// Focus trap function
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
}

// Event Listeners
hamburger.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarFunc);
overlay.addEventListener('click', closeSidebarFunc);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSidebarFunc();
    }
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const chapters = chapterList.querySelectorAll('li');
    
    chapters.forEach(chapter => {
        const link = chapter.querySelector('a');
        const chapterText = link.textContent.toLowerCase();
        const chapterData = link.getAttribute('data-chapter').toLowerCase();
        
        if (chapterText.includes(searchTerm) || chapterData.includes(searchTerm)) {
            chapter.style.display = 'block';
        } else {
            chapter.style.display = 'none';
        }
    });
});

// Copy code functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-btn')) {
        const codeId = e.target.getAttribute('data-copy');
        const codeElement = document.getElementById(codeId);
        
        if (codeElement) {
            const code = codeElement.textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                // Show feedback
                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                e.target.classList.add('copy-feedback');
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.classList.remove('copy-feedback');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                e.target.textContent = 'Failed';
                setTimeout(() => {
                    e.target.textContent = 'Copy';
                }, 2000);
            });
        }
    }
});

// Quiz functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quiz-option')) {
        const quizContainer = e.target.closest('.bg-gray-800');
        const options = quizContainer.querySelectorAll('.quiz-option');
        const feedback = quizContainer.querySelector('.quiz-feedback');
        const isCorrect = e.target.getAttribute('data-correct') === 'true';
        
        // Remove previous selections
        options.forEach(option => {
            option.classList.remove('bg-green-600', 'bg-red-600', 'bg-gray-600');
            option.classList.add('bg-gray-700');
        });
        
        // Show correct/incorrect
        if (isCorrect) {
            e.target.classList.remove('bg-gray-700');
            e.target.classList.add('bg-green-600');
            feedback.innerHTML = '<p class="text-green-400 text-sm">✅ Correct! Well done.</p>';
        } else {
            e.target.classList.remove('bg-gray-700');
            e.target.classList.add('bg-red-600');
            
            // Highlight correct answer
            options.forEach(option => {
                if (option.getAttribute('data-correct') === 'true') {
                    option.classList.remove('bg-gray-700');
                    option.classList.add('bg-green-600');
                }
            });
            
            feedback.innerHTML = '<p class="text-red-400 text-sm">❌ Incorrect. The correct answer is highlighted in green.</p>';
        }
        
        feedback.classList.remove('hidden');
        
        // Disable all options after selection
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all scroll-animate elements
document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-fade').forEach(el => {
    observer.observe(el);
});

// Active chapter highlighting
function updateActiveChapter() {
    const sections = document.querySelectorAll('section[id^="chapter"]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get current hash from URL if present
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            // Update active link based on URL hash
            navLinks.forEach(link => {
                link.classList.remove('bg-teal-600', 'text-white');
                if (link.getAttribute('href') === hash) {
                    link.classList.add('bg-teal-600', 'text-white');
                }
            });
            return;
        }
    }
    
    // Handle scroll-based highlighting
    const headerHeight = document.getElementById('header').offsetHeight;
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
            // Update URL without triggering scroll
            history.replaceState(null, '', `#${current}`);
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('bg-teal-600', 'text-white');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('bg-teal-600', 'text-white');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Update URL and trigger active chapter update
            history.pushState(null, '', this.getAttribute('href'));
            updateActiveChapter();
            
            // Calculate proper scroll position accounting for fixed header
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra padding
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 1024) {
                closeSidebarFunc();
            }
        }
    });
});

// Update active chapter on scroll
window.addEventListener('scroll', updateActiveChapter);

// Initial call to set active chapter
updateActiveChapter();

// Additional keyboard navigation
document.addEventListener('keydown', function(e) {
    // Alt + S to focus search
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Alt + M to toggle sidebar
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        toggleSidebar();
    }
});

// Add loading animation to fade-in elements
setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}, 100);
