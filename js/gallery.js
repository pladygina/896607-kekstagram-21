'use strict';

(function () {
  const body = document.querySelector(`body`);
  const picturesList = document.querySelector(`.pictures`);

  const pictureTemplate = document.querySelector(`#picture`)
    .content
    .querySelector(`.picture`);

  picturesList.appendChild(window.createPicturesListFragment(window.pictures, pictureTemplate));

  const imgEditingForm = document.querySelector(`.img-upload__form`);
  const uploadFileInput = imgEditingForm.querySelector(`#upload-file`);
  const uploadOverlay = imgEditingForm.querySelector(`.img-upload__overlay`);
  const uploadCancel = imgEditingForm.querySelector(`#upload-cancel`);

  const onUploadEscPress = (evt) => {
    window.utils.isEscEvent(evt, closeUploadOverlay);
  };

  const openUploadOverlay = () => {
    body.classList.add(`modal-open`);
    uploadOverlay.classList.remove(`hidden`);
    document.addEventListener(`keydown`, onUploadEscPress);
  };

  const closeUploadOverlay = () => {
    uploadFileInput.value = ``;
    body.classList.remove(`modal-open`);
    uploadOverlay.classList.add(`hidden`);
    document.removeEventListener(`keydown`, onUploadEscPress);
  };

  uploadFileInput.addEventListener(`change`, function () {
    openUploadOverlay();
  });

  uploadCancel.addEventListener(`click`, function () {
    closeUploadOverlay();
  });

  uploadCancel.addEventListener(`keydown`, function (evt) {
    window.utils.isEnterEvent(evt, closeUploadOverlay);
  });

  /* временно для отладки*/
  openUploadOverlay();

  uploadFileInput.required = false;

  const textHashtagsInput = imgEditingForm.querySelector(`.text__hashtags`);

  textHashtagsInput.addEventListener(`focus`, function () {
    document.removeEventListener(`keydown`, onUploadEscPress);
  });

  textHashtagsInput.addEventListener(`blur`, function () {
    document.addEventListener(`keydown`, onUploadEscPress);
  });

})();
