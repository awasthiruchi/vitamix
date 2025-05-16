import { createOptimizedPicture } from '../../scripts/aem.js';
import { attachImageListeners } from './gallery.js';

/**
 * Handles the change of an option.
 * @param {Element} block - The PDP block element
 * @param {Array} variants - The variants of the product
 * @param {string} color - The color of the selected option
 */
function onOptionChange(block, variants, color) {
  const selectedOptionLabel = block.querySelector('.selected-option-label');
  const variant = variants.find((colorVariant) => colorVariant.color.replace(/\s+/g, '-').toLowerCase() === color);
  selectedOptionLabel.textContent = `Color: ${variant.color}`;

  const selectedImage = block.querySelector('.gallery-selected-image');
  const currentImage = selectedImage.querySelector('picture');
  currentImage.remove();
  selectedImage.append(createOptimizedPicture(variant.image[0], '', false));

  // Update the gallery images
  const galleryImages = block.querySelector('.gallery-images');
  const currentVariantImages = block.querySelectorAll('.gallery-images > picture');
  currentVariantImages.forEach((image) => {
    image.remove();
  });

  const variantImages = variant.image.map((image) => createOptimizedPicture(image, '', false));
  variantImages.reverse().forEach((image) => {
    galleryImages.prepend(image);
  });

  // remove selected class from all pictures
  galleryImages.querySelectorAll('picture').forEach((picture) => {
    picture.classList.remove('selected');
  });

  // add selected class to the first image
  galleryImages.querySelector('picture').classList.add('selected');

  attachImageListeners(galleryImages, selectedImage);
}

/**
 * Renders the options section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The options container element
 */
export default function renderOptions(block, variants) {
  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options');

  const selectionContainer = document.createElement('div');
  selectionContainer.classList.add('selection');

  const selectedOptionLabel = document.createElement('div');
  selectedOptionLabel.classList.add('selected-option-label');
  selectedOptionLabel.textContent = `Color: ${variants[0].color}`;
  selectionContainer.append(selectedOptionLabel);

  const colors = variants.map((variant) => variant.color.replace(/\s+/g, '-').toLowerCase());

  const colorOptions = colors.map((color) => {
    const colorOption = document.createElement('div');
    colorOption.classList.add('color-swatch');
    colorOption.classList.add(color);

    const colorSwatch = document.createElement('div');
    colorSwatch.classList.add('color-inner');
    colorOption.append(colorSwatch);

    colorOption.addEventListener('click', () => {
      onOptionChange(block, variants, color);
    });

    return colorOption;
  });

  const colorOptionsContainer = document.createElement('div');
  colorOptionsContainer.classList.add('color-options');
  colorOptionsContainer.append(...colorOptions);
  selectionContainer.append(colorOptionsContainer);

  optionsContainer.append(selectionContainer);

  const warrentyContainer = document.createElement('div');
  warrentyContainer.classList.add('warranty');

  const warrentyHeading = document.createElement('div');
  warrentyHeading.textContent = 'Warranty:';
  warrentyContainer.append(warrentyHeading);

  const warrentyValue = document.createElement('div');
  warrentyValue.textContent = '10 Year Standard Warranty (Free)';
  warrentyContainer.append(warrentyValue);

  const cookbookContainer = document.createElement('div');
  cookbookContainer.classList.add('cookbook');

  const promoHeading = document.createElement('div');
  promoHeading.classList.add('promo-heading');
  promoHeading.textContent = 'Free Simply Soups & Simply Smoothies Cookbooks with purchase of $399.95 or more!';
  cookbookContainer.append(promoHeading);

  const cookbookPlaceholder = document.createElement('img');
  cookbookPlaceholder.classList.add('cookbook-placeholder');
  cookbookPlaceholder.src = '/blocks/pdp/cookbook.png';
  cookbookContainer.append(cookbookPlaceholder);

  optionsContainer.append(cookbookContainer);

  return optionsContainer;
}
