document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Management ---
    const htmlEl = document.documentElement;
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    
    // Load saved preferences
    const savedTheme = localStorage.getItem('lumalab_theme') || 'light';
    const savedDir = localStorage.getItem('lumalab_dir') || 'ltr';
    
    if (savedTheme === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
        updateThemeIcons('dark');
    }
    
    if (savedDir === 'rtl') {
        htmlEl.setAttribute('dir', 'rtl');
    }

    // Toggle Theme
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            if (newTheme === 'dark') {
                htmlEl.setAttribute('data-theme', 'dark');
            } else {
                htmlEl.removeAttribute('data-theme');
            }
            
            localStorage.setItem('lumalab_theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });
    
    function updateThemeIcons(theme) {
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // Toggle RTL
    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentDir = htmlEl.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            
            htmlEl.setAttribute('dir', newDir);
            localStorage.setItem('lumalab_dir', newDir);
        });
    });

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger counter animation if it's the technology section
                if (entry.target.classList.contains('section-3')) {
                    startCounters();
                }
                
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Counter Animation ---
    let countersStarted = false;
    
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        
        const counters = document.querySelectorAll('.stat-num');
        const duration = 2000; // 2 seconds
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = counter.hasAttribute('data-decimal');
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = target * easeProgress;
                
                if (isDecimal) {
                    counter.innerText = currentVal.toFixed(1);
                } else {
                    counter.innerText = Math.floor(currentVal);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = isDecimal ? target.toFixed(1) : target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // --- Active Nav Link on Scroll ---
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    function updateActiveLink() {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 50;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // initial call

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetEl = document.querySelector(href);
            if (targetEl) {
                e.preventDefault();
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission (Prevent default for demo)
    const bookingForm = document.querySelector('.booking-form');
    if(bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Requesting...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-success');
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.add('btn-primary');
                    btn.classList.remove('btn-success');
                    btn.disabled = false;
                    bookingForm.reset();
                }, 3000);
            }, 1500);
        });
    }
});
