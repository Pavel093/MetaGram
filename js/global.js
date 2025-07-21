const themes = {
  light: {
    name: 'light',
    media: {
      promo: {
        desktop: 'assets/video/white_coin.mp4',
        mobile: 'assets/video/white_coin_720.mp4',
      },
      promo_secondary: {
        desktop: 'assets/video/1white_coin.mp4',
        mobile: 'assets/video/1white_coin_720.mp4',
      },
      two_mask: 'assets/two-section/Mask-light.png',
      shape: 'assets/two-section/shape2_light.png',
      background: 'assets/three-section/background_light.svg',
      shape_one: 'assets/three-section/one-shape-light.png',
      shape_two: 'assets/three-section/two-shape-light.png',
      shape_three: 'assets/three-section/three-shape-light.png',
      shape_four: 'assets/four-page/one_light.png',
      shape_five: 'assets/four-page/two_light.png',
      shape_six: 'assets/four-page/three_light.png',
      svg: 'assets/four-page/svg_light.svg',
      seven_section_background: {
        desktop: 'assets/seven-section/background.png',
        mobile: 'assets/seven-section/background_mobile.png'
      },
      seven_section_background_svg: 'assets/seven-page/background_light.svg',
      footer_image: 'assets/footer/shape_light.png',
      footer_image_background: 'assets/footer/background_light.svg'
    }
  },
  dark: {
    name: 'dark',
    media: {
      promo: {
        desktop: 'assets/video/dark_coin.mp4',
        mobile: 'assets/video/dark_coin_720.mp4'
      },
      promo_secondary: {
        desktop: 'assets/video/1dark_coin.mp4',
        mobile: 'assets/video/1dark_coin_720.mp4'
      },
      two_mask: 'assets/two-section/Mask-dark.png',
      shape: 'assets/two-section/shape2_dark.png',
      background: 'assets/three-section/background_dark.svg',
      shape_one: 'assets/three-section/one-shape-dark.png',
      shape_two: 'assets/three-section/two-shape-dark.png',
      shape_three: 'assets/three-section/three-shape-dark.png',
      shape_four: 'assets/four-page/one_dark.png',
      shape_five: 'assets/four-page/two_dark.png',
      shape_six: 'assets/four-page/three_dark.png',
      svg: 'assets/four-page/svg_dark.svg',
      seven_section_background: {
        desktop: 'assets/seven-section/background_dark.png',
        mobile: 'assets/seven-section/background_dark_mobile.png'
      },
      seven_section_background_svg: 'assets/seven-page/background_dark.svg',
      footer_image: 'assets/footer/shape_dark.png',
      footer_image_background: 'assets/footer/background_dark.svg'
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

// Функция для загрузки SVG и вставки его в DOM
async function loadSvg(url, container) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const svgText = await response.text();
    container.innerHTML = svgText;
    
    // Добавляем класс к SVG для последующей стилизации
    const svgElement = container.querySelector('svg');
    if (svgElement) {
      svgElement.classList.add('inline-svg');
    }
  } catch (error) {
    console.error('Error loading SVG:', error);
    // Можно добавить fallback, например, изображение
    container.innerHTML = `<img src="${url}" alt="SVG fallback">`;
  }
}

// Функция для отложенной загрузки видео
function loadSecondaryVideo(videoElement, mediaUrl) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = mediaUrl;
  link.setAttribute('importance', 'low');
  document.head.appendChild(link);

  setTimeout(() => {
    videoElement.innerHTML = `<source src="${mediaUrl}" type="video/mp4">`;
    videoElement.load();
    videoElement.oncanplaythrough = () => {
      videoElement.play().catch(err => {
        console.warn('Autoplay failed:', err);
      });
    };
  }, 1000);
}

// Загрузка медиа с поддержкой мобильных версий
async function loadThemeMedia(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const mediaElements = document.querySelectorAll('[data-theme-media]');
  const isMobile = isMobileDevice();

  for (const el of mediaElements) {
    const mediaKey = el.getAttribute('data-theme-media');
    let mediaUrl = theme.media[mediaKey];

    if (mediaUrl && typeof mediaUrl === 'object') {
      mediaUrl = isMobile ? mediaUrl.mobile : mediaUrl.desktop;
    }

    if (!mediaUrl) continue;

    if (el.tagName === 'IMG') {
      el.src = mediaUrl;
    } else if (el.tagName === 'VIDEO') {
      if (mediaKey === 'promo') {
        el.innerHTML = `<source src="${mediaUrl}" type="video/mp4">`;
        el.load();
        el.oncanplaythrough = () => {
          el.play().catch(err => {
            console.warn('Autoplay failed:', err);
          });
        };
      } else if (mediaKey === 'promo_secondary') {
        loadSecondaryVideo(el, mediaUrl);
      }
    } else if (el.classList.contains('svg-container') || mediaKey === 'svg') {
      // Загружаем SVG как встроенный элемент
      await loadSvg(mediaUrl, el);
    }
  }
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

// Экспорт функций для доступа из консоли (опционально)
window.themeSwitcher = {
  setTheme,
  getCurrentTheme: () => document.documentElement.getAttribute('data-theme')
};