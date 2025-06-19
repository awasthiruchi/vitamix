import { buildVideo } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.querySelectorAll('div img, div svg')].forEach((img) => {
    const wrapper = img.closest('div');
    if (wrapper.children.length === 1) wrapper.className = 'img-wrapper';
  });

  // set video background
  const video = buildVideo(block);
  if (video) {
    const wrapper = video.closest('div');
    wrapper.classList.add('vid-wrapper', 'img-wrapper');
  }

  const variants = [...block.classList].filter((c) => c !== 'block' && c !== 'banner');
  if (variants.includes('aligned')) {
    block.parentElement.classList.add('aligned');
    const cells = [...block.firstElementChild.children].map((c) => c.className);
    const index = cells.indexOf('img-wrapper');
    block.classList.add(index === 0 ? 'left-text' : 'right-text');
  }
  if (variants.includes('split')) {
    block.parentElement.classList.add('split');
  }
}
