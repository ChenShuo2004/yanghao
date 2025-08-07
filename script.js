// DOM Elements
const loadingOverlay = document.querySelector('.loading-overlay');
const scrollProgress = document.querySelector('.scroll-progress');
const scrollToTopBtn = document.querySelector('.scroll-to-top');
const header = document.querySelector('.header');

// Loading Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }, 1500);
});

// Scroll Progress Bar
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }
}

// Scroll to Top Button
function toggleScrollToTop() {
    if (scrollToTopBtn) {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
}

// Header Scroll Effect
function updateHeader() {
    if (header) {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Scroll Event Listener
window.addEventListener('scroll', () => {
    updateScrollProgress();
    toggleScrollToTop();
    updateHeader();
});

// Scroll to Top Click Handler
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
});

// Configuration Form Functionality
class ConfigManager {
    constructor() {
        this.config = {
            window: {
                width: 1280,
                height: 720
            },
            times: {
                watch_time_min: 30,
                watch_time_max: 180,
                like_delay_min: 5,
                like_delay_max: 15,
                subscribe_delay_min: 10,
                subscribe_delay_max: 25
            },
            probabilities: {
                like_probability: 0.7,
                subscribe_probability: 0.3,
                comment_probability: 0.1
            },
            behavior: {
                scroll_count: 3,
                mouse_speed: 'medium',
                scroll_pattern: 'natural',
                pause_probability: 0.2,
                replay_probability: 0.1
            },
            browser_ids: ['default'],
            user_persona: 'casual_viewer'
        };
        
        this.initializeForm();
        this.bindEvents();
        this.updatePreview();
    }

    initializeForm() {
        // Window settings
        this.setInputValue('window-width', this.config.window.width);
        this.setInputValue('window-height', this.config.window.height);
        
        // Time settings
        this.setInputValue('watch-time-min', this.config.times.watch_time_min);
        this.setInputValue('watch-time-max', this.config.times.watch_time_max);
        this.setInputValue('like-delay-min', this.config.times.like_delay_min);
        this.setInputValue('like-delay-max', this.config.times.like_delay_max);
        this.setInputValue('subscribe-delay-min', this.config.times.subscribe_delay_min);
        this.setInputValue('subscribe-delay-max', this.config.times.subscribe_delay_max);
        
        // Probabilities
        this.setInputValue('like-probability', this.config.probabilities.like_probability);
        this.setInputValue('subscribe-probability', this.config.probabilities.subscribe_probability);
        this.setInputValue('comment-probability', this.config.probabilities.comment_probability);
        
        // Behavior settings
        this.setInputValue('scroll-count', this.config.behavior.scroll_count);
        this.setSelectValue('mouse-speed', this.config.behavior.mouse_speed);
        this.setSelectValue('scroll-pattern', this.config.behavior.scroll_pattern);
        this.setInputValue('pause-probability', this.config.behavior.pause_probability);
        this.setInputValue('replay-probability', this.config.behavior.replay_probability);
        
        // User persona
        this.setSelectValue('user-persona', this.config.user_persona);
        
        // Browser IDs
        this.updateBrowserIdsList();
    }

    setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
            // Update range display if it's a range input
            const display = document.getElementById(id + '-display');
            if (display) {
                display.textContent = value;
            }
        }
    }

    setSelectValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    }

    bindEvents() {
        // Form input events
        const inputs = document.querySelectorAll('.config-form input, .config-form select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateConfig());
            input.addEventListener('change', () => this.updateConfig());
        });

        // Range input display updates
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const display = document.getElementById(e.target.id + '-display');
                if (display) {
                    display.textContent = e.target.value;
                }
            });
        });

        // Button events
        const generateBtn = document.getElementById('generate-config');
        const downloadBtn = document.getElementById('download-config');
        const resetBtn = document.getElementById('reset-config');
        const addBrowserIdBtn = document.getElementById('add-browser-id');

        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateConfig());
        }
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadConfig());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetConfig());
        }
        if (addBrowserIdBtn) {
            addBrowserIdBtn.addEventListener('click', () => this.addBrowserId());
        }

        // File upload
        const fileInput = document.getElementById('config-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.loadConfigFile(e));
        }
    }

    updateConfig() {
        // Window settings
        this.config.window.width = parseInt(document.getElementById('window-width')?.value) || 1280;
        this.config.window.height = parseInt(document.getElementById('window-height')?.value) || 720;
        
        // Time settings
        this.config.times.watch_time_min = parseInt(document.getElementById('watch-time-min')?.value) || 30;
        this.config.times.watch_time_max = parseInt(document.getElementById('watch-time-max')?.value) || 180;
        this.config.times.like_delay_min = parseInt(document.getElementById('like-delay-min')?.value) || 5;
        this.config.times.like_delay_max = parseInt(document.getElementById('like-delay-max')?.value) || 15;
        this.config.times.subscribe_delay_min = parseInt(document.getElementById('subscribe-delay-min')?.value) || 10;
        this.config.times.subscribe_delay_max = parseInt(document.getElementById('subscribe-delay-max')?.value) || 25;
        
        // Probabilities
        this.config.probabilities.like_probability = parseFloat(document.getElementById('like-probability')?.value) || 0.7;
        this.config.probabilities.subscribe_probability = parseFloat(document.getElementById('subscribe-probability')?.value) || 0.3;
        this.config.probabilities.comment_probability = parseFloat(document.getElementById('comment-probability')?.value) || 0.1;
        
        // Behavior settings
        this.config.behavior.scroll_count = parseInt(document.getElementById('scroll-count')?.value) || 3;
        this.config.behavior.mouse_speed = document.getElementById('mouse-speed')?.value || 'medium';
        this.config.behavior.scroll_pattern = document.getElementById('scroll-pattern')?.value || 'natural';
        this.config.behavior.pause_probability = parseFloat(document.getElementById('pause-probability')?.value) || 0.2;
        this.config.behavior.replay_probability = parseFloat(document.getElementById('replay-probability')?.value) || 0.1;
        
        // User persona
        this.config.user_persona = document.getElementById('user-persona')?.value || 'casual_viewer';
        
        // Browser IDs
        this.updateBrowserIdsFromForm();
        
        this.updatePreview();
    }

    updateBrowserIdsList() {
        const container = document.getElementById('browser-ids-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.config.browser_ids.forEach((id, index) => {
            const item = document.createElement('div');
            item.className = 'browser-id-item';
            item.innerHTML = `
                <input type="text" class="browser-id-input" value="${id}" data-index="${index}">
                ${this.config.browser_ids.length > 1 ? `<button type="button" class="btn-remove" onclick="configManager.removeBrowserId(${index})">删除</button>` : ''}
            `;
            container.appendChild(item);
        });
        
        // Bind events for browser ID inputs
        const inputs = container.querySelectorAll('.browser-id-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateBrowserIdsFromForm());
        });
    }

    updateBrowserIdsFromForm() {
        const inputs = document.querySelectorAll('.browser-id-input');
        this.config.browser_ids = Array.from(inputs).map(input => input.value || 'default');
    }

    addBrowserId() {
        this.config.browser_ids.push('new_id_' + (this.config.browser_ids.length + 1));
        this.updateBrowserIdsList();
        this.updatePreview();
    }

    removeBrowserId(index) {
        if (this.config.browser_ids.length > 1) {
            this.config.browser_ids.splice(index, 1);
            this.updateBrowserIdsList();
            this.updatePreview();
        }
    }

    updatePreview() {
        const preview = document.getElementById('config-preview');
        if (preview) {
            preview.textContent = JSON.stringify(this.config, null, 2);
        }
    }

    generateConfig() {
        this.updateConfig();
        this.showNotification('配置已生成！', 'success');
    }

    downloadConfig() {
        this.updateConfig();
        const dataStr = JSON.stringify(this.config, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.showNotification('配置文件已下载！', 'success');
    }

    resetConfig() {
        this.config = {
            window: {
                width: 1280,
                height: 720
            },
            times: {
                watch_time_min: 30,
                watch_time_max: 180,
                like_delay_min: 5,
                like_delay_max: 15,
                subscribe_delay_min: 10,
                subscribe_delay_max: 25
            },
            probabilities: {
                like_probability: 0.7,
                subscribe_probability: 0.3,
                comment_probability: 0.1
            },
            behavior: {
                scroll_count: 3,
                mouse_speed: 'medium',
                scroll_pattern: 'natural',
                pause_probability: 0.2,
                replay_probability: 0.1
            },
            browser_ids: ['default'],
            user_persona: 'casual_viewer'
        };
        this.initializeForm();
        this.showNotification('配置已重置！', 'info');
    }

    loadConfigFile(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    this.config = { ...this.config, ...config };
                    this.initializeForm();
                    this.showNotification('配置文件已加载！', 'success');
                } catch (error) {
                    this.showNotification('配置文件格式错误！', 'error');
                }
            };
            reader.readAsText(file);
        } else {
            this.showNotification('请选择有效的JSON文件！', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = '#238636';
                break;
            case 'error':
                notification.style.background = '#da3633';
                break;
            case 'info':
            default:
                notification.style.background = '#58a6ff';
                break;
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize config manager on pages that have the config form
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.config-form')) {
        window.configManager = new ConfigManager();
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Dynamic stats animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number, .hero-stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        if (finalValue > 0) {
            let currentValue = 0;
            const increment = finalValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                
                // Format number with appropriate suffix
                let displayValue = Math.floor(currentValue);
                if (finalValue >= 1000000) {
                    displayValue = (currentValue / 1000000).toFixed(1) + 'M';
                } else if (finalValue >= 1000) {
                    displayValue = (currentValue / 1000).toFixed(1) + 'K';
                } else {
                    displayValue = Math.floor(currentValue).toString();
                }
                
                stat.textContent = displayValue;
            }, 50);
        }
    });
}

// Trigger stats animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
    
    // Space or Enter to scroll to top
    if ((e.key === ' ' || e.key === 'Enter') && e.target === scrollToTopBtn) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateScrollProgress();
    toggleScrollToTop();
    updateHeader();
}, 16)); // ~60fps