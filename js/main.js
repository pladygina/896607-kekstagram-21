'use strict';

const TEST_ARRAY_LENGTH = 25;
const MAX_COMMENTS_NUMBER = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
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
const AVATARS = [];
for (let i = 1; i <= MAX_COMMENTS_NUMBER; i++) {
  AVATARS[i - 1] = `img/avatar-` + i + `.svg`;
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

const createComments = (quantity) => {
  const comments = [];
  for (let i = 0; i < quantity; i++) {
    let comment = {};
    comment.avatar = getRandomFromArray(AVATARS);
    comment.message = getRandomFromArray(MESSAGES);
    comment.name = getRandomFromArray(NAMES);
    comments[i] = comment;
  }
  return comments;
};

let pictureUrls = [];
const pictureComments = [];
for (let i = 1; i <= TEST_ARRAY_LENGTH; i++) {
  pictureUrls[i - 1] = `photos/` + i + `.jpg`;
  pictureComments[i - 1] = createComments(getRandomFromInterval(1, MAX_COMMENTS_NUMBER));
}
pictureUrls = getRandomizedArray(pictureUrls);

const createPicture = (number) => {
  let pictureItem = {};
  pictureItem.url = pictureUrls[number];
  pictureItem.description = ``;
  pictureItem.likes = getRandomFromInterval(MIN_LIKES, MAX_LIKES);
  pictureItem.comments = pictureComments[number];
  return pictureItem;
};

const createTestPictures = (quantity) => {
  let testPictures = [];
  for (let i = 0; i < quantity; i++) {
    testPictures[i] = createPicture(i);
  }
  return testPictures;
};

const pictures = createTestPictures(TEST_ARRAY_LENGTH);

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
for (let i = 0; i < TEST_ARRAY_LENGTH; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}

picturesList.appendChild(fragment);
