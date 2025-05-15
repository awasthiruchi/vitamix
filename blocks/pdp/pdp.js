/**
 * Renders the gallery section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The gallery container element
 */
function renderGallery(block) {
  const galleryContainer = document.createElement('div');
  galleryContainer.classList.add('gallery');

  const images = block.querySelectorAll('.img-wrapper');
  galleryContainer.append(...images);

  return galleryContainer;
}

/**
 * Renders the title section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The title container element
 */
function renderTitle(block) {
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('title');

  const reviewsPlaceholder = document.createElement('img');
  reviewsPlaceholder.classList.add('reviews-placeholder');
  reviewsPlaceholder.src = '/blocks/pdp/reviews.png';

  titleContainer.append(
    block.querySelector('p:nth-of-type(1)'), 
    block.querySelector('h1:first-of-type'),
    reviewsPlaceholder
  );

  return titleContainer;
}

/**
 * Renders the pricing section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The pricing container element
 */
function renderPricing(block) {
  const pricingContainer = document.createElement('div');
  pricingContainer.classList.add('pricing');
  pricingContainer.append(block.querySelector('p:nth-of-type(1)'));

  return pricingContainer;
}

/**
 * Renders the options section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The options container element
 */
function renderOptions(block) {
  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options');

  const warrentyContainer = document.createElement('div');
  warrentyContainer.classList.add('warrenty');
  warrentyContainer.textContent = '10 Year Standard Warranty (Free)';
  optionsContainer.append(warrentyContainer);

  return optionsContainer;
}

/**
 * Renders the details section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The details container element
 */
function renderDetails(block) {
  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('details');

  detailsContainer.append(...block.children);

  return detailsContainer;
}

/**
 * Renders the specifications section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The specifications container element
 */
function renderSpecs(block) {
  const specsContainer = document.createElement('div');
  specsContainer.classList.add('specs');

  specsContainer.append(block.querySelector('.specifications'));
  return specsContainer;
}

/**
 * Decorates the PDP block.
 * @param {Element} block - The PDP block element
 */
export default function decorate(block) {
  const galleryContainer = renderGallery(block);
  const titleContainer = renderTitle(block);
  const pricingContainer = renderPricing(block);
  const optionsContainer = renderOptions(block);
  const detailsContainer = renderDetails(block);
  const specsContainer = renderSpecs(block);

  block.append(titleContainer, pricingContainer, optionsContainer, detailsContainer, specsContainer, galleryContainer);

  // remove eyebrow classes from all but the first eyebrow
  [...block.querySelectorAll('p.eyebrow')].slice(1).forEach(element => {
    element.classList.remove('eyebrow');
  });
}
