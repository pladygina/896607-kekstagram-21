'use strict';

(function () {
  const body = document.querySelector(`body`);
  const bigPicture = document.querySelector(`.big-picture`);

  const openBigPicture = (picture) => {
    body.classList.add(`modal-open`);
    bigPicture.classList.remove(`hidden`);
    window.createBigPicture(bigPicture, picture);
  };

  openBigPicture(window.pictures[0]);

  /* временно для выполнения следующего задания  */
  const closeBigPicture = () => {
    body.classList.remove(`modal-open`);
    bigPicture.classList.add(`hidden`);
  };

  closeBigPicture();
}());

