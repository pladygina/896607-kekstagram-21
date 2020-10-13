'use strict';

(function () {
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
    }
  };
})();
