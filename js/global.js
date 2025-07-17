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

// 1. Определение текущей темы
function detectSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSavedTheme() {
  return localStorage.getItem('selectedTheme');
}

// 2. Установка темы
function initTheme() {
  const themeName = getSavedTheme() || detectSystemTheme();
  document.documentElement.setAttribute('data-theme', themeName);
  return themeName;
}

// 3. Улучшенная загрузка медиа
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
      optimizeVideoLoading(el, mediaUrl);
    }
  });
}

// 4. Оптимизированная загрузка видео
function optimizeVideoLoading(videoEl, videoUrl) {
  // Проверяем, не загружено ли уже это видео
  const currentSource = videoEl.querySelector('source');
  if (currentSource && currentSource.src === videoUrl) {
    videoEl.classList.add('ready');
    return;
  }

  // Создаем новый элемент видео для предзагрузки
  const tempVideo = document.createElement('video');
  tempVideo.style.display = 'none';
  tempVideo.preload = 'auto';
  tempVideo.muted = true;
  
  const source = document.createElement('source');
  source.src = videoUrl;
  source.type = 'video/mp4';
  tempVideo.appendChild(source);

  // Добавляем временное видео в DOM для предзагрузки
  document.body.appendChild(tempVideo);

  tempVideo.onloadeddata = () => {
    // Когда видео загружено, подменяем источник в основном видео
    videoEl.innerHTML = '';
    const mainSource = source.cloneNode();
    videoEl.appendChild(mainSource);
    
    // Удаляем временное видео
    document.body.removeChild(tempVideo);
    
    // Применяем оптимизации
    applyVideoOptimizations(videoEl);
    
    // Пытаемся воспроизвести
    playVideoWithRetry(videoEl, 3);
  };

  tempVideo.onerror = () => {
    console.error('Error preloading video:', videoUrl);
    document.body.removeChild(tempVideo);
  };
}

// 5. Применение оптимизаций к видео
function applyVideoOptimizations(videoEl) {
  // Устанавливаем важные атрибуты
  videoEl.preload = 'auto';
  videoEl.playsInline = true;
  videoEl.muted = true;
  videoEl.loop = true;
  
  // Принудительное декодирование видео
  if ('videoTracks' in videoEl) {
    videoEl.videoTracks[0].selected = true;
  }
  
  // WebKit-specific optimization
  if ('webkitSupportsFullscreen' in videoEl) {
    videoEl.webkitEnterFullscreen();
    videoEl.webkitExitFullscreen();
  }
}

// 6. Попытка воспроизведения с повторными попытками
function playVideoWithRetry(videoEl, retries) {
  if (retries <= 0) return;

  const playPromise = videoEl.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log('Play attempt failed, retrying...', error);
      setTimeout(() => {
        playVideoWithRetry(videoEl, retries - 1);
      }, 500);
    }).then(() => {
      videoEl.classList.add('ready');
    });
  }
}

// 7. Функция смены темы
function setTheme(themeName) {
  if (!themes[themeName]) return;
  
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('selectedTheme', themeName);
  loadThemeMedia(themeName);
}

// 8. Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const themeName = initTheme();
  loadThemeMedia(themeName);
  
  const themeLoader = document.querySelector('.theme-loader');
  if (themeLoader) {
    themeLoader.style.display = 'none';
  }
});

// 9. Обработчик изменения системной темы
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('selectedTheme')) {
    const themeName = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    loadThemeMedia(themeName);
  }
});