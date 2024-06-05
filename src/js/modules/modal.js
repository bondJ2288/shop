const modal = () => {
    // это дефолтный софт для открытия закрытия модалок
    const modal = document.getElementById("myModal");
    const modal2 = document.getElementById("myModal2");
    const modal3 = document.getElementById("myModal3");
    const cartModal = document.getElementById("cartModal");
    const delivmodal = document.getElementById('uniqueDeliveryModal') // Добавляем получение cartModal

    const btn = document.getElementById("openModalBtn");
    const btn2 = document.getElementById("openModalBtn2");
    const btn3 = document.getElementById("openModalBtn3");
    const delivSmodal = document.getElementById('uniqueShippingModal');

    const span = document.getElementsByClassName("close")[0];
    const span2 = document.getElementsByClassName("close2")[0];
    const span3 = document.getElementsByClassName("close3")[0];
    const spanCart = document.getElementsByClassName("close-cart-modal")[0];

    const reg = document.getElementById("reg");
    const log = document.getElementById("log");
    const email = document.getElementById("emailul");

    // Проверяем наличие JWT токена
    const jwtToken = localStorage.getItem('jwt');
    const subscribeButton = document.querySelector('.sub');
    const emailInput = document.querySelector('.email');
    // Получаем все элементы с классом "size"
    const sizeElements = document.querySelectorAll('.size');

    // Функция для обработки клика по размеру
    const handleSizeClick = (event) => {
        // Удаляем класс "active" у всех элементов
        sizeElements.forEach(sizeElement => {
            sizeElement.classList.remove('active');
        });

        // Добавляем класс "active" к текущему элементу
        event.target.classList.add('active');
    };

    // Добавляем обработчик клика к каждому элементу с классом "size"
    sizeElements.forEach(sizeElement => {
        sizeElement.addEventListener('click', handleSizeClick);
    });


    // Функция для очистки поля ввода email
    const clearEmailInput = () => {
        emailInput.value = '';
    };

    // Добавляем обработчик клика на кнопку "Подписаться"
    if (subscribeButton) {
        subscribeButton.addEventListener('click', clearEmailInput);
    }


    if (jwtToken) {
        // Если токен существует, открываем cartModal при клике на btn2
        if (btn2 && modal2 && span2 && cartModal) {
            btn2.onclick = function() {
                cartModal.style.display = "block";
            };
        }
    } else {
        // Если токен не существует, открываем myModal2 при клике на btn2
        if (btn2 && modal2 && span2) {
            btn2.onclick = function() {
                modal2.style.display = "block";
            };
        }
    }

    // Остальной код оставляем без изменений


    if (btn3 && modal3 && span3) {
        btn3.onclick = function() {
            modal3.style.display = "block";
        };
    }

    if (reg && email) {
        reg.onclick = function() {
            email.style.display = "block";
        };
    }

    if (log && modal && modal2) {
        log.onclick = function() {
            modal2.style.display = "none";
            modal.style.display = "block";
        };
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        };
    }

    if (span2) {
        span2.onclick = function() {
            modal2.style.display = "none";
        };
    }

    if (span3) {
        span3.onclick = function() {
            modal3.style.display = "none";
        };
    }

    if (spanCart && modal2) {
        spanCart.onclick = function() {
            modal2.style.display = "none";
        };
    }
    if (btn3 && delivmodal) {
        btn3.addEventListener('click', function() {
            delivmodal.style.display = "block";
        });
    }
    if (btn && delivSmodal) {
        btn.addEventListener('click', function() {
            delivSmodal.style.display = "block";
        });
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        } else if (event.target == modal2) {
            modal2.style.display = "none";
        } else if (event.target == modal3) {
            modal3.style.display = "none";
        }
        if (event.target === delivmodal) {
            delivmodal.style.display = "none";
        }

        if (event.target === delivSmodal) {
            delivSmodal.style.display = "none";
        }
    };
};

export default modal;
