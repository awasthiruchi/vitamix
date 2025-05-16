import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Attaches click listeners to each gallery image and assigns them to the .gallery-selected-image.
 * @param {Element} galleryImages - The gallery images container element
 * @param {Element} selectedImageElement - The selected image element
 */
export function attachImageListeners(galleryImages, selectedImageElement) {
  // Add click listener to each gallery image and assign to .gallery-selected-image
  // TODO: This is adding multiple listeners to the same element
  galleryImages.querySelectorAll('picture').forEach((picture) => {
    picture.addEventListener('click', () => {
      // if the picture is already selected, do nothing
      if (picture.classList.contains('selected')) return;

      // remove selected class from all pictures
      galleryImages.querySelectorAll('picture').forEach((galleryImage) => {
        galleryImage.classList.remove('selected');
      });
      // add selected class to the clicked picture
      picture.classList.add('selected');

      // swap the selected picture with the .gallery-selected-image
      const currentImage = selectedImageElement.querySelector('picture');
      currentImage.remove();
      selectedImageElement.append(picture.cloneNode(true));
    });
  });
}

/**
 * Renders the gallery section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The gallery container element
 */
export default function renderGallery(block, variants) {
  const galleryContainer = document.createElement('div');
  galleryContainer.classList.add('gallery');

  const defaultVariant = variants[0];

  const selectedImage = block.querySelector('.gallery-selected-image');
  galleryContainer.append(selectedImage);

  const galleryImages = document.createElement('div');
  galleryImages.classList.add('gallery-images');
  const variantImageElements = defaultVariant.image.map((image) => createOptimizedPicture(image, '', false));
  variantImageElements[0].classList.add('selected');

  const images = block.querySelectorAll('.img-wrapper');

  // Keep track of the default product images
  window.defaultProductImages = Array.from(images).map((image) => image.cloneNode(true));

  galleryImages.append(...variantImageElements, ...images);

  attachImageListeners(galleryImages, selectedImage);

  galleryContainer.append(galleryImages);

  return galleryContainer;
}
