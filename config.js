// Configuration Management for Online Config Page

// Global configuration manager
let configManager;

// Browser ID management functions
function addBrowserId() {
    if (configManager) {
        configManager.addBrowserId();
    }
}

function removeBrowserId(button) {
    if (configManager) {
        const container = button.closest('.browser-id-item');
        const index = Array.from(container.parentNode.children).indexOf(container);
        configManager.removeBrowserId(index);
    }
}

// Configuration file operations
function generateConfig() {
    if (configManager) {
        configManager.generateConfig();
    }
}

function downloadConfig() {
    if (configManager) {
        configManager.downloadConfig();
    }
}

function resetConfig() {
    if (configManager) {
        configManager.resetConfig();
    }
}

function loadConfig(event) {
    if (configManager) {
        configManager.loadConfigFile(event);
    }
}

// Initialize config manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof ConfigManager !== 'undefined') {
        configManager = new ConfigManager();
        window.configManager = configManager;
    }
});

// Make functions globally available
window.addBrowserId = addBrowserId;
window.removeBrowserId = removeBrowserId;
window.generateConfig = generateConfig;
window.downloadConfig = downloadConfig;
window.resetConfig = resetConfig;
window.loadConfig = loadConfig;