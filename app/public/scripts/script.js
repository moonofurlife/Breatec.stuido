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
const player = document.querySelector("lottie-player");
const menuWrapper = document.querySelector(".menu-wrapper");
const mainContainer = document.querySelector(".main_container");
const menuOpenedClass = "menu-open";
const breakpoint = window.matchMedia("(max-width: 1079px)");

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
      mainContainer.style.transform = "translateY(0)"; 
    } else {
      // Открытие меню
      pageHeader.classList.add(menuOpenedClass);
      toggleMenu.setAttribute("aria-label", "Close navigation");
      toggleMenu.setAttribute("aria-expanded", "true");
      player.getLottie().playSegments([0, 14], true);
      mainContainer.style.transform = "translateY(200px)"; // Опускаем вниз (пример)
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
});