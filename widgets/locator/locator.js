import { loadCSS } from '../../scripts/aem.js';
import { toggleForm } from '../../blocks/form/form.js';

async function fetchData(form) {
  const loaded = form.dataset.status;
  if (loaded) return window.locatorData;

  form.dataset.status = 'loading';
  const src = 'https://main--thinktanked--davidnuescheler.aem.live/vitamix/storelocations-hh.json?sheet=US&limit=5000';
  const resp = await fetch(src);
  const { data } = await resp.json();
  window.locatorData = data;
  form.dataset.status = 'loaded';
  return data;
}

function findResults(data) {
  // eslint-disable-next-line no-unused-vars
  const { location } = data;
}

export default function decorate(widget) {
  widget.style.visibility = 'hidden';
  loadCSS('/blocks/form/form.css').then(() => widget.removeAttribute('style'));

  const form = widget.querySelector('form');

  // set initial values from query params
  const queryParams = Object.fromEntries(new URLSearchParams(window.location.search));
  Object.entries(queryParams).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = value;
  });

  // load results data
  form.addEventListener('input', () => fetchData(form));
  setTimeout(() => fetchData(form), 3000);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    toggleForm(form);
    const data = Object.fromEntries(formData);
    findResults(data);
  });
}
