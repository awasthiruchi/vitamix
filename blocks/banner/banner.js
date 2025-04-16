export default function decorate(block) {
  [...block.querySelectorAll('div img, div svg')].forEach((img) => {
    const wrapper = img.closest('div');
    wrapper.className = 'img-wrapper';
  });
}
