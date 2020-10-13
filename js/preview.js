'use strict';

(function () {
  const AVATAR_WIDTH = 35;
  const AVATAR_HEIGHT = 35;

  window.createBigPicture = (element, picture) => {
    element.querySelector(`.big-picture__img`).querySelector(`img`).src = picture.url;
    element.querySelector(`.likes-count`).textContent = picture.likes;
    element.querySelector(`.comments-count`).textContent = picture.comments.length;
    element.querySelector(`.social__caption`).textContent = picture.description;

    const commentCount = element.querySelector(`.social__comment-count`);
    commentCount.classList.add(`hidden`);

    const commentsLoader = element.querySelector(`.comments-loader`);
    commentsLoader.classList.add(`hidden`);

    const socialComments = element.querySelector(`.social__comments`);

    let bigPictureComments = picture.comments;
    for (let i = 0; i < bigPictureComments.length; i++) {
      let commentItem = window.utils.makeElement(`li`, `social__comment`);
      let commentPicture = window.utils.makeElement(`img`, `social__picture`);
      commentPicture.src = bigPictureComments[i].avatar;
      commentPicture.alt = bigPictureComments[i].name;
      commentPicture.width = AVATAR_WIDTH;
      commentPicture.height = AVATAR_HEIGHT;
      commentItem.appendChild(commentPicture);
      let commentText = window.utils.makeElement(`p`, `social__text`, bigPictureComments[i].message);
      commentItem.appendChild(commentText);
      socialComments.appendChild(commentItem);
    }
  };
})();
