'use strict';

(function () {
  let number = 100;

  window.utils = {
    isEscEvent: (evt, action) => {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        action();
      }
    },
    isEnterEvent: (evt, action) => {
      if (evt.key === `Enter`) {
        evt.preventDefault();
        action();
      }
    },
    makeElement: (tagName, className, text) => {
      let element = document.createElement(tagName);
      element.classList.add(className);
      if (text) {
        element.textContent = text;
      }
      return element;
    },
    getRandomFromArray: (array) => {
      return array[Math.floor(Math.random() * array.length)];
    },
    getRandomFromInterval: (min, max) => {
      let minimum = Math.ceil(min);
      let maximum = Math.floor(max);
      return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
    },
    getRandomizedArray: (array) => {
      let randomizedArray = [];
      for (let i = array.length - 1; i >= 0; i--) {
        randomizedArray[i] = array.splice((window.utils.getRandomFromInterval(0, i)), 1);
      }
      return randomizedArray;
    },
    // временно, пока в задании нет пункта по реакции на ошибки
    errorHandler: (errorMessage) => {
      let node = document.createElement(`div`);
      let style = `z-index: ` + number + `; margin: 0 auto; text-align: center; background-color: #da641a;`;
      node.style = style;
      node.style.position = `absolute`;
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = `20px`;
      node.textContent = errorMessage;
      document.body.insertAdjacentElement(`afterbegin`, node);
      number++;
    }
  };
})();
