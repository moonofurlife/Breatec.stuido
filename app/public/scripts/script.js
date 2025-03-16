document.addEventListener('DOMContentLoaded', () => {
    const loaderAnimation = document.getElementById('loaderAnimation');

    // Запускаем анимацию загрузки
    loaderAnimation.play();

    // Прячем loader после завершения анимации
    loaderAnimation.addEventListener('complete', () => {
        document.getElementById('loader').style.display = 'none';
    });

    const pageHeader = document.querySelector(".page-header");
    const toggleMenu = document.querySelector(".toggle-menu");
    const toggleAnimationPlayer = document.querySelector("#menuToggleAnimation");
    const menuOpenedClass = "menu-open";
    const menuOpenedClassPhone = "menu-open-phone";
    const breakpoint = window.matchMedia("(max-width: 1079px)");

    function toggleMenuHandler(e) {
        e.preventDefault();

        if (breakpoint.matches) {
            if (pageHeader.classList.contains(menuOpenedClassPhone)) {
                // Если меню открыто, закрываем
                pageHeader.classList.add('menu-closing');
                setTimeout(() => {
                    pageHeader.classList.remove(menuOpenedClassPhone);
                    pageHeader.classList.remove('menu-closing');
                }, 1000);
                toggleMenu.setAttribute("aria-label", "Open navigation");
                toggleMenu.setAttribute("aria-expanded", "false");
                toggleAnimationPlayer.getLottie().playSegments([14, 28], true); // Воспроизвести сегмент для "закрытия"
            } else {
                // Если меню закрыто, открываем
                pageHeader.classList.add(menuOpenedClassPhone);
                toggleMenu.setAttribute("aria-label", "Close navigation");
                toggleMenu.setAttribute("aria-expanded", "true");
                toggleAnimationPlayer.getLottie().playSegments([0, 14], true); // Воспроизвести сегмент для "открытия"
            }
        } else {
            // Аналогично для десктопа
            if (pageHeader.classList.contains(menuOpenedClass)) {
                pageHeader.classList.remove(menuOpenedClass);
                toggleMenu.setAttribute("aria-label", "Open navigation");
                toggleMenu.setAttribute("aria-expanded", "false");
                toggleAnimationPlayer.getLottie().playSegments([14, 28], true);
            } else {
                pageHeader.classList.add(menuOpenedClass);
                toggleMenu.setAttribute("aria-label", "Close navigation");
                toggleMenu.setAttribute("aria-expanded", "true");
                toggleAnimationPlayer.getLottie().playSegments([0, 14], true);
            }
        }
    }

    // Получаем параметры URL
    const urlParams = new URLSearchParams(window.location.search);

    const fetchData = async () => {
        try {
            const lang = urlParams.get('lang') || 'en';
            const response = await fetch(`/api/projects?lang=${lang}`);

            // Проверяем статус ответа
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();
            const projectData = data; // теперь переменная projectData объявлена в пределах функции
            console.log(projectData); // Можно добавить вывод данных в консоль для проверки

            // Добавление проектов в HTML
            const cardsContainer = document.querySelector('.cards_container');
            cardsContainer.innerHTML = ''; // Очищаем предыдущие элементы, если есть

            projectData.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'card';
                projectCard.innerHTML = `
                    <a href="/gallery/${project.slug}">
                        <div class="image">
                            <img src="${'/public/uploads/' + project.slug + '/' + project.images[0]}" alt="${project.name}">
                        </div>
                        <h1>${project.name}</h1>
                    </a>
                `;
                cardsContainer.appendChild(projectCard);
            });

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    // Вызов функции для получения данных
    fetchData();

    // Добавляем обработчик события
    toggleMenu.addEventListener("click", toggleMenuHandler);
});