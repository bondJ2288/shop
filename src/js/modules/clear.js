import axios from 'axios'; // Импорт библиотеки axios для работы с HTTP-запросами

const accountModal = () => { // Объявление функции accountModal
    const accountModal = document.getElementById('accountInfoModal'); // Получение модального окна аккаунта
    const closeAccountModalButton = document.querySelector('.close-account-modal'); // Получение кнопки закрытия модального окна аккаунта
    const logoutButton = document.getElementById('logoutButton'); // Получение кнопки выхода из аккаунта
    const accountEmail = document.getElementById('account-email'); // Получение элемента с почтовым адресом аккаунта
    const accountUsername = document.getElementById('account-username'); // Получение элемента с именем пользователя аккаунта
    const accountButton = document.getElementById('openAccountInfoModal'); // Получение кнопки для открытия модального окна

    let jwtToken = localStorage.getItem('jwt'); // Получение JWT-токена из локального хранилища
    let userData = JSON.parse(localStorage.getItem('userData')); // Получение данных пользователя из локального хранилища и преобразование из JSON в объект

    // Проверка наличия JWT-токена и данных пользователя в локальном хранилище
    if (jwtToken && userData) {
        accountEmail.textContent = `Email: ${userData.email}`; // Установка текста для элемента с почтовым адресом аккаунта
        accountUsername.textContent = `Username: ${userData.username}`; // Установка текста для элемента с именем пользователя аккаунта
    }

    // Добавление слушателя события клика для кнопки открытия модального окна аккаунта
    accountButton.addEventListener('click', () => {
        accountModal.style.display = 'block'; // Отображение модального окна аккаунта
    });

    // Добавление слушателя события клика для кнопки закрытия модального окна аккаунта
    closeAccountModalButton.addEventListener('click', () => {
        accountModal.style.display = 'none'; // Скрытие модального окна аккаунта
    });

    // Добавление слушателя события клика на весь экран для закрытия модального окна аккаунта при клике за его пределами
    window.addEventListener('click', (event) => {
        if (event.target == accountModal) {
            accountModal.style.display = 'none'; // Скрытие модального окна аккаунта при клике за его пределами
        }
    });

    // Добавление слушателя события клика для кнопки выхода из аккаунта
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('jwt'); // Удаление JWT-токена из локального хранилища
        localStorage.removeItem('userData'); // Удаление данных пользователя из локального хранилища
        setTimeout(() => {
            window.location.reload(); // Перезагрузка страницы
        }, 50);
    });
};

export default accountModal; // Экспорт функции accountModal
