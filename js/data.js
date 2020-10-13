'use strict';

(function () {
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
    `Алёна`
  ];
  const MESSAGES = [
    `Всё отлично!`,
    `В целом всё неплохо. Но не всё.`,
    `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
    `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
    `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
    `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
  ];

  const avatars = [];
  for (let i = 1; i <= MAX_COMMENTS_NUMBER; i++) {
    avatars.push(`img/avatar-` + i + `.svg`);
  }

  const createComments = (quantity) => {
    const comments = [];
    for (let i = 0; i < quantity; i++) {
      comments.push({
        avatar: window.utils.getRandomFromArray(avatars),
        message: window.utils.getRandomFromArray(MESSAGES),
        name: window.utils.getRandomFromArray(NAMES)
      });
    }
    return comments;
  };

  let pictureUrls = [];
  const pictureComments = [];
  for (let i = 1; i <= MAX_OBJECTS; i++) {
    pictureUrls.push(`photos/` + i + `.jpg`);
    pictureComments.push(createComments(window.utils.getRandomFromInterval(1, MAX_COMMENTS_NUMBER)));
  }
  pictureUrls = window.utils.getRandomizedArray(pictureUrls);

  const createPicture = (number) => {
    return {
      url: pictureUrls[number],
      description: `Это случайное фото`,
      likes: window.utils.getRandomFromInterval(MIN_LIKES, MAX_LIKES),
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

  window.pictures = createTestPictures(MAX_OBJECTS);

})();


