/**
 * Creates and displays a navigation popover for mobile view.
 * @param {HTMLElement} block - Navigation block
 * @param {HTMLUListElement} ul - Navigation list
 * @param {HTMLDivElement} popover - Popover container
 */
function buildPopover(block, ul, popover) {
  const clone = ul.cloneNode(true);
  clone.querySelectorAll('li').forEach((l) => l.removeAttribute('aria-current'));
  popover.append(clone);
  block.append(popover);
  popover.hidden = window.matchMedia('(width >= 800px)').matches;
  clone.addEventListener('click', () => {
    popover.hidden = true;
  });
}

export default function decorate(block) {
  const variants = [...block.classList].filter((c) => c !== 'block' && c !== 'navigation');
  const row = block.firstElementChild;
  const ul = row.querySelector('ul');

  if (ul) {
    const wrapper = document.createElement('div');
    wrapper.className = 'navigation-list-wrapper';

    const nav = document.createElement('nav');
    if (variants.includes('jump')) nav.setAttribute('aria-label', 'Jump navigation');

    const popover = document.createElement('div');
    popover.className = 'navigation-popover';
    popover.hidden = true;

    block.addEventListener('click', () => buildPopover(block, ul, popover), { once: true });

    ul.addEventListener('scroll', () => {
      const { scrollLeft, scrollWidth, clientWidth } = ul;
      const scrollRight = scrollWidth - clientWidth - scrollLeft;
      if (scrollLeft === 0) {
        wrapper.dataset.scroll = 'start';
      } else if (scrollRight <= 1) {
        wrapper.dataset.scroll = 'end';
      } else {
        wrapper.removeAttribute('data-scroll');
      }
    });

    // set scroll state
    ul.dispatchEvent(new Event('scroll'));

    const links = ul.querySelectorAll('a[href]');
    links.forEach((link) => {
      // enable scroll tracking
      const hash = link.getAttribute('href').split('#')[1];
      const section = document.getElementById(hash);
      if (section) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              links.forEach((l) => {
                l.closest('li').removeAttribute('aria-current');
              });
              // highlight the current link
              link.closest('li').setAttribute('aria-current', true);
              // scroll nav into view if it's currently sticky on desktop
              const mobile = !window.matchMedia('(width >= 800px)').matches;
              const sticky = block.getBoundingClientRect().top === 0;
              if (!mobile && sticky) link.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
          });
        }, { threshold: 0.75 });
        observer.observe(section);
      }

      link.addEventListener('click', (e) => {
        // enable mobile popover
        const mobile = !window.matchMedia('(width >= 800px)').matches;
        if (mobile) {
          e.preventDefault();
          const li = link.closest('li');
          const expanded = li.hasAttribute('aria-expanded');
          block.querySelectorAll('[aria-expanded]').forEach((el) => el.removeAttribute('aria-expanded'));
          popover.hidden = true;
          if (!expanded) {
            li.setAttribute('aria-expanded', true);
            popover.hidden = false;
          }
        } else { // desktop scroll into view
          link.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      });
    });

    wrapper.appendChild(ul);
    ul.querySelector('li').setAttribute('aria-current', true);
    nav.appendChild(wrapper);
    row.prepend(nav);
  }
}
