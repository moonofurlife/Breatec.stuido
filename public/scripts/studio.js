  document.addEventListener('DOMContentLoaded', () => {
    const loaderAnimation = document.getElementById('loaderAnimation');

    // Запускаем анимацию загрузки
    loaderAnimation.play();

    // Прячем loader после завершения анимации
    loaderAnimation.addEventListener('complete', () => {
        document.getElementById('loader').style.display = 'none';
        loadEmployees();
    });
    const pageHeader = document.querySelector(".page-header");
    const toggleMenu = document.querySelector(".toggle-menu");
    const toggleAnimationPlayer = document.querySelector("#menuToggleAnimation");
    const menuOpenedClass = "menu-open";
    const menuOpenedClassPhone = "menu-open-phone";
    const breakpoint = window.matchMedia("(max-width: 1079px)");

    function toggleMenuHandler(e) {
        e.preventDefault();
        const isMenuOpened = pageHeader.classList.contains(breakpoint.matches ? menuOpenedClassPhone : menuOpenedClass);

        if (isMenuOpened) {
        pageHeader.classList.remove(breakpoint.matches ? menuOpenedClassPhone : menuOpenedClass);
        toggleMenu.setAttribute("aria-label", "Open navigation");
        toggleMenu.setAttribute("aria-expanded", "false");
        toggleAnimationPlayer.getLottie().playSegments([14, 28], true);
        } else {
        pageHeader.classList.add(breakpoint.matches ? menuOpenedClassPhone : menuOpenedClass);
        toggleMenu.setAttribute("aria-label", "Close navigation");
        toggleMenu.setAttribute("aria-expanded", "true");
        toggleAnimationPlayer.getLottie().playSegments([0, 14], true);
        }
    }

    toggleMenu.addEventListener("click", toggleMenuHandler);



    // Функция для загрузки сотрудников
    let employeesLoaded = false; // Флаг для отслеживания загрузки сотрудников
    initSwiper();
    async function loadEmployees() {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || 'en';
        if (employeesLoaded) return; // Если данные уже загружены, выходим из функции
    
        try {
            const mainResponse = await fetch(`/api/employees/main?lang=${lang}`);
            const mainEmployees = await mainResponse.json();
            const mainContainer = document.getElementById('main-employees');
    
            // Очищаем контейнер перед загрузкой новых данных (если нужно)
            mainContainer.innerHTML = '';
    
            mainEmployees.forEach(employee => {
                const columnDiv = document.createElement('div');
                columnDiv.className = 'column button';
                
                const imgContainer = document.createElement('div');
                imgContainer.className = 'img_container';
                const img = document.createElement('img');
                img.src = `/public/uploads/0012/${employee.image}`; 
                img.alt = employee.name;
    
                const nameHeading = document.createElement('h1');
                nameHeading.textContent = employee.name;
    
                const occupationHeading = document.createElement('h2');
                occupationHeading.textContent = employee.occupation;
    
                imgContainer.appendChild(img);
                columnDiv.appendChild(imgContainer);
                columnDiv.appendChild(nameHeading);
                columnDiv.appendChild(occupationHeading);
    
                mainContainer.appendChild(columnDiv);
    
                // Обработчик для попапа
                columnDiv.addEventListener('click', () => showPopup(employee));
            });
    
            const nonMainResponse = await fetch(`/api/employees/non-main?lang=${lang}`);
            const nonMainEmployees = await nonMainResponse.json();
            const nonMainContainer = document.getElementById('non-main-employees-container');
    
            // Очищаем контейнер перед загрузкой новых данных (если нужно)
            nonMainContainer.innerHTML = '';
    
            nonMainEmployees.forEach(employee => {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'card';
    
                const imgDiv = document.createElement('div');
                imgDiv.className = 'image';
                const img = document.createElement('img');
                img.src = `/public/uploads/0012/${employee.image}`; 
                img.alt = employee.name;
    
                const nameHeading = document.createElement('h1');
                nameHeading.textContent = employee.name;
    
                const occupationHeading = document.createElement('h2');
                occupationHeading.textContent = employee.occupation;
    
                imgDiv.appendChild(img);
                cardDiv.appendChild(imgDiv);
                cardDiv.appendChild(nameHeading);
                cardDiv.appendChild(occupationHeading);
    
                nonMainContainer.appendChild(cardDiv);
    
                // Обработчик для попапа
                // cardDiv.addEventListener('click', () => showPopup(employee));
            });
    
            // Создайте и добавьте footer после добавления карточек сотрудников
            const footer = document.createElement('footer');
            const footerInfo = document.createElement('div');
            footerInfo.className = 'footer_info';
    
            const footerObject = document.createElement('object');
            footerObject.setAttribute('data', '/public/src/studio.svg');
            footerObject.setAttribute('type', 'image/svg+xml');
    
            const langHeader = document.createElement('h1');
            langHeader.innerHTML = '<a href="?lang=en">EN</a>/<a href="?lang=ru">RU</a>'; // Добавляем ссылки на язык
    
            footerInfo.appendChild(footerObject);
            footerInfo.appendChild(langHeader);
            footer.appendChild(footerInfo);
    
            // Добавьте footer в конец контейнера
            nonMainContainer.appendChild(footer);
    
            // Устанавливаем флаг
            employeesLoaded = true;
            // initSwiper();
        } catch (error) {
            console.error('Ошибка при загрузке сотрудников:', error);
        }
    }

    // Показ попапа с информацией о сотруднике
    function showPopup(employee) {
        document.getElementById('employee_image').src = `/public/uploads/0012/${employee.image}`;
        document.getElementById('Name').textContent = employee.name;
        document.getElementById('Occupation').textContent = employee.occupation;
        const eduContainer = document.querySelector('.education');
        eduContainer.innerHTML = '';
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || 'en';
        if (Array.isArray(employee.education)) {
            employee.education.forEach(edu => {
                const ed = document.createElement('h1');
                ed.textContent = lang === 'ru' ? 'Обучение:' : 'Education:';

                const yearElement = document.createElement('h3');
                yearElement.textContent = edu.year;
    
                const uniElement = document.createElement('h3');
                uniElement.textContent = edu.university;

                eduContainer.appendChild(ed);
                eduContainer.appendChild(yearElement);
                eduContainer.appendChild(uniElement);

                const hrElement = document.createElement('hr');
                hrElement.setAttribute('size', '1');
                hrElement.setAttribute('color', 'black');
                eduContainer.appendChild(hrElement);

            });}
        const workContainer = document.querySelector('.work');
        workContainer.innerHTML = '';
    
        // Проверьте существование workExperience и его тип
        if (Array.isArray(employee.work_experience)) {
            employee.work_experience.forEach(exp => {
                const wd = document.createElement('h1');
                wd.textContent = lang === 'ru' ? 'Опыт работы:' : 'Work:';

                const yearElement = document.createElement('h3');
                yearElement.textContent = exp.years;
    
                const placeElement = document.createElement('h3');
                placeElement.textContent = exp.place;
    
                const positionElement = document.createElement('h2');
                positionElement.textContent = exp.position;
    
                workContainer.appendChild(wd);
                workContainer.appendChild(yearElement);
                workContainer.appendChild(placeElement);
                workContainer.appendChild(positionElement);
    
                // Создаем и добавляем <hr> с нужными атрибутами
                const hrElement = document.createElement('hr');
                hrElement.setAttribute('size', '1');
                hrElement.setAttribute('color', 'black');
                workContainer.appendChild(hrElement);
            });
        } else {
            const noExperienceMessage = document.createElement('h3');
            noExperienceMessage.textContent = "Нет данных о трудовом опыте.";
            workContainer.appendChild(noExperienceMessage);
        }
    
        const popup = document.querySelector('.popup');
        popup.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    // Инициализация Swiper
    function initSwiper() {
        const swiperContainer = document.querySelector('.swiper-container');
        if (swiperContainer && window.innerWidth > 1079) { // Инициализация только для десктопов
            const swiper = new Swiper(swiperContainer, {
                direction: 'vertical', // Вертикальная ориентация
                simulateTouch: true, 
                // autoHeight: true,
            });
                

            // Переключение слайдов с помощью стрелок на клавиатуре
            document.addEventListener('keydown', function(event) {
                if (event.key === 'ArrowDown' && !swiper.isEnd) {
                    swiper.slideNext(); // Нажата клавиша стрелки вниз
                } else if (event.key === 'ArrowUp' && !swiper.isBeginning) {
                    swiper.slidePrev(); // Нажата клавиша стрелки вверх
                }
            });

        }
    }

    // Обработчик клика для закрытия попапа
    const popup = document.querySelector('.popup');
    popup.addEventListener('click', () => {
        popup.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});