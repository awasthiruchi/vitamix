export default function decorate(block) {
  const nav = document.createElement('nav');
  const cell = block.children[0].children[0];
  const div = document.createElement('div');
  div.className = 'navigation-list-wrapper';
  const ul = cell.firstElementChild;
  div.appendChild(ul);
  nav.appendChild(div);
  while (cell.firstElementChild) nav.append(cell.firstElementChild);

  block.innerHTML = '';
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
    const hash = link.href.split('#')[1];
    const section = document.getElementById(hash);
    if (section) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.jumpNavActiveLink = link;
            links.forEach((l) => {
              l.closest('li').setAttribute('aria-selected', 'false');
            });
            link.closest('li').setAttribute('aria-selected', 'true');
          }
        });
      });
      io.observe(section);
    }
  });

  [window.jumpNavActiveLink] = links;
}
