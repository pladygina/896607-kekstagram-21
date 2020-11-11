'use strict';

const DEBOUNCE_INTERVAL = 500; // мс
const Key = {
  ENTER: `Enter`,
  ESCAPE: `Escape`
};

window.utils = {
  isEscEvent: (evt, action) => {
    if (evt.key === Key.ESCAPE) {
      evt.preventDefault();
      if (action) {
        action();
      }
    }
  },
  isEnterEvent: (evt, action) => {
    if (evt.key === Key.ENTER) {
      evt.preventDefault();
      if (action) {
        action();
      }
    }
  },
  makeElement: (tagName, className, text) => {
    let node = document.createElement(tagName);
    node.classList.add(className);
    if (text) {
      node.textContent = text;
    }
    return node;
  },
  getRandomFromInterval: (min, max) => {
    let minimum = Math.ceil(min);
    let maximum = Math.floor(max);
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
  },
  getRandomizedArray: (photos) => {
    let shuffledPhotos = [];
    let copyPhotos = photos.slice();
    for (let i = photos.length - 1; i >= 0; i--) {
      shuffledPhotos.push(copyPhotos.splice((window.utils.getRandomFromInterval(0, i)), 1)[0]);
    }
    return shuffledPhotos;
  },
  debounce: (cb) => {
    let lastTimeout = null;

    return (...parameters) => {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(() => {
        cb(...parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }
};
