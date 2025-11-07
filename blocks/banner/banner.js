import { buildVideo } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import ColorThief from './colorthief.js';

export default function decorate(block) {
  const colorThief = new ColorThief();

  const applyBrightness = (img) => {
    const thumbnail = createOptimizedPicture(img.src, '', '', [{ width: 100 }]).querySelector('source').srcset;
    const thumbnailImg = new Image();
    thumbnailImg.src = thumbnail;
    thumbnailImg.onload = () => {
      const color = colorThief.getColor(thumbnailImg, 5, 10);
      const [r, g, b] = color;
      const y = Math.floor(r * 0.2126 + g * 0.7152 + b * 0.0722);
      const brightness = {
        dark: 80,
        'kinda-dark': 160,
        'kinda-light': 200,
        light: 256,
      };
      const brightnessKey = Object.keys(brightness).find((key) => y <= brightness[key]);
      block.classList.add(brightnessKey);
      block.style.setProperty('--overlay-color', `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`);
    };
  };

  [...block.querySelectorAll('div img, div svg')].forEach((img) => {
    const closestBlock = img.closest('.block');
    if (img.complete) applyBrightness(img);
    else if (img.tagName === 'IMG') {
      img.addEventListener('load', () => {
        applyBrightness(img);
      });
    }
    if (closestBlock !== block) return; // skip nested blocks
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
  if (variants.includes('narrow-media')) {
    block.classList.add('split');
    variants.push('split');
  }
  if (variants.includes('split')) {
    block.parentElement.classList.add('split');
  }
}
