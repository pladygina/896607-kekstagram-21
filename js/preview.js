'use strict';

(function () {
  const AVATAR_WIDTH = 35;
  const AVATAR_HEIGHT = 35;

  const bigPictureCancel = window.nodes.bigPicture.querySelector(`.big-picture__cancel`);

  const createBigPicture = (picture) => {
    window.nodes.bigPicture.querySelector(`.big-picture__img`).querySelector(`img`).src = picture.url;
    window.nodes.bigPicture.querySelector(`.likes-count`).textContent = picture.likes;
    window.nodes.bigPicture.querySelector(`.comments-count`).textContent = picture.comments.length;
    window.nodes.bigPicture.querySelector(`.social__caption`).textContent = picture.description;

    const commentCount = window.nodes.bigPicture.querySelector(`.social__comment-count`);
    commentCount.classList.add(`hidden`);

    const commentsLoader = window.nodes.bigPicture.querySelector(`.comments-loader`);
    commentsLoader.classList.add(`hidden`);

    const socialComments = window.nodes.bigPicture.querySelector(`.social__comments`);

    let bigPictureComments = picture.comments;

    bigPictureComments.forEach((comment) => {
      let commentItem = window.utils.makeElement(`li`, `social__comment`);
      let commentPicture = window.utils.makeElement(`img`, `social__picture`);
      commentPicture.src = comment.avatar;
      commentPicture.alt = comment.name;
      commentPicture.width = AVATAR_WIDTH;
      commentPicture.height = AVATAR_HEIGHT;
      commentItem.appendChild(commentPicture);
      let commentText = window.utils.makeElement(`p`, `social__text`, comment.message);
      commentItem.appendChild(commentText);
      socialComments.appendChild(commentItem);
    });
  };

  const onPreviewCancelClick = () => {
    window.preview.closeBigPicture();
  };

  const onPreviewEscPress = (evt) => {
    window.utils.isEscEvent(evt, window.preview.closeBigPicture);
  };

  window.preview = {
    openBigPicture: (picture) => {
      window.nodes.body.classList.add(`modal-open`);
      window.nodes.bigPicture.classList.remove(`hidden`);
      createBigPicture(picture);
      bigPictureCancel.addEventListener(`click`, onPreviewCancelClick);
      document.addEventListener(`keydown`, onPreviewEscPress);
    },
    closeBigPicture: () => {
      window.nodes.body.classList.remove(`modal-open`);
      window.nodes.bigPicture.classList.add(`hidden`);
      bigPictureCancel.removeEventListener(`click`, onPreviewCancelClick);
      document.removeEventListener(`keydown`, onPreviewEscPress);
    }
  };
})();
