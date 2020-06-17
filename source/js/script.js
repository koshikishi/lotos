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
  lazyLoading: false,
  afterRender() {
    changeScrollBtn(scrollBtn, this);

    document.querySelector(`.pagination-page__total`).textContent = addLeadingZero(sections.length);
  },
  onLeave(origin, destination) {
    changeScrollBtn(scrollBtn, destination);

    document.querySelector(`.pagination-page__current`).textContent = addLeadingZero(destination.index + 1);
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
const classesPaginationBtns = document.querySelectorAll(`.classes .pagination__button`);

const classesSwiper = new Swiper(`.classes__wrapper`, {
  spaceBetween: 20,
  loop: true,
  breakpoints: {
    768: {
      spaceBetween: 30
    },
    1920: {
      spaceBetween: 90
    }
  },
  navigation: {
    nextEl: `.button-arrow--right`,
    prevEl: `.button-arrow--left`
  },
  pagination: {
    el: `.pagination`,
    clickable: true,
    renderBullet(index, className) {
      return `<button class="${className}" type="button" data-text="${classesPaginationBtns[index].dataset.text}">${classesPaginationBtns[index].textContent}</button>`;
    },
    bulletClass: `pagination__button`,
    bulletActiveClass: `pagination__button--active`
  },
  keyboard: {
    enabled: true,
    pageUpDown: false
  }
});

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
