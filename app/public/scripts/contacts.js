document.addEventListener('DOMContentLoaded', () => {
  const loaderAnimation = document.getElementById('loaderAnimation');

  // Запускаем анимацию загрузки
  loaderAnimation.play();
  
  // Прячем loader после завершения анимации
  loaderAnimation.addEventListener('complete', () => {
      document.getElementById('loader').style.display = 'none';
  });
  
  // Остальной код
  const pageHeader = document.querySelector(".page-header");
  const toggleMenu = document.querySelector(".toggle-menu");
  const menuToggleAnimation = document.getElementById('menuToggleAnimation');
  const mainContainer = document.querySelector(".main_container");
  const menuOpenedClass = "menu-open";
  const breakpoint = window.matchMedia("(max-width: 1079px)");

  // Обработчик события открытия меню
  function toggleMenuHandler(e) {
      e.preventDefault();

      if (breakpoint.matches) {
          if (pageHeader.classList.contains(menuOpenedClass)) {
              // Закрытие меню
              pageHeader.classList.remove(menuOpenedClass);
              toggleMenu.setAttribute("aria-label", "Open navigation");
              toggleMenu.setAttribute("aria-expanded", "false");
              menuToggleAnimation.getLottie().playSegments([14, 28], true);
              mainContainer.style.transform = "translateY(0)"; 
          } else {
              // Открытие меню
              pageHeader.classList.add(menuOpenedClass);
              toggleMenu.setAttribute("aria-label", "Close navigation");
              toggleMenu.setAttribute("aria-expanded", "true");
              menuToggleAnimation.getLottie().playSegments([0, 14], true);
              mainContainer.style.transform = "translateY(150px)";
          }
      } else {
          // Если ширина экрана больше 1080px
          if (pageHeader.classList.contains(menuOpenedClass)) {
              // Закрытие меню
              pageHeader.classList.remove(menuOpenedClass);
              toggleMenu.setAttribute("aria-label", "Open navigation");
              toggleMenu.setAttribute("aria-expanded", "false");
              menuToggleAnimation.playSegments([14, 28], true);
          } else {
              // Открытие меню
              pageHeader.classList.add(menuOpenedClass);
              toggleMenu.setAttribute("aria-label", "Close navigation");
              toggleMenu.setAttribute("aria-expanded", "true");
              menuToggleAnimation.playSegments([0, 14], true);
          }
      }
  }

  // Добавляем обработчик события
  toggleMenu.addEventListener("click", toggleMenuHandler);
});