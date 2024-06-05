import axios from 'axios';

// Этот код реализует функциональность для отображения товаров на веб-странице, их визуального представления в виде карточек, а также модального окна с подробной информацией о товаре. 
// Функция Jet принимает аргумент gender (пол) со значением "all" по умолчанию и отображает товары на веб-странице в зависимости от пола.
const Jet = (gender = 'all') => {
    const all = document.querySelectorAll('.grid-item'); // Получение всех элементов с классом 'grid-item'

    // Функция getProducts отправляет GET-запрос на сервер, получает данные о товарах и обновляет их отображение на странице
    function getProducts() {
        const url = 'https://better-success-f3e3e81dd8.strapiapp.com/api/products?populate=*'; // URL-адрес для запроса данных о товарах
        axios.get(url) // Выполнение GET-запроса с использованием axios
            .then(response => { // Обработка успешного ответа от сервера
                const rens = response.data.data.filter(item => { // Фильтрация данных о товарах в зависимости от пола
                    const sex = item.attributes.male; // Пол товара
                    return gender === 'all' || sex === gender; // Условие для фильтрации по полу
                });

                // Обновление отображения каждого товара на странице
                all.forEach((item, index) => {
                    if (index < rens.length) { // Проверка наличия данных о товаре
                        // Получение необходимых данных о товаре
                        const textElement = item.querySelector('.gridtxt');
                        const imgElement = item.querySelector('.gridimg');
                        const priceElement = item.querySelector('.price');
                        const imageURL = rens[index].attributes.preview.data.attributes.url;
                        const description = rens[index].attributes.description;
                        const price = rens[index].attributes.price;
                        const name = rens[index].attributes.name;
                        const id = rens[index].id
                        const imageURL2 = rens[index].attributes.carusel.data[1].attributes.url;
                        const imageURL3 = rens[index].attributes.carusel.data[2].attributes.url;
                        const sex = rens[index].attributes.male;
                        const fullImageURL2 = `${imageURL2}`;
                        const fullImageURL3 = `${imageURL3}`;
                        const fullImageURL = `${imageURL}`;
                        
                        // Обновление содержимого элементов для отображения данных о товаре
                        imgElement.src = fullImageURL;
                        textElement.textContent = name;
                        priceElement.textContent = `${price} руб.`;
                        imgElement.setAttribute('data-name', name);
                        imgElement.setAttribute('data-alt-src', fullImageURL2);
                        imgElement.setAttribute('data-alt-src3', fullImageURL3);
                        imgElement.setAttribute('data-alt-src4', description);
                    }
                });
                grid(); // Вызов функции для обновления отображения товаров
            })
            .catch(error => { // Обработка ошибок при выполнении запроса
                console.error('There was a problem with your axios request:', error);
            });
    }

    getProducts(); // Вызов функции для получения и отображения товаров
}

// Функция grid обрабатывает события mouseenter и mouseleave для анимации изображений товаров
const grid = () => {
    const gridItems = document.querySelectorAll('.grid-item'); // Получение всех элементов с классом 'grid-item'

    // Обработка событий для каждого элемента
    gridItems.forEach(item => {
        const img = item.querySelector('.gridimg'); // Получение изображения товара
        const originalSrc = img.src; // Исходный URL изображения
        let intervalId;

        const altSrc = img.getAttribute('data-alt-src'); // Альтернативный URL изображения
        const altSrc3 = img.getAttribute('data-alt-src3'); // Второй альтернативный URL изображения

        // Обработка события при наведении курсора на элемент
        item.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
            let toggle = false;
            intervalId = setInterval(() => {
                img.classList.add('hidden');
                setTimeout(() => {
                    img.src = toggle ? altSrc3 : altSrc; // Переключение между альтернативными изображениями
                    toggle = !toggle;
                    img.classList.remove('hidden');
                }, 400);
            }, 1500);
        });

        // Обработка события при уводе курсора с элемента
        item.addEventListener('mouseleave', () => {
            clearInterval(intervalId);
            img.classList.add('hidden');
            setTimeout(() => {
                img.src = originalSrc; // Восстановление исходного изображения
                img.classList.remove('hidden');
            }, 400);
        });
    });
};

// Функция hiol обрабатывает события открытия и закрытия модального окна с информацией о товаре
const hiol = () => {
    const openButtons = document.querySelectorAll('.grid-item'); // Получение всех элементов с классом 'grid-item' для открытия модального окна
    const closeButton = document.querySelector('.close-product-modal'); // Получение кнопки закрытия модального окна
    const productModal = document.querySelector('.product-modal'); // Получение модального окна
    const addToCartButton = document.querySelector('.add-to-cart-button2'); // Получение кнопки "Добавить в корзину"

    // Обработка события клика для каждой кнопки открытия модального окна
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const img = button.querySelector('.gridimg');
            const productTitle = button.querySelector('.gridtxt').textContent;
            const productPrice = button.querySelector('.price').textContent;
            const productDescription = img.getAttribute('data-alt-src4');
            const productImage = img.src;
            const productName = img.getAttribute('data-name'); // Получение имени товара

            // Заполнение модального окна данными о товаре
            const modalImage = document.querySelector('.product-image-slider img');
            const modalTitle = document.querySelector('.product-title');
            const modalDescription = document.querySelector('.product-description-slider div');
            const modalPrice = document.querySelector('.product-price');

            if (modalImage && modalTitle && modalDescription && modalPrice) {
                modalImage.src = productImage;
                modalTitle.textContent = productTitle;
                modalDescription.textContent = productDescription;
                modalPrice.textContent = productPrice;
                addToCartButton.setAttribute('data-name', productName); // Установка имени товара для кнопки "Добавить в корзину"
            } else {
                console.error('One or more modal elements are not found'); // Вывод сообщения об ошибке, если один или несколько элементов модального окна не найдены
            }

            // Отображение модального окна
            if (productModal) {
                productModal.style.display = 'flex';
            } else {
                console.error('Product modal element is not found'); // Вывод сообщения об ошибке, если модальное окно не найдено
            }
        });
    });

    // Обработка события клика по кнопке закрытия модального окна
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (productModal) {
                productModal.style.display = 'none'; // Скрытие модального окна
            } else {
                console.error('Product modal element is not found'); // Вывод сообщения об ошибке, если модальное окно не найдено
            }
        });
    } else {
        console.error('Close button element is not found'); // Вывод сообщения об ошибке, если кнопка закрытия модального окна не найдена
    }
}

export { Jet, hiol }; // Экспорт функций Jet и hiol для использования в других файлах
