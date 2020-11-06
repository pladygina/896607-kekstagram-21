'use strict';

(function () {
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
    LOAD: `load`,
    SAVE: `save`
  };

  const transferData = (direction, onLoad, onError, data) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
        return;
      }
      onError();
    });
    xhr.addEventListener(`error`, onError);
    xhr.addEventListener(`timeout`, onError);

    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open(Method[direction.toUpperCase()], Url[direction.toUpperCase()]);
    if (data) {
      xhr.send(data);
      return;
    }
    xhr.send();
  };

  window.backend = {
    load: (onLoad, onError) => {
      transferData(Action.LOAD, onLoad, onError);
    },
    save: (data, onLoad, onError) => {
      transferData(Action.SAVE, onLoad, onError, data);
    }
  };
})();
