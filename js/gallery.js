'use strict';

(function () {
  const RANDOM_IMAGES_QUANTITY = 10;

  let pictures = [];
  let currentPictures = [];

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
  closeUploadOverlay();

  uploadFileInput.required = false;

  const textHashtagsInput = window.nodes.imgEditingForm.querySelector(`.text__hashtags`);

  textHashtagsInput.addEventListener(`focus`, function () {
    document.removeEventListener(`keydown`, onUploadEscPress);
  });

  textHashtagsInput.addEventListener(`blur`, function () {
    document.addEventListener(`keydown`, onUploadEscPress);
  });

  const imgFilters = document.querySelector(`.img-filters`);
  const imgFiltersForm = imgFilters.querySelector(`.img-filters__form`);
  const imgFiltersButton = {
    default: imgFiltersForm.querySelector(`#filter-default`),
    random: imgFiltersForm.querySelector(`#filter-random`),
    discussed: imgFiltersForm.querySelector(`#filter-discussed`)
  };
  const onFilterChange = {
    default: () => {},
    random: () => {},
    discussed: () => {}
  };
  let currentGalleryFilter = ``;

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

  onFilterChange.default = () => {
    currentPictures = pictures;
    changeFilter(`default`);
  };
  onFilterChange.random = () => {
    currentPictures = (window.utils.getRandomizedArray(pictures)).slice(0, RANDOM_IMAGES_QUANTITY);
    changeFilter(`random`);
  };
  onFilterChange.discussed = () => {
    currentPictures = (pictures.slice()).sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });
    changeFilter(`discussed`);
  };

  imgFiltersButton.default.addEventListener(`click`, function () {
    onFilterChange.default();
  });
  imgFiltersButton.random.addEventListener(`click`, function () {
    onFilterChange.random();
  });
  imgFiltersButton.discussed.addEventListener(`click`, function () {
    onFilterChange.discussed();
  });

  window.gallery = {
    loadSuccessHandler: (data) => {
      pictures = data;
      window.picture.updatePictures(pictures);
      imgFilters.classList.remove(`img-filters--inactive`);
      /* временно для отладки */
      window.preview.openBigPicture(pictures[0]);
      window.preview.closeBigPicture();
    }
  };
})();
