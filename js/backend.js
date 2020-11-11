'use strict';

const Url = {
  LOAD: `https://21.javascript.pages.academy/kekstagram/data`,
  SAVE: `https://21.javascript.pages.academy/kekstagram`
};
const Method = {
  LOAD: `GET`,
  SAVE: `POST`
};
const TIMEOUT_IN_MS = 10000;
const StatusCode = {
  OK: 200
};
const Action = {
  LOAD: `LOAD`,
  SAVE: `SAVE`
};

const transferData = (direction, onLoad, onError, picture) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === StatusCode.OK) {
      onLoad(xhr.response);
      return;
    }
    onError();
  });
  xhr.addEventListener(`error`, onError);
  xhr.addEventListener(`timeout`, onError);

  xhr.timeout = TIMEOUT_IN_MS;
  xhr.open(Method[direction], Url[direction]);
  if (picture) {
    xhr.send(picture);
    return;
  }
  xhr.send();
};

window.backend = {
  load: (onLoad, onError) => {
    transferData(Action.LOAD, onLoad, onError);
  },
  save: (picture, onLoad, onError) => {
    transferData(Action.SAVE, onLoad, onError, picture);
  }
};
