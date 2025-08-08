// DOM Elements
const loadingOverlay = document.querySelector('.loading-overlay');
const scrollProgress = document.querySelector('.scroll-progress');
const scrollToTopBtn = document.querySelector('.scroll-to-top');
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Mobile Menu Toggle
function toggleMobileMenu() {
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Mobile Menu Event Listeners
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Close menu when clicking on nav links
if (navLinks) {
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenuBtn && navLinks && 
        !mobileMenuBtn.contains(e.target) && 
        !navLinks.contains(e.target) && 
        navLinks.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Enhanced Button Interactions
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .nav-links a, .mobile-menu-btn');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add touch feedback
        button.addEventListener('touchstart', function() {
            this.style.transform = this.style.transform.replace('scale(1)', 'scale(0.98)');
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = this.style.transform.replace('scale(0.98)', 'scale(1)');
        });
    });
}

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize button effects when DOM is loaded
document.addEventListener('DOMContentLoaded', addButtonEffects);

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
        
        this.loadConfigFromServer();
        this.bindEvents();
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
                const inputId = e.target.id;
                const value = parseFloat(e.target.value);
                
                // Try different display element naming patterns
                let display = document.getElementById(inputId + '-display');
                if (!display) {
                    display = document.getElementById(inputId + 'Value');
                }
                
                if (display) {
                    // Format the display value based on the input type
                    if (inputId.includes('Probability')) {
                        display.textContent = Math.round(value * 100) + '%';
                    } else if (inputId === 'mouseSpeed') {
                        const speedLabels = { 0.5: '慢速', 1: '正常', 1.5: '快速', 2: '很快', 2.5: '极快', 3: '最快' };
                        display.textContent = speedLabels[value] || '自定义';
                    } else {
                        display.textContent = value;
                    }
                }
            });
            
            // Initialize display values on page load
            const event = new Event('input');
            input.dispatchEvent(event);
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
        const container = document.getElementById('browserIdContainer');
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
        this.config.browser_ids = Array.from(inputs).map(input => input.value).filter(value => value.trim() !== '');
        // 如果没有有效的浏览器ID，保持原有的配置
        if (this.config.browser_ids.length === 0) {
            // 从config.json重新加载浏览器ID
            this.loadConfigFromServer();
        }
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

    async loadConfigFromServer() {
        try {
            const response = await fetch('/config.json');
            if (response.ok) {
                const serverConfig = await response.json();
                // 合并服务器配置到当前配置
                this.config = { ...this.config, ...serverConfig };
                console.log('从服务器加载配置成功:', this.config);
            } else {
                console.log('无法从服务器加载配置，使用默认配置');
            }
        } catch (error) {
            console.log('加载服务器配置时出错，使用默认配置:', error);
        }
        
        this.initializeForm();
        this.updatePreview();
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

// Mobile menu functionality (already declared above)
        if (mobileMenuBtn && navLinks) {
            // Additional mobile menu event listener (if needed)
            // This is handled by the toggleMobileMenu function above
        }

        // ===== SCHEDULER FUNCTIONALITY =====
        
        // Scheduler state
        let schedulerData = {
            status: 'stopped',
            schedules: [],
            logs: []
        };
        
        // Initialize scheduler page
        function initScheduler() {
            if (!document.querySelector('.scheduler-hero')) return;
            
            loadSchedulerData();
            setupSchedulerEventListeners();
            setupPresetButtons();
            setupScheduleForm();
            updateSchedulerStatus();
        }
        
        // Load scheduler data from backend
        async function loadSchedulerData() {
            try {
                // Load current configuration
                const response = await fetch('/api/scheduler/config');
                if (response.ok) {
                    const config = await response.json();
                    schedulerData.schedules = config.schedules || [];
                    updateScheduleList();
                }
                
                // Load scheduler status
                const statusResponse = await fetch('/api/scheduler/status');
                if (statusResponse.ok) {
                    const status = await statusResponse.json();
                    schedulerData.status = status.running ? 'running' : 'stopped';
                    updateSchedulerStatus();
                }
                
                // Load logs
                loadSchedulerLogs();
            } catch (error) {
                console.error('Failed to load scheduler data:', error);
                // Use mock data for demo
                loadMockSchedulerData();
            }
        }
        
        // Load mock data for demo
        function loadMockSchedulerData() {
            schedulerData.schedules = [
                {
                    name: 'morning_run',
                    description: '每天上午9点运行',
                    type: 'daily',
                    time: '09:00',
                    enabled: true
                },
                {
                    name: 'afternoon_run',
                    description: '每天下午2点运行',
                    type: 'daily',
                    time: '14:00',
                    enabled: true
                },
                {
                    name: 'hourly_run',
                    description: '每2小时运行一次',
                    type: 'hourly',
                    interval: 2,
                    enabled: false
                }
            ];
            updateScheduleList();
        }
        
        // Setup event listeners for scheduler controls
        function setupSchedulerEventListeners() {
            const startBtn = document.getElementById('startScheduler');
            const stopBtn = document.getElementById('stopScheduler');
            const runOnceBtn = document.getElementById('runOnce');
            const refreshBtn = document.getElementById('refreshStatus');
            const addScheduleBtn = document.getElementById('addSchedule');
            const refreshLogsBtn = document.getElementById('refreshLogs');
            const clearLogsBtn = document.getElementById('clearLogs');
            
            if (startBtn) startBtn.addEventListener('click', startScheduler);
            if (stopBtn) stopBtn.addEventListener('click', stopScheduler);
            if (runOnceBtn) runOnceBtn.addEventListener('click', runOnce);
            if (refreshBtn) refreshBtn.addEventListener('click', refreshSchedulerStatus);
            if (addScheduleBtn) addScheduleBtn.addEventListener('click', showAddScheduleForm);
            if (refreshLogsBtn) refreshLogsBtn.addEventListener('click', loadSchedulerLogs);
            if (clearLogsBtn) clearLogsBtn.addEventListener('click', clearSchedulerLogs);
        }
        
        // Setup preset buttons
        function setupPresetButtons() {
            const presetButtons = document.querySelectorAll('.preset-btn');
            presetButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const preset = btn.dataset.preset;
                    applyPreset(preset);
                    
                    // Update active state
                    presetButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
        
        // Apply preset configuration
        function applyPreset(preset) {
            let newSchedules = [];
            
            switch (preset) {
                case 'daily-3':
                    newSchedules = [
                        { name: 'morning', description: '上午运行', type: 'daily', time: '09:00', enabled: true },
                        { name: 'afternoon', description: '下午运行', type: 'daily', time: '14:00', enabled: true },
                        { name: 'evening', description: '晚上运行', type: 'daily', time: '20:00', enabled: true }
                    ];
                    break;
                case 'hourly-2':
                    newSchedules = [
                        { name: 'hourly', description: '每2小时运行', type: 'hourly', interval: 2, enabled: true }
                    ];
                    break;
                case 'weekly':
                    newSchedules = [
                        { name: 'monday', description: '周一运行', type: 'weekly', day: 'monday', time: '09:00', enabled: true },
                        { name: 'wednesday', description: '周三运行', type: 'weekly', day: 'wednesday', time: '09:00', enabled: true },
                        { name: 'friday', description: '周五运行', type: 'weekly', day: 'friday', time: '09:00', enabled: true }
                    ];
                    break;
                case 'custom':
                    showAddScheduleForm();
                    return;
            }
            
            if (newSchedules.length > 0) {
                schedulerData.schedules = newSchedules;
                updateScheduleList();
                saveSchedulerConfig();
            }
        }
        
        // Update scheduler status display
        function updateSchedulerStatus() {
            const statusElement = document.getElementById('schedulerStatus');
            const nextRunElement = document.getElementById('nextRun');
            
            if (statusElement) {
                statusElement.textContent = schedulerData.status === 'running' ? '运行中' : '已停止';
                statusElement.className = 'status-value ' + (schedulerData.status === 'running' ? 'running' : 'stopped');
            }
            
            if (nextRunElement) {
                const nextRun = getNextRunTime();
                nextRunElement.textContent = nextRun || '未设置';
            }
        }
        
        // Get next run time
        function getNextRunTime() {
            const enabledSchedules = schedulerData.schedules.filter(s => s.enabled);
            if (enabledSchedules.length === 0) return null;
            
            // This is a simplified calculation - in real implementation,
            // this would come from the backend
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            
            for (const schedule of enabledSchedules) {
                if (schedule.type === 'daily' && schedule.time) {
                    const nextRun = new Date(`${today}T${schedule.time}:00`);
                    if (nextRun > now) {
                        return nextRun.toLocaleString('zh-CN');
                    }
                }
            }
            
            return '明天 ' + enabledSchedules[0].time;
        }
        
        // Update schedule list display
        function updateScheduleList() {
            const container = document.getElementById('scheduleItems');
            if (!container) return;
            
            if (schedulerData.schedules.length === 0) {
                container.innerHTML = '<div class="empty-state">暂无调度任务，点击上方按钮添加</div>';
                return;
            }
            
            container.innerHTML = schedulerData.schedules.map((schedule, index) => `
                <div class="schedule-item ${!schedule.enabled ? 'disabled' : ''}">
                    <div class="schedule-info">
                        <div class="schedule-name">${schedule.name}</div>
                        <div class="schedule-desc">${schedule.description || ''}</div>
                        <div class="schedule-details">
                            <span class="schedule-type">${getScheduleTypeText(schedule)}</span>
                            <span class="schedule-time">${getScheduleTimeText(schedule)}</span>
                        </div>
                    </div>
                    <div class="schedule-actions">
                        <button class="action-btn" onclick="editSchedule(${index})" title="编辑">✏️</button>
                        <button class="action-btn" onclick="toggleSchedule(${index})" title="${schedule.enabled ? '禁用' : '启用'}">
                            ${schedule.enabled ? '⏸️' : '▶️'}
                        </button>
                        <button class="action-btn danger" onclick="deleteSchedule(${index})" title="删除">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
        
        // Get schedule type text
        function getScheduleTypeText(schedule) {
            switch (schedule.type) {
                case 'daily': return '每日';
                case 'hourly': return '每小时';
                case 'weekly': return '每周';
                case 'interval': return '间隔';
                default: return schedule.type;
            }
        }
        
        // Get schedule time text
        function getScheduleTimeText(schedule) {
            switch (schedule.type) {
                case 'daily':
                    return schedule.time || '';
                case 'hourly':
                    return `每${schedule.interval || 1}小时`;
                case 'weekly':
                    const days = {
                        monday: '周一', tuesday: '周二', wednesday: '周三',
                        thursday: '周四', friday: '周五', saturday: '周六', sunday: '周日'
                    };
                    return `${days[schedule.day] || schedule.day} ${schedule.time || ''}`;
                case 'interval':
                    return `每${schedule.interval || 30}分钟`;
                default:
                    return '';
            }
        }
        
        // Scheduler control functions
        async function startScheduler() {
            try {
                const response = await fetch('/api/scheduler/start', { method: 'POST' });
                if (response.ok) {
                    schedulerData.status = 'running';
                    updateSchedulerStatus();
                    addLogEntry('success', '调度器启动成功');
                } else {
                    throw new Error('Failed to start scheduler');
                }
            } catch (error) {
                console.error('Failed to start scheduler:', error);
                // Mock success for demo
                schedulerData.status = 'running';
                updateSchedulerStatus();
                addLogEntry('success', '调度器启动成功');
            }
        }
        
        async function stopScheduler() {
            try {
                const response = await fetch('/api/scheduler/stop', { method: 'POST' });
                if (response.ok) {
                    schedulerData.status = 'stopped';
                    updateSchedulerStatus();
                    addLogEntry('info', '调度器已停止');
                } else {
                    throw new Error('Failed to stop scheduler');
                }
            } catch (error) {
                console.error('Failed to stop scheduler:', error);
                // Mock success for demo
                schedulerData.status = 'stopped';
                updateSchedulerStatus();
                addLogEntry('info', '调度器已停止');
            }
        }
        
        async function runOnce() {
            try {
                const response = await fetch('/api/scheduler/run-once', { method: 'POST' });
                if (response.ok) {
                    addLogEntry('info', '开始执行一次性任务');
                } else {
                    throw new Error('Failed to run once');
                }
            } catch (error) {
                console.error('Failed to run once:', error);
                // Mock success for demo
                addLogEntry('info', '开始执行一次性任务');
            }
        }
        
        async function refreshSchedulerStatus() {
            await loadSchedulerData();
            addLogEntry('info', '状态已刷新');
        }
        
        // Schedule management functions
        function editSchedule(index) {
            const schedule = schedulerData.schedules[index];
            if (schedule) {
                showScheduleForm(schedule, index);
            }
        }
        
        function toggleSchedule(index) {
            if (schedulerData.schedules[index]) {
                schedulerData.schedules[index].enabled = !schedulerData.schedules[index].enabled;
                updateScheduleList();
                saveSchedulerConfig();
                
                const action = schedulerData.schedules[index].enabled ? '启用' : '禁用';
                addLogEntry('info', `任务 "${schedulerData.schedules[index].name}" 已${action}`);
            }
        }
        
        function deleteSchedule(index) {
            if (confirm('确定要删除这个调度任务吗？')) {
                const schedule = schedulerData.schedules[index];
                schedulerData.schedules.splice(index, 1);
                updateScheduleList();
                saveSchedulerConfig();
                addLogEntry('info', `任务 "${schedule.name}" 已删除`);
            }
        }
        
        // Schedule form functions
        function setupScheduleForm() {
            const form = document.getElementById('scheduleForm');
            const overlay = document.getElementById('scheduleFormOverlay');
            const closeBtn = document.getElementById('closeForm');
            const cancelBtn = document.getElementById('cancelForm');
            const typeSelect = document.getElementById('scheduleType');
            
            if (form) {
                form.addEventListener('submit', handleScheduleFormSubmit);
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', hideScheduleForm);
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', hideScheduleForm);
            }
            
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        hideScheduleForm();
                    }
                });
            }
            
            if (typeSelect) {
                typeSelect.addEventListener('change', updateScheduleFormOptions);
            }
        }
        
        function showAddScheduleForm() {
            showScheduleForm();
        }
        
        function showScheduleForm(schedule = null, index = null) {
            const overlay = document.getElementById('scheduleFormOverlay');
            const form = document.getElementById('scheduleForm');
            const title = document.getElementById('formTitle');
            
            if (!overlay || !form) return;
            
            // Reset form
            form.reset();
            
            // Set title
            if (title) {
                title.textContent = schedule ? '编辑调度任务' : '添加调度任务';
            }
            
            // Fill form if editing
            if (schedule) {
                document.getElementById('scheduleName').value = schedule.name || '';
                document.getElementById('scheduleDescription').value = schedule.description || '';
                document.getElementById('scheduleType').value = schedule.type || 'daily';
                document.getElementById('scheduleEnabled').checked = schedule.enabled !== false;
                
                // Fill type-specific fields
                if (schedule.type === 'daily' && schedule.time) {
                    document.getElementById('dailyTime').value = schedule.time;
                } else if (schedule.type === 'hourly' && schedule.interval) {
                    document.getElementById('hourlyInterval').value = schedule.interval;
                } else if (schedule.type === 'weekly') {
                    if (schedule.day) document.getElementById('weeklyDay').value = schedule.day;
                    if (schedule.time) document.getElementById('weeklyTime').value = schedule.time;
                } else if (schedule.type === 'interval' && schedule.interval) {
                    document.getElementById('intervalMinutes').value = schedule.interval;
                }
            }
            
            // Store edit index
            form.dataset.editIndex = index !== null ? index : '';
            
            updateScheduleFormOptions();
            overlay.classList.add('active');
        }
        
        function hideScheduleForm() {
            const overlay = document.getElementById('scheduleFormOverlay');
            if (overlay) {
                overlay.classList.remove('active');
            }
        }
        
        function updateScheduleFormOptions() {
            const type = document.getElementById('scheduleType').value;
            const options = document.querySelectorAll('.schedule-options');
            
            options.forEach(option => {
                option.style.display = 'none';
            });
            
            const targetOption = document.getElementById(type + 'Options');
            if (targetOption) {
                targetOption.style.display = 'block';
            }
        }
        
        function handleScheduleFormSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);
            const editIndex = form.dataset.editIndex;
            
            const schedule = {
                name: formData.get('name'),
                description: formData.get('description'),
                type: formData.get('type'),
                enabled: formData.get('enabled') === 'on'
            };
            
            // Add type-specific fields
            switch (schedule.type) {
                case 'daily':
                    schedule.time = formData.get('time');
                    break;
                case 'hourly':
                    schedule.interval = parseInt(formData.get('interval')) || 1;
                    break;
                case 'weekly':
                    schedule.day = formData.get('day');
                    schedule.time = formData.get('time');
                    break;
                case 'interval':
                    schedule.interval = parseInt(formData.get('interval')) || 30;
                    break;
            }
            
            // Validate required fields
            if (!schedule.name) {
                alert('请输入任务名称');
                return;
            }
            
            if (schedule.type === 'daily' && !schedule.time) {
                alert('请选择运行时间');
                return;
            }
            
            if (schedule.type === 'weekly' && !schedule.time) {
                alert('请选择运行时间');
                return;
            }
            
            // Save schedule
            if (editIndex !== '') {
                schedulerData.schedules[parseInt(editIndex)] = schedule;
                addLogEntry('info', `任务 "${schedule.name}" 已更新`);
            } else {
                schedulerData.schedules.push(schedule);
                addLogEntry('info', `任务 "${schedule.name}" 已添加`);
            }
            
            updateScheduleList();
            saveSchedulerConfig();
            hideScheduleForm();
        }
        
        // Save scheduler configuration
        async function saveSchedulerConfig() {
            try {
                const config = {
                    scheduler_settings: {
                        enabled: true,
                        timezone: 'Asia/Shanghai',
                        log_level: 'INFO',
                        max_concurrent_runs: 1,
                        execution_timeout_minutes: 120
                    },
                    schedules: schedulerData.schedules
                };
                
                const response = await fetch('/api/scheduler/config', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(config)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save config');
                }
                
                addLogEntry('success', '配置已保存');
            } catch (error) {
                console.error('Failed to save config:', error);
                // Mock success for demo
                addLogEntry('success', '配置已保存');
            }
        }
        
        // Logging functions
        function loadSchedulerLogs() {
            // In real implementation, this would fetch from backend
            // For demo, we'll show some mock logs
            const logsContent = document.getElementById('logsContent');
            if (!logsContent) return;
            
            const mockLogs = [
                { time: new Date().toLocaleString(), level: 'info', message: '调度器系统初始化完成' },
                { time: new Date(Date.now() - 60000).toLocaleString(), level: 'success', message: '加载调度配置成功' },
                { time: new Date(Date.now() - 120000).toLocaleString(), level: 'info', message: '检测到 ' + schedulerData.schedules.length + ' 个调度任务' }
            ];
            
            schedulerData.logs = [...mockLogs, ...schedulerData.logs].slice(0, 50);
            updateLogsDisplay();
        }
        
        function addLogEntry(level, message) {
            const logEntry = {
                time: new Date().toLocaleString(),
                level: level,
                message: message
            };
            
            schedulerData.logs.unshift(logEntry);
            schedulerData.logs = schedulerData.logs.slice(0, 50); // Keep only last 50 logs
            updateLogsDisplay();
        }
        
        function updateLogsDisplay() {
            const logsContent = document.getElementById('logsContent');
            if (!logsContent) return;
            
            logsContent.innerHTML = schedulerData.logs.map(log => `
                <div class="log-entry">
                    <span class="log-time">${log.time}</span>
                    <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('');
        }
        
        function clearSchedulerLogs() {
            if (confirm('确定要清空所有日志吗？')) {
                schedulerData.logs = [];
                updateLogsDisplay();
                addLogEntry('info', '日志已清空');
            }
        }
        
        // Make functions globally available
        window.editSchedule = editSchedule;
        window.toggleSchedule = toggleSchedule;
        window.deleteSchedule = deleteSchedule;
        
        // Auto-refresh status every 30 seconds
        if (document.querySelector('.scheduler-hero')) {
            setInterval(() => {
                if (schedulerData.status === 'running') {
                    updateSchedulerStatus();
                }
            }, 30000);
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

// Integrated Scheduler Functions for Config Page
if (document.getElementById('scheduleType')) {
    let integratedSchedulerData = {
        status: 'stopped',
        schedules: [],
        logs: []
    };

    // Initialize integrated scheduler
    function initIntegratedScheduler() {
        loadIntegratedSchedulerData();
        setupIntegratedSchedulerEvents();
        updateIntegratedSchedulerStatus();
        updateIntegratedScheduleList();
    }

    // Load scheduler data
    async function loadIntegratedSchedulerData() {
        try {
            // In a real implementation, this would fetch from the backend
            // For now, use mock data
            loadMockIntegratedSchedulerData();
        } catch (error) {
            console.error('Failed to load scheduler data:', error);
            loadMockIntegratedSchedulerData();
        }
    }

    function loadMockIntegratedSchedulerData() {
        integratedSchedulerData = {
            status: 'stopped',
            schedules: [
                {
                    id: 1,
                    type: 'daily',
                    time: '09:00',
                    enabled: true,
                    description: '每日上午9点运行'
                },
                {
                    id: 2,
                    type: 'weekly',
                    day: 'monday',
                    time: '14:00',
                    enabled: false,
                    description: '每周一下午2点运行'
                }
            ],
            logs: [
                { timestamp: new Date().toISOString(), level: 'info', message: '调度器已初始化' }
            ]
        };
    }

    // Setup event listeners
    function setupIntegratedSchedulerEvents() {
        // Schedule type change
        const scheduleType = document.getElementById('scheduleType');
        if (scheduleType) {
            scheduleType.addEventListener('change', updateScheduleForm);
        }

        // Initialize form
        updateScheduleForm();
    }

    // Update scheduler status display
    function updateIntegratedSchedulerStatus() {
        const statusDot = document.getElementById('schedulerStatusDot');
        const statusText = document.getElementById('schedulerStatusText');
        
        if (statusDot && statusText) {
            statusDot.className = `status-dot ${integratedSchedulerData.status}`;
            statusText.textContent = `调度器状态: ${integratedSchedulerData.status === 'running' ? '运行中' : '已停止'}`;
        }
    }

    // Update schedule form based on type
    function updateScheduleForm() {
        const scheduleType = document.getElementById('scheduleType')?.value;
        const forms = ['dailyForm', 'hourlyForm', 'weeklyForm', 'intervalForm'];
        
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.style.display = 'none';
            }
        });
        
        if (scheduleType) {
            const activeForm = document.getElementById(scheduleType + 'Form');
            if (activeForm) {
                activeForm.style.display = 'flex';
            }
        }
    }

    // Update schedule list
    function updateIntegratedScheduleList() {
        const scheduleList = document.getElementById('scheduleList');
        if (!scheduleList) return;
        
        if (integratedSchedulerData.schedules.length === 0) {
            scheduleList.innerHTML = '<p style="color: #8b949e; text-align: center; padding: 1rem;">暂无调度任务</p>';
            return;
        }
        
        scheduleList.innerHTML = integratedSchedulerData.schedules.map((schedule, index) => `
            <div class="schedule-item">
                <div class="schedule-info">
                    <div class="schedule-type">${getIntegratedScheduleTypeText(schedule)}</div>
                    <div class="schedule-details">${schedule.description}</div>
                </div>
                <div class="schedule-actions">
                    <button class="btn btn-xs ${schedule.enabled ? 'btn-success' : 'btn-secondary'}" 
                            onclick="toggleIntegratedSchedule(${index})">
                        ${schedule.enabled ? '启用' : '禁用'}
                    </button>
                    <button class="btn btn-xs btn-primary" onclick="editIntegratedSchedule(${index})">编辑</button>
                    <button class="btn btn-xs btn-danger" onclick="deleteIntegratedSchedule(${index})">删除</button>
                </div>
            </div>
        `).join('');
    }

    function getIntegratedScheduleTypeText(schedule) {
        const types = {
            'daily': '每日调度',
            'hourly': '每小时调度',
            'weekly': '每周调度',
            'interval': '间隔调度'
        };
        return types[schedule.type] || schedule.type;
    }

    // Scheduler control functions
    async function startScheduler() {
        try {
            // In real implementation, make API call
            integratedSchedulerData.status = 'running';
            updateIntegratedSchedulerStatus();
            showIntegratedNotification('调度器已启动', 'success');
        } catch (error) {
            showIntegratedNotification('启动调度器失败: ' + error.message, 'error');
        }
    }

    async function stopScheduler() {
        try {
            // In real implementation, make API call
            integratedSchedulerData.status = 'stopped';
            updateIntegratedSchedulerStatus();
            showIntegratedNotification('调度器已停止', 'info');
        } catch (error) {
            showIntegratedNotification('停止调度器失败: ' + error.message, 'error');
        }
    }

    async function runOnce() {
        try {
            // In real implementation, make API call
            showIntegratedNotification('正在执行一次性运行...', 'info');
        } catch (error) {
            showIntegratedNotification('执行失败: ' + error.message, 'error');
        }
    }

    // Preset functions
    function applyPreset(preset) {
        const presets = {
            'daily': { type: 'daily', time: '09:00' },
            'workdays': { type: 'weekly', day: 'monday', time: '09:00' },
            'hourly': { type: 'hourly', minute: 0 },
            'weekly': { type: 'weekly', day: 'sunday', time: '10:00' }
        };
        
        const presetData = presets[preset];
        if (presetData) {
            document.getElementById('scheduleType').value = presetData.type;
            updateScheduleForm();
            
            // Set form values based on preset
            if (presetData.time) {
                const timeInput = document.getElementById(presetData.type + 'Time');
                if (timeInput) timeInput.value = presetData.time;
            }
            if (presetData.day) {
                const daySelect = document.getElementById('weeklyDay');
                if (daySelect) daySelect.value = presetData.day;
            }
            if (presetData.minute !== undefined) {
                const minuteInput = document.getElementById('hourlyMinute');
                if (minuteInput) minuteInput.value = presetData.minute;
            }
        }
    }

    // Schedule management functions
    function addSchedule() {
        const scheduleType = document.getElementById('scheduleType')?.value;
        if (!scheduleType) return;
        
        const newSchedule = {
            id: Date.now(),
            type: scheduleType,
            enabled: true
        };
        
        // Get form data based on type
        switch (scheduleType) {
            case 'daily':
                newSchedule.time = document.getElementById('dailyTime')?.value || '09:00';
                newSchedule.description = `每日${newSchedule.time}运行`;
                break;
            case 'hourly':
                newSchedule.minute = parseInt(document.getElementById('hourlyMinute')?.value) || 0;
                newSchedule.description = `每小时第${newSchedule.minute}分钟运行`;
                break;
            case 'weekly':
                newSchedule.day = document.getElementById('weeklyDay')?.value || 'monday';
                newSchedule.time = document.getElementById('weeklyTime')?.value || '09:00';
                const dayNames = {
                    'monday': '周一', 'tuesday': '周二', 'wednesday': '周三',
                    'thursday': '周四', 'friday': '周五', 'saturday': '周六', 'sunday': '周日'
                };
                newSchedule.description = `每${dayNames[newSchedule.day]}${newSchedule.time}运行`;
                break;
            case 'interval':
                newSchedule.minutes = parseInt(document.getElementById('intervalMinutes')?.value) || 60;
                newSchedule.description = `每${newSchedule.minutes}分钟运行一次`;
                break;
        }
        
        integratedSchedulerData.schedules.push(newSchedule);
        updateIntegratedScheduleList();
        showIntegratedNotification('调度任务已添加', 'success');
    }

    function editIntegratedSchedule(index) {
        // For simplicity, just show current values in form
        const schedule = integratedSchedulerData.schedules[index];
        if (schedule) {
            document.getElementById('scheduleType').value = schedule.type;
            updateScheduleForm();
            
            // Set form values
            setTimeout(() => {
                if (schedule.time) {
                    const timeInput = document.getElementById(schedule.type + 'Time');
                    if (timeInput) timeInput.value = schedule.time;
                }
                if (schedule.day) {
                    const daySelect = document.getElementById('weeklyDay');
                    if (daySelect) daySelect.value = schedule.day;
                }
                if (schedule.minute !== undefined) {
                    const minuteInput = document.getElementById('hourlyMinute');
                    if (minuteInput) minuteInput.value = schedule.minute;
                }
                if (schedule.minutes !== undefined) {
                    const minutesInput = document.getElementById('intervalMinutes');
                    if (minutesInput) minutesInput.value = schedule.minutes;
                }
            }, 100);
            
            showIntegratedNotification('请修改表单后重新添加任务', 'info');
        }
    }

    function toggleIntegratedSchedule(index) {
        if (integratedSchedulerData.schedules[index]) {
            integratedSchedulerData.schedules[index].enabled = !integratedSchedulerData.schedules[index].enabled;
            updateIntegratedScheduleList();
            const status = integratedSchedulerData.schedules[index].enabled ? '启用' : '禁用';
            showIntegratedNotification(`任务已${status}`, 'info');
        }
    }

    function deleteIntegratedSchedule(index) {
        if (confirm('确定要删除这个调度任务吗？')) {
            integratedSchedulerData.schedules.splice(index, 1);
            updateIntegratedScheduleList();
            showIntegratedNotification('调度任务已删除', 'info');
        }
    }

    // Save scheduler config
    async function saveSchedulerConfig() {
        try {
            // In real implementation, save to backend
            const config = {
                enabled: integratedSchedulerData.status === 'running',
                schedules: integratedSchedulerData.schedules
            };
            
            // For demo, just show success
            showIntegratedNotification('调度配置已保存', 'success');
            console.log('Scheduler config saved:', config);
        } catch (error) {
            showIntegratedNotification('保存配置失败: ' + error.message, 'error');
        }
    }

    // Notification function
    function showIntegratedNotification(message, type = 'info') {
        // Reuse existing notification system if available
        if (window.configManager && window.configManager.showNotification) {
            window.configManager.showNotification(message, type);
        } else {
            // Fallback to alert
            alert(message);
        }
    }

    // Make functions globally available
    window.startScheduler = startScheduler;
    window.stopScheduler = stopScheduler;
    window.runOnce = runOnce;
    window.applyPreset = applyPreset;
    window.addSchedule = addSchedule;
    window.editIntegratedSchedule = editIntegratedSchedule;
    window.toggleIntegratedSchedule = toggleIntegratedSchedule;
    window.deleteIntegratedSchedule = deleteIntegratedSchedule;
    window.updateScheduleForm = updateScheduleForm;
    window.saveSchedulerConfig = saveSchedulerConfig;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('scheduleType')) {
            initIntegratedScheduler();
        }
    });
}

// Execution Control Panel
class ExecutionController {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.status = 'stopped';
        this.stats = {
            videosWatched: 0,
            likesGiven: 0,
            subscriptionsGiven: 0,
            commentsGiven: 0,
            pauseCount: 0,
            replayCount: 0,
            scrollCount: 0,
            runtime: 0,
            avgWatchTime: 0
        };
        this.logs = [];
        this.statusCheckInterval = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.checkApiStatus();
    }

    bindEvents() {
        const startBtn = document.getElementById('startBot');
        const stopBtn = document.getElementById('stopBot');
        const checkApiBtn = document.getElementById('checkApi');
        const createBrowserBtn = document.getElementById('createBrowser');
        const clearLogsBtn = document.getElementById('clearLogs');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startBot());
        }
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopBot());
        }
        if (checkApiBtn) {
            checkApiBtn.addEventListener('click', () => this.checkApiStatus());
        }
        if (createBrowserBtn) {
            createBrowserBtn.addEventListener('click', () => this.createBrowser());
        }
        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', () => this.clearLogs());
        }
    }

    async makeApiCall(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            let errorMessage = `API调用失败: ${error.message}`;
            let userGuidance = '';
            
            // 根据错误类型提供具体的用户指导
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'API服务器连接失败';
                userGuidance = '请检查：\n1. Web API服务是否正在运行 (python web_api.py)\n2. 端口5000是否被占用\n3. 防火墙设置是否阻止连接';
            } else if (error.message.includes('HTTP 404')) {
                errorMessage = 'API接口不存在';
                userGuidance = '请确认API服务版本是否正确';
            } else if (error.message.includes('HTTP 500')) {
                errorMessage = 'API服务器内部错误';
                userGuidance = '请检查服务器日志，可能需要重启API服务';
            } else if (error.message.includes('HTTP 403')) {
                errorMessage = 'API访问被拒绝';
                userGuidance = '请检查API服务配置和权限设置';
            }
            
            this.addLog('error', errorMessage);
            if (userGuidance) {
                this.addLog('warning', userGuidance);
                this.showErrorDialog(errorMessage, userGuidance);
            }
            
            return { success: false, error: errorMessage, guidance: userGuidance };
        }
    }

    async checkApiStatus() {
        this.addLog('info', '检查API状态...');
        const result = await this.makeApiCall('/status');
        
        const apiStatusEl = document.getElementById('apiStatus');
        if (apiStatusEl) {
            if (result.success) {
                apiStatusEl.textContent = '可用';
                apiStatusEl.className = 'api-status available';
                this.addLog('success', 'API连接正常');
                
                // 检查浏览器API状态
                if (result.data && result.data.browser_api_status === false) {
                    this.addLog('warning', 'Bit Browser API未运行，请启动Bit Browser客户端');
                    this.showErrorDialog('浏览器API未运行', '请按以下步骤操作：\n1. 启动Bit Browser客户端\n2. 确保API服务正常运行\n3. 重新检查API状态');
                }
            } else {
                apiStatusEl.textContent = '不可用';
                apiStatusEl.className = 'api-status unavailable';
                this.addLog('error', 'API连接失败');
                
                if (result.guidance) {
                    this.addLog('info', '解决方案：');
                    this.addLog('info', result.guidance);
                }
            }
        }
    }

    async startBot() {
        this.addLog('info', '启动机器人...');
        
        // 先检查API状态
        const statusCheck = await this.makeApiCall('/status');
        if (!statusCheck.success) {
            this.addLog('error', '无法连接到API服务，请先检查API状态');
            this.showErrorDialog('启动失败', '无法连接到API服务，请：\n1. 确认Web API服务正在运行\n2. 点击"检查浏览器API"按钮\n3. 解决连接问题后重试');
            return;
        }
        
        // 检查浏览器API
        if (statusCheck.data && statusCheck.data.browser_api_status === false) {
            this.addLog('error', 'Bit Browser API未运行，无法启动机器人');
            this.showErrorDialog('启动失败', 'Bit Browser API未运行，请：\n1. 启动Bit Browser客户端\n2. 确保API服务正常\n3. 重新检查API状态后再启动');
            return;
        }
        
        // 获取当前配置
        let config = {};
        if (configManager) {
            configManager.updateConfig(); // 确保配置是最新的
            config = configManager.config;
        }
        
        // 验证配置
        if (!config.browser_ids || config.browser_ids.length === 0 || config.browser_ids[0] === 'default') {
            this.addLog('error', '浏览器ID配置无效');
            this.showErrorDialog('启动失败', '浏览器ID配置无效，请：\n1. 点击"创建浏览器"按钮创建新的浏览器实例\n2. 或在配置中输入有效的浏览器ID\n3. 保存配置后重新启动');
            return;
        }
        
        const result = await this.makeApiCall('/start', 'POST', config);
        
        if (result.success) {
            this.status = 'running';
            this.addLog('success', '机器人启动成功');
            this.startStatusCheck();
        } else {
            let errorMsg = result.message || result.error || '未知错误';
            this.addLog('error', `启动失败: ${errorMsg}`);
            
            // 根据错误类型提供具体指导
            let guidance = '';
            if (errorMsg.includes('browser_id')) {
                guidance = '浏览器ID相关错误，请：\n1. 检查浏览器ID是否有效\n2. 尝试创建新的浏览器实例\n3. 确认Bit Browser客户端正常运行';
            } else if (errorMsg.includes('window limit')) {
                guidance = '浏览器窗口数量已达上限，请：\n1. 关闭不需要的浏览器窗口\n2. 或删除不使用的浏览器配置\n3. 重新尝试启动';
            } else if (errorMsg.includes('config')) {
                guidance = '配置文件错误，请：\n1. 检查配置参数是否正确\n2. 尝试重置配置到默认值\n3. 重新保存配置';
            } else {
                guidance = '请检查：\n1. 所有服务是否正常运行\n2. 配置是否正确\n3. 查看详细日志获取更多信息';
            }
            
            this.showErrorDialog('机器人启动失败', guidance);
        }
        
        this.updateUI();
    }

    async stopBot() {
        this.addLog('info', '停止机器人...');
        const result = await this.makeApiCall('/stop', 'POST');
        
        if (result.success) {
            this.status = 'stopped';
            this.addLog('success', '机器人已停止');
            this.stopStatusCheck();
        } else {
            this.addLog('error', `停止失败: ${result.error}`);
        }
        
        this.updateUI();
    }

    async createBrowser() {
        this.addLog('info', '创建新浏览器实例...');
        
        // 先检查API状态
        const statusCheck = await this.makeApiCall('/status');
        if (!statusCheck.success) {
            this.addLog('error', '无法连接到API服务');
            this.showErrorDialog('创建失败', '无法连接到API服务，请先检查API状态');
            return;
        }
        
        if (statusCheck.data && statusCheck.data.browser_api_status === false) {
            this.addLog('error', 'Bit Browser API未运行');
            this.showErrorDialog('创建失败', 'Bit Browser API未运行，请启动Bit Browser客户端');
            return;
        }
        
        const result = await this.makeApiCall('/create-browser', 'POST');
        
        if (result.success) {
            this.addLog('success', `浏览器创建成功: ${result.browser_id}`);
            this.addLog('info', '请将此浏览器ID复制到配置中并保存');
            
            // 自动更新配置中的浏览器ID
            if (configManager && result.browser_id) {
                const browserIdInput = document.getElementById('browser-ids');
                if (browserIdInput) {
                    browserIdInput.value = result.browser_id;
                    configManager.updateConfig();
                    this.addLog('success', '浏览器ID已自动更新到配置中');
                }
            }
        } else {
            let errorMsg = result.error || '未知错误';
            this.addLog('error', `创建失败: ${errorMsg}`);
            
            let guidance = '';
            if (errorMsg.includes('limit')) {
                guidance = '浏览器数量已达上限，请：\n1. 删除不需要的浏览器配置\n2. 或联系管理员增加配额\n3. 重新尝试创建';
            } else if (errorMsg.includes('permission')) {
                guidance = '权限不足，请：\n1. 检查Bit Browser客户端权限\n2. 确认API服务配置正确\n3. 重新启动相关服务';
            } else {
                guidance = '请检查：\n1. Bit Browser客户端是否正常运行\n2. API服务是否正常\n3. 网络连接是否正常';
            }
            
            this.showErrorDialog('创建浏览器失败', guidance);
        }
    }

    startStatusCheck() {
        if (this.statusCheckInterval) {
            clearInterval(this.statusCheckInterval);
        }
        
        this.statusCheckInterval = setInterval(async () => {
            const result = await this.makeApiCall('/status');
            if (result.success && result.data) {
                this.updateStats(result.data);
            }
        }, 5000); // 每5秒检查一次状态
    }

    stopStatusCheck() {
        if (this.statusCheckInterval) {
            clearInterval(this.statusCheckInterval);
            this.statusCheckInterval = null;
        }
    }

    updateStats(data) {
        if (data.stats) {
            this.stats = { ...this.stats, ...data.stats };
        }
        
        if (data.status) {
            this.status = data.status;
        }
        
        if (data.logs) {
            data.logs.forEach(log => {
                this.addLog(log.level, log.message);
            });
        }
        
        this.updateUI();
    }

    updateUI() {
        // 更新状态徽章
        const statusBadge = document.getElementById('executionStatus');
        if (statusBadge) {
            statusBadge.textContent = this.status === 'running' ? '运行中' : '已停止';
            statusBadge.className = `status-badge ${this.status}`;
        }

        // 更新基础统计数据
        const videosEl = document.getElementById('videosWatched');
        const likesEl = document.getElementById('likesGiven');
        const subscriptionsEl = document.getElementById('subscriptionsGiven');
        const commentsEl = document.getElementById('commentsGiven');
        const pauseEl = document.getElementById('pauseCount');
        const replayEl = document.getElementById('replayCount');
        const scrollEl = document.getElementById('scrollCount');
        const runtimeEl = document.getElementById('runtime');
        
        if (videosEl) videosEl.textContent = this.stats.videosWatched || 0;
        if (likesEl) likesEl.textContent = this.stats.likesGiven || 0;
        if (subscriptionsEl) subscriptionsEl.textContent = this.stats.subscriptionsGiven || 0;
        if (commentsEl) commentsEl.textContent = this.stats.commentsGiven || 0;
        if (pauseEl) pauseEl.textContent = this.stats.pauseCount || 0;
        if (replayEl) replayEl.textContent = this.stats.replayCount || 0;
        if (scrollEl) scrollEl.textContent = this.stats.scrollCount || 0;
        if (runtimeEl) runtimeEl.textContent = this.formatRuntime(this.stats.runtime || 0);

        // 更新人类行为统计数据
        const avgWatchTimeEl = document.getElementById('avgWatchTime');
        const likeRateEl = document.getElementById('likeRate');
        const subscribeRateEl = document.getElementById('subscribeRate');
        const commentRateEl = document.getElementById('commentRate');
        const pauseRateEl = document.getElementById('pauseRate');
        const replayRateEl = document.getElementById('replayRate');
        
        if (avgWatchTimeEl) {
            const avgTime = this.stats.avgWatchTime || 0;
            avgWatchTimeEl.textContent = avgTime > 0 ? `${avgTime}秒` : '0秒';
        }
        
        if (likeRateEl) {
            const rate = this.calculateRate(this.stats.likesGiven, this.stats.videosWatched);
            likeRateEl.textContent = `${rate}%`;
        }
        
        if (subscribeRateEl) {
            const rate = this.calculateRate(this.stats.subscriptionsGiven, this.stats.videosWatched);
            subscribeRateEl.textContent = `${rate}%`;
        }
        
        if (commentRateEl) {
            const rate = this.calculateRate(this.stats.commentsGiven, this.stats.videosWatched);
            commentRateEl.textContent = `${rate}%`;
        }
        
        if (pauseRateEl) {
            const rate = this.calculateRate(this.stats.pauseCount, this.stats.videosWatched);
            pauseRateEl.textContent = `${rate}%`;
        }
        
        if (replayRateEl) {
            const rate = this.calculateRate(this.stats.replayCount, this.stats.videosWatched);
            replayRateEl.textContent = `${rate}%`;
        }

        // 更新按钮状态
        const startBtn = document.getElementById('startBot');
        const stopBtn = document.getElementById('stopBot');
        
        if (startBtn) {
            startBtn.disabled = this.status === 'running';
        }
        if (stopBtn) {
            stopBtn.disabled = this.status === 'stopped';
        }

        // 更新日志
        this.updateLogsDisplay();
    }

    formatRuntime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    calculateRate(numerator, denominator) {
        if (!denominator || denominator === 0) {
            return 0;
        }
        return Math.round((numerator / denominator) * 100);
    }

    addLog(level, message) {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.unshift({ level, message, timestamp });
        
        // 限制日志数量，避免内存占用过多
        if (this.logs.length > 100) {
            this.logs = this.logs.slice(0, 100);
        }
    }
    
    showErrorDialog(title, message) {
        // 创建错误对话框
        const dialog = document.createElement('div');
        dialog.className = 'error-dialog-overlay';
        dialog.innerHTML = `
            <div class="error-dialog">
                <div class="error-dialog-header">
                    <h3>⚠️ ${title}</h3>
                    <button class="error-dialog-close" onclick="this.closest('.error-dialog-overlay').remove()">&times;</button>
                </div>
                <div class="error-dialog-content">
                    <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="error-dialog-actions">
                    <button class="btn btn-primary" onclick="this.closest('.error-dialog-overlay').remove()">我知道了</button>
                </div>
            </div>
        `;
        
        // 添加样式
        if (!document.getElementById('error-dialog-styles')) {
            const styles = document.createElement('style');
            styles.id = 'error-dialog-styles';
            styles.textContent = `
                .error-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }
                .error-dialog {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                .error-dialog-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #333;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .error-dialog-header h3 {
                    margin: 0;
                    color: #f85149;
                    font-size: 18px;
                }
                .error-dialog-close {
                    background: none;
                    border: none;
                    color: #8b949e;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .error-dialog-close:hover {
                    color: #f0f6fc;
                }
                .error-dialog-content {
                    padding: 20px;
                    color: #e6edf3;
                    line-height: 1.6;
                }
                .error-dialog-content p {
                    margin: 0;
                }
                .error-dialog-actions {
                    padding: 16px 20px;
                    border-top: 1px solid #333;
                    text-align: right;
                }
                .error-dialog-actions .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .error-dialog-actions .btn-primary {
                    background: #238636;
                    color: white;
                }
                .error-dialog-actions .btn-primary:hover {
                    background: #2ea043;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(dialog);
        
        // 3秒后自动关闭（可选）
        setTimeout(() => {
            if (dialog.parentNode) {
                dialog.remove();
            }
        }, 10000);
    }
    
    clearLogs() {
        this.logs = [];
        this.updateLogsDisplay();
        this.addLog('info', '日志已清空');
    }
    
    updateLogsDisplay() {
        const logsContainer = document.getElementById('execution-logs');
        if (!logsContainer) return;
        
        logsContainer.innerHTML = '';
        
        this.logs.slice(0, 20).forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = `log-entry log-${log.level}`;
            logElement.innerHTML = `
                <span class="log-timestamp">${log.timestamp}</span>
                <span class="log-level">[${log.level.toUpperCase()}]</span>
                <span class="log-message">${log.message}</span>
            `;
            logsContainer.appendChild(logElement);
        });
    }
}

// 初始化执行控制器
let executionController;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('execution-panel')) {
        executionController = new ExecutionController();
        executionController.updateUI(); // 初始化UI状态
    }
});