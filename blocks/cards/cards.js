import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // replace default div structure with ordered list
  const ul = document.createElement('ul');
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

  // replace contentwith new list structure
  block.replaceChildren(ul);
}
