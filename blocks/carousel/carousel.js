import { buildCarousel } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  // build wrapper
  const wrapper = document.createElement('ul');
  block.append(wrapper);

  // extract slides
  const slides = rows.map((s) => s.children);
  slides.forEach((s) => {
    const slide = document.createElement('li');
    [...s].forEach((cell) => {
      const img = cell.querySelector('div img, div svg');
      if (img) cell.classList.add('img-wrapper');
      slide.append(cell);
    });
    wrapper.append(slide);
  });

  const carousel = buildCarousel(block, 1, false);

  if (carousel) block.replaceWith(carousel);
  else block.parentElement.remove();
}
