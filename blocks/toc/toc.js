export default function decorate(block) {
  const h2s = document.querySelectorAll('h2');
  const toc = document.createElement('ul');
  toc.classList.add('toc');
  block.appendChild(toc);
  h2s.forEach((h2) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h2.id}`;
    a.textContent = h2.textContent;
    li.appendChild(a);
    toc.appendChild(li);
  });
  const main = block.closest('main');
  const children = [...main.children];
  const tocMainWrapper = document.createElement('div');
  tocMainWrapper.classList.add('toc-main-wrapper');
  children.forEach((child) => {
    if (child.tagName === 'ASIDE') return;
    tocMainWrapper.appendChild(child);
  });
  main.appendChild(tocMainWrapper);
  main.classList.add('toc-left');
}
