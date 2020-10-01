'use strict';

const MAX_OBJECTS = 25;
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
const AVATAR_WIDTH = 35;
const AVATAR_HEIGHT = 35;
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

const body = document.querySelector(`body`);

const bigPicture = document.querySelector(`.big-picture`);

const showBigPicture = (number) => {
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

showBigPicture(0);
