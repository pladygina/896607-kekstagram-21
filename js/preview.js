'use strict';

(function () {
  const AVATAR_WIDTH = 35;
  const AVATAR_HEIGHT = 35;

  const bigPicture = document.querySelector(`.big-picture`);

  const createBigPicture = (picture) => {
    bigPicture.querySelector(`.big-picture__img`).querySelector(`img`).src = picture.url;
    bigPicture.querySelector(`.likes-count`).textContent = picture.likes;
    bigPicture.querySelector(`.comments-count`).textContent = picture.comments.length;
    bigPicture.querySelector(`.social__caption`).textContent = picture.description;

    const commentCount = bigPicture.querySelector(`.social__comment-count`);
    commentCount.classList.add(`hidden`);

    const commentsLoader = bigPicture.querySelector(`.comments-loader`);
    commentsLoader.classList.add(`hidden`);

    const socialComments = bigPicture.querySelector(`.social__comments`);

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

  window.preview = {
    openBigPicture: (picture) => {
      window.nodes.body.classList.add(`modal-open`);
      bigPicture.classList.remove(`hidden`);
      createBigPicture(picture);
    },
    closeBigPicture: () => {
      window.nodes.body.classList.remove(`modal-open`);
      bigPicture.classList.add(`hidden`);
    }
  };
})();
