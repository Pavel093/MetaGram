document.addEventListener("DOMContentLoaded", function () {
    drawLines();
    window.addEventListener("resize", drawLines);
});

function drawLines() {
    const container = document.querySelector(".right-card");
    const linesContainer = container;
    const elements = Array.from(container.querySelectorAll(".element"));

    container.querySelectorAll(".line").forEach(line => line.remove());

    elements.slice(0, -1).forEach((el, i) => {
        const coin1 = el.querySelector(".coin");
        const coin2 = elements[i + 1].querySelector(".coin");

        // Получаем позиции относительно .right-card
        const containerRect = container.getBoundingClientRect();
        const coin1Rect = coin1.getBoundingClientRect();
        const coin2Rect = coin2.getBoundingClientRect();

        // Переводим в координаты относительно .right-card
        const x1 = coin1Rect.left - containerRect.left + container.scrollLeft;
        const y1 = coin1Rect.top - containerRect.top + container.scrollTop;
        const x2 = coin2Rect.left - containerRect.left + container.scrollLeft;
        const y2 = coin2Rect.top - containerRect.top + container.scrollTop;

        // Центр монет
        const centerX1 = x1 + coin1Rect.width / 2;
        const centerY1 = y1 + coin1Rect.height / 2;
        const centerX2 = x2 + coin2Rect.width / 2;
        const centerY2 = y2 + coin2Rect.height / 2;

        // Рисуем линию
        const length = Math.hypot(centerX2 - centerX1, centerY2 - centerY1);
        const angle = Math.atan2(centerY2 - centerY1, centerX2 - centerX1) * 180 / Math.PI;

        const line = document.createElement("div");
        line.classList.add("line");

        // Определяем текущую тему
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        
        // Цвет линии в зависимости от темы
        if (coin1.classList.contains("gray_coin") && coin2.classList.contains("gray_coin")) {
            line.style.backgroundColor = currentTheme === 'light' ? 'black' : 'white';
        } else {
            line.style.backgroundColor = currentTheme === 'light' ? '#D4095A' : '#FFD700';
        }

        line.style.width = `${length}px`;
        line.style.left = `${centerX1}px`;
        line.style.top = `${centerY1}px`;
        line.style.transform = `rotate(${angle}deg)`;

        linesContainer.appendChild(line);
    });
}

// Добавьте этот код в конец вашего скрипта
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(mutation => {
    if (mutation.attributeName === 'data-theme') {
      drawLines();  // Перерисовываем линии при изменении темы
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,  // Следим за изменениями атрибутов
  attributeFilter: ['data-theme']  // Только атрибут data-theme
});

//TOGGLE

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('theme-toggle');
    
    // Функция для обновления состояния переключателя
    function updateToggleState() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        toggle.checked = (currentTheme === 'dark');
    }
    
    // Установка начального состояния переключателя
    updateToggleState();
    
    // Обработка изменения темы через переключатель
    toggle.addEventListener('change', function() {
        const themeName = this.checked ? 'dark' : 'light';
        setTheme(themeName);
    });
    
    // Синхронизация с системными изменениями темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('selectedTheme')) {
            const themeName = e.matches ? 'dark' : 'light';
            setTheme(themeName);
            updateToggleState();
        }
    });
    
    // Наблюдатель за изменениями атрибута data-theme
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                updateToggleState();
            }
        });
    });
    
    // Начинаем наблюдение за изменениями атрибута data-theme
    observer.observe(document.documentElement, {
        attributes: true
    });
});

// Функция для обновления переключателя (если нужно из других частей кода)
function updateToggleState() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        toggle.checked = (currentTheme === 'dark');
    }
}

// Добавляем функцию обновления в ваш themeSwitcher
if (window.themeSwitcher) {
    window.themeSwitcher.updateToggleState = updateToggleState;
}

// carusel
document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.querySelector('.six-section .card-container');
    const cards = Array.from(document.querySelectorAll('.six-section .card'));
    
    // Очищаем контейнер
    cardContainer.innerHTML = '';
    
    // Определяем количество дубликатов для бесшовной анимации
    const duplicates = 3; // Создаем 3 копии для плавности
    
    // Создаем ряды
    function createInfiniteSlider() {
        const isMobile = window.innerWidth <= 768;
        const rows = isMobile ? 3 : 2;
        
        // Создаем контейнеры для каждого ряда
        for (let i = 0; i < rows; i++) {
            const rowContainer = document.createElement('div');
            rowContainer.className = `slider-row row-${i}`;
            
            // Добавляем карточки (оригиналы + дубликаты)
            for (let d = 0; d < duplicates; d++) {
                cards.forEach(card => {
                    const clone = card.cloneNode(true);
                    rowContainer.appendChild(clone);
                });
            }
            
            cardContainer.appendChild(rowContainer);
        }
        
        // Настраиваем анимацию
        setupAnimation(rows);
    }
    
    function setupAnimation(rows) {
        const rowContainers = document.querySelectorAll('.slider-row');
        const duration = 40; // секунд на полный цикл
        
        // Стили для основного контейнера
        cardContainer.style.display = 'flex';
        cardContainer.style.flexDirection = 'column';
        cardContainer.style.gap = '20px';
        cardContainer.style.overflow = 'hidden';
        cardContainer.style.width = '100%';
        
        // Стили для каждого ряда
        rowContainers.forEach((row, index) => {
            row.style.display = 'flex';
            row.style.gap = '20px';
            row.style.width = 'max-content';
            row.style.animation = `scroll${index} ${duration}s linear infinite`;
            
            // Разное направление для четных рядов
            if (index % 2 === 0) {
                row.style.animationDirection = 'reverse';
            }
        });
        
        // Создаем keyframes для каждого ряда
        const style = document.createElement('style');
        let keyframes = '';
        
        for (let i = 0; i < rows; i++) {
            keyframes += `
                @keyframes scroll${i} {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-50%));
                    }
                }
            `;
        }
        
        style.innerHTML = keyframes;
        document.head.appendChild(style);
    }
    
    // Инициализация и обработчик изменения размера окна
    createInfiniteSlider();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cardContainer.innerHTML = '';
            createInfiniteSlider();
        }, 100);
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const btnUp = document.querySelector('.btn-up');
  const footer = document.querySelector('footer');
  
  if (!btnUp || !footer) return; // Проверяем, существуют ли элементы
  
  // Изначально скрываем кнопку
  btnUp.style.display = 'none';
  
  // Функция для проверки видимости футера
  function checkFooterVisibility() {
    const footerRect = footer.getBoundingClientRect();
    const isFooterVisible = footerRect.top <= window.innerHeight;
    
    if (isFooterVisible) {
      btnUp.style.display = 'block';
    } else {
      btnUp.style.display = 'none';
    }
  }
  
  // Обработчик клика по кнопке
  btnUp.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    btnUp.style.display = 'none'; // Скрываем кнопку после клика
  });
  
  // Проверяем видимость футера при скролле
  window.addEventListener('scroll', checkFooterVisibility);
  
  // Также проверяем при загрузке страницы (на случай, если футер сразу виден)
  checkFooterVisibility();
});