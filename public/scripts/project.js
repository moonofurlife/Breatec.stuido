window.addEventListener('load', () => {
  document.getElementById('loader').classList.add('hidden');
  document.getElementById('content').style.display = 'block';
});
const pageHeader = document.querySelector(".page-header");
const toggleMenu = document.querySelector(".toggle-menu");
const player = document.querySelector("lottie-player");
const menuWrapper = document.querySelector(".menu-wrapper");
const mainContainer = document.querySelector(".content_container");
const menuOpenedClass = "menu-open";
const breakpoint = window.matchMedia("(max-width: 1079px)");
const menuwrapper = document.querySelector(".menu-wrapper")

// Функция для обработки открытия меню
function toggleMenuHandler(e) {
  e.preventDefault();

  // Если ширина экрана меньше 1080px
  if (breakpoint.matches) {
    if (pageHeader.classList.contains(menuOpenedClass)) {
      // Закрытие меню
      pageHeader.classList.remove(menuOpenedClass);
      toggleMenu.setAttribute("aria-label", "Open navigation");
      toggleMenu.setAttribute("aria-expanded", "false");
      player.getLottie().playSegments([14, 28], true);
      mainContainer.style.transform = "none"; 
      mainContainer.style.backgroundColor = "white";
    } else {
      // Открытие меню
      pageHeader.classList.add(menuOpenedClass);
      toggleMenu.setAttribute("aria-label", "Close navigation");
      toggleMenu.setAttribute("aria-expanded", "true");
      player.getLottie().playSegments([0, 14], true);
      mainContainer.style.transform = "translateY(150px)";
      mainContainer.style.backgroundColor = "white";
      menuwrapper.style.backgroundColor = "rgb(255,255,255,0.4";
    }
  } else {
    // Если ширина экрана больше 1080px
    if (pageHeader.classList.contains(menuOpenedClass)) {
      // Закрытие меню
      pageHeader.classList.remove(menuOpenedClass);
      toggleMenu.setAttribute("aria-label", "Open navigation");
      toggleMenu.setAttribute("aria-expanded", "false");
      player.getLottie().playSegments([14, 28], true);
    } else {
      // Открытие меню
      pageHeader.classList.add(menuOpenedClass);
      toggleMenu.setAttribute("aria-label", "Close navigation");
      toggleMenu.setAttribute("aria-expanded", "true");
      player.getLottie().playSegments([0, 14], true);
    }
  }
}

// Добавляем обработчик события
toggleMenu.addEventListener("click", toggleMenuHandler);

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.buttom');
  const popup = document.querySelector('.popup');
  const closePopup = document.querySelector('.close-popup');

  if (button) {
    button.addEventListener('click', () => {
      popup.classList.add('active');
      console.log('Button clicked');
    });
  } else {
    console.error('Элемент .buttom не найден');
  }

  if (closePopup) {
    closePopup.addEventListener('click', () => {
      console.log('Button закрыть');
      popup.classList.remove('active');
    });
  }

  // Закрытие попапа при клике вне его контента
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      popup.classList.remove('active');
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const projectNameElements = document.querySelectorAll('.project_name'); // Названия проекта
  const locationElement = document.querySelector('.popup h2:nth-of-type(1)'); // Локация
  const areaElement = document.querySelector('.popup h2:nth-of-type(2)'); // Площадь
  const processElement = document.querySelector('.popup h2:nth-of-type(3)'); // Стадия
  const sliderImg = document.querySelector('.slider_img'); // Слайдер изображений

  let images = [];
  let currentIndex = 0;

  // Загружаем данные из JSON
  fetch('/public/data/projectData.json')
    .then(response => response.json())
    .then(data => {
      const project = data.projects[0]; // Берем только первый проект

      // Обновляем данные на странице
      projectNameElements.forEach(el => el.textContent = project.name); // Название проекта
      locationElement.textContent = `Location: ${project.location}`;
      areaElement.textContent = `Area: ${project.area}`;
      processElement.textContent = `Process: ${project.process}`;

      // Устанавливаем изображения для слайдера
      images = project.images;
      if (images.length > 0) {
        sliderImg.src = images[currentIndex]; // Первое изображение
      }
    })
    .catch(error => console.error('Error loading project data:', error));

  // Функция для обновления изображения
  const updateImage = () => {
    sliderImg.style.opacity = '0'; // Скрываем изображение
    setTimeout(() => {
      sliderImg.src = images[currentIndex]; // Меняем изображение
      sliderImg.style.opacity = '1'; // Показываем изображение
    }, 300); // Длительность совпадает с CSS transition
  };

  // Навигация по изображениям
  sliderImg.addEventListener('click', (event) => {
    const { offsetX, target } = event;
    const middle = target.clientWidth / 2;

    if (offsetX < middle) {
      // Клик слева — предыдущее изображение
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    } else {
      // Клик справа — следующее изображение
      currentIndex = (currentIndex + 1) % images.length;
    }
    updateImage();
  });
});
