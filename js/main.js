'use strict';

const MAX_OBJECTS = 25;
const MAX_COMMENTS_NUMBER = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_SCALE = 0.25;
const MAX_SCALE = 1;
const SCALE_INTERVAL = 0.25;
const AVATAR_WIDTH = 35;
const AVATAR_HEIGHT = 35;
const START_EFFECT_DEPTH = 1;
const HASHTAG_PATTERN = /^#[\wа-яА-ЯёЁ]{1,19}$/;
const HASHTAG_MAX_QUANTITY = 5;
const HASHTAG_MIN_LENGTH = 2;
const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_SEPARATOR = ` `;
const NAMES = [
  `Виктор`,
  `Илья`,
  `Мария`,
  `Ленусик`,
  `Петр Иванович`,
  `Зеленый`,
  `Рафаэль`,
  `Людоед`,
  `Дарья Воробьева`,
  `Алёна`];
const MESSAGES = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
];
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
const body = document.querySelector(`body`);
const imgEditingForm = document.querySelector(`.img-upload__form`);

const avatars = [];
for (let i = 1; i <= MAX_COMMENTS_NUMBER; i++) {
  avatars.push(`img/avatar-` + i + `.svg`);
}

const getRandomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const getRandomFromInterval = (min, max) => {
  let minimum = Math.ceil(min);
  let maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
};
const getRandomizedArray = (array) => {
  let randomizedArray = [];
  for (let i = array.length - 1; i >= 0; i--) {
    randomizedArray[i] = array.splice((getRandomFromInterval(0, i)), 1);
  }
  return randomizedArray;
};
const makeElement = (tagName, className, text) => {
  let element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

const createComments = (quantity) => {
  const comments = [];
  for (let i = 0; i < quantity; i++) {
    comments.push({
      avatar: getRandomFromArray(avatars),
      message: getRandomFromArray(MESSAGES),
      name: getRandomFromArray(NAMES)
    });
  }
  return comments;
};

let pictureUrls = [];
const pictureComments = [];
for (let i = 1; i <= MAX_OBJECTS; i++) {
  pictureUrls.push(`photos/` + i + `.jpg`);
  pictureComments.push(createComments(getRandomFromInterval(1, MAX_COMMENTS_NUMBER)));
}
pictureUrls = getRandomizedArray(pictureUrls);

const createPicture = (number) => {
  return {
    url: pictureUrls[number],
    description: `Это случайное фото`,
    likes: getRandomFromInterval(MIN_LIKES, MAX_LIKES),
    comments: pictureComments[number]
  };
};

const createTestPictures = (quantity) => {
  let testPictures = [];
  for (let i = 0; i < quantity; i++) {
    testPictures[i] = createPicture(i);
  }
  return testPictures;
};

const pictures = createTestPictures(MAX_OBJECTS
);

const picturesList = document.querySelector(`.pictures`);

const pictureTemplate = document.querySelector(`#picture`)
  .content
  .querySelector(`.picture`);

const renderPicture = (item) => {
  let picture = pictureTemplate.cloneNode(true);
  picture.querySelector(`.picture__img`).src = item.url;
  picture.querySelector(`.picture__likes`).textContent = item.likes;
  picture.querySelector(`.picture__comments`).textContent = item.comments.length;
  return picture;
};

const fragment = document.createDocumentFragment();
for (let i = 0; i < MAX_OBJECTS; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}

picturesList.appendChild(fragment);

const bigPicture = document.querySelector(`.big-picture`);

const openBigPicture = (number) => {
  body.classList.add(`modal-open`);
  bigPicture.classList.remove(`hidden`);

  bigPicture.querySelector(`.big-picture__img`).querySelector(`img`).src = pictures[number].url;
  bigPicture.querySelector(`.likes-count`).textContent = pictures[number].likes;
  bigPicture.querySelector(`.comments-count`).textContent = pictures[number].comments.length;
  bigPicture.querySelector(`.social__caption`).textContent = pictures[number].description;

  const commentCount = bigPicture.querySelector(`.social__comment-count`);
  commentCount.classList.add(`hidden`);

  const commentsLoader = bigPicture.querySelector(`.comments-loader`);
  commentsLoader.classList.add(`hidden`);

  const socialComments = bigPicture.querySelector(`.social__comments`);

  let bigPictureComments = pictures[number].comments;
  for (let i = 0; i < bigPictureComments.length; i++) {
    let commentItem = makeElement(`li`, `social__comment`);
    let commentPicture = makeElement(`img`, `social__picture`);
    commentPicture.src = bigPictureComments[i].avatar;
    commentPicture.alt = bigPictureComments[i].name;
    commentPicture.width = AVATAR_WIDTH;
    commentPicture.height = AVATAR_HEIGHT;
    commentItem.appendChild(commentPicture);
    let commentText = makeElement(`p`, `social__text`, bigPictureComments[i].message);
    commentItem.appendChild(commentText);
    socialComments.appendChild(commentItem);
  }
};

openBigPicture(0);

/* временно для выполнения следующего задания */
const closeBigPicture = () => {
  body.classList.remove(`modal-open`);
  bigPicture.classList.add(`hidden`);
};
closeBigPicture();

/* загрузка и редактирование изображения */
const uploadFileInput = document.querySelector(`#upload-file`);
const uploadOverlay = document.querySelector(`.img-upload__overlay`);
const uploadCancel = document.querySelector(`#upload-cancel`);

const onUploadEscPress = (evt) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closeUploadOverlay();
  }
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

uploadOverlay.addEventListener(`change`, function () {
  openUploadOverlay();
});

uploadCancel.addEventListener(`click`, function () {
  closeUploadOverlay();
});

uploadCancel.addEventListener(`keydown`, function (evt) {
  if (evt.key === `Enter`) {
    closeUploadOverlay();
  }
});

openUploadOverlay();

const imgUploadPreview = document.querySelector(`.img-upload__preview`);
const scaleControlSmaller = document.querySelector(`.scale__control--smaller`);
const scaleControlBigger = document.querySelector(`.scale__control--bigger`);
const scaleControlValue = document.querySelector(`.scale__control--value`);

const setPreviewScale = (value) => {
  scaleControlValue.value = (value * 100) + `%`;
  imgUploadPreview.querySelector(`img`).style.transform = `scale(` + value + `)`;
  return value;
};

const makePreviewSmaller = () => {
  if (currentPreviewSize > MIN_SCALE) {
    currentPreviewSize = setPreviewScale(currentPreviewSize - SCALE_INTERVAL);
    if (scaleControlBigger.disabled) {
      scaleControlBigger.disabled = false;
    }
  }
  if (currentPreviewSize === MIN_SCALE) {
    scaleControlSmaller.disabled = true;
  }
};

const makePreviewBigger = () => {
  if (currentPreviewSize < MAX_SCALE) {
    currentPreviewSize = setPreviewScale(currentPreviewSize + SCALE_INTERVAL);
    if (scaleControlSmaller.disabled) {
      scaleControlSmaller.disabled = false;
    }
  }
  if (currentPreviewSize === MAX_SCALE) {
    scaleControlBigger.disabled = true;
  }
};

let currentPreviewSize = setPreviewScale(1);

scaleControlSmaller.addEventListener(`click`, function () {
  makePreviewSmaller();
});

scaleControlBigger.addEventListener(`click`, function () {
  makePreviewBigger();
});

/* временно для отладки*/
uploadFileInput.required = false;

/* наложение эффекта и регулировка*/
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
        if (hashtags[i].length < HASHTAG_MIN_LENGTH || hashtags[i].length > HASHTAG_MAX_LENGTH) {
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
  document.removeEventListener(`keydown`, onUploadEscPress);
  textHashtagsInput.addEventListener(`input`, function () {
    checkHashtags();
  });
});

textHashtagsInput.addEventListener(`blur`, function () {
  document.addEventListener(`keydown`, onUploadEscPress);
});
