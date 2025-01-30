window.addEventListener('load', () => {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('content').style.display = 'block';
});
const menuItems = document.querySelectorAll('.toggale_menu li'); 
const mainImage = document.querySelector('.column img'); 

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const newImgSrc = item.getAttribute('data-img'); 
        if (newImgSrc) {
            mainImage.setAttribute('src', newImgSrc);
            mainImage.style.display = 'block'; 
        }
    });

    item.addEventListener('mouseleave', () => {
        mainImage.removeAttribute('src'); 
        mainImage.style.display = 'none'; 
    });
});