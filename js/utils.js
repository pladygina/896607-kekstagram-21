'use strict';

const DEBOUNCE_INTERVAL = 500; // мс

window.utils = {
  isEscEvent: (evt, action) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      if (action) {
        action();
      }
    }
  },
  isEnterEvent: (evt, action) => {
    if (evt.key === `Enter`) {
      evt.preventDefault();
      if (action) {
        action();
      }
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
    let arrayCopy = array.slice();
    for (let i = array.length - 1; i >= 0; i--) {
      randomizedArray.push(arrayCopy.splice((window.utils.getRandomFromInterval(0, i)), 1)[0]);
    }
    return randomizedArray;
  },
  debounce: (cb) => {
    let lastTimeout = null;

    return function (...parameters) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb(...parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }
};
