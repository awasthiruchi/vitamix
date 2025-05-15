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

function extractPricing(element) {
  if (!element) return null;

  const pricingText = element.textContent.trim();
  const priceMatch = pricingText.match(/\$([\d,]+\.\d{2})/g);

  if (!priceMatch) return null;

  const finalPrice = parseFloat(priceMatch[0].replace(/[$,]/g, ''));
  const regularPrice = priceMatch[1] ? parseFloat(priceMatch[1].replace(/[$,]/g, '')) : null;

  return {
    final: finalPrice,
    regular: regularPrice,
  };
}

/**
 * Renders the pricing section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The pricing container element
 */
function renderPricing(block) {
  const pricingContainer = document.createElement('div');
  pricingContainer.classList.add('pricing');

  const pricingElement = block.querySelector('p:nth-of-type(1)');
  const pricing = extractPricing(pricingElement);
  pricingElement.remove();

  const nowLabel = document.createElement('div');
  nowLabel.className = 'pricing-now';
  nowLabel.textContent = 'Now';
  pricingContainer.appendChild(nowLabel);

  const finalPrice = document.createElement('div');
  finalPrice.className = 'pricing-final';
  finalPrice.textContent = `$${pricing.final.toFixed(2)}`;
  pricingContainer.appendChild(finalPrice);

  if (pricing.regular && pricing.regular > pricing.final) {
    const savingsContainer = document.createElement('div');
    savingsContainer.className = 'pricing-savings';

    const savingsAmount = pricing.regular - pricing.final;
    const saveText = document.createElement('span');
    saveText.className = 'pricing-save';
    saveText.textContent = `Save $${savingsAmount.toFixed(2)} | `;

    const regularPrice = document.createElement('del');
    regularPrice.className = 'pricing-regular';
    regularPrice.textContent = `$${pricing.regular.toFixed(2)}`;

    savingsContainer.appendChild(saveText);
    savingsContainer.appendChild(regularPrice);
    pricingContainer.appendChild(savingsContainer);
  }

  const paymentsPlaceholder = document.createElement('img');
  paymentsPlaceholder.classList.add('payments-placeholder');
  paymentsPlaceholder.src = '/blocks/pdp/payments.png';

  pricingContainer.append(paymentsPlaceholder);

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
