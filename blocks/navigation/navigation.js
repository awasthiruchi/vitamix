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
  const links = ul.querySelectorAll('a[href]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const isMobile = window.matchMedia('(width >= 600px)');
      if (isMobile) {
        e.preventDefault();
        const li = link.closest('li');
        if (!li.ariaExpanded) {
          link.closest('li').setAttribute('aria-expanded', 'true');
          const popover = document.createElement('div');
          popover.className = 'navigation-popover';
          popover.innerHTML = div.innerHTML;
          block.appendChild(popover);
          popover.addEventListener('click', () => {
            popover.remove();
          });
        } else {
          li.removeAttribute('aria-expanded');
          const popover = block.querySelector('.navigation-popover');
          if (popover) {
            popover.remove();
          }
        }
      }
    });
  });

  /* update active link on scroll */
  window.setInterval(() => {
    links.forEach((link) => {
      link.closest('li').setAttribute('aria-selected', 'false');
      const href = link.getAttribute('href');
      const element = document.getElementById(href.split('#')[1]);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top > 0 && rect.top < (window.innerHeight / 2)) {
          window.jumpNavActiveLink = link;
        }
      }
    });

    if (window.jumpNavActiveLink) {
      window.jumpNavActiveLink.closest('li').setAttribute('aria-selected', 'true');
    }
  }, 200);

  [window.jumpNavActiveLink] = links;
}
