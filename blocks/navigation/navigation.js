export default function decorate(block) {
  const nav = document.createElement('nav');
  const cell = block.children[0].children[0];
  const div = document.createElement('div');
  div.className = 'navigation-list-wrapper';
  const ul = cell.firstElementChild;
  div.appendChild(ul);
  nav.appendChild(div);
  while (cell.firstElementChild) nav.append(cell.firstElementChild);
  block.appendChild(nav);
  ul.addEventListener('scroll', (e) => {
    if (e.target.scrollLeft === 0) {
      div.classList.remove('navigation-left-scroll');
    } else {
      div.classList.add('navigation-left-scroll');
    }
  });
  window.setInterval(() => {
    const links = ul.querySelectorAll('a[href]');
    let activeLink = null;
    links.forEach((link) => {
      link.closest('li').setAttribute('aria-selected', 'false');
      const href = link.getAttribute('href');
      const element = document.getElementById(href.split('#')[1]);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top > 0 && rect.top < (window.innerHeight / 2)) {
          activeLink = link;
        }
      }
    });

    if (activeLink) {
      activeLink.closest('li').setAttribute('aria-selected', 'true');
    }
  }, 1000);
}
