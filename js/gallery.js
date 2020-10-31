'use strict';

(function () {
  const RANDOM_IMAGES_QUANTITY = 10;

  let pictures = [];
  let currentPictures = [];

  const uploadOverlay = window.nodes.imgEditingForm.querySelector(`.img-upload__overlay`);
  const uploadCancel = window.nodes.imgEditingForm.querySelector(`#upload-cancel`);

  const onUploadEscPress = (evt) => {
    window.utils.isEscEvent(evt, closeUploadOverlay);
  };

  /* отправка */
  const submitHandler = (evt) => {
    window.backend.save(new FormData(window.nodes.imgEditingForm), closeUploadOverlay, window.utils.errorHandler);
    evt.preventDefault();
  };

  const openUploadOverlay = () => {
    window.nodes.picturesList.removeEventListener(`click`, onPicturesListClick);
    window.nodes.body.classList.add(`modal-open`);
    uploadOverlay.classList.remove(`hidden`);
    document.addEventListener(`keydown`, onUploadEscPress);
    window.nodes.filterSliderControl.addEventListener(`mousedown`, window.form.onMouseDown);
    window.nodes.imgEditingForm.addEventListener(`submit`, submitHandler);
    window.form.clearForm();
  };

  const closeUploadOverlay = () => {
    window.nodes.body.classList.remove(`modal-open`);
    uploadOverlay.classList.add(`hidden`);
    document.removeEventListener(`keydown`, onUploadEscPress);
    window.nodes.picturesList.addEventListener(`click`, onPicturesListClick);
    window.nodes.filterSliderControl.removeEventListener(`mousedown`, window.form.onMouseDown);
    window.nodes.imgEditingForm.removeEventListener(`submit`, submitHandler);
    window.form.clearForm();
  };

  window.nodes.uploadFileInput.addEventListener(`change`, function () {
    openUploadOverlay();
  });

  uploadCancel.addEventListener(`click`, function () {
    closeUploadOverlay();
  });

  uploadCancel.addEventListener(`keydown`, function (evt) {
    window.utils.isEnterEvent(evt, closeUploadOverlay);
  });

  window.nodes.textHashtagsInput.addEventListener(`focus`, function () {
    document.removeEventListener(`keydown`, onUploadEscPress);
  });

  window.nodes.textHashtagsInput.addEventListener(`blur`, function () {
    document.addEventListener(`keydown`, onUploadEscPress);
  });

  window.nodes.imgEditingFormComment.addEventListener(`focus`, function () {
    document.removeEventListener(`keydown`, onUploadEscPress);
  });
  window.nodes.imgEditingFormComment.addEventListener(`blur`, function () {
    document.addEventListener(`keydown`, onUploadEscPress);
  });

  const imgFilters = document.querySelector(`.img-filters`);
  const imgFiltersForm = imgFilters.querySelector(`.img-filters__form`);
  const imgFiltersButton = {
    default: imgFiltersForm.querySelector(`#filter-default`),
    random: imgFiltersForm.querySelector(`#filter-random`),
    discussed: imgFiltersForm.querySelector(`#filter-discussed`)
  };

  let currentGalleryFilter = ``;

  const getItemsByFilter = (filterName) => {
    switch (filterName) {
      case `random`:
        return (window.utils.getRandomizedArray(pictures)).slice(0, RANDOM_IMAGES_QUANTITY);
      case `discussed`:
        return (pictures.slice()).sort(function (left, right) {
          return right.comments.length - left.comments.length;
        });
      default:
        return pictures;
    }
  };

  const reRenderPictures = window.utils.debounce(function (images) {
    window.picture.updatePictures(images);
  });

  const changeFilter = (filter) => {
    if (currentGalleryFilter === filter && currentGalleryFilter !== `random`) {
      return;
    }
    if (currentGalleryFilter) {
      imgFiltersButton[currentGalleryFilter].classList.remove(`img-filters__button--active`);
    } else {
      imgFiltersButton.default.classList.remove(`img-filters__button--active`);
    }
    imgFiltersButton[filter].classList.add(`img-filters__button--active`);
    currentGalleryFilter = filter;
    reRenderPictures(currentPictures);
  };

  imgFiltersForm.addEventListener(`click`, function (evt) {
    let newFilter = `default`;
    if (evt.target === imgFiltersButton.random) {
      newFilter = `random`;
    }
    if (evt.target === imgFiltersButton.discussed) {
      newFilter = `discussed`;
    }
    currentPictures = getItemsByFilter(newFilter);
    changeFilter(newFilter);
  });

  const onPicturesListClick = (evt) => {
    let closestPicture = evt.target.closest(`.picture`);
    if (closestPicture) {
      window.preview.openBigPicture(pictures[closestPicture.dataset.imgNumber]);
    }
    /*
    console.log(evt.target);
    if (evt.target !== document.querySelector(`.img-upload__label`) &&
      evt.tagget !== document.querySelector(`.img-upload__start`)) {
      let previewNumber = evt.target.closest(`.picture`).dataset.imgNumber;
      window.preview.openBigPicture(pictures[previewNumber]);
      */
  };

  window.gallery = {
    loadSuccessHandler: (data) => {
      pictures = data;
      window.picture.updatePictures(pictures);
      imgFilters.classList.remove(`img-filters--inactive`);
      window.nodes.picturesList.addEventListener(`click`, onPicturesListClick);
    }
  };
})();
