import { createOptimizedPicture } from '../../scripts/aem.js';

function getVideoElement(source, replacePlaceholder, autoplay) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  video.dataset.loading = 'true';
  video.addEventListener('loadedmetadata', () => delete video.dataset.loading);
  if (autoplay || replacePlaceholder) {
    video.setAttribute('autoplay', '');
    if (autoplay) {
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.removeAttribute('controls');
      video.addEventListener('canplay', () => {
        video.muted = true;
        video.play();
      });
    }
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${source.split('.').pop()}`);
  video.append(sourceEl);

  return video;
}

export default function carousel(block) {
  if (block.classList.contains('expansion')) {
    const left = document.createElement('div');
    left.classList.add('carousel-left');
    const center = document.createElement('div');
    center.classList.add('carousel-center');
    const right = document.createElement('div');
    right.classList.add('carousel-right');
    left.append(block.firstElementChild);

    const selectSlide = (slide) => {
      const videoHref = slide.dataset.video;
      const imageSrc = slide.dataset.image;

      [...slide.parentElement.children].forEach((child) => {
        child.ariaSelected = false;
      });
      slide.ariaSelected = true;

      if (videoHref) {
        const videoElement = getVideoElement(videoHref, true, true);
        center.replaceChildren(videoElement);
      }

      if (imageSrc) {
        const imageElement = createOptimizedPicture(imageSrc);
        center.replaceChildren(imageElement);
      }
    };

    while (block.firstElementChild) {
      const slide = block.firstElementChild;
      const video = block.firstElementChild.querySelector('a[href$=".mp4"]');
      if (video) {
        slide.dataset.video = video.href;
        video.remove();
      }
      const image = block.firstElementChild.querySelector('img');
      if (image) {
        slide.dataset.image = image.src;
        image.parentElement.remove();
      }
      slide.addEventListener('click', () => selectSlide(slide));
      right.append(block.firstElementChild);
    }
    block.appendChild(left);
    block.appendChild(center);
    block.appendChild(right);

    selectSlide(right.firstElementChild);
  }
}
