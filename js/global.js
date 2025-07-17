const themes = {
  light: {
    name: 'light',
    media: {
      promo: 'assets/video/white_coin.mp4',
      two_mask: 'assets/two-section/Mask-light.png'
    }
  },
  dark: {
    name: 'dark',
    media: {
      promo: 'assets/video/dark_coin.mp4',
      two_mask: 'assets/two-section/Mask-dark.png'
    }
  }
};

// 1. Определяем текущую тему (системную или из localStorage)
function detectSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
}

function getSavedTheme() {
  return localStorage.getItem('selectedTheme');
}

// 2. Устанавливаем тему (без загрузки медиа)
function initTheme() {
  const themeName = getSavedTheme() || detectSystemTheme();
  document.documentElement.setAttribute('data-theme', themeName);
  return themeName;
}

// 3. Загружаем медиафайлы для темы
function loadThemeMedia(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const mediaElements = document.querySelectorAll('[data-theme-media]');
  
  mediaElements.forEach(el => {
    const mediaKey = el.getAttribute('data-theme-media');
    const mediaUrl = theme.media[mediaKey];
    
    if (!mediaUrl) return;

    if (el.tagName === 'IMG') {
      el.src = mediaUrl;
    } else if (el.tagName === 'VIDEO') {
      el.innerHTML = `<source src="${mediaUrl}" type="video/mp4">`;
      el.load();

      // Ждём, пока видео будет готово к проигрыванию
      el.oncanplay = () => {
        el.play().catch(err => {
          console.warn('Autoplay failed:', err);
        });
      };
    }
  });
}

// 4. Публичная функция для смены темы
function setTheme(themeName) {
  if (!themes[themeName]) return;
  
  // Меняем тему и сохраняем
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('selectedTheme', themeName);
  
  // Перезагружаем медиа
  loadThemeMedia(themeName);
}

// 5. Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Сначала ставим тему
  const themeName = initTheme();
  
  // Затем загружаем медиа
  loadThemeMedia(themeName);
  
  // Скрываем лоадер
  document.querySelector('.theme-loader').style.display = 'none';
});