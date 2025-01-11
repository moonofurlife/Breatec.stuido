// Инициализация Lottie-анимации
let animation = lottie.loadAnimation({
    container: document.getElementById('lottie-menu'), // контейнер для анимации
    renderer: 'svg', // рендеринг через SVG
    loop: false, // не зацикливаем анимацию
    autoplay: false, // не запускаем сразу
    path: 'src/icons_menu.json' // путь к вашему файлу JSON
});

let isFirstSegmentPlayed = false;

// Обработчик клика
document.getElementById('lottie-menu').addEventListener('click', function() {

    animation.play();
    // if (currentFrame = ) {
    //     animation.pause();
    //     console.log('ytn');
    // } 
    if (animation.isPaused) {
        animation.play();
        let currentFrame = animation.currentFrame; 
        if(currentFrame = 14) {
            animation.pause();
        }
    }
});