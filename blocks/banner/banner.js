export default function decorate(block) {
  [...block.querySelectorAll('div img, div svg')].forEach((img) => {
    const wrapper = img.closest('div');
    wrapper.className = 'img-wrapper';
  });

  // set video background
  const vid = block.querySelector(
    'a[href$=".mp4"], a[href*=".mp4?"], a[href*=".mp4&"]',
  );
  if (vid) {
    const imgWrapper = vid.closest('.img-wrapper');
    if (imgWrapper) imgWrapper.classList.add('vid-wrapper');
    // set video as background
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.addEventListener('canplay', () => {
      video.muted = true;
      video.play();
    });
    const source = document.createElement('source');
    source.src = vid.href;
    source.type = 'video/mp4';
    video.append(source);
    vid.parentElement.replaceWith(video);
    video.play();
  }

  const variants = [...block.classList].filter((c) => c !== 'block' && c !== 'banner');
  if (variants.includes('aligned')) {
    block.parentElement.classList.add('aligned');
    const cells = [...block.firstElementChild.children].map((c) => c.className);
    const index = cells.indexOf('img-wrapper');
    block.classList.add(index === 0 ? 'left-text' : 'right-text');
  }
}
