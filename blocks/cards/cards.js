import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Returns the largest factor of given n among bewteen 1 and 4.
 * @param {number} n - Number to find largest factor for
 * @returns {number|undefined} Largest factor
 */
function getLargestFactor(n) {
  return [4, 3, 2, 1].find((f) => n % f === 0) || 1;
}

export default function decorate(block) {
  // replace default div structure with ordered list
  const ul = document.createElement('ul');
  const cardsPerRow = getLargestFactor(block.children.length);
  ul.classList.add(`rows-${cardsPerRow}`);

  [...block.children].forEach((row) => {
    // move all children from row into list item
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // assign classes based on content
    [...li.children].forEach((div, i) => {
      if (div.children.length === 1 && div.querySelector('picture')) { // single picture element
        div.className = 'card-image';
      } else if (!i && div.querySelector('picture')) { // first div with picture
        div.className = 'card-captioned';
        div.querySelectorAll('.button').forEach((button) => {
          button.classList.remove('button');
          button.parentElement.classList.remove('button-wrapper');
        });
      } else { // default, all other divs
        div.className = 'card-body';
      }
    });
    ul.append(li);
  });

  // replace images with optimized versions
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(
    createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
  ));

  // decorate variant specifics
  const variants = [...block.classList].filter((c) => c !== 'block' && c !== 'cards');
  if (!variants.length) {
    // default card styling
    ul.querySelectorAll('li .card-body').forEach((body) => {
      const link = body.querySelector('a[href]');
      if (link) {
        const content = body.textContent.trim();
        // link is the only content
        if (link.textContent.trim() === content) {
          link.removeAttribute('class');
          link.parentElement.classList.remove('button-wrapper');
          variants.push('linked');
          block.classList.add('linked');
        }
      }
    });
  }
  if (variants.includes('knockout') || variants.includes('articles') || variants.includes('linked')) {
    ul.querySelectorAll('li').forEach((li) => {
      const as = li.querySelectorAll('a');
      // setup full card click if there's one link or all links have same href
      if (as.length === 1 || (as.length > 1 && [...as].every((a) => a.href === as[0].href))) {
        li.classList.add('card-click');
        li.addEventListener('click', () => as[0].click());
      }
    });
  }

  // replace contentwith new list structure
  block.replaceChildren(ul);
}
