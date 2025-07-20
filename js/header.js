document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.querySelector('.burger-button-pc');
    const burgerMobile = document.querySelector('.burger-mobile');
    const dropdown = document.querySelector('.dropdown-menu');
    const mobileMenu = document.querySelector('.links-mobile');
    
    // Проверяем, ПК ли это (ширина больше 1024px)
    function isDesktop() {
        return window.innerWidth > 1024;
    }
    
    // Функция для переключения меню
    function toggleMenu() {
        if (isDesktop()) {
            dropdown.classList.toggle('active');
            
            if (dropdown.classList.contains('active')) {
                // Добавляем обработчик для закрытия при клике вне меню
                document.addEventListener('click', closeMenuOnClickOutside);
            } else {
                document.removeEventListener('click', closeMenuOnClickOutside);
            }
        } else {
            mobileMenu.classList.toggle('active');
            
            if (mobileMenu.classList.contains('active')) {
                // Добавляем обработчик для закрытия при клике вне меню
                document.addEventListener('click', closeMobileMenuOnClickOutside);
            } else {
                document.removeEventListener('click', closeMobileMenuOnClickOutside);
            }
        }
    }
    
    // Закрытие меню при клике вне его области (для ПК)
    function closeMenuOnClickOutside(e) {
        if (!dropdown.contains(e.target) && e.target !== burgerBtn && !burgerBtn.contains(e.target)) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }
    
    // Закрытие мобильного меню при клике вне его области
    function closeMobileMenuOnClickOutside(e) {
        if (!mobileMenu.contains(e.target) && e.target !== burgerMobile && !burgerMobile.contains(e.target)) {
            mobileMenu.classList.remove('active');
            document.removeEventListener('click', closeMobileMenuOnClickOutside);
        }
    }
    
    // Обработчик клика по бургер-кнопке (ПК)
    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Обработчик клика по мобильной бургер-кнопке
    burgerMobile.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        if (isDesktop()) {
            mobileMenu.classList.remove('active');
            document.removeEventListener('click', closeMobileMenuOnClickOutside);
        } else {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    });
});