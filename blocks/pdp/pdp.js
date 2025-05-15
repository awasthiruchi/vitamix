import { createOptimizedPicture, loadScript } from "../../scripts/aem.js";

/**
 * Renders the gallery section of the PDP block.
 * @param {Element} block - The PDP block element
 * @returns {Element} The gallery container element
 */
function renderGallery(block, variants) {
  const galleryContainer = document.createElement('div');
  galleryContainer.classList.add('gallery');

  const defaultVariant = variants[0];
  const defaultImage = defaultVariant.image[0];

  const selectedImage = document.createElement('div');
  selectedImage.classList.add('gallery-selected-image');
  const lcp = createOptimizedPicture(defaultImage, defaultVariant.name, true);
  selectedImage.append(lcp);
  galleryContainer.append(selectedImage);

  const galleryImages = document.createElement('div');
  galleryImages.classList.add('gallery-images');
  const variantImageElements = defaultVariant.image.map(image => createOptimizedPicture(image, '', false));
  variantImageElements[0].classList.add('selected');

  const images = block.querySelectorAll('.img-wrapper');

  // Keep track of the default product images
  window.defaultProductImages = Array.from(images).map(image => image.cloneNode(true));

  galleryImages.append(...variantImageElements, ...images);

  attachImageListeners(galleryImages, selectedImage);

  galleryContainer.append(galleryImages);

  return galleryContainer;
}

function attachImageListeners(galleryImages, selectedImageElement) {
  // Add click listener to each gallery image and assign to .gallery-selected-image
  // TODO: This is adding multiple listeners to the same element
  galleryImages.querySelectorAll('picture').forEach(picture => {
    picture.addEventListener('click', () => {
      // if the picture is already selected, do nothing
      if (picture.classList.contains('selected')) return;

      // remove selected class from all pictures
      galleryImages.querySelectorAll('picture').forEach(picture => {
        picture.classList.remove('selected');
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

function onOptionChange(block, variants, color) {
  const selectedOptionLabel = block.querySelector('.selected-option-label');
  const variant = variants.find(variant => variant.color.replace(/\s+/g, '-').toLowerCase() === color);
  selectedOptionLabel.textContent = `Color: ${variant.color}`;

  const selectedImage = block.querySelector('.gallery-selected-image');
  const currentImage = selectedImage.querySelector('picture');
  currentImage.remove();
  selectedImage.append(createOptimizedPicture(variant.image[0], '', false));

  // Update the gallery images
  const galleryImages = block.querySelector('.gallery-images');
  const currentVariantImages = block.querySelectorAll('.gallery-images > picture');
  currentVariantImages.forEach(image => {
    image.remove();
  });

  const variantImages = variant.image.map(image => createOptimizedPicture(image, '', false));
  variantImages.reverse().forEach(image => {
    galleryImages.prepend(image);
  });

  // remove selected class from all pictures
  galleryImages.querySelectorAll('picture').forEach(picture => {
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
function renderOptions(block, variants) {
  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options');

  const selectionContainer = document.createElement('div');
  selectionContainer.classList.add('selection');

  const selectedOptionLabel = document.createElement('div');
  selectedOptionLabel.classList.add('selected-option-label');
  selectedOptionLabel.textContent = `Color: ${variants[0].color}`;
  selectionContainer.append(selectedOptionLabel);

  const colors = variants.map(variant => variant.color.replace(/\s+/g, '-').toLowerCase());

  const colorOptions = colors.map(color => {
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

function renderAddToCart(block) {
  const addToCartContainer = document.createElement('div');
  addToCartContainer.classList.add('add-to-cart');

  // Quantity Label
  const quantityLabel = document.createElement('label');
  quantityLabel.textContent = 'Quantity:';
  addToCartContainer.appendChild(quantityLabel);

  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('quantity-container');
  const quantitySelect = document.createElement('select');
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
 * Decorates the PDP block.
 * @param {Element} block - The PDP block element
 */
export default function decorate(block) {
  // Get the json-ld from the head and parse it
  const jsonLd = document.head.querySelector('script[type="application/ld+json"]');
  const jsonLdData = jsonLd ? JSON.parse(jsonLd.textContent) : null;
  const variants = jsonLdData.hasVariant ? jsonLdData.hasVariant : [];

  const galleryContainer = renderGallery(block, variants);
  const titleContainer = renderTitle(block);
  const pricingContainer = renderPricing(block);
  const optionsContainer = renderOptions(block, variants);
  const addToCartContainer = renderAddToCart(block);
  const detailsContainer = renderDetails(block);
  const specsContainer = renderSpecs(block);

  // TODO: Add Bazaarvoice reviews
  // const bazaarvoiceContainer = document.createElement('div');
  // bazaarvoiceContainer.classList.add('BVRRContainer');

  // loadScript('https://apps.bazaarvoice.com/deployments/vitamix/main_site/production/en_US/bv.js').then(() => {
  //   $BV.ui('rr', 'show_reviews', {
  //     productId: 'ascent-x2'
  //   });
  // });

  block.append(titleContainer, pricingContainer, optionsContainer, addToCartContainer, detailsContainer, specsContainer, galleryContainer);

  // remove eyebrow classes from all but the first eyebrow
  [...block.querySelectorAll('p.eyebrow')].slice(1).forEach(element => {
    element.classList.remove('eyebrow');
  });
}
