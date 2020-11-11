'use strict';

const AVATAR_WIDTH = 35;
const AVATAR_HEIGHT = 35;
const COMMENTS_COUNT_STEP = 5;

const bigPictureCancel = window.nodes.bigPicture.querySelector(`.big-picture__cancel`);
const socialCommentsCountShown = window.nodes.bigPicture.querySelector(`.comments-count__shown`);
const socialCommentsCount = window.nodes.bigPicture.querySelector(`.comments-count`);
const socialComments = window.nodes.bigPicture.querySelector(`.social__comments`);
const commentsLoader = window.nodes.bigPicture.querySelector(`.comments-loader`);

let addComments = () => {};

const onExtraCommentButtonClick = () => {
  addComments();
};
const createBigPicture = (picture) => {
  window.nodes.bigPicture.querySelector(`.big-picture__img`).querySelector(`img`).src = picture.url;
  window.nodes.bigPicture.querySelector(`.likes-count`).textContent = picture.likes;
  window.nodes.bigPicture.querySelector(`.social__caption`).textContent = picture.description;

  let bigPictureComments = picture.comments;

  socialComments.innerHTML = ``;
  commentsLoader.classList.remove(`hidden`);

  let commentsShownQuantity = 0;

  const updateCommentsCount = () => {
    socialCommentsCountShown.textContent = commentsShownQuantity;
    socialCommentsCount.textContent = bigPictureComments.length;
  };
  const createCommentItem = (comment) => {
    let commentItem = window.utils.makeElement(`li`, `social__comment`);
    let commentPicture = window.utils.makeElement(`img`, `social__picture`);
    commentPicture.src = comment.avatar;
    commentPicture.alt = comment.name;
    commentPicture.width = AVATAR_WIDTH;
    commentPicture.height = AVATAR_HEIGHT;
    commentItem.appendChild(commentPicture);
    let commentText = window.utils.makeElement(`p`, `social__text`, comment.message);
    commentItem.appendChild(commentText);
    return commentItem;
  };

  addComments = () => {
    let maxAdding = bigPictureComments.length - commentsShownQuantity;
    let addCount = COMMENTS_COUNT_STEP < maxAdding ? COMMENTS_COUNT_STEP : maxAdding;
    for (let i = 0; i < addCount; i++) {
      socialComments.appendChild(createCommentItem(bigPictureComments[commentsShownQuantity + i]));
    }
    commentsShownQuantity += addCount;
    updateCommentsCount();
    if (commentsShownQuantity === bigPictureComments.length) {
      commentsLoader.classList.add(`hidden`);
      commentsLoader.removeEventListener(`click`, onExtraCommentButtonClick);
    }
  };

  addComments();

  commentsLoader.addEventListener(`click`, onExtraCommentButtonClick);
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
    commentsLoader.removeEventListener(`click`, onExtraCommentButtonClick);
  }
};
