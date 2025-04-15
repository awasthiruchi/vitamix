import { fetchPlaceholders } from '../../scripts/aem.js';

export default function carousel(block) {
   if (block.classList.contains('expansion')) {
      const left = document.createElement('div');
      left.classList.add('carousel-left');
      const center = document.createElement('div');
      center.classList.add('carousel-center');
      const right = document.createElement('div');
      right.classList.add('carousel-right');
      left.append(block.firstElementChild);

      while (block.firstElementChild) {
        console.log(block.firstElementChild);
        right.append(block.firstElementChild);
      }
      block.appendChild(left);
      block.appendChild(center);
      block.appendChild(right);
   }
}