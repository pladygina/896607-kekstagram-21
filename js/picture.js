'use strict';

(function () {
  const IMAGES_MAX_QUANTITY = 25;

  const pictureTemplate = document.querySelector(`#picture`)
    .content
    .querySelector(`.picture`);

  let imagesCurrentQuntity = 0;

  const renderPicture = (item, number, template) => {
    let picture = template.cloneNode(true);
    picture.dataset.imgNumber = number;
    picture.querySelector(`.picture__img`).src = item.url;
    picture.querySelector(`.picture__likes`).textContent = item.likes;
    picture.querySelector(`.picture__comments`).textContent = item.comments.length;
    return picture;
  };

  window.picture = {
    updatePictures: (items) => {
      const fragment = document.createDocumentFragment();
      let imagesNewQuantity = items.length < IMAGES_MAX_QUANTITY ? items.length : IMAGES_MAX_QUANTITY;
      for (let i = 0; i < imagesCurrentQuntity; i++) {
        window.nodes.picturesList.querySelector(`.picture`).remove();
      }
      items.slice(0, imagesNewQuantity).forEach((item, index) => {
        fragment.appendChild(renderPicture(item, index, pictureTemplate));
      });
      window.nodes.picturesList.appendChild(fragment);
      imagesCurrentQuntity = imagesNewQuantity;
    }
  };
})();
