document.addEventListener('DOMContentLoaded', () => {
  const loaderAnimation = document.getElementById('loaderAnimation');

  // Запускаем анимацию загрузки
  loaderAnimation.play();
  
  // Прячем loader после завершения анимации
  loaderAnimation.addEventListener('complete', () => {
      document.getElementById('loader').style.display = 'none';
  });
});
const pageHeader = document.querySelector(".page-header");
const toggleMenu = document.querySelector(".toggle-menu");
const toggleAnimationPlayer = document.querySelector("#menuToggleAnimation");
const menuOpenedClass = "menu-open";
const menuOpenedClassPhone = "menu-open-phone";
const breakpoint = window.matchMedia("(max-width: 500px)");

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

toggleMenu.addEventListener("click", toggleMenuHandler);

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.buttom');
  const popup = document.querySelector('.popup');

  if (button) {
    button.addEventListener('click', () => {
      popup.classList.add('active');
    });
  } 

  popup.addEventListener('click', (event) => {
    popup.classList.remove('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const projectNameElements = document.querySelectorAll('.project_name'); // Названия проекта
  const locationElement = document.querySelector('.popup h2:nth-of-type(1)'); // Локация
  const areaElement = document.querySelector('.popup h2:nth-of-type(2)'); // Площадь
  const processElement = document.querySelector('.popup h2:nth-of-type(3)'); // Стадия
  const sliderImg = document.querySelector('.slider_img'); // Слайдер изображений
  const client = document.getElementById("Client");
  const description =document.getElementById('description');

  let currentIndex = 0;
  let projectData = {}; // Ссылка на проект

  // Функция для смены изображения в слайдере
  const updateSliderImage = () => {
    if (projectData.images && projectData.images.length > 0) {
      sliderImg.src = projectData.images[currentIndex]; // Установка изображения
    }
  };

  // Навигация по изображениям по клику на слайдер
  sliderImg.addEventListener('click', () => {
    if (projectData.images && projectData.images.length > 0) {
      currentIndex = (currentIndex + 1) % projectData.images.length; // Переход к следующему изображению
      updateSliderImage(); // Обновляем слайдер
    }
  });

  // Обработчик для загрузки данных из JSON
  const fetchData = async () => {
    try {
      const response = await fetch('/public/data/projectData.json');
      const data = await response.json(); // Загружаем данные проекта

      // Получаем конкретный проект из загруженных данных
      const projectSlug = window.location.pathname.split('/').pop(); // Получаем слаг из URL
      projectData = data.projects.find(p => p.slug === projectSlug); // Ищем наш проект
      
      if (projectData) {
        // Обновляем данные на странице
        projectNameElements.forEach(el => el.textContent = projectData.name); // Название проекта
        locationElement.textContent = `Location: ${projectData.location}`;
        areaElement.textContent = `Area: ${projectData.area}`;
        processElement.textContent = `Process: ${projectData.process}`;
        client.textContent = `Client: ${projectData.client}`;
        const formattedDescription = projectData.description.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
        description.innerHTML = formattedDescription;

        // Устанавливаем изображения
        if (projectData.images && projectData.images.length > 0) {
          currentIndex = 0; // Сбрасываем индекс
          updateSliderImage(); // Устанавливаем первое изображение
        } else {
          console.error('Нет изображений для проекта');
        }
      } else {
        console.error('Проект не найден');
      }

    } catch (error) {
      console.error('Ошибка загрузки данных проекта:', error);
    }
  };

  fetchData(); // Стартуем загрузку данных
});