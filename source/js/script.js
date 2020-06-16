// Оживление всплывающего меню
const menu = document.getElementById(`menu`);
const menuOpenBtn = document.querySelector(`.header__toggle`);
const menuCloseBtn = menu.querySelector(`.menu__close`);

// Появление всплывающего меню
menuOpenBtn.onclick = (evt) => {
  evt.preventDefault();
  addClass(menuOpenBtn, `header__toggle--hidden`);
  addClass(menu, `menu--shown`);
};

// Закрытие всплывающего меню
menuCloseBtn.onclick = (evt) => {
  evt.preventDefault();
  removeClass(menu, `menu--shown`);
  removeClass(menuOpenBtn, `header__toggle--hidden`);
};

// Добавление класса элементу
function addClass(elmnt, cls) {
  elmnt.classList.add(cls);
}

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
