'use strict';

(function () {
  const renderPicture = (item, template) => {
    let picture = template.cloneNode(true);
    picture.querySelector(`.picture__img`).src = item.url;
    picture.querySelector(`.picture__likes`).textContent = item.likes;
    picture.querySelector(`.picture__comments`).textContent = item.comments.length;
    return picture;
  };

  window.createPicturesListFragment = (items, template) => {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < items.length; i++) {
      fragment.appendChild(renderPicture(items[i], template));
    }
    return fragment;
  };
})();
