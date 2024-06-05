import axios from 'axios'; // Импорт библиотеки axios для выполнения HTTP-запросов

const slider = () => {
    const total = []; // Массив для хранения данных о продуктах
    const photo = document.getElementById('photo'); // Получение элемента для отображения фотографии товара
    const oldpr = document.getElementById('old'); // Получение элемента для отображения старой цены товара
    const newpr = document.getElementById('new');// Получение элемента для отображения новой цены товара
    const gridBlock = document.querySelector('.grid'); 

    // Массив кнопок для переключения слайдов
    const buttons = [
        document.getElementById('f'),
        document.getElementById('s'),
        document.getElementById('t'),
        document.getElementById('fo')
    ];

    // Функция для загрузки данных о продуктах и их отображения в слайдере
    function sli() {
        const url = `https://better-success-f3e3e81dd8.strapiapp.com/api/products?populate=*`; // URL для получения данных о продуктах
        axios.get(url) // Выполнение GET-запроса для получения данных о продуктах
            .then(response => {
                const rens = response.data.data; // Получение данных о продуктах из ответа сервера

                // Добавление данных о продуктах в массив total
                total.push(rens[0].attributes);
                total.push(rens[1].attributes);
                total.push(rens[2].attributes);
                total.push(rens[3].attributes);

                let currentIndex = 0; // Индекс текущего слайда

                // Функция для обновления слайдера
                const updateSlider = () => {
                    if (currentIndex < total.length) { // Проверка, что индекс находится в пределах массива total
                        // Обновление данных о текущем слайде
                        photo.src = `https://better-success-f3e3e81dd8.strapiapp.com${total[currentIndex].preview.data.attributes.url}`;
                        oldpr.textContent = total[currentIndex].price;
                        newpr.textContent = total[currentIndex].price - 200;
                        currentIndex++;
                    } else {
                        // Возврат к первой фотографии после завершения цикла
                        photo.src = `https://better-success-f3e3e81dd8.strapiapp.com${total[0].preview.data.attributes.url}`;
                        oldpr.textContent = total[0].price;
                        newpr.textContent = total[0].price - 200;
                        clearInterval(sliderInterval); // Остановка интервала для переключения слайдов
                    }
                };

                // Установка интервала для автоматического переключения слайдов каждые 2 секунды
                const sliderInterval = setInterval(updateSlider, 2000);

                // Инициализация слайдера
                updateSlider();

                // Добавление обработчиков событий клика для кнопок переключения слайдов
                buttons.forEach((btn, index) => {
                    btn.onclick = () => {
                        // Обновление данных о текущем слайде при клике на кнопку
                        photo.src = `https://better-success-f3e3e81dd8.strapiapp.com${total[index].preview.data.attributes.url}`;
                        oldpr.textContent = total[index].price;
                        newpr.textContent = total[index].price - 200;
                    };
                });
                document.querySelector('.fbb').addEventListener('click', () => {
                    gridBlock.scrollIntoView({ behavior: "smooth" }); // Плавно скроллим к блоку с классом 'grid'
                });
            })
            .catch(error => {
                console.error('There was a problem with your axios request:', error); // Вывод ошибки в консоль в случае возникновения проблемы с запросом axios
            });
    }

    sli(); // Вызов функции для инициализации слайдера
};

export default slider; // Экспорт функции slider
