import { loadScript, toClassName, getMetadata } from '../../scripts/aem.js';
import renderGallery from './gallery.js';
import renderSpecs from './specification-tabs.js';
import renderPricing, { extractPricing } from './pricing.js';
// eslint-disable-next-line import/no-cycle
import { renderOptions, onOptionChange } from './options.js';
import { loadFragment } from '../fragment/fragment.js';
import { checkOutOfStock } from '../../scripts/scripts.js';

const BV_PRODUCT_ID = getMetadata('reviewsId') || toClassName(getMetadata('sku')).replace(/-/g, '');

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

  const collectionContainer = document.createElement('p');
  collectionContainer.classList.add('pdp-collection-placeholder');
  collectionContainer.textContent = `${getMetadata('collection') || ''}`;

  titleContainer.append(
    collectionContainer,
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
  if (detailsContainer.querySelector('h3')) {
    const h2 = document.createElement('h2');
    h2.textContent = 'About';
    detailsContainer.prepend(h2);
  }

  return detailsContainer;
}

/**
 * Renders the add to cart section of the PDP block.
 * @returns {Element} The add to cart container element
 */
function renderAddToCart(custom) {
  const addToCartContainer = document.createElement('div');
  addToCartContainer.classList.add('add-to-cart');

  // Quantity Label
  const quantityLabel = document.createElement('label');
  quantityLabel.textContent = 'Quantity:';
  quantityLabel.classList.add('pdp-quantity-label');
  quantityLabel.htmlFor = 'pdp-quantity-select';
  addToCartContainer.appendChild(quantityLabel);

  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('quantity-container');
  const quantitySelect = document.createElement('select');
  quantitySelect.id = 'pdp-quantity-select';

  const maxQuantity = custom.maxCartQty ? +custom.maxCartQty : 5;
  for (let i = 1; i <= maxQuantity; i += 1) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    quantitySelect.appendChild(option);
  }
  quantityContainer.appendChild(quantitySelect);

  // Add to Cart Button
  const addToCartButton = document.createElement('button');
  addToCartButton.textContent = 'Add to Cart';

  addToCartButton.addEventListener('click', async () => {
    const { cartApi } = await import('../../scripts/minicart/api.js');

    const { updateMagentoCacheSections, getMagentoCache } = await import('../../scripts/storage/util.js');

    // Check cache and update if needed
    const currentCache = getMagentoCache();
    if (!currentCache?.customer) {
      await updateMagentoCacheSections(['customer']);
    }

    addToCartButton.textContent = 'Adding...';
    addToCartButton.setAttribute('aria-disabled', 'true');

    const quantity = document.querySelector('.quantity-container select')?.value || 1;

    const { sku, options } = window.selectedVariant
      ? window.selectedVariant
      : { sku: getMetadata('sku'), options: [] };

    const filteredOptions = options?.uid ? [options.uid] : [];

    await cartApi.addToCart(sku, filteredOptions, quantity);

    // Open cart page
    window.location.href = '/us/en_us/checkout/cart/';
  });

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
  bazaarvoiceContainer.classList.add('pdp-reviews-container');
  bazaarvoiceContainer.innerHTML = `<div data-bv-show="reviews" data-bv-product-id="${BV_PRODUCT_ID}"></div>`;

  setTimeout(async () => {
    await loadScript('https://apps.bazaarvoice.com/deployments/vitamix/main_site/production/en_US/bv.js');
  }, 5000);

  window.bvCallback = () => { };

  block.parentElement.append(bazaarvoiceContainer);
}

function renderFAQ() {
  const faqContainer = document.createElement('div');
  faqContainer.classList.add('faq-container');
  faqContainer.innerHTML = `
  <h4>Have a question?</h4>
  <ul>
    <li><a href="https://www.vitamix.com/us/en_us/owners-resources/product-support/faqs/">Frequently Asked Questions</a></li>
    <li><a href="https://www.vitamix.com/us/en_us/customer-service/contact-us/">Contact Us</a></li>
  </ul>`;
  return faqContainer;
}

function renderCompare() {
  const compareContainer = document.createElement('div');
  compareContainer.classList.add('pdp-compare-container');
  compareContainer.innerHTML = `
    <div>
      <button class="pdp-compare-button">Compare</button>
      <a href="https://www.vitamix.com/us/en_us/catalog/product_compare/index/" title="View Comparison" class="comparelistlink">View Comparison List.</a>
    </div>`;
  return compareContainer;
}

function renderContent() {
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('pdp-content-fragment');
  const fragmentPath = window.location.pathname.replace('/products/', '/products/fragments/');
  const insertFragment = async () => {
    const fragment = await loadFragment(fragmentPath);
    if (fragment) {
      while (fragment.firstChild) {
        contentContainer.append(fragment.firstChild);
      }
    }
  };
  insertFragment();
  return contentContainer;
}

function renderFreeShipping(offers) {
  if (!offers[0] || offers[0].price < 99) return null;
  const freeShippingContainer = document.createElement('div');
  freeShippingContainer.classList.add('pdp-free-shipping-container');
  freeShippingContainer.innerHTML = `
      <img src="/icons/delivery.svg" alt="Free Shipping" />
      <span>Eligible for FREE shipping</span>
  `;
  return freeShippingContainer;
}

function renderAlert(block, product) {
  /* retired and coming soon */
  if (product.custom && product.custom.retired === 'Yes') {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('pdp-alert');
    alertContainer.innerHTML = '<p>Retired Product</p>';
    return alertContainer;
  }
  /* promos */
  const promo = getMetadata('promoButton');
  if (promo) {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('pdp-alert');
    alertContainer.classList.add('pdp-promo-alert');
    alertContainer.innerHTML = `<p>${promo}</p>`;
    return alertContainer;
  }

  /* save now */
  const pricingElement = block.querySelector('p:nth-of-type(1)');
  const pricing = extractPricing(pricingElement);
  if (pricing.regular && pricing.regular > pricing.final) {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('pdp-alert');
    alertContainer.classList.add('pdp-promo-alert');
    alertContainer.innerHTML = '<p>Save Now!</p>';
    return alertContainer;
  }

  return null;
}

function renderRelatedProducts(product) {
  const { relatedSkus } = product.custom;
  const relatedProducts = relatedSkus || [];
  if (relatedProducts.length > 0) {
    const relatedProductsContainer = document.createElement('div');
    relatedProductsContainer.classList.add('pdp-related-products-container');
    relatedProductsContainer.innerHTML = `
      <h2>Related Products</h2>
    `;
    const ul = document.createElement('ul');
    relatedProducts.forEach((url) => {
      const li = document.createElement('li');
      const fillProduct = async () => {
        const resp = await fetch(`${url}.json`);
        const json = await resp.json();
        const title = json.name;
        const image = new URL(json.images[0].url, window.location.href);
        const price = +json.price.final;
        li.innerHTML = `<a href="${url}"><img src="${image}?width=750&#x26;format=webply&#x26;optimize=medium" alt="${title}" /><div><p>${title}</p><strong>$${price.toFixed(2)}</strong></div></a>`;
      };
      fillProduct();
      ul.appendChild(li);
    });
    relatedProductsContainer.appendChild(ul);
    return relatedProductsContainer;
  }
  return null;
}

function renderShare() {
  const shareContainer = document.createElement('div');
  shareContainer.classList.add('pdp-share-container');
  const url = decodeURIComponent(window.location.href);
  shareContainer.innerHTML = `
    Share: 
    <a rel="noopener noreferrer nofollow" href="https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${url}"><img src="/icons/facebook.svg" alt="Facebook" /></a>
    <a rel="noopener noreferrer nofollow" href="https://www.twitter.com/share?url=${url}"><img src="/icons/twitter.svg" alt="Twitter" /></a>
    <a rel="noopener noreferrer nofollow" href="https://www.pinterest.com/pin/create/button/?url=${url}"><img src="/icons/pinterest.svg" alt="Pinterest" /></a>
    <a rel="noopener noreferrer nofollow" class="pdp-share-email"href="mailto: ?subject=Check this out on Vitamix.com&body=${url}"><img src="/icons/email.svg" alt="Email" /></a>
  `;
  return shareContainer;
}

/**
 * Decorates the PDP block.
 * @param {Element} block - The PDP block element
 */
export default function decorate(block) {
  const { jsonLdData, variants } = window;
  const galleryContainer = renderGallery(block, variants);
  const titleContainer = renderTitle(block);
  const alertContainer = renderAlert(block, jsonLdData);
  const relatedProductsContainer = renderRelatedProducts(jsonLdData);

  const buyBox = document.createElement('div');
  buyBox.classList.add('pdp-buy-box');

  const pricingContainer = renderPricing(block);
  const optionsContainer = renderOptions(block, variants, jsonLdData.custom.options);
  const addToCartContainer = renderAddToCart(jsonLdData.custom);
  const compareContainer = renderCompare();
  const freeShippingContainer = renderFreeShipping(jsonLdData.offers);
  const shareContainer = renderShare();
  buyBox.append(
    pricingContainer,
    optionsContainer || '',
    addToCartContainer,
    compareContainer,
    freeShippingContainer || '',
    shareContainer,
  );

  const detailsContainer = renderDetails(block);
  const specifications = detailsContainer.querySelector('.specifications');
  const specsContainer = renderSpecs(specifications, jsonLdData);
  specifications.remove();

  const contentContainer = renderContent();
  const faqContainer = renderFAQ(block);
  renderReviews(block);

  /* remove buttons styling from details */
  detailsContainer.querySelectorAll('.button').forEach((button) => {
    button.classList.remove('button');
    button.parentElement.classList.remove('button-wrapper');
  });

  block.append(
    alertContainer || '',
    titleContainer,
    galleryContainer,
    buyBox,
    contentContainer,
    detailsContainer,
    specsContainer,
    faqContainer,
    relatedProductsContainer || '',
  );

  const queryParams = new URLSearchParams(window.location.search);
  const color = queryParams.get('color');

  if (color) {
    onOptionChange(block, variants, color);
  } else if (variants.length > 0) {
    [window.selectedVariant] = variants;
  }

  buyBox.dataset.sku = jsonLdData.offers[0].sku;
  buyBox.dataset.oos = checkOutOfStock(jsonLdData.offers[0].sku);
}
