'use strict';

(function () {
  let pictures = [];

  const uploadFileInput = window.nodes.imgEditingForm.querySelector(`#upload-file`);
  const uploadOverlay = window.nodes.imgEditingForm.querySelector(`.img-upload__overlay`);
  const uploadCancel = window.nodes.imgEditingForm.querySelector(`#upload-cancel`);

  const onUploadEscPress = (evt) => {
    window.utils.isEscEvent(evt, closeUploadOverlay);
  };

  const openUploadOverlay = () => {
    window.nodes.body.classList.add(`modal-open`);
    uploadOverlay.classList.remove(`hidden`);
    document.addEventListener(`keydown`, onUploadEscPress);
  };

  const closeUploadOverlay = () => {
    uploadFileInput.value = ``;
    window.nodes.body.classList.remove(`modal-open`);
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

  const textHashtagsInput = window.nodes.imgEditingForm.querySelector(`.text__hashtags`);

  textHashtagsInput.addEventListener(`focus`, function () {
    document.removeEventListener(`keydown`, onUploadEscPress);
  });

  textHashtagsInput.addEventListener(`blur`, function () {
    document.addEventListener(`keydown`, onUploadEscPress);
  });

  window.gallery = {
    loadSuccessHandler: (items) => {
      pictures = items;
      window.picture.updatePictures(pictures);
      window.preview.openBigPicture(pictures[0]);
      /* временно для отладки */
      window.preview.closeBigPicture();
    }
  };
})();
