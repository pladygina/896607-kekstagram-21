'use strict';

const IMAGES_MAX_QUANTITY = 25;

const pictureTemplate = document.querySelector(`#picture`)
  .content
  .querySelector(`.picture`);

let imagesCurrentQuantity = 0;

const renderPicture = (image, number, template) => {
  let picture = template.cloneNode(true);
  picture.dataset.imgNumber = number;
  picture.querySelector(`.picture__img`).src = image.url;
  picture.querySelector(`.picture__likes`).textContent = image.likes;
  picture.querySelector(`.picture__comments`).textContent = image.comments.length;
  return picture;
};

window.picture = {
  updateGallery: (images) => {
    const fragment = document.createDocumentFragment();
    let imagesNewQuantity = images.length < IMAGES_MAX_QUANTITY ? images.length : IMAGES_MAX_QUANTITY;
    for (let i = 0; i < imagesCurrentQuantity; i++) {
      window.nodes.picturesList.querySelector(`.picture`).remove();
    }
    images.slice(0, imagesNewQuantity).forEach((image, index) => {
      fragment.appendChild(renderPicture(image, index, pictureTemplate));
    });
    window.nodes.picturesList.appendChild(fragment);
    imagesCurrentQuantity = imagesNewQuantity;
  }
};
