const search = () => {
    const searchInput = document.querySelector('.searcher'); // Получение элемента поискового поля
    const gridItems = document.querySelectorAll('.grid-item'); // Получение всех элементов сетки

    if (!searchInput) { // Проверка наличия элемента поискового поля
        console.error('Search input element not found'); // Вывод сообщения об ошибке в консоль, если элемент поискового поля не найден
        return; // Выход из функции
    }

    // Функция для отображения всех элементов сетки
    function showAllItems() {
        gridItems.forEach(item => {
            item.classList.remove('hidden'); // Удаление класса hidden для отображения элемента
            item.classList.add('fade-in'); // Добавление класса fade-in для плавного появления элемента
        });
    }

    // Функция для скрытия элемента
    function hideItem(item) {
        item.classList.add('hidden'); // Добавление класса hidden для скрытия элемента
        item.classList.remove('fade-in'); // Удаление класса fade-in
    }

    // Добавление слушателя события input для поля поиска
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase(); // Получение текста из поля поиска и преобразование его в нижний регистр

        // Перебор всех элементов сетки
        gridItems.forEach(item => {
            const textElement = item.querySelector('.gridtxt'); // Получение элемента с текстом из элемента сетки
            const itemName = textElement.textContent.toLowerCase(); // Получение текста элемента и преобразование его в нижний регистр

            // Проверка, содержит ли текст элемента поисковую строку
            if (itemName.includes(searchTerm)) {
                item.classList.remove('hidden'); // Удаление класса hidden для отображения элемента
                item.classList.add('fade-in'); // Добавление класса fade-in для плавного появления элемента
            } else {
                hideItem(item); // Скрытие элемента, если он не содержит поисковую строку
            }
        });

        // Отображение всех элементов сетки, если поисковая строка пуста
        if (!searchTerm) {
            showAllItems(); // Вызов функции для отображения всех элементов сетки
        }
    });

    showAllItems(); // Вызов функции для отображения всех элементов сетки при загрузке страницы
};

export default search; // Экспорт функции search
