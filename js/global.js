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

// 3. Загружаем медиафайлы для темы с улучшенной обработкой видео
function loadThemeMedia(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const mediaElements = document.querySelectorAll('[data-theme-media]');
  
  mediaElements.forEach(el => {
    const mediaKey = el.getAttribute('data-theme-media');
    const mediaUrl = theme.media[mediaKey];
    
    if (!mediaUrl) return;

    if (el.tagName === 'IMG') {
      // Обработка изображений
      el.src = mediaUrl;
    } else if (el.tagName === 'VIDEO') {
      // Обработка видео с улучшенной логикой
      handleVideoElement(el, mediaUrl);
    }
  });
}

// Новая функция для обработки видео элементов
function handleVideoElement(videoEl, videoUrl) {
  // Проверяем, не загружено ли уже это видео
  const currentSource = videoEl.querySelector('source');
  if (currentSource && currentSource.src === videoUrl) {
    // Видео уже загружено, пытаемся воспроизвести
    playVideoWithFallback(videoEl);
    return;
  }

  // Создаем новый источник видео
  videoEl.innerHTML = '';
  const source = document.createElement('source');
  source.src = videoUrl;
  source.type = 'video/mp4';
  videoEl.appendChild(source);

  // Добавляем класс для плавного появления
  videoEl.classList.remove('ready');

  // Обработчики событий для видео
  videoEl.onloadeddata = () => {
    videoEl.classList.add('ready');
    playVideoWithFallback(videoEl);
  };

  videoEl.onerror = () => {
    console.error('Error loading video:', videoUrl);
  };

  // Принудительная загрузка видео
  videoEl.load();
}

// Функция для воспроизведения видео с обработкой ошибок
function playVideoWithFallback(videoEl) {
  if (videoEl.readyState < 3) return; // Недостаточно данных для воспроизведения

  const playPromise = videoEl.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log('Autoplay prevented:', error);
      // Можно добавить кнопку воспроизведения здесь при необходимости
    });
  }
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
  const themeLoader = document.querySelector('.theme-loader');
  if (themeLoader) {
    themeLoader.style.display = 'none';
  }
});

// Добавляем обработчик для изменения системной темы
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('selectedTheme')) {
    const themeName = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    loadThemeMedia(themeName);
  }
});