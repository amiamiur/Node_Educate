// ===== Проверка, можно ли работать на этой странице =====
function isAllowedPage() {
    const url = window.location.href;
    if (url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') ||
        url.startsWith('edge://') ||
        url.startsWith('about:') ||
        url.startsWith('data:')) {
        return false;
    }
    return true;
}

// Если страница не подходит — выходим
if (!isAllowedPage()) {
    console.log('Ночной режим: страница не поддерживается');
    // Не выполняем код на системных страницах
} else {
    // ===== Основной код =====
    let styleElement = null;
    
    // Слушаем сообщения от попапа
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'APPLY_THEME') {
            applyTheme(request.settings);
            sendResponse({ success: true });
        }
        return true; // Важно для асинхронного ответа
    });
    
    // Применяем тему к странице
    function applyTheme(settings) {
        if (!settings.nightModeEnabled) {
            removeTheme();
            return;
        }
        
        const filters = `
            brightness(${settings.brightness})
            contrast(${settings.contrast})
            sepia(${settings.sepia})
        `;
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            html {
                filter: ${filters};
                transition: filter 0.3s ease;
            }
            
            img, video, iframe {
                filter: brightness(0.9) contrast(1.1);
            }
        `;
        
        document.documentElement.setAttribute('data-night-mode', 'true');
    }
    
    // Удаляем тему
    function removeTheme() {
        if (styleElement) {
            styleElement.remove();
            styleElement = null;
            document.documentElement.removeAttribute('data-night-mode');
        }
    }
    
    // Загружаем сохранённые настройки
    async function loadInitialTheme() {
        try {
            const result = await chrome.storage.local.get([
                'nightModeEnabled',
                'brightness',
                'contrast',
                'sepia'
            ]);
            
            if (result.nightModeEnabled) {
                applyTheme({
                    nightModeEnabled: true,
                    brightness: result.brightness || 0.85,
                    contrast: result.contrast || 1,
                    sepia: result.sepia || 0.2
                });
            }
            
            console.log('Ночной режим: content.js загружен');
        } catch (error) {
            console.error('Ошибка при загрузке темы:', error);
        }
    }
    
    // Запускаем загрузку темы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadInitialTheme);
    } else {
        loadInitialTheme();
    }
}