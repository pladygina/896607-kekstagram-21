'use strict';

(function () {
  const IMAGES_MAX_QUANTITY = 25;
  const imagesQuantity = 0;

  const picturesList = document.querySelector(`.pictures`);
  const pictureTemplate = document.querySelector(`#picture`)
    .content
    .querySelector(`.picture`);

  const renderPicture = (item, template) => {
    let picture = template.cloneNode(true);
    picture.querySelector(`.picture__img`).src = item.url;
    picture.querySelector(`.picture__likes`).textContent = item.likes;
    picture.querySelector(`.picture__comments`).textContent = item.comments.length;
    return picture;
  };

  window.picture = {
    updatePictures: (items) => {
      const fragment = document.createDocumentFragment();
      for (let i = imagesQuantity; i < IMAGES_MAX_QUANTITY; i++) {
        fragment.appendChild(renderPicture(items[i], pictureTemplate));
      }
      picturesList.appendChild(fragment);
    }
  };
})();
