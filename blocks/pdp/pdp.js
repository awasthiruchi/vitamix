import { loadScript, toClassName, getMetadata } from '../../scripts/aem.js';
import renderGallery from './gallery.js';
import renderSpecs from './specification-tabs.js';
import renderPricing from './pricing.js';
import renderOptions from './options.js';

const BV_PRODUCT_ID = toClassName(getMetadata('sku')).replace(/-/g, '');

/**
 * Renders the title section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The title container element
 */
function renderTitle(block) {
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('title');

  const reviewsPlaceholder = document.createElement('div');
  reviewsPlaceholder.classList.add('pdp-reviews-summary-placeholder');
  reviewsPlaceholder.innerHTML = `<div data-bv-show="rating_summary" data-bv-product-id="${BV_PRODUCT_ID}">`;

  titleContainer.append(
    block.querySelector('h1:first-of-type'),
    reviewsPlaceholder,
  );

  return titleContainer;
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
 * Renders the add to cart section of the PDP block.
 * @returns {Element} The add to cart container element
 */
function renderAddToCart() {
  const addToCartContainer = document.createElement('div');
  addToCartContainer.classList.add('add-to-cart');

  // Quantity Label
  const quantityLabel = document.createElement('label');
  quantityLabel.textContent = 'Quantity:';
  addToCartContainer.appendChild(quantityLabel);

  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('quantity-container');
  const quantitySelect = document.createElement('select');

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    quantitySelect.appendChild(option);
  }
  quantityContainer.appendChild(quantitySelect);

  // Add to Cart Button
  const addToCartButton = document.createElement('button');
  addToCartButton.textContent = 'Add to Cart';
  quantityContainer.appendChild(addToCartButton);

  addToCartContainer.appendChild(quantityContainer);

  return addToCartContainer;
}

/**
 * Renders the reviews section of the PDP block.
 * @param {Element} block - The PDP block element
 */
// eslint-disable-next-line no-unused-vars
async function renderReviews(block) {
  // TODO: Add Bazaarvoice reviews
  const bazaarvoiceContainer = document.createElement('div');
  bazaarvoiceContainer.innerHTML = `<div data-bv-show="reviews" data-bv-product-id="${BV_PRODUCT_ID}"></div>`;

  setTimeout(async () => {
    await loadScript('https://apps.bazaarvoice.com/deployments/vitamix/main_site/production/en_US/bv.js');
  }, 5000);

  block.append(bazaarvoiceContainer);
}

/**
 * Decorates the PDP block.
 * @param {Element} block - The PDP block element
 */
export default function decorate(block) {
  // remove eyebrow classes from all but the first eyebrow
  [...block.querySelectorAll('p.eyebrow')].forEach((element) => {
    element.classList.remove('eyebrow');
  });

  // Get the json-ld from the head and parse it
  const jsonLd = document.head.querySelector('script[type="application/ld+json"]');
  const jsonLdData = jsonLd ? JSON.parse(jsonLd.textContent) : null;

  const { variants } = window;
  const galleryContainer = renderGallery(block, variants);
  const titleContainer = renderTitle(block);
  const pricingContainer = renderPricing(block);
  const optionsContainer = renderOptions(block, variants);
  const addToCartContainer = renderAddToCart(block);
  const detailsContainer = renderDetails(block);
  renderReviews(block);

  block.append(
    titleContainer,
    pricingContainer,
    addToCartContainer,
    detailsContainer,
    galleryContainer,
  );

  if (optionsContainer) {
    block.append(optionsContainer);
  }

  const specifications = detailsContainer.querySelector('.specifications');
  renderSpecs(specifications, galleryContainer, jsonLdData);
  renderSpecs(specifications, detailsContainer, jsonLdData);
  specifications.remove();
}
