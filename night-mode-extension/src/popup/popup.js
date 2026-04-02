// ===== Получаем ссылки на элементы =====
const nightModeToggle = document.getElementById('nightModeToggle');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const sepiaSlider = document.getElementById('sepia');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const sepiaValue = document.getElementById('sepiaValue');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');

// ===== Вспомогательные функции =====
function updateValueDisplays() {
    brightnessValue.textContent = Math.round(brightnessSlider.value * 100) + '%';
    contrastValue.textContent = Math.round(contrastSlider.value * 100) + '%';
    sepiaValue.textContent = Math.round(sepiaSlider.value * 100) + '%';
}

function showStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.style.display = 'block';
    statusEl.style.background = isError 
        ? 'rgba(255, 71, 87, 0.3)' 
        : 'rgba(102, 126, 234, 0.3)';
    statusEl.querySelector('.status-text').textContent = message;
    
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 2000);
}

// ===== Загрузка сохранённых настроек =====
async function loadSettings() {
    const result = await chrome.storage.local.get([
        'nightModeEnabled',
        'brightness',
        'contrast',
        'sepia'
    ]);
    
    nightModeToggle.checked = result.nightModeEnabled || false;
    brightnessSlider.value = result.brightness || 0.85;
    contrastSlider.value = result.contrast || 1;
    sepiaSlider.value = result.sepia || 0.2;
    
    updateValueDisplays();
}

// ===== Отправка сообщения на страницу =====
async function sendMessageToTab(settings) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Проверяем, что вкладка существует
        if (!tab || !tab.id) {
            console.log('Не удалось получить вкладку');
            return false;
        }
        
        // Проверяем, что это не системная страница Chrome
        if (tab.url && (tab.url.startsWith('chrome://') || 
                        tab.url.startsWith('edge://') ||
                        tab.url.startsWith('about:'))) {
            showStatus('❌ Нельзя применить на этой странице', true);
            return false;
        }
        
        // Отправляем сообщение
        await chrome.tabs.sendMessage(tab.id, {
            type: 'APPLY_THEME',
            settings: settings
        });
        
        showStatus('✓ Настройки применены');
        return true;
        
    } catch (error) {
        console.log('Ошибка отправки:', error.message);
        showStatus('🔄 Обновите страницу для применения', true);
        return false;
    }
}

// ===== Сохранение и применение настроек =====
async function saveAndApply() {
    const settings = {
        nightModeEnabled: nightModeToggle.checked,
        brightness: parseFloat(brightnessSlider.value),
        contrast: parseFloat(contrastSlider.value),
        sepia: parseFloat(sepiaSlider.value)
    };
    
    // Сохраняем в хранилище
    await chrome.storage.local.set(settings);
    
    // Отправляем на активную вкладку
    await sendMessageToTab(settings);
}

// ===== Сброс настроек =====
async function resetSettings() {
    const defaultSettings = {
        nightModeEnabled: false,
        brightness: 0.85,
        contrast: 1,
        sepia: 0.2
    };
    
    // Обновляем интерфейс
    nightModeToggle.checked = defaultSettings.nightModeEnabled;
    brightnessSlider.value = defaultSettings.brightness;
    contrastSlider.value = defaultSettings.contrast;
    sepiaSlider.value = defaultSettings.sepia;
    
    updateValueDisplays();
    
    // Сохраняем и применяем
    await chrome.storage.local.set(defaultSettings);
    await sendMessageToTab(defaultSettings);
}

// ===== Навешиваем обработчики =====
nightModeToggle.addEventListener('change', saveAndApply);
brightnessSlider.addEventListener('input', () => {
    updateValueDisplays();
    saveAndApply();
});
contrastSlider.addEventListener('input', () => {
    updateValueDisplays();
    saveAndApply();
});
sepiaSlider.addEventListener('input', () => {
    updateValueDisplays();
    saveAndApply();
});
resetBtn.addEventListener('click', resetSettings);

// ===== Запуск =====
loadSettings();