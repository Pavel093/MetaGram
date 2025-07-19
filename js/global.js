const themes = {
  light: {
    name: 'light',
    media: {
      promo: {
        desktop: 'assets/video/white_coin.mp4',
        mobile: 'assets/video/white_coin_720.mp4',
      },
      promo_secondary: {  // Добавлено новое видео с префиксом 1
        desktop: 'assets/video/1white_coin.mp4',
        mobile: 'assets/video/1white_coin_720.mp4',
      },
      two_mask: 'assets/two-section/Mask-light.png',
      shape: 'assets/two-section/shape2_light.png',
      background: 'assets/three-section/background_light.svg',
      shape_one: 'assets/three-section/one-shape-light.png',
      shape_two: 'assets/three-section/two-shape-light.png',
      shape_three: 'assets/three-section/three-shape-light.png'
    }
  },
  dark: {
    name: 'dark',
    media: {
      promo: {
        desktop: 'assets/video/dark_coin.mp4',
        mobile: 'assets/video/dark_coin_720.mp4'
      },
      promo_secondary: {  // Добавлено новое видео с префиксом 1
        desktop: 'assets/video/1dark_coin.mp4',
        mobile: 'assets/video/1dark_coin_720.mp4'
      },
      two_mask: 'assets/two-section/Mask-dark.png',
      shape: 'assets/two-section/shape2_dark.png',
      background: 'assets/three-section/background_dark.svg',
      shape_one: 'assets/three-section/one-shape-dark.png',
      shape_two: 'assets/three-section/two-shape-dark.png',
      shape_three: 'assets/three-section/three-shape-dark.png'
    }
  }
};

// Определение мобильного устройства
function isMobileDevice() {
  return window.matchMedia('(max-width: 768px)').matches;
}

// Определение темы
function detectSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSavedTheme() {
  return localStorage.getItem('selectedTheme');
}

function initTheme() {
  const themeName = getSavedTheme() || detectSystemTheme();
  document.documentElement.setAttribute('data-theme', themeName);
  return themeName;
}

// Функция для отложенной загрузки видео
function loadSecondaryVideo(videoElement, mediaUrl) {
  // Устанавливаем низкий приоритет загрузки
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = mediaUrl;
  link.setAttribute('importance', 'low');
  document.head.appendChild(link);

  // Загружаем видео после небольшой задержки
  setTimeout(() => {
    videoElement.innerHTML = `<source src="${mediaUrl}" type="video/mp4">`;
    videoElement.load();
    videoElement.oncanplaythrough = () => {
      videoElement.play().catch(err => {
        console.warn('Autoplay failed:', err);
      });
    };
  }, 1000); // Задержка 1 секунда
}

// Загрузка медиа с поддержкой мобильных версий
function loadThemeMedia(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const mediaElements = document.querySelectorAll('[data-theme-media]');
  const isMobile = isMobileDevice();

  mediaElements.forEach(el => {
    const mediaKey = el.getAttribute('data-theme-media');
    let mediaUrl = theme.media[mediaKey];

    // Если это видео — выбираем мобильную или десктоп версию
    if (mediaUrl && typeof mediaUrl === 'object') {
      mediaUrl = isMobile ? mediaUrl.mobile : mediaUrl.desktop;
    }

    if (!mediaUrl) return;

    if (el.tagName === 'IMG') {
      el.src = mediaUrl;
    } else if (el.tagName === 'VIDEO') {
      // Для основного видео загружаем сразу
      if (mediaKey === 'promo') {
        el.innerHTML = `<source src="${mediaUrl}" type="video/mp4">`;
        el.load();
        el.oncanplaythrough = () => {
          el.play().catch(err => {
            console.warn('Autoplay failed:', err);
          });
        };
      } 
      // Для дополнительного видео используем отложенную загрузку
      else if (mediaKey === 'promo_secondary') {
        loadSecondaryVideo(el, mediaUrl);
      }
    }
  });
}

// Смена темы
function setTheme(themeName) {
  if (!themes[themeName]) return;

  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('selectedTheme', themeName);

  loadThemeMedia(themeName);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const themeName = initTheme();
  loadThemeMedia(themeName);
  document.querySelector('.theme-loader')?.remove();
});