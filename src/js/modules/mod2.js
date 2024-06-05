const load = () => { // Объявление функции load
    document.addEventListener('DOMContentLoaded', () => { // Добавление слушателя события DOMContentLoaded
        const cartModal = document.getElementById('cartModal'); // Получение модального окна корзины
        const openCartButtons = document.querySelectorAll('.open-cart-modal'); // Получение кнопок для открытия модального окна корзины
        const closeCartModal = document.querySelector('.close-cart-modal'); // Получение кнопки для закрытия модального окна корзины
    
        openCartButtons.forEach(button => { // Для каждой кнопки для открытия модального окна корзины добавляем обработчик события клика
            button.addEventListener('click', () => { // Добавление слушателя события клика
                cartModal.style.display = 'flex'; // Отображение модального окна корзины
                document.body.classList.add('modal-open'); // Добавление класса для блокировки прокрутки страницы
            });
        });
    
        closeCartModal.addEventListener('click', () => { // Добавление слушателя события клика для кнопки закрытия модального окна корзины
            cartModal.style.display = 'none'; // Скрытие модального окна корзины
            document.body.classList.remove('modal-open'); // Удаление класса для блокировки прокрутки страницы
        });
    
        window.addEventListener('click', (event) => { // Добавление слушателя события клика для закрытия модального окна корзины при клике за его пределами
            if (event.target === cartModal) { // Проверка, что клик произошел за пределами модального окна корзины
                cartModal.style.display = 'none'; // Скрытие модального окна корзины
                document.body.classList.remove('modal-open'); // Удаление класса для блокировки прокрутки страницы
            }
        });
    });
};

export default load; // Экспорт функции load
