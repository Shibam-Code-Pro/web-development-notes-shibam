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

// Focus Trapping for Accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
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
        }
    });
}

// Search Functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();
        const chapters = chapterList.querySelectorAll('li');
        
        chapters.forEach(chapter => {
            const link = chapter.querySelector('a');
            const chapterText = link.getAttribute('data-chapter').toLowerCase();
            const chapterTitle = link.textContent.toLowerCase();
            
            if (chapterText.includes(searchTerm) || chapterTitle.includes(searchTerm)) {
                chapter.style.display = 'block';
            } else {
                chapter.style.display = 'none';
            }
        });
    }, 300);
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Update URL and trigger the active link update
            history.pushState(null, '', targetId);
            updateActiveNavLink();
            
            // Use native scroll behavior - let CSS scroll-mt handle the offset
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            if (window.innerWidth < 1024) {
                closeSidebarFunc();
            }
        }
    });
});

// Copy to Clipboard Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
        const codeId = e.target.getAttribute('data-copy');
        const codeElement = document.getElementById(codeId);
        
        if (codeElement) {
            const textToCopy = codeElement.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                e.target.classList.add('copy-feedback');
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.classList.remove('copy-feedback');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                e.target.textContent = 'Error';
                setTimeout(() => {
                    e.target.textContent = 'Copy';
                }, 2000);
            });
        }
    }
});

// Quiz Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quiz-option')) {
        const quizContainer = e.target.closest('.bg-gray-800');
        const options = quizContainer.querySelectorAll('.quiz-option');
        const feedback = quizContainer.querySelector('.quiz-feedback');
        const isCorrect = e.target.getAttribute('data-correct') === 'true';
        
        // Reset all options
        options.forEach(option => {
            option.classList.remove('bg-green-600', 'bg-red-600', 'hover:bg-gray-600');
            option.classList.add('hover:bg-gray-600');
        });
        
        // Style the clicked option
        if (isCorrect) {
            e.target.classList.remove('hover:bg-gray-600');
            e.target.classList.add('bg-green-600');
            feedback.innerHTML = '<p class="text-green-400 font-medium">✅ Correct! Great job!</p>';
        } else {
            e.target.classList.remove('hover:bg-gray-600');
            e.target.classList.add('bg-red-600');
            feedback.innerHTML = '<p class="text-red-400 font-medium">❌ Incorrect. Try again!</p>';
            
            // Show correct answer after a delay
            setTimeout(() => {
                options.forEach(option => {
                    if (option.getAttribute('data-correct') === 'true') {
                        option.classList.remove('hover:bg-gray-600');
                        option.classList.add('bg-green-600');
                    }
                });
                feedback.innerHTML += '<p class="text-green-400 font-medium mt-2">✅ The correct answer is highlighted above.</p>';
            }, 1500);
        }
        
        feedback.classList.remove('hidden');
        
        // Disable all options after selection
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
    }
});

// Scroll Animations
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
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
    animateElements.forEach(el => observer.observe(el));
});

// Active Navigation Link Highlighting
function updateActiveNavLink() {
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
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
            // Update URL without triggering scroll
            history.replaceState(null, '', `#${currentSection}`);
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('bg-teal-600', 'text-white');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('bg-teal-600', 'text-white');
        }
    });
}

// Throttled scroll event for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavLink, 50);
});

// Window Resize Handler
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        // Desktop view - ensure sidebar is visible and overlay is hidden
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        sidebar.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'true');
    } else {
        // Mobile view - ensure sidebar is hidden unless explicitly opened
        if (!sidebar.classList.contains('-translate-x-full')) {
            // Only close if it was opened via hamburger menu
            closeSidebarFunc();
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure proper initial state
    if (window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        sidebar.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
    } else {
        sidebar.classList.remove('-translate-x-full');
        sidebar.setAttribute('aria-hidden', 'false');
    }
    
    // Initialize active nav link
    updateActiveNavLink();
});
