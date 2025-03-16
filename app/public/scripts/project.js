document.addEventListener('DOMContentLoaded', () => {
  const loaderAnimation = document.getElementById('loaderAnimation');

  loaderAnimation.play();

  loaderAnimation.addEventListener('complete', () => {
    document.getElementById('loader').style.display = 'none';
  });

  const pageHeader = document.querySelector(".page-header");
  const toggleMenu = document.querySelector(".toggle-menu");
  const toggleAnimationPlayer = document.querySelector("#menuToggleAnimation");
  const menuOpenedClass = "menu-open";
  const menuOpenedClassPhone = "menu-open-phone";
  const breakpoint = window.matchMedia("(max-width: 1079px)");

  function toggleMenuHandler(e) {
    e.preventDefault();
    const isMenuOpened = pageHeader.classList.contains(breakpoint.matches ? menuOpenedClassPhone : menuOpenedClass);

    if (isMenuOpened) {
      pageHeader.classList.remove(breakpoint.matches ? menuOpenedClassPhone : menuOpenedClass);
      toggleMenu.setAttribute("aria-label", "Open navigation");
      toggleMenu.setAttribute("aria-expanded", "false");
      toggleAnimationPlayer.getLottie().playSegments([14, 28], true);
    } else {
      pageHeader.classList.add(breakpoint.matches ? menuOpenedClassPhone : menuOpenedClass);
      toggleMenu.setAttribute("aria-label", "Close navigation");
      toggleMenu.setAttribute("aria-expanded", "true");
      toggleAnimationPlayer.getLottie().playSegments([0, 14], true);
    }
  }

  toggleMenu.addEventListener("click", toggleMenuHandler);
  
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

  const projectNameElements = document.querySelectorAll('.project_name');
  const locationElement = document.querySelector('.popup h2:nth-of-type(1)');
  const areaElement = document.querySelector('.popup h2:nth-of-type(2)');
  const processElement = document.querySelector('.popup h2:nth-of-type(3)');
  const sliderImg = document.querySelector('.slider_img');
  const client = document.getElementById("Client");
  const description = document.getElementById('description');

  let currentIndex = 0;  
  let projectData = {};
  let db;

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('imagesDB', 1);

      request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.createObjectStore('images', { keyPath: 'key' });
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  const saveImageToIndexedDB = (key, imageData) => {
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    store.put({ key, data: imageData });
  };

  const getImageFromIndexedDB = (key) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');

      const request = store.get(key);
      request.onsuccess = (event) => {
        resolve(event.target.result ? event.target.result.data : null);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  const preloadImages = async (images) => {
    for (const image of images) {
      const imageKey = `${projectData.name}_${image}`; 
      const storedImage = await getImageFromIndexedDB(imageKey);
      
      if (!storedImage) {
        try {
          const response = await fetch('/public/uploads/' + projectData.name + '/' + image);
          const blob = await response.blob();

          // Сжимаем изображение с использованием Canvas
          const imgElement = document.createElement('img');
          imgElement.src = URL.createObjectURL(blob);

          await new Promise((resolve) => {
            imgElement.onload = async () => {
              const canvas = document.createElement('canvas');
              canvas.width = imgElement.width; 
              canvas.height = imgElement.height;

              const context = canvas.getContext('2d');
              context.drawImage(imgElement, 0, 0);

              // Сжимаем изображение (0.7 — уровень качества от 0 до 1)
              const compressedBlob = await new Promise((resolve) => {
                canvas.toBlob((blob) => {
                  resolve(blob);
                }, 'image/jpeg', 0.7);
              });

              const reader = new FileReader();
              reader.onload = function (event) {
                saveImageToIndexedDB(imageKey, event.target.result);
                resolve();
              };
              reader.readAsDataURL(compressedBlob);
            };
          });
        } catch (error) {
          console.error('Ошибка при предзагрузке изображения:', error);
        }
      }
    }
  };

  const fetchData = async () => {
    try {
      const projectSlug = window.location.pathname.split('/').pop();
      const urlParams = new URLSearchParams(window.location.search);
      const lang = urlParams.get('lang') || 'en';

      const response = await fetch(`/api/projects/${projectSlug}?lang=${lang}`);
      const data = await response.json();
      projectData = data;

      if (projectData) {
        projectNameElements.forEach(el => el.textContent = projectData.name);
        locationElement.textContent = `${lang === 'ru' ? 'Локация' : 'Location'}: ${projectData.location}`;
        areaElement.textContent = `${lang === 'ru' ? 'Площадь' : 'Area'}: ${projectData.area} ${lang === 'ru' ? 'м2' : 'm2'}`;
        processElement.textContent = `${lang === 'ru' ? 'Стадия' : 'Process'}: ${projectData.process}`;
        client.textContent = `${lang === 'ru' ? 'Клиент' : 'Client'}: ${projectData.client}`;
        description.innerHTML = projectData.description.split('\r\n').map(paragraph => `<p>${paragraph}</p>`).join('');

        if (projectData.images && projectData.images.length > 0) {
          currentIndex = 1; 
          await preloadImages(projectData.images);
          updateSliderImage();
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

  const updateSliderImage = async () => {
    if (projectData.images && projectData.images.length > 0) {
      const imageKey = `${projectData.name}_${projectData.images[currentIndex]}`;
      const storedImage = await getImageFromIndexedDB(imageKey);
      sliderImg.src = storedImage ? storedImage : '/public/uploads/' + projectData.name + '/' + projectData.images[currentIndex];
    }
  };

  // Создаем область для навигации по изображениям
  sliderImg.addEventListener('click', (event) => {
    const sliderRect = sliderImg.getBoundingClientRect();
    const clickX = event.clientX;

    if (clickX < sliderRect.left + sliderRect.width / 2) {
      // Нажатие на левую сторону
      currentIndex = (currentIndex - 1 + projectData.images.length) % projectData.images.length;
    } else {
      // Нажатие на правую сторону
      currentIndex = (currentIndex + 1) % projectData.images.length;
    }

    updateSliderImage();
  });

  openDatabase()
    .then(fetchData)
    .catch(error => console.error('Ошибка при инициализации базы данных:', error));
});