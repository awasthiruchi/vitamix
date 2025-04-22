import { buildCarousel } from '../../scripts/scripts.js';

/**
 * Advances carousel to next slide
 * @param {HTMLElement} carousel - Carousel element
 */
function nextSlide(carousel) {
  const slides = [...carousel.children];
  const current = slides.findIndex((s) => s.dataset.countdown);
  const next = slides[(current + 1) % slides.length];
  const desktop = window.matchMedia('width >= 800px').matches;
  // scroll to next slide on mobile
  if (!desktop) carousel.scrollTo({ left: next.offsetLeft, behavior: 'smooth' });
  // show/hide "tabs" on desktop
  slides.forEach((s) => s.removeAttribute('data-countdown'));
  // set countdown on next slide
  next.dataset.countdown = true;
}

/**
 * Enable automatic carousel rotation
 * @param {HTMLElement} carousel - Carousel element
 * @param {number} interval - Time (in ms) between slide transitions
 * @returns {number} - Interval ID
 */
function autoRotate(carousel, interval = 6000) {
  const slides = [...carousel.children];
  if (slides.length <= 1) return;

  // eslint-disable-next-line consistent-return
  return setInterval(() => {
    nextSlide(carousel);
  }, interval);
}

export default function decorate(block) {
  const variants = [...block.classList].filter((c) => c !== 'block' && c !== 'carousel');

  const rows = [...block.children];
  block.innerHTML = '';

  // build wrapper
  const wrapper = document.createElement('ul');
  block.append(wrapper);

  // extract slides
  const slides = rows.map((s) => s.children);
  let caption;

  // decorate expansion variant
  if (variants.includes('expansion')) {
    variants.forEach((v) => block.parentElement.classList.add(`${v}-wrapper`));

    // add logo icon
    const logo = document.createElement('img');
    logo.className = 'expansion-logo';
    logo.src = '/icons/mark.svg';
    block.parentElement.prepend(logo);

    // extract first "slide" as caption
    [caption] = slides.shift();
    caption.classList.add('carousel-caption');

    // track visible slide
    wrapper.addEventListener('scroll', () => {
      const { scrollLeft, clientWidth } = wrapper;
      const current = Math.round(scrollLeft / clientWidth);
      const { children } = wrapper;
      [...children].forEach((slide, i) => {
        if (i === current) slide.setAttribute('data-countdown', true);
        else slide.removeAttribute('data-countdown');
      });
    });
  }

  slides.forEach((s) => {
    const slide = document.createElement('li');
    [...s].forEach((cell) => {
      const vid = cell.querySelector('a[href$=".mp4"]');
      if (vid) {
        // load video
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        const source = document.createElement('source');
        source.src = vid.href;
        source.type = 'video/mp4';
        video.append(source);
        vid.parentElement.replaceWith(video);
        video.play();
      }
      slide.append(cell);
    });

    // add expansion autotimer
    if (variants.includes('expansion')) {
      const timer = document.createElement('div');
      timer.classList.add('expansion-timer');
      const heading = slide.querySelector('h2, h3, h4, h5, h6');
      if (heading) heading.prepend(timer);
      else slide.prepend(timer);
    }

    wrapper.append(slide);
  });

  // start autorotation
  if (variants.includes('expansion')) {
    const firstSlide = wrapper.firstElementChild;
    firstSlide.dataset.countdown = true;

    let autoRotateTimer = autoRotate(wrapper);
    let interactionTimeout;

    const resetAutoRotate = () => {
      clearInterval(autoRotateTimer);
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        autoRotateTimer = autoRotate(wrapper);
      }, 100); // match scroll debounce
    };

    wrapper.addEventListener('scroll', resetAutoRotate);

    [...wrapper.children].forEach((slide) => {
      slide.addEventListener('click', () => {
        wrapper.querySelectorAll('li').forEach((s) => s.removeAttribute('data-countdown'));
        slide.setAttribute('data-countdown', true);
        resetAutoRotate();
      });
    });
  }

  const carousel = buildCarousel(block, 1, false);
  if (caption) carousel.parentElement.prepend(caption);

  if (carousel) block.replaceWith(carousel);
  else block.parentElement.remove();
}
