'use strict';

const RANDOM_IMAGES_QUANTITY = 10;
const ERROR_INPUT_STYLE = `5px solid red`;
const result = {
  SUCCESS: `success`,
  ERROR: `error`
};

let pictures = [];
let currentPictures = [];

const galleryFilters = [
  {
    name: `default`,
    filter: () => {
      return pictures;
    },
    repeat: false
  },
  {
    name: `random`,
    filter: () => {
      return (window.utils.getRandomizedArray(pictures)).slice(0, RANDOM_IMAGES_QUANTITY);
    },
    repeat: true
  },
  {
    name: `discussed`,
    filter: () => {
      return (pictures.slice()).sort((left, right) => {
        return right.comments.length - left.comments.length;
      });
    },
    repeat: false
  }
];

const uploadOverlay = window.nodes.imgEditingForm.querySelector(`.img-upload__overlay`);
const uploadCancel = window.nodes.imgEditingForm.querySelector(`#upload-cancel`);
const submitButton = window.nodes.imgEditingForm.querySelector(`.img-upload__submit`);

const onUploadEscPress = (evt) => {
  window.utils.isEscEvent(evt, closeUploadOverlay);
};

const checkElementValidity = (input) => {
  if (!input.validity.valid) {
    input.style.outline = ERROR_INPUT_STYLE;
  }
};
const checkFormValidity = () => {
  checkElementValidity(window.nodes.textHashtagsInput);
  checkElementValidity(window.nodes.imgEditingFormComment);
};
const onFormEnterPress = (evt) => {
  if (evt.target !== submitButton) {
    window.utils.isEnterEvent(evt);
  }
};

/* отправка */
const submitHandler = (evt) => {
  window.backend.save(new FormData(window.nodes.imgEditingForm), saveSuccessHandler, saveErrorHandler);
  evt.preventDefault();
};

const openUploadOverlay = () => {
  window.nodes.picturesList.removeEventListener(`click`, onPicturesListClick);
  window.nodes.body.classList.add(`modal-open`);
  uploadOverlay.classList.remove(`hidden`);
  window.form.changePreview();
  window.form.clearScale();
  document.addEventListener(`keydown`, onUploadEscPress);
  document.addEventListener(`keydown`, onFormEnterPress);
  window.nodes.filterSliderControl.addEventListener(`mousedown`, window.form.onMouseDown);
  submitButton.addEventListener(`click`, checkFormValidity);
  window.nodes.imgEditingForm.addEventListener(`submit`, submitHandler);
  window.nodes.imgEditingForm.addEventListener(`click`, window.form.onPreviewScaleControlsClick);
  window.nodes.imgEditingForm.addEventListener(`keydown`, window.form.onPreviewScaleControlsEnterPress);
};

const closeUploadOverlay = () => {
  window.nodes.body.classList.remove(`modal-open`);
  uploadOverlay.classList.add(`hidden`);
  document.removeEventListener(`keydown`, onUploadEscPress);
  document.removeEventListener(`keydown`, onFormEnterPress);
  window.nodes.picturesList.addEventListener(`click`, onPicturesListClick);
  window.nodes.filterSliderControl.removeEventListener(`mousedown`, window.form.onMouseDown);
  submitButton.removeEventListener(`click`, checkFormValidity);
  window.nodes.imgEditingForm.removeEventListener(`submit`, submitHandler);
  window.form.clearEditing();
  window.nodes.imgEditingForm.removeEventListener(`click`, window.form.onPreviewScaleControlsClick);
  window.nodes.imgEditingForm.removeEventListener(`keydown`, window.form.onPreviewScaleControlsEnterPress);
};

window.nodes.uploadFileInput.addEventListener(`change`, () => {
  openUploadOverlay();
});

uploadCancel.addEventListener(`click`, () => {
  closeUploadOverlay();
});

uploadCancel.addEventListener(`keydown`, (evt) => {
  window.utils.isEnterEvent(evt, closeUploadOverlay);
});

window.nodes.textHashtagsInput.addEventListener(`focus`, () => {
  document.removeEventListener(`keydown`, onUploadEscPress);
});

window.nodes.textHashtagsInput.addEventListener(`blur`, () => {
  document.addEventListener(`keydown`, onUploadEscPress);
});

window.nodes.imgEditingFormComment.addEventListener(`focus`, () => {
  document.removeEventListener(`keydown`, onUploadEscPress);
});
window.nodes.imgEditingFormComment.addEventListener(`blur`, () => {
  document.addEventListener(`keydown`, onUploadEscPress);
});

const imgFilters = document.querySelector(`.img-filters`);
const imgFiltersForm = imgFilters.querySelector(`.img-filters__form`);
const imgFiltersButtons = {
  default: imgFiltersForm.querySelector(`#filter-default`),
  random: imgFiltersForm.querySelector(`#filter-random`),
  discussed: imgFiltersForm.querySelector(`#filter-discussed`)
};

let currentGalleryFilter = galleryFilters[0];

const reRenderPictures = window.utils.debounce((images) => {
  window.picture.updateGallery(images);
});

const changeFilter = (filter) => {
  if (currentGalleryFilter === filter && !currentGalleryFilter.repeat) {
    return;
  }
  if (currentGalleryFilter !== filter) {
    imgFiltersButtons[currentGalleryFilter.name].classList.remove(`img-filters__button--active`);
    imgFiltersButtons[filter.name].classList.add(`img-filters__button--active`);
    currentGalleryFilter = filter;
  }
  currentPictures = filter.filter();
  reRenderPictures(currentPictures);
};

imgFiltersForm.addEventListener(`click`, (evt) => {
  let newFilter = galleryFilters[0];
  for (let i = 0; i < galleryFilters.length; i++) {
    if (evt.target === imgFiltersButtons[galleryFilters[i].name]) {
      newFilter = galleryFilters[i];
      break;
    }
  }
  changeFilter(newFilter);
});

const onPicturesListClick = (evt) => {
  let closestPicture = evt.target.closest(`.picture`);
  if (closestPicture) {
    if (currentPictures.length > 0) {
      window.preview.openBigPicture(currentPictures[closestPicture.dataset.imgNumber]);
      return;
    }
    window.preview.openBigPicture(pictures[closestPicture.dataset.imgNumber]);
  }
};

const main = document.querySelector(`main`);
const popupMessageTemplate = {
  error: document.querySelector(`#error`).content.querySelector(`.error`),
  success: document.querySelector(`#success`).content.querySelector(`.success`)
};
let popup = ``;
let closePopupButton = ``;
const closePopup = () => {
  closePopupButton.removeEventListener(`click`, closePopup);
  document.removeEventListener(`keydown`, onPopupEscPress);
  document.removeEventListener(`click`, onPopupBackgroundClick);
  window.nodes.body.classList.remove(`modal-open`);
  window.nodes.picturesList.addEventListener(`click`, onPicturesListClick);
  popup.remove();
};
const onPopupEscPress = (evt) => {
  window.utils.isEscEvent(evt, closePopup);
};
const onPopupBackgroundClick = (evt) => {
  if (evt.target === popup) {
    closePopup();
  }
};
const showMessage = (saveResult, isLoad) => {
  let message = popupMessageTemplate[saveResult].cloneNode(true);
  /*
  if (!isLoad) {
    closeUploadOverlay();
  }
  */
  main.insertAdjacentElement(`afterbegin`, message);
  window.nodes.body.classList.add(`modal-open`);
  window.nodes.picturesList.removeEventListener(`click`, onPicturesListClick);
  popup = document.querySelector(`.${saveResult}`);
  closePopupButton = popup.querySelector(`.${saveResult}__button`);
  closePopupButton.focus();
  if (isLoad) {
    message.querySelector(`.error__title`).textContent = `Не удалось загрузить фотографии`;
    closePopupButton.textContent = `Понятно`;
  } else {
    closeUploadOverlay();
  }
  closePopupButton.addEventListener(`click`, closePopup);
  document.addEventListener(`keydown`, onPopupEscPress);
  document.addEventListener(`click`, onPopupBackgroundClick);
};

const saveErrorHandler = () => {
  showMessage(result.ERROR);
};
const saveSuccessHandler = () => {
  showMessage(result.SUCCESS);
};
const loadErrorHandler = () => {
  showMessage(result.ERROR, true);
};

window.gallery = {
  loadSuccessHandler: (images) => {
    pictures = images;
    window.picture.updateGallery(pictures);
    imgFilters.classList.remove(`img-filters--inactive`);
    window.nodes.picturesList.addEventListener(`click`, onPicturesListClick);
  },
  loadErrorHandler
};
