'use strict';
(function () {
  const MIN_SCALE = 0.25;
  const MAX_SCALE = 1;
  const SCALE_INTERVAL = 0.25;
  const START_EFFECT_DEPTH = 1;
  const HASHTAG_PATTERN = /^#[\wа-яА-ЯёЁ]{1,19}$/;
  const HASHTAG_MAX_QUANTITY = 5;
  const HASHTAG_MIN_LENGTH = 2;
  const HASHTAG_MAX_LENGTH = 20;
  const HASHTAG_SEPARATOR = ` `;
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

  const imgEditingForm = document.querySelector(`.img-upload__form`);
  const imgUploadPreview = document.querySelector(`.img-upload__preview`);
  const scaleControlSmaller = document.querySelector(`.scale__control--smaller`);
  const scaleControlBigger = document.querySelector(`.scale__control--bigger`);
  const scaleControlValue = document.querySelector(`.scale__control--value`);

  const setPreviewScale = (value) => {
    scaleControlValue.value = (value * 100) + `%`;
    imgUploadPreview.querySelector(`img`).style.transform = `scale(` + value + `)`;
    return value;
  };

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

  let currentPreviewSize = setPreviewScale(1);
  scaleControlBigger.disabled = true;

  scaleControlSmaller.addEventListener(`click`, function (evt) {
    changePreviewScale(evt);
  });

  scaleControlBigger.addEventListener(`click`, function (evt) {
    changePreviewScale(evt);
  });

  const filterSlider = document.querySelector(`.img-upload__effect-level`);
  const filterLevelEffectValue = filterSlider.querySelector(`.effect-level__value`);
  const filterSliderLine = filterSlider.querySelector(`.effect-level__line`);
  const filterSliderDepth = filterSliderLine.querySelector(`.effect-level__depth`);
  const filterSliderControl = filterSliderLine.querySelector(`.effect-level__pin`);
  let currentFilter = FILTERS[0];
  const calculatePercent = (level) => {
    return (level * 100 + `%`);
  };
  const createFilterScript = (filter, depth) => {
    return (filter.name + `(` + (depth * (filter.max - filter.min) + filter.min) + filter.measure + `)`);
  };
  const calculateDepthLevel = () => {
    return ((filterSliderControl.getBoundingClientRect().x -
      filterSliderLine.getBoundingClientRect().x +
      filterSliderControl.getBoundingClientRect().width / 2) /
    filterSliderLine.getBoundingClientRect().width);
  };
  const changeFilter = () => {
    if (currentFilter.value === `none`) {
      filterSlider.classList.add(`hidden`);
      return ``;
    } else {
      filterSlider.classList.remove(`hidden`);
      filterSliderControl.style.left = calculatePercent(START_EFFECT_DEPTH);
      filterSliderDepth.style.width = calculatePercent(START_EFFECT_DEPTH);
      filterLevelEffectValue.value = Math.round(START_EFFECT_DEPTH * 100);
      return createFilterScript(currentFilter, START_EFFECT_DEPTH);
    }
  };
  const changeFilterDepth = () => {
    let currentDepth = calculateDepthLevel();
    imgUploadPreview.querySelector(`img`).style.filter = createFilterScript(currentFilter, currentDepth);
    filterSliderControl.style.left = calculatePercent(currentDepth);
    filterSliderDepth.style.width = calculatePercent(currentDepth);
    filterLevelEffectValue.value = Math.round(currentDepth * 100);
  };
  const onFilterListChoose = (evt) => {
    if (evt.target && evt.target.matches(`input[type="radio"]`)) {
      for (let i = 0; i < FILTERS.length; i++) {
        if (FILTERS[i].value === evt.target.value) {
          currentFilter = FILTERS[i];
          imgUploadPreview.querySelector(`img`).style.filter = changeFilter();
        }
      }
    }
  };

  changeFilter();

  imgEditingForm.addEventListener(`change`, onFilterListChoose);

  filterSliderControl.addEventListener(`mouseup`, function () {
    changeFilterDepth();
  });

  /* Хэш-теги */
  const textHashtagsInput = imgEditingForm.querySelector(`.text__hashtags`);

  const splitHashtags = (text) => {
    return text.split(HASHTAG_SEPARATOR);
  };

  const checkArrayForRepeat = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (array[i].toLowerCase() === array[j].toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  };

  const checkHashtags = () => {
    let hashtags = splitHashtags(textHashtagsInput.value);
    if (hashtags.length > HASHTAG_MAX_QUANTITY) {
      textHashtagsInput.setCustomValidity(`Максимальное количество хэш-тегов: ` + HASHTAG_MAX_QUANTITY);
    } else if (checkArrayForRepeat(hashtags)) {
      textHashtagsInput.setCustomValidity(`Хэш-теги не должны повторяться и не чувствительны к регистру`);
    } else {
      textHashtagsInput.setCustomValidity(``);
      for (let i = 0; i < hashtags.length; i++) {
        if (!HASHTAG_PATTERN.test(hashtags[i])) {
          if (hashtags[i] === ``) {
            break;
          } else if (hashtags[i].length < HASHTAG_MIN_LENGTH || hashtags[i].length > HASHTAG_MAX_LENGTH) {
            textHashtagsInput.setCustomValidity(`Длина хэш-тегов должна быть не менее ` + HASHTAG_MIN_LENGTH + ` и не более ` + HASHTAG_MAX_LENGTH + ` символов`);
            break;
          } else {
            textHashtagsInput.setCustomValidity(`Хэш-тэг начинается с символа # и может содержать только буквы и числа`);
            break;
          }
        }
      }
    }
    textHashtagsInput.reportValidity();
  };

  textHashtagsInput.addEventListener(`focus`, function () {
    textHashtagsInput.addEventListener(`input`, checkHashtags);
  });

  textHashtagsInput.addEventListener(`blur`, function () {
    textHashtagsInput.removeEventListener(`input`, checkHashtags);
  });
})();
