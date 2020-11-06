'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
const MIN_SCALE = 0.25;
const MAX_SCALE = 1;
const SCALE_INTERVAL = 0.25;
const START_EFFECT_DEPTH = 1;
const HASHTAG_PATTERN = /^#[\wа-яА-ЯёЁ]{1,19}$/;
const HASHTAG_MAX_QUANTITY = 5;
const HASHTAG_MIN_LENGTH = 2;
const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_SEPARATOR = ` `;
const TEXT_COMMENT_MAX_LENGTH = window.nodes.imgEditingFormComment.maxLength;
const FILTERS = [
  {
    value: `none`
  },
  {
    value: `chrome`,
    name: `grayscale`,
    min: 0,
    max: 1,
    measure: ``
  },
  {
    value: `sepia`,
    name: `sepia`,
    min: 0,
    max: 1,
    measure: ``
  },
  {
    value: `marvin`,
    name: `invert`,
    min: 0,
    max: 100,
    measure: `%`
  },
  {
    value: `phobos`,
    name: `blur`,
    min: 0,
    max: 3,
    measure: `px`
  },
  {
    value: `heat`,
    name: `brightness`,
    min: 1,
    max: 3,
    measure: ``
  }
];

const filterPreviews = window.nodes.imgEditingForm.querySelectorAll(`.effects__preview`);
const changePreview = () => {
  let previewUrl = window.nodes.imgEditingForm.querySelector(`img`).src;
  let file = window.nodes.uploadFileInput.files[0];
  let fileName = file.name.toLowerCase();
  let matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    let reader = new FileReader();
    reader.addEventListener(`load`, function () {
      previewUrl = reader.result;
      window.nodes.imgEditingForm.querySelector(`img`).src = previewUrl;
      filterPreviews.forEach((element) => {
        element.style.backgroundImage = `url('${previewUrl}')`;
      });
    });

    reader.readAsDataURL(file);
  }
};

const imgUploadPreview = document.querySelector(`.img-upload__preview`);
const scaleControlSmaller = document.querySelector(`.scale__control--smaller`);
const scaleControlBigger = document.querySelector(`.scale__control--bigger`);
const scaleControlValue = document.querySelector(`.scale__control--value`);

const setPreviewScale = (value) => {
  scaleControlValue.value = (value * 100) + `%`;
  imgUploadPreview.querySelector(`img`).style.transform = `scale(${value})`;
  return value;
};
let currentPreviewSize = setPreviewScale(MAX_SCALE);

const changePreviewScale = (evt) => {
  let scaleChanging = 0;
  if (evt.target === scaleControlSmaller && currentPreviewSize > MIN_SCALE) {
    scaleChanging = -SCALE_INTERVAL;
  } else if (evt.target === scaleControlBigger && currentPreviewSize < MAX_SCALE) {
    scaleChanging = SCALE_INTERVAL;
  }
  currentPreviewSize = setPreviewScale(currentPreviewSize + scaleChanging);
  if (currentPreviewSize === MIN_SCALE) {
    scaleControlSmaller.disabled = true;
  } else if (currentPreviewSize === MAX_SCALE) {
    scaleControlBigger.disabled = true;
  } else {
    scaleControlBigger.disabled = false;
    scaleControlSmaller.disabled = false;
  }
};

/* уровень эффекта */
const filterSlider = document.querySelector(`.img-upload__effect-level`);
const filterLevelEffectValue = filterSlider.querySelector(`.effect-level__value`);
const filterSliderLine = filterSlider.querySelector(`.effect-level__line`);
const filterSliderDepth = filterSliderLine.querySelector(`.effect-level__depth`);
let currentFilter = FILTERS[0];
const calculatePercent = (level) => {
  return (level * 100 + `%`);
};
const createFilterScript = (filter, depth) => {
  return (`${filter.name}(${(depth * (filter.max - filter.min) + filter.min) + filter.measure})`);
};
const calculateMaxDecrease = () => {
  return (window.nodes.filterSliderControl.getBoundingClientRect().x -
    filterSliderLine.getBoundingClientRect().x +
    window.nodes.filterSliderControl.getBoundingClientRect().width / 2);
};
const calculateMaxIncrease = () => {
  return (filterSliderLine.getBoundingClientRect().width - calculateMaxDecrease());
};
const calculateDepthLevel = () => {
  return (calculateMaxDecrease() /
  filterSliderLine.getBoundingClientRect().width);
};
const renderFilter = (depth) => {
  filterSliderDepth.style.width = calculatePercent(depth);
  filterLevelEffectValue.value = Math.round(depth * 100);
  imgUploadPreview.querySelector(`img`).style.filter = createFilterScript(currentFilter, depth);
};
const onChangeFilter = () => {
  if (currentFilter === FILTERS[0]) {
    filterSlider.classList.add(`hidden`);
    imgUploadPreview.querySelector(`img`).style.filter = ``;
    return;
  }
  filterSlider.classList.remove(`hidden`);
  window.nodes.filterSliderControl.style.left = calculatePercent(START_EFFECT_DEPTH);
  renderFilter(START_EFFECT_DEPTH);
};
const onFilterListChoose = (evt) => {
  if (evt.target && evt.target.matches(`input[type="radio"]`)) {
    FILTERS.forEach((element) => {
      if (element.value === evt.target.value) {
        currentFilter = element;
        onChangeFilter();
      }
    });
  }
};

const onMouseDown = (evt) => {
  evt.preventDefault();

  let startCoordX = evt.clientX;
  let coordLimit = {
    left: startCoordX - calculateMaxDecrease(),
    right: startCoordX + calculateMaxIncrease()
  };

  const onMouseMove = (moveEvt) => {
    moveEvt.preventDefault();
    let newCoordX = moveEvt.clientX;
    if (newCoordX < coordLimit.left) {
      newCoordX = coordLimit.left;
    }
    if (newCoordX > coordLimit.right) {
      newCoordX = coordLimit.right;
    }
    let shift = startCoordX - newCoordX;
    window.nodes.filterSliderControl.style.left = (window.nodes.filterSliderControl.offsetLeft - shift) + `px`;
    startCoordX = newCoordX;
    renderFilter(calculateDepthLevel());
  };

  const onMouseUp = (upEvt) => {
    upEvt.preventDefault();
    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
  };

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
};

onChangeFilter();

window.nodes.imgEditingForm.addEventListener(`change`, onFilterListChoose);

/* Хэш-теги */
const splitHashtags = (text) => {
  return text.split(HASHTAG_SEPARATOR);
};
const arrayToLowerCase = (array) => {
  array.forEach((element, i) => {
    array[i] = element.toLowerCase();
  });
};

const checkArrayForRepeat = (array) => {
  let containsRepeat = false;
  arrayToLowerCase(array);
  array.forEach((element, i) => {
    if (array.indexOf(element) !== i) {
      containsRepeat = true;
    }
  });
  return containsRepeat;
};

const checkHashtags = () => {
  window.nodes.textHashtagsInput.style.outline = `none`;
  let hashtags = splitHashtags(window.nodes.textHashtagsInput.value);
  if (hashtags.length > HASHTAG_MAX_QUANTITY) {
    window.nodes.textHashtagsInput.setCustomValidity(`Максимальное количество хэш-тегов: ${HASHTAG_MAX_QUANTITY}`);
  } else if (checkArrayForRepeat(hashtags)) {
    window.nodes.textHashtagsInput.setCustomValidity(`Хэш-теги не должны повторяться и не чувствительны к регистру`);
  } else {
    window.nodes.textHashtagsInput.setCustomValidity(``);
    for (let i = 0; i < hashtags.length; i++) {
      if (!HASHTAG_PATTERN.test(hashtags[i])) {
        if (hashtags[i] === ``) {
          break;
        } else if (hashtags[i].length < HASHTAG_MIN_LENGTH || hashtags[i].length > HASHTAG_MAX_LENGTH) {
          window.nodes.textHashtagsInput.setCustomValidity(`Длина хэш-тегов должна быть не менее ${HASHTAG_MIN_LENGTH} и не более ${HASHTAG_MAX_LENGTH} символов`);
          break;
        } else {
          window.nodes.textHashtagsInput.setCustomValidity(`Хэш-тэг начинается с символа # и может содержать только буквы и числа`);
          break;
        }
      }
    }
  }
  window.nodes.textHashtagsInput.reportValidity();
};

window.nodes.textHashtagsInput.addEventListener(`focus`, function () {
  window.nodes.textHashtagsInput.addEventListener(`input`, checkHashtags);
});

window.nodes.textHashtagsInput.addEventListener(`blur`, function () {
  window.nodes.textHashtagsInput.removeEventListener(`input`, checkHashtags);
});

/* коментарий */
const checkComment = () => {
  window.nodes.imgEditingFormComment.style.outline = `none`;
  if (window.nodes.imgEditingFormComment.value.length > TEXT_COMMENT_MAX_LENGTH) {
    window.nodes.imgEditingFormComment.setCustomValidity(`Длина комментария не может быть больше ${TEXT_COMMENT_MAX_LENGTH} символов`);
  }
  window.nodes.imgEditingFormComment.reportValidity();
};

window.nodes.imgEditingFormComment.addEventListener(`focus`, function () {
  window.nodes.imgEditingFormComment.addEventListener(`input`, checkComment);
});

window.nodes.imgEditingFormComment.addEventListener(`blur`, function () {
  window.nodes.imgEditingFormComment.removeEventListener(`input`, checkComment);
});

const clearForm = () => {
  currentFilter = FILTERS[0];
  onChangeFilter();
  window.nodes.textHashtagsInput.value = ``;
  window.nodes.imgEditingFormComment.value = ``;
  window.nodes.uploadFileInput.value = ``;
  window.nodes.imgEditingForm.querySelector(`.effects__radio`).checked = true;
};

const clearScale = () => {
  currentPreviewSize = setPreviewScale(MAX_SCALE);
  scaleControlBigger.disabled = true;
  scaleControlSmaller.focus();
};

window.form = {
  onMouseDown,
  clearForm,
  clearScale,
  changePreviewScale,
  changePreview
};
