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

  const selectedImage = block.querySelector('.gallery-selected-image');
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
function renderSpecs(specifications, parent, jsonLD) {
  const specsContainer = document.createElement('div');
  specsContainer.classList.add('tabs-container');

  const tabs = [
    { id: 'specifications', label: 'Specifications' },
    { id: 'warranty', label: 'Warranty' },
    { id: 'resources', label: 'Resources' }
  ];

  const tabButtons = document.createElement('div');
  tabButtons.classList.add('tabs');

  tabs.forEach(tab => {
    const button = document.createElement('button');
    button.classList.add('tab');
    button.setAttribute('data-target', tab.id);
    button.textContent = tab.label;
    tabButtons.appendChild(button);
  });

  specsContainer.appendChild(tabButtons);

  const contents = document.createElement('div');
  contents.classList.add('tab-contents');

  tabs.forEach(tab => {
    const content = document.createElement('div');
    content.classList.add('tab-content');
    content.id = tab.id;

    if (tab.id === 'specifications') {
      const heading = document.createElement('h3');
      heading.textContent = 'Product Specifications';
      content.append(heading);
      content.append(specifications.cloneNode(true));
    } else if (tab.id === 'warranty') {
      const warrantyContainer = document.createElement('div');
      warrantyContainer.classList.add('warranty-container');

      const warrantyImage = createOptimizedPicture('/blocks/pdp/10-year-warranty.png', '10-Year Warranty', false);
      warrantyImage.classList.add('warranty-icon');

      const details = document.createElement('div');
      details.classList.add('warranty-details');

      const title = document.createElement('h3');
      title.classList.add('warranty-title');
      title.textContent = '10-Year Full Warranty';

      const paragraph = document.createElement('p');
      paragraph.classList.add('warranty-text');
      paragraph.textContent = 'We stand behind the quality of our machines with full warranties, covering parts, performance, labor, and two-way shipping at no cost to you. ';

      const link = document.createElement('a');
      link.href = '#';
      link.textContent = 'Read the Warranty.';
      link.classList.add('warranty-link');

      details.append(title, paragraph, link);

      warrantyContainer.appendChild(warrantyImage);
      warrantyContainer.appendChild(details);
      content.appendChild(warrantyContainer);
    } else if (tab.id === 'resources') {
      const resourcesContainer = document.createElement('div');
      resourcesContainer.classList.add('resources-container');

      const resourceTitle = document.createElement('h3');
      resourceTitle.textContent = 'Ascent® X2 Resources';

      const resourceItem = document.createElement('div');
      const resourceIcon = document.createElement('span');
      resourceIcon.textContent = '📄';
      const resourceLink = document.createElement('a');
      resourceLink.href = '#';
      resourceLink.textContent = 'Ascent X2 Owners Manual pdf';
      const resourceDetails = document.createElement('p');
      resourceDetails.textContent = '6 mb - PDF';

      resourceItem.appendChild(resourceIcon);
      resourceItem.appendChild(resourceLink);
      resourceItem.appendChild(resourceDetails);

      const contactTitle = document.createElement('h3');
      contactTitle.textContent = 'Have a question?';

      const contactInfo = document.createElement('p');
      contactInfo.textContent = 'Contact customer service!';

      const emailLink = document.createElement('a');
      emailLink.href = 'mailto:service@vitamix.com';
      emailLink.textContent = 'service@vitamix.com';

      const phoneLink = document.createElement('p');
      phoneLink.textContent = '1.800.848.2649';

      resourcesContainer.appendChild(resourceTitle);
      resourcesContainer.appendChild(resourceItem);
      resourcesContainer.appendChild(contactTitle);
      resourcesContainer.appendChild(contactInfo);
      resourcesContainer.appendChild(emailLink);
      resourcesContainer.appendChild(phoneLink);
      content.appendChild(resourcesContainer);
    }
    contents.appendChild(content);
  });

  specsContainer.appendChild(contents);
  parent.append(specsContainer);

  // Tab logic
  const tabsInContainer = specsContainer.querySelectorAll('.tab');
  const contentsInContainer = specsContainer.querySelectorAll('.tab-content');

  tabsInContainer.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabsInContainer.forEach(t => t.classList.remove('active'));
      contentsInContainer.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      const targetContent = specsContainer.querySelector(`#${target}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Set initial active tab within this container
  tabsInContainer[0].classList.add('active');
  contentsInContainer[0].classList.add('active');
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

  // TODO: Add Bazaarvoice reviews
  // const bazaarvoiceContainer = document.createElement('div');
  // bazaarvoiceContainer.classList.add('BVRRContainer');

  // loadScript('https://apps.bazaarvoice.com/deployments/vitamix/main_site/production/en_US/bv.js').then(() => {
  //   $BV.ui('rr', 'show_reviews', {
  //     productId: 'ascent-x2'
  //   });
  // });

  block.append(titleContainer, pricingContainer, optionsContainer, addToCartContainer, detailsContainer, galleryContainer);


  const specifications = detailsContainer.querySelector('.specifications');
  renderSpecs(specifications, galleryContainer, jsonLdData);
  renderSpecs(specifications, detailsContainer, jsonLdData);
  specifications.remove();

  // remove eyebrow classes from all but the first eyebrow
  [...block.querySelectorAll('p.eyebrow')].slice(1).forEach(element => {
    element.classList.remove('eyebrow');
  });
}
