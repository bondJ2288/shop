import axios from 'axios';
//Этот код реализует аутентификацию пользователя через форму ввода email и пароля:

const auth2 = () => {
    const loginForm = document.getElementById('hh');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

        // Получаем значения полей формы
        const email = document.getElementById('email3').value;
        const password = document.getElementById('password3').value;

        // Вызываем функцию auth с полученными данными
        auth(email, password);
    });

    // Функция auth принимает email и password пользователя и отправляет запрос на сервер для аутентификации
    const auth = (email, password) => {
        axios
            .post('https://better-success-f3e3e81dd8.strapiapp.com/api/auth/local', {
                identifier: email,
                password: password
            })
            .then((response) => {
                // Если аутентификация прошла успешно, сохраняем полученный JWT токен в локальном хранилище
                const jwt = response.data.jwt;
                window.localStorage.setItem('jwt', jwt);

                // Получаем ID пользователя из ответа сервера
                const userId = response.data.user.id;

                // Проверяем или создаем корзину для пользователя
                checkOrCreateCart(userId, jwt);

                // Обновляем данные пользователя
                refreshUser(jwt);
            })
            .catch((error) => {
                // Обрабатываем ошибку аутентификации
                console.error('An error occurred during authentication:', error);
            });
    };

    // Функция checkOrCreateCart проверяет существует ли корзина для пользователя, и если нет - создает новую
    const checkOrCreateCart = (userId, jwt) => {
        axios
            .get('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', {
                params: {
                    'user.id': userId
                },
                headers: {
                    'Authorization': 'Bearer ' + jwt
                }
            })
            .then(response => {
                // Если корзина не существует, создаем новую
                if (response.data.length === 0) {
                    createCartForUser(userId, jwt);
                } else {
                    console.log('Cart already exists for user:', response.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Функция createCartForUser создает новую корзину для пользователя
    const createCartForUser = (userId, jwt) => {
        axios
            .post('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', {
                data: {
                    user: userId
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            })
            .then(response => {
                console.log('Cart created:', response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Функция refreshUser обновляет данные пользователя после успешной аутентификации
    const refreshUser = (jwt) => {
        axios
            .get('https://better-success-f3e3e81dd8.strapiapp.com/api/users/me?populate=*', {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            })
            .then((response) => {
                // Получаем данные пользователя из ответа сервера и сохраняем их в локальном хранилище
                const userData = response.data;
                window.localStorage.setItem('userData', JSON.stringify(userData));

                // Перенаправляем пользователя на главную страницу
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('An error occurred during authentication:', error);
            });
    };
};

export default auth2;
