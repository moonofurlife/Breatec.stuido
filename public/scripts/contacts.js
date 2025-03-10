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

  // Добавляем обработчик события
  toggleMenu.addEventListener("click", toggleMenuHandler);
});