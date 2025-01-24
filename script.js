const pageHeader = document.querySelector(".page-header");
const toggleMenu = document.querySelector(".toggle-menu");
const player = document.querySelector("lottie-player");
const menuWrapper = document.querySelector(".menu-wrapper");
const menuOpenedClass = "menu-open";
const noTransitionClass = "no-transition";
let timer;

toggleMenu.addEventListener("click", function (e) {
  e.preventDefault();
  pageHeader.classList.toggle(menuOpenedClass);
  if (pageHeader.classList.contains(menuOpenedClass)) {
    this.setAttribute("aria-label", "Close navigation");
    this.setAttribute("aria-expanded", "true");
    player.getLottie().playSegments([0, 14], true);
  } else {
    this.setAttribute("aria-label", "Open navigation");
    this.setAttribute("aria-expanded", "false");
    player.getLottie().playSegments([14, 28], true);
    //player.getLottie().playSegments([46, 90], true);
  }
});

window.addEventListener("resize", function () {
  menuWrapper.classList.add(noTransitionClass);
  clearTimeout(timer);
  timer = setTimeout(function () {
    menuWrapper.classList.remove(noTransitionClass);
  }, 500);
});

