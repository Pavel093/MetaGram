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