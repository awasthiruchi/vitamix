export default function decorate(block) {
  const galleryContainer = document.createElement('div');
  galleryContainer.classList.add('gallery');

  const images = block.querySelectorAll('.img-wrapper');
  galleryContainer.append(...images);

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

  const pricingContainer = document.createElement('div');
  pricingContainer.classList.add('pricing');
  pricingContainer.append(block.querySelector('p:nth-of-type(1)'));

  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options');
  const warrentyContainer = document.createElement('div');
  warrentyContainer.classList.add('warrenty');
  warrentyContainer.textContent = '10 Year Standard Warranty (Free)';
  optionsContainer.append(warrentyContainer);

  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('details');
  detailsContainer.append(...block.children);

  const specsContainer = document.createElement('div');
  specsContainer.classList.add('specs');
  specsContainer.append(block.querySelector('.specifications'));

  block.append(titleContainer, pricingContainer, optionsContainer, detailsContainer, specsContainer, galleryContainer);

  // remove eyebrow classes from all but the first eyebrow
  [...block.querySelectorAll('p.eyebrow')].slice(1).forEach(element => {
    element.classList.remove('eyebrow');
  });
}
