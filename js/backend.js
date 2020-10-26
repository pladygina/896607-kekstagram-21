'use strict';

(function () {
  const Url = {
    LOAD: `https://21.javascript.pages.academy/kekstagram/data`
  };
  const TIMEOUT_IN_MS = 10000;
  const StatusCode = {
    OK: 200
  };

  window.backend = {
    load: (onLoad, onError) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = `json`;

      xhr.addEventListener(`load`, function () {
        if (xhr.status === StatusCode.OK) {
          onLoad(xhr.response);
          return;
        }
        onError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
      });
      xhr.addEventListener(`error`, function () {
        onError(`Произошла ошибка соединения`);
      });
      xhr.addEventListener(`timeout`, function () {
        onError(`Не удалось загрузить фотографии других пользователей за  ` + xhr.timeout + ` мс`);
      });

      xhr.timeout = TIMEOUT_IN_MS;
      xhr.open(`GET`, Url.LOAD);
      xhr.send();
    }
  };
})();
