document.addEventListener('DOMContentLoaded', () => {
    const loaderAnimation = document.getElementById('loaderAnimation');
  
    // Запускаем анимацию загрузки
    loaderAnimation.play();
    
    // Прячем loader после завершения анимации
    loaderAnimation.addEventListener('complete', () => {
        document.getElementById('loader').style.display = 'none';
    });
  
    // Функция для инициализации Swiper
    function initSwiper() {
        const swiperContainer = document.querySelector('.swiper-container');
  
        if (swiperContainer && window.innerWidth > 1079) { // Инициализация только для десктопов
            const swiper = new Swiper(swiperContainer, {
                direction: 'vertical', // Вертикальная ориентация
                simulateTouch: true, 
                autoHeight: true,
              //   spaceBetween: 100,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
            
            // Переключение слайдов при прокрутке колесом мыши
            swiper.on('wheel', function(event) {
                if (event.deltaY > 0) {
                    swiper.slideNext(); // Прокрутка вниз
                } else {
                    swiper.slidePrev(); // Прокрутка вверх
                }
                event.preventDefault();
            });
  
            // Переключение слайдов с помощью стрелок на клавиатуре
            document.addEventListener('keydown', function(event) {
                if (event.key === 'ArrowDown') {
                    swiper.slideNext(); // Нажата клавиша стрелки вниз
                } else if (event.key === 'ArrowUp') {
                    swiper.slidePrev(); // Нажата клавиша стрелки вверх
                }
            });
        }
    }
  
    // Инициализация Swiper
    initSwiper();
  
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
              setTimeout(function() {
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
  
    // Добавляем обработчик события для кнопки меню
    toggleMenu.addEventListener("click", toggleMenuHandler);
  
    
    const buttons = document.querySelectorAll('.button');
    const popup = document.querySelector('.popup');
    const popup_content = document.querySelector('.popup-content');
    const nameElement = popup_content.querySelector('#Name');
    const img = document.getElementById('employee_image');
    const occupationElement = popup_content.querySelector('#Occupation');
    const yearEduElement = popup_content.querySelector('#year_edu');
    const universityElement = popup_content.querySelector('#university');
    const workContainer = popup_content.querySelector('.work'); 
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const h1 = this.querySelector('h1');
            
            if (h1) {
                const employeeName = h1.textContent; // Получаем имя сотрудника
    
                // Загрузка данных из JSON файла
                fetch('public/data/employees.json') // Укажите путь к вашему JSON файлу
                    .then(response => response.json())
                    .then(data => {
                        // Находим информацию о сотруднике по имени
                        const employee = data.find(emp => emp.name === employeeName);
                        console.log(employee);
                        if (employee) {
                            // Заполняем информацию в попапе
                            img.src = employee.image;
                            nameElement.textContent = employee.name;
                            occupationElement.textContent = employee.occupation;
                            yearEduElement.textContent = employee.education.year;
                            universityElement.textContent = employee.education.university;
    
                            console.log(workContainer)
                            workContainer.innerHTML = ''; // Очищаем контейнер перед добавлением нового опыта
                            
                            // Добавляем новый опыт работы
                            employee.workExperience.forEach(exp => {
                                const yearElement = document.createElement('h3');
                                yearElement.textContent = exp.year;
                                
                                const placeElement = document.createElement('h3');
                                placeElement.textContent = exp.place;
    
                                const positionElement = document.createElement('h2');
                                positionElement.textContent = exp.position;
    
                                workContainer.appendChild(yearElement);
                                workContainer.appendChild(placeElement);
                                workContainer.appendChild(positionElement);
    
                                // Создаем и добавляем <hr> с нужными атрибутами
                                const hrElement = document.createElement('hr');
                                hrElement.setAttribute('size', '1');
                                hrElement.setAttribute('color', 'black');
                                workContainer.appendChild(hrElement);
                            });
  
                        }
                        const buttonRect = button.getBoundingClientRect(); 
                        const scrollTop = window.scrollY || window.pageYOffset; 
                        popup.classList.add('active');
                        if (breakpoint.matches){
                          popup.style.top = `${buttonRect.top + scrollTop}px`
                        }
                        else {
                          popup.style.top = ``
                        }
                        document.body.classList.add('no-scroll');
                    })
                    .catch(error => {
                        console.error('Ошибка при загрузке данных:', error);
                    });
            }
        });
    });
    popup.addEventListener('click', (event) => {
        popup.classList.remove('active');
        popup.style.top = '';
        document.body.classList.remove('no-scroll');
    });
  
    
  });