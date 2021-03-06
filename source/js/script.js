/* ----------------
  Всплывающеее меню
  ----------------- */
const menu = document.getElementById(`menu`);
const menuOpenBtn = document.querySelector(`.header__toggle`);
const menuCloseBtn = menu.querySelector(`.menu__close`);
const menuLinks = menu.querySelectorAll(`.menu__link`);

// Появление всплывающего меню
menuOpenBtn.onclick = (evt) => {
  evt.preventDefault();
  menuOpenBtn.classList.add(`header__toggle--hidden`);
  menu.classList.add(`menu--shown`);
};

// Закрытие всплывающего меню
menuCloseBtn.onclick = (evt) => {
  evt.preventDefault();
  removeClass(menu, `menu--shown`);
  removeClass(menuOpenBtn, `header__toggle--hidden`);
};

// Закрытие всплывающего меню после клика по ссылке
for (let i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener(`click`, () => {
    removeClass(menu, `menu--shown`);
    removeClass(menuOpenBtn, `header__toggle--hidden`);
  });
}

/* ----------------------
  Полноэкранная прокрутка
  ----------------------- */
let isContactsMapLoaded = false;

// Замена id элементов на data-атрибут для fullPage.js
const sections = document.querySelectorAll(`.section`);

for (let i = 0; i < sections.length; i++) {
  sections[i].dataset.anchor = sections[i].id;
  sections[i].removeAttribute(`id`);
}

// Добавление полноэкранной прокрутки
const scrollBtn = document.querySelector(`.header__scroll`);

const fullpage = new fullpage(`#fullpage`, {
  licenseKey: `YOUR_KEY_HERE`,
  loopBottom: true,
  normalScrollElements: `#menu, .contacts__map`,
  menu: `#menu`,
  scrollOverflow: true,
  scrollOverflowOptions: {
    eventPassthrough: `horizontal`
  },
  lazyLoading: false,
  afterRender() {
    changeScrollBtn(scrollBtn, this);

    document.querySelector(`.pagination-page__total`).textContent = addLeadingZero(sections.length);
  },
  onLeave(origin, destination) {
    changeScrollBtn(scrollBtn, destination);

    document.querySelector(`.pagination-page__current`).textContent = addLeadingZero(destination.index + 1);

    // Отложенное добавление скрипта интерактивной карты
    if (!isContactsMapLoaded && destination.index > sections.length - 3) {
      const scriptEl = document.createElement(`script`);

      scriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDC_DpMEN_0ha6EyLVKSj1Z-VVq_avOc3A&callback=initMap`;
      scriptEl.async = true;
      scriptEl.defer = true;

      document.head.appendChild(scriptEl);
    }
  }
});

// Оживление кнопки перехода к следующей секции
scrollBtn.onclick = (evt) => {
  evt.preventDefault();
  fullpage.moveSectionDown();
};

// Оживление кнопки перехода далее для hero-блока
const scrollHeroBtn = document.querySelector(`.hero__scroll`);

scrollHeroBtn.onclick = (evt) => {
  evt.preventDefault();
  fullpage.moveSectionDown();
};

/* -------
  Слайдеры
  -------- */
// Оживление слайдера направлений
const classesSwiper = new Swiper(`.classes__wrapper`, new SwiperOptions(document.querySelectorAll(`.classes .pagination__button`)));

// Оживление слайдера тренеров
const coachesSwiper = new Swiper(`.coaches__wrapper`, new SwiperOptions(document.querySelectorAll(`.coaches .pagination__button`)));

// Оживление слайдера отзывов
const reviewsSwiper = new Swiper(`.reviews__wrapper`, new SwiperOptions(document.querySelectorAll(`.reviews .pagination__button`)));

/* -----------------
  Формы блоков акции
  ------------------ */
// Оживление формы блока акции
const entryContent = document.querySelectorAll(`.entry__content`);
const entryMessage = document.querySelectorAll(`.entry__message`);

for (let i = 0; i < entryContent.length; i++) {
  const entryForm = entryContent[i].querySelector(`.form`);

  entryForm.onsubmit = (evt) => {
    evt.preventDefault(); // Форма не отправляется, это сделано для демонстрации
    entryContent[i].classList.add(`entry__content--hidden`);
    entryMessage[i].classList.remove(`entry__message--hidden`);
  };
}

/* ---------------------------
  Скролл перетаскиванием мышью
  ---------------------------- */
// Добавление скролла форме блока абонементов
const abonementsScroll = new ScrollBooster({
  viewport: document.querySelector(`.abonements__form-inner`),
  scrollMode: `transform`,
  direction: `horizontal`,
  shouldScroll(state, event) {
    return event.view.innerWidth < 604;
  }
});

// Добавление скролла таблице расписания
const scheduleScroll = new ScrollBooster({
  viewport: document.querySelector(`.schedule__table-main`),
  scrollMode: `transform`,
  direction: `horizontal`,
  onUpdate(state) {
    const scheduleTable = document.querySelector(`.schedule__table`);

    if (state.borderCollision.left) {
      scheduleTable.classList.remove(`schedule__table--swiped`);
    } else {
      scheduleTable.classList.add(`schedule__table--swiped`);
    }
  },
  shouldScroll(state, event) {
    return event.view.innerWidth < 1449;
  }
});

/* -----------------------------
  Всплывающее окно формы отзывов
  ------------------------------ */
const contactsContent = document.querySelector(`.contacts__content`);
const contactsModal = document.querySelector(`.contacts__modal`);
const contactsModalOpenBtn = contactsContent.querySelector(`.contacts__link--envelope`);
const contactsModalCloseBtn = contactsModal.querySelector(`.modal__close`);
const overlay = document.querySelector(`.overlay`);

// Появление всплывающего окна
contactsModalOpenBtn.onclick = (evt) => {
  evt.preventDefault();
  contactsContent.classList.add(`contacts__content--hidden`);
  overlay.classList.add(`overlay--shown`);
  contactsModal.classList.remove(`modal--hidden`);
};

// Закрытие всплывающего окна
contactsModalCloseBtn.onclick = (evt) => {
  evt.preventDefault();
  modalClose();
};

// Закрытие всплывающего окна клавишей ESC
window.onkeydown = (evt) => {
  if (evt.keyCode === 27) {
    evt.preventDefault();

    if (!contactsModal.classList.contains(`modal--hidden`)) {
      modalClose();
    }
  }
};

// Закрытие всплывающего окна по клику вне окна
overlay.onclick = () => {
  modalClose();
};

/* ------------------
  Интерактивная карта
  ------------------- */
window.initMap = () => {
  isContactsMapLoaded = true;

  const contactsMap = new google.maps.Map(document.querySelector(`.contacts__map`), {
    center: {
      lat: 59.932004,
      lng: 30.357496
    },
    zoom: 17,
    styles: [
      {
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#fbf5f4`
          }
        ]
      },
      {
        "elementType": `labels.icon`,
        "stylers": [
          {
            "visibility": `off`
          }
        ]
      },
      {
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#616161`
          }
        ]
      },
      {
        "elementType": `labels.text.stroke`,
        "stylers": [
          {
            "color": `#f5f5f5`
          }
        ]
      },
      {
        "featureType": `administrative.land_parcel`,
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#bdbdbd`
          }
        ]
      },
      {
        "featureType": `poi`,
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#eeeeee`
          }
        ]
      },
      {
        "featureType": `poi`,
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#757575`
          }
        ]
      },
      {
        "featureType": `poi.park`,
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#e5e5e5`
          }
        ]
      },
      {
        "featureType": `poi.park`,
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#9e9e9e`
          }
        ]
      },
      {
        "featureType": `road`,
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#ffffff`
          }
        ]
      },
      {
        "featureType": `road.arterial`,
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#757575`
          }
        ]
      },
      {
        "featureType": `road.highway`,
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#dadada`
          }
        ]
      },
      {
        "featureType": `road.highway`,
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#616161`
          }
        ]
      },
      {
        "featureType": `road.local`,
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#9e9e9e`
          }
        ]
      },
      {
        "featureType": `transit.line`,
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#e5e5e5`
          }
        ]
      },
      {
        "featureType": `transit.station`,
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#eeeeee`
          }
        ]
      },
      {
        "featureType": `water`,
        "elementType": `geometry`,
        "stylers": [
          {
            "color": `#c9c9c9`
          }
        ]
      },
      {
        "featureType": `water`,
        "elementType": `labels.text.fill`,
        "stylers": [
          {
            "color": `#9e9e9e`
          }
        ]
      }
    ],
    disableDefaultUI: true
  });

  const contactsMapMarker = new google.maps.Marker({
    position: {
      lat: 59.931864,
      lng: 30.357496
    },
    map: contactsMap,
    icon: {
      url: `img/contacts_map-marker.png`,
      size: new google.maps.Size(49, 60),
      anchor: new google.maps.Point(24, 60)
    }
  });
};

/* -----------------------
  Пользовательские функции
  ------------------------ */
// Удаление класса у элемента с сохранением CSS-анимации
function removeClass(elmnt, cls) {
  cssAnimationReset(elmnt, cls);
  elmnt.style.animationDirection = `reverse`;

  window.setTimeout(() => {
    elmnt.classList.remove(cls);
    elmnt.removeAttribute(`style`);
  }, 1000);
}

// Сброс CSS-анимации
function cssAnimationReset(elmnt, cls) {
  elmnt.classList.remove(cls);
  void elmnt.offsetWidth;
  elmnt.classList.add(cls);
}

// Изменение кнопки перехода к следующей секции
function changeScrollBtn(btn, section) {
  const scrollBtnText = btn.querySelector(`span`);
  const nextSection = section.item.nextSibling;

  if (section.isLast) {
    btn.classList.add(`button-arrow--up`);
    scrollBtnText.textContent = `Вернуться`;
  } else {
    btn.classList.remove(`button-arrow--up`);

    if (`title` in nextSection.dataset) {
      scrollBtnText.textContent = nextSection.dataset.title;
    } else {
      scrollBtnText.textContent = nextSection.querySelector(`.section__title`).textContent;
    }
  }
}

// Добавление ведущего нуля к числу
function addLeadingZero(num) {
  return num > 9 ? num : `0` + num;
}

// Закрытие всплывающего окна
function modalClose() {
  contactsModal.classList.add(`modal--hidden`);
  overlay.classList.remove(`overlay--shown`);
  contactsContent.classList.remove(`contacts__content--hidden`);
}

// Создание объекта опций для слайдеров
function SwiperOptions(paginationBtns) {
  this.autoHeight = true;
  this.spaceBetween = 20;
  this.loop = true;
  this.breakpoints = {
    768: {
      spaceBetween: 30
    },
    1920: {
      spaceBetween: 90
    }
  };
  this.navigation = {
    nextEl: `.button-arrow--right`,
    prevEl: `.button-arrow--left`
  };
  this.pagination = {
    el: `.pagination`,
    clickable: true,
    renderBullet(index, className) {
      return `<button class="${className}" type="button" data-text="${paginationBtns[index].dataset.text}">${paginationBtns[index].textContent}</button>`;
    },
    bulletClass: `pagination__button`,
    bulletActiveClass: `pagination__button--active`
  };
  this.keyboard = {
    enabled: true,
    pageUpDown: false
  };
}
