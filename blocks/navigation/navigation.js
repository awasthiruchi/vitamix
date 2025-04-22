export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'navigation';
  const cell = block.children[0].children[0];
  while (cell.firstElementChild) nav.append(cell.firstElementChild);
  block.appendChild(nav);
}
