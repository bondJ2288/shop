// добавляет элементы при клике на кнопку еще
const ak = () => {
    // Получаем кнопку "Еще..."
    const moreButton = document.querySelector('.idk');

    // Функция, которая добавляет элемент в список
    function addNewItem() {
        // Получаем контейнер, в который будем добавлять новые элементы
        const gridContainer = document.querySelector('.grid-container');

        // Создаем новый элемент div и добавляем ему класс grid-item
        const newItem = document.createElement('div');
        newItem.classList.add('grid-item');

        // Заполняем содержимое нового элемента HTML-кодом
        newItem.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;

        // Добавляем новый элемент в контейнер
        gridContainer.appendChild(newItem);

        // Повторяем те же шаги для создания и добавления еще трех элементов
        const newItem2 = document.createElement('div');
        newItem2.classList.add('grid-item');
        newItem2.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;
        gridContainer.appendChild(newItem2);

        // Повторяем те же шаги для создания и добавления еще трех элементов
        const newItem3 = document.createElement('div');
        newItem3.classList.add('grid-item');
        newItem3.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;
        gridContainer.appendChild(newItem3);

        // Повторяем те же шаги для создания и добавления еще трех элементов
        const newItem4 = document.createElement('div');
        newItem4.classList.add('grid-item');
        newItem4.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;
        gridContainer.appendChild(newItem4);
    }

    // Обработчик события клика на кнопку "Еще..."
    moreButton.addEventListener('click', addNewItem);
}

export default ak;
