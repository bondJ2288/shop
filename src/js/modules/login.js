import axios from 'axios'; // Импорт библиотеки axios для работы с HTTP-запросами

const addUser = () => {
    const registerForm = document.getElementById('ff'); // Получение формы регистрации

    // Добавление слушателя события отправки формы
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращение стандартного поведения отправки формы

        // Получение значений полей формы
        const username2 = document.getElementById('phone5').value;
        const email2 = document.getElementById('emailul5').value;
        const password2 = document.getElementById('password5').value;

        // Отправка POST-запроса для регистрации пользователя
        axios
            .post('https://better-success-f3e3e81dd8.strapiapp.com/api/auth/local/register', { // URL для регистрации пользователя
                username: username2, // Параметр с именем пользователя
                email: email2, // Параметр с адресом электронной почты пользователя
                password: password2 // Параметр с паролем пользователя
            })
            .then(response => {
                const jwt = response.data.jwt; // Получение JWT-токена из ответа сервера
                const userId = response.data.user.id; // Получение идентификатора пользователя из ответа сервера

                // Сохранение JWT-токена в локальном хранилище браузера
                window.localStorage.setItem('jwt', jwt);

                // Проверка или создание корзины для пользователя
                checkOrCreateCart(userId, jwt);

                // Закрытие модального окна после успешной регистрации
                const modal = document.getElementById('myModal2');
                modal.style.display = 'none';
            })
            .catch(error => {
                console.log(error); // Вывод ошибки в консоль в случае возникновения ошибки при регистрации пользователя
            });
    });
};

// Функция для проверки существующей корзины пользователя или создания новой
const checkOrCreateCart = (userId, jwt) => {
    axios
        .get('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', { // GET-запрос для получения корзины пользователя
            params: {
                'filters[user][id][$eq]': userId // Параметр запроса для указания идентификатора пользователя
            },
            headers: {
                'Authorization': 'Bearer ' + jwt // Установка заголовка авторизации с JWT-токеном
            }
        })
        .then(response => {
            // Если корзина не существует, создаем новую
            if (response.data.data.length === 0) {
                createCartForUser(userId, jwt); // Создание новой корзины для пользователя
            } else {
                console.log('Cart already exists for user:', response.data.data); // Вывод сообщения о существующей корзине пользователя
            }
        })
        .catch(error => {
            console.log(error); // Вывод ошибки в консоль в случае возникновения ошибки при получении корзины пользователя
        });
};

// Функция для создания новой корзины для пользователя
const createCartForUser = (userId, jwt) => {
    axios
        .post('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', { // POST-запрос для создания новой корзины пользователя
            data: {
                user: userId // Параметр запроса для указания идентификатора пользователя
            }
        }, {
            headers: {
                'Content-Type': 'application/json', // Установка заголовка Content-Type
                'Authorization': 'Bearer ' + jwt // Установка заголовка авторизации с JWT-токеном
            }
        })
        .then(response => {
            console.log('Cart created:', response.data); // Вывод сообщения о созданной корзине для пользователя
        })
        .catch(error => {
            console.log(error); // Вывод ошибки в консоль в случае возникновения ошибки при создании корзины для пользователя
        });
};

export default addUser; // Экспорт функции addUser
