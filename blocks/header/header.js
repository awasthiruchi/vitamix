import { getMetadata } from '../../scripts/aem.js';
import { swapIcons } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 1000px)');

/**
 * Rewrites links to use the current hostname.
 * @param {HTMLElement} element - Element within which to rewrite links
 */
function rewriteLinks(element) {
  if (window.location.hostname.endsWith('.vitamix.com')) {
    const links = element.querySelectorAll('a[href^="https://www.vitamix.com"]');
    links.forEach((link) => {
      if (link.href.includes('vitamix.com')) {
        link.href = link.href.replace('https://www.vitamix.com', window.location.origin);
      }
    });
  }
}

/**
 * Parses `document.cookie` into key-value map.
 * @returns {Object} Object representing all cookies as key-value pairs
 */
function getCookies() {
  const cookies = document.cookie.split(';');
  const cookieMap = {};
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    if (key && value) cookieMap[key.trim()] = value.trim();
  });
  return cookieMap;
}

/**
 * Updates navigation view state based on screen size
 * @param {boolean} desktop - Whether layout is currently desktop
 * @param {HTMLElement} nav - Navigation container element
 */
function toggleNavView(desktop, nav) {
  nav.querySelectorAll('[data-view]').forEach((el) => {
    el.dataset.view = desktop ? 'desktop' : 'mobile';
    const { id } = el;
    const wrapper = el.parentElement;
    const button = wrapper.querySelector(`button[aria-controls=${id}]`);
    if (button) button.setAttribute('aria-expanded', !desktop);
  });
  nav.querySelectorAll('.nested-submenu').forEach((submenu) => {
    const { id } = submenu;
    const wrapper = submenu.parentElement;
    const button = wrapper.querySelector(`button[aria-controls="${id}"]`);
    if (button) button.setAttribute('aria-expanded', isDesktop.matches);
  });
}

/**
 * Toggles header state based on screen size.
 * @param {boolean} desktop - Whether current layout is desktop
 * @param {HTMLElement} nav - Navigation container∂
 * @param {HTMLElement} hamburger - Hamburger toggle button
 */
function toggleHeader(desktop, nav, hamburger) {
  const hamburgerWrapper = hamburger.closest('div');
  const controls = hamburger.getAttribute('aria-controls').split(' ');
  const toggleControls = (ids, status) => {
    ids.forEach((id) => {
      const control = nav.querySelector(`#${id}`);
      if (control) control.setAttribute('aria-hidden', status);
    });
  };

  if (desktop) {
    nav.dataset.expanded = true;
    hamburgerWrapper.setAttribute('aria-hidden', true);
    toggleControls(controls, false);
  } else {
    nav.dataset.expanded = false;
    hamburgerWrapper.setAttribute('aria-hidden', false);
    toggleControls(controls, true);
  }
}

/**
 * Toggles expanded/collapsed state of hamburger menu.
 * @param {HTMLElement} hamburger - Hamburger toggle button
 * @param {HTMLElement} nav - Navigation container
 */
function toggleHamburger(hamburger, nav) {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
  const controls = hamburger.getAttribute('aria-controls').split(' ');
  controls.forEach((id) => {
    const control = document.getElementById(id);
    if (control) {
      control.setAttribute('aria-hidden', expanded);
    }
  });
  nav.dataset.expanded = !expanded;
  if (!expanded) document.body.dataset.scroll = 'disabled';
  else document.body.removeAttribute('data-scroll');
}

/**
 * Builds language selector block.
 * @param {HTMLElement} tool - Language selector.
 */
function buildLanguageSelector(tool) {
  const label = tool.querySelector('p');
  const options = tool.querySelector('ul');

  const selected = [...options.children].find((option) => option.querySelector('strong'));
  const selectedIcon = selected.querySelector('.icon');
  const selectedText = [...selected.querySelectorAll('strong')].pop().textContent;

  const button = document.createElement('button');
  button.className = 'icon-wrapper';
  button.setAttribute('aria-haspopup', true);
  button.setAttribute('aria-expanded', false);
  button.setAttribute('aria-controls', 'language-menu');
  button.setAttribute('aria-label', label.textContent);
  button.append(selectedIcon.cloneNode(true), selectedText);

  options.setAttribute('role', 'menu');
  options.id = 'language-menu';
  [...options.children].forEach((option) => {
    const optionLink = option.querySelector('a');
    const optionIcon = option.querySelector('.icon');
    const optionLabels = [...option.querySelectorAll('a')].map((a) => {
      const span = document.createElement('span');
      span.textContent = a.textContent;
      return span;
    });
    const optionText = document.createElement('p');
    optionText.append(...optionLabels);
    option.innerHTML = '';
    optionLink.replaceChildren(optionIcon.cloneNode(true), optionText);
    option.append(optionLink);
  });

  label.replaceWith(button);

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
  });
}

/**
 * Fetches navigation fragments from given link.
 * @param {string} a - Anchor href pointing to a nav fragment
 * @returns {Promise} NodeList of <ul> elements (or null on error)
 */
async function fetchNavFragments(a) {
  try {
    const { pathname } = new URL(a, window.location);
    const resp = await fetch(pathname);
    const temp = document.createElement('div');
    temp.innerHTML = await resp.text();
    const sections = temp.querySelectorAll('div > ul');
    temp.remove();
    return sections;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching nav fragment:', error);
  }
  return null;
}

/**
 * Populates navigation fragments.
 * @param {Event} e - Event object
 * @param {Element} navA - Navigation anchor element
 */
async function populateNavFragments(e, navA) {
  e.preventDefault();
  const navFragmentSections = await fetchNavFragments(navA);
  const menu = navA.parentElement.parentElement;
  menu.innerHTML = '';
  menu.dataset.view = isDesktop.matches ? 'desktop' : 'mobile';
  navFragmentSections.forEach((s) => {
    const menuItem = document.createElement('li');
    menuItem.setAttribute('role', 'menuitem');

    menuItem.append(s);
    menu.append(menuItem);

    rewriteLinks(menuItem);
  });
  // decorate any nested uls inside nav fragments
  menu.querySelectorAll(':scope > li > ul > li > ul').forEach((nestedUl, j) => {
    const nestedLi = nestedUl.closest('li');
    if (nestedLi) {
      const parentUl = nestedUl.closest('ul');
      const subId = `${parentUl.id || 'subsection'}-sub-${j + 1}`;
      nestedUl.id = subId;
      nestedUl.setAttribute('role', 'menu');
      nestedUl.classList.add('nested-submenu');
      nestedLi.classList.add('nested-submenu-item');

      const label = nestedLi.textContent.replace(nestedUl.textContent, '').trim();

      const toggle = document.createElement('button');
      toggle.setAttribute('type', 'button');
      toggle.className = 'nested-toggle';
      toggle.setAttribute('aria-haspopup', true);
      toggle.setAttribute('aria-expanded', false);
      toggle.setAttribute('aria-controls', subId);
      toggle.setAttribute('aria-label', `Toggle ${label} menu`);

      const chevron = document.createElement('i');
      chevron.className = 'symbol symbol-chevron';
      toggle.prepend(chevron);

      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
      });

      const p = nestedLi.querySelector('p');
      if (p) {
        p.insertAdjacentElement('afterend', toggle);
      } else {
        nestedLi.insertBefore(toggle, nestedUl);
      }

      nestedLi.append(nestedUl); // make sure submenu stays in DOM
    }
  });
  if (!isDesktop.matches) { // set default mobile open state
    const { id } = menu;
    const button = menu.parentElement.querySelector(`button[aria-controls="${id}"]`);
    if (button) button.setAttribute('aria-expanded', true);
  } else { // set default desktop open state
    menu.querySelectorAll('.nested-submenu').forEach((submenu) => {
      const { id } = submenu;
      const button = submenu.parentElement.querySelector(`button[aria-controls="${id}"]`);
      if (button) button.setAttribute('aria-expanded', true);
    });
  }
}

/**
 * Sets up event listeners for lazy loading navigation fragments.
 * @param {HTMLElement} nav - Navigation container element
 * @param {HTMLElement} li - List item element containing navigation fragment
 * @param {HTMLElement} a - Anchor element pointing to navigation fragment URL
 */
function setupFragmentLoader(nav, li, a) {
  const hamburgerButton = nav.querySelector('.nav-hamburger button');
  let loaded = false;

  let onMouseOver;
  let onClick;

  const loadFragmentOnce = (e) => {
    if (loaded) return;
    e.preventDefault();
    populateNavFragments(e, a);
    loaded = true;

    li.removeEventListener('mouseover', onMouseOver);
    hamburgerButton.removeEventListener('click', onClick);
  };

  onMouseOver = (e) => loadFragmentOnce(e);
  onClick = (e) => loadFragmentOnce(e);

  li.addEventListener('mouseover', onMouseOver);
  hamburgerButton.addEventListener('click', onClick);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  rewriteLinks(fragment);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('section');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['title', 'sections', 'tools', 'cart'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) {
      section.id = `nav-${c}`;
      section.classList.add(`nav-${c}`);
    }
  });

  // decorate icons
  const icons = nav.querySelectorAll('li .icon');
  icons.forEach((i) => {
    const parent = i.parentElement;
    parent.className = 'icon-wrapper';
  });

  // build mobile hamburger
  const hamburgerWrapper = document.createElement('div');
  hamburgerWrapper.className = 'nav-hamburger';
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav-sections nav-tools');
  hamburgerButton.setAttribute('aria-expanded', false);
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  const hamburger = document.createElement('i');
  hamburger.className = 'symbol symbol-hamburger';
  hamburgerButton.append(hamburger);
  hamburgerButton.addEventListener('click', () => {
    toggleHamburger(hamburgerButton, nav);
    toggleNavView(isDesktop.matches, nav);
  });

  hamburgerButton.addEventListener('click', () => {
    nav.querySelectorAll('[data-listener="mouseover"]').forEach((li) => {
      const { a } = li.dataset;
      li.removeEventListener('mouseover', populateNavFragments);
      populateNavFragments(new Event('click'), a);
    });
  }, { once: true });

  hamburgerWrapper.append(hamburgerButton);
  nav.prepend(hamburgerWrapper);

  // decorate title
  const title = nav.querySelector('.nav-title');
  if (title) {
    const a = title.querySelector('a[href]');
    if (!a) {
      const content = title.querySelector('h1, h2, h3, h4, h5, h6, p');
      content.className = 'title-content';
      if (content && content.textContent) {
        const link = document.createElement('a');
        link.href = '/';
        link.innerHTML = content.innerHTML;
        content.innerHTML = link.outerHTML;
      }
    } else {
      a.classList.remove('button');
      a.parentElement.classList.remove('button-wrapper');
    }
  }

  // decorate sections
  const sections = nav.querySelector('.nav-sections');
  if (sections) {
    const wrapper = document.createElement('nav');
    const ul = sections.querySelector('ul');
    const clone = ul.cloneNode(true);
    wrapper.append(clone);
    [...clone.children].forEach((li, i) => {
      // clear buttons
      const as = li.querySelectorAll('a[href]');
      as.forEach((a) => {
        a.classList.remove('button');
        a.parentElement.classList.remove('button-wrapper');
      });

      const subsection = li.querySelector('ul');
      if (subsection) {
        li.className = 'subsection';
        subsection.id = `subsection-${i + 1}`;
        subsection.setAttribute('role', 'menu');

        // populate nav fragments
        const navA = li.querySelector('a[href*="/nav"]');
        if (navA) setupFragmentLoader(nav, li, navA);

        [...subsection.children].forEach((subli) => subli.setAttribute('role', 'menuitem'));
        const label = li.textContent.replace(subsection.textContent, '').trim();
        const button = document.createElement('button');
        button.setAttribute('aria-haspopup', true);
        button.setAttribute('aria-expanded', false);
        button.setAttribute('aria-controls', `subsection-${i + 1}`);
        button.classList.add('subsection-toggle');
        button.textContent = label;
        button.addEventListener('click', () => {
          const expanded = button.getAttribute('aria-expanded') === 'true';
          if (isDesktop.matches) {
            wrapper.querySelectorAll('[aria-expanded="true"]').forEach((ex) => ex.setAttribute('aria-expanded', false));
            wrapper.querySelectorAll('.nested-toggle').forEach((toggle) => {
              toggle.setAttribute('aria-expanded', true);
            });
          }
          button.setAttribute('aria-expanded', !expanded);
        });

        const chevron = document.createElement('i');
        chevron.className = 'symbol symbol-chevron';
        button.prepend(chevron);

        li.innerHTML = '';
        li.prepend(button, subsection);
      }
    });
    ul.replaceWith(wrapper);
  }

  // decorate tools
  const tools = nav.querySelector('.nav-tools');
  if (tools) {
    tools.querySelectorAll('div > ul > li').forEach((t) => {
      const tool = t.querySelector('.icon');
      const type = [...tool.classList].filter((c) => c !== 'icon')[0].replace('icon-', '');
      if (type.includes('flag')) {
        t.classList.add('nav-tools-language');
        // enable language selector
        buildLanguageSelector(t);
      }
    });
  }

  // temp banner
  const banner = document.createElement('div');
  banner.className = 'nav-banner';
  banner.innerHTML = '<p>Mother’s Day Sale: <b>Up to $200 Off Select Vitamix Blenders!</b> Hurry, limited time only. <b><a href="https://www.vitamix.com/shop/sale">Shop the Sale.</a></b></p>';
  nav.prepend(banner);

  toggleHeader(isDesktop.matches, nav, hamburgerButton);
  toggleNavView(isDesktop.matches, nav);

  // enable viewport responsive nav
  isDesktop.addEventListener('change', (e) => {
    toggleHeader(e.matches, nav, hamburgerButton);
    // update all nav-submenus to reflect new view
    toggleNavView(e.matches, nav);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  swapIcons(block);

  const cookies = getCookies();
  const customer = cookies.vitamix_customer;
  const cartItems = cookies.cart_items_count;
  const compareProducts = cookies.compare_products_count;
  if (!compareProducts || compareProducts === '0') {
    const compare = block.querySelector('.icon-compare');
    if (compare) {
      const li = compare.closest('li');
      li.remove();
    }
  }

  if (customer) {
    const account = block.querySelector('.icon-account').parentElement;
    account.lastChild.textContent = `${customer}'s Account`;
  }
  if (cartItems) {
    const cart = block.querySelector('.icon-cart').parentElement;
    cart.dataset.cartItems = cartItems;
    cart.lastChild.textContent = `Cart (${cartItems})`;
  }
}
