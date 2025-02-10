window.addEventListener('load', () => {
    document.getElementById('loader').classList.add('hidden');
});
const menuItems = document.querySelectorAll('.toggale_menu li'); 
const mainImage = document.getElementById('mainImage'); 

let currentTimeout;

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const newImgSrc = item.getAttribute('data-img'); 
        if (newImgSrc) {
            clearTimeout(currentTimeout); 
            if (mainImage.src !== newImgSrc) { 
                mainImage.style.opacity = '0'; 
                setTimeout(() => {
                    mainImage.setAttribute('src', newImgSrc);
                    mainImage.style.opacity = '1'; 
                    mainImage.style.visibility = 'visible';
                }, 300); 
            } else {
                mainImage.style.opacity = '1';
                mainImage.style.visibility = 'visible';
            }
        }
    });
    item.addEventListener('mouseleave', () => {
        currentTimeout = setTimeout(() => {
            mainImage.style.opacity = '0'; 
            
            setTimeout(() => {
                mainImage.style.visibility = 'hidden';
            }, 300); 
        }, 100); 
    });
});