const history = () => {
    const accountInfoModal = document.getElementById('accountInfoModal'); // Получение модального окна аккаунта
    const closeAccountModalButton = document.querySelector('.close-account-modal'); // Получение кнопки закрытия модального окна аккаунта
    const accountEmailElement = document.getElementById('account-email'); // Получение элемента с адресом электронной почты аккаунта
    const accountUsernameElement = document.getElementById('account-username'); // Получение элемента с именем пользователя аккаунта
    const ordersContainer = document.getElementById('orders-container'); // Получение контейнера для заказов
    const logoutButton = document.getElementById('logoutButton'); // Получение кнопки выхода из аккаунта
    const openAccountModalButton = document.getElementById('openAccountInfoModal'); // Получение кнопки открытия модального окна аккаунта

    let jwtToken = localStorage.getItem('jwt'); // Получение JWT-токена из локального хранилища
    let userData = JSON.parse(localStorage.getItem('userData')); // Получение данных пользователя из локального хранилища и преобразование их из JSON в объект

    // Проверка наличия JWT-токена и данных пользователя в локальном хранилище
    if (!jwtToken || !userData || !userData.cart || !userData.cart.id) {
        console.error('User data or JWT token not found'); // Вывод сообщения об ошибке в консоль, если данные пользователя или JWT-токен не найдены
        return; // Выход из функции
    }

    // Функция для отображения информации о заказе в модальном окне
    const displayOrderInfo = (orders) => {
        ordersContainer.innerHTML = ''; // Очищаем контейнер перед добавлением заказов

        orders.forEach(order => {
            const orderElement = document.createElement('div'); // Создание нового элемента заказа
            orderElement.classList.add('order-item'); // Добавление класса для стилизации элемента заказа

            orderElement.innerHTML = `
                <h3>Заказ №${order.id}</h3>
                <p>Продукты:</p>
                <ul>
                    <li>${order.attributes.name}</li>
                </ul>
            `; // Заполнение HTML-содержимым элемента заказа

            ordersContainer.appendChild(orderElement); // Добавление элемента заказа в контейнер
        });
    };

    // Обработчик клика по кнопке для закрытия модального окна аккаунта
    closeAccountModalButton.addEventListener('click', () => {
        accountInfoModal.style.display = 'none'; // Скрытие модального окна аккаунта
    });

    // Обработчик клика по кнопке "Выйти"
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('jwt'); // Удаление JWT-токена из локального хранилища
        localStorage.removeItem('userData'); // Удаление данных пользователя из локального хранилища
        window.location.reload(); // Перезагрузка страницы после выхода
    });

    // Функция для получения информации о заказах
    const getOrderInfo = () => {
        const userId = userData.id; // Получение идентификатора пользователя
        const productRequests = []; // Массив для запросов на получение информации о продуктах в заказах пользователя

        axios.get(`https://better-success-f3e3e81dd8.strapiapp.com/api/orders?userId=${userId}&populate=prods`, { // Выполнение GET-запроса для получения информации о заказах пользователя
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Установка заголовка авторизации с JWT-токеном
            }
        }).then(response => {
            const orders = response.data.data; // Получение данных о заказах

            // Обработка полученных данных о заказах
            orders.forEach(order => {
                order.attributes.prods.data.forEach(prod => {
                    productRequests.push(axios.get(`https://better-success-f3e3e81dd8.strapiapp.com/api/products/${prod.id}`, { // Добавление запросов на получение информации о продуктах в заказах
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}` // Установка заголовка авторизации с JWT-токеном
                        }
                    }));
                });
            });

            // Выполнение всех запросов на получение информации о продуктах
            Promise.all(productRequests)
                .then(responses => {
                    responses.forEach((response, index) => {
                        const product = response.data.data; // Получение данных о продукте из ответа сервера

                        // Обновление данных о продуктах в заказах
                        orders.forEach(order => {
                            order.attributes.prods.data.forEach(prod => {
                                if (prod.id === product.id) {
                                    prod.attributes.name = product.attributes.name; // Обновление имени продукта в заказе
                                }
                            });
                        });
                    });

                    // Отображение информации о заказах после обновления данных о продуктах
                    displayOrderInfo(orders);
                })
                .catch(error => {
                    console.error('Error fetching product data:', error.response ? error.response.data : error.message); // Вывод сообщения об ошибке в консоль при ошибке получения данных о продуктах
                });
        }).catch(error => {
            console.error('Error fetching order data:', error.response ? error.response.data : error.message); // Вывод сообщения об ошибке в консоль при ошибке получения данных о заказах
        });
    };

    // Обработчик для открытия модального окна и получения информации о заказах
    openAccountModalButton.addEventListener('click', () => {
        accountEmailElement.textContent = `Email: ${userData.email}`; // Установка текста для элемента с адресом электронной почты аккаунта
        accountUsernameElement.textContent = `Phone: ${userData.username}`; // Установка текста для элемента с именем пользователя аккаунта
        accountInfoModal.style.display = 'block'; // Отображение модального окна аккаунта
        getOrderInfo(); // Получение информации о заказах
    });
};

export default history; // Экспорт функции history
