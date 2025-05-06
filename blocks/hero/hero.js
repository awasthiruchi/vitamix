export default function decorate(block) {
  // set background
  const vid = block.querySelector(
    'a[href$=".mp4"], a[href*=".mp4?"], a[href*=".mp4&"]',
  );
  if (vid) {
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

  const disclaimer = block.querySelector('.disclaimer');
  if (disclaimer) {
    block.dataset.disclaimer = disclaimer.textContent;
  }
}
