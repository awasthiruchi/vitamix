import { loadCSS } from '../../scripts/aem.js';

const retailersResults = document.querySelector('#locator-retailers-tabpanel');
const distributorsResults = document.querySelector('#locator-distributors-tabpanel');
const onlineResults = document.querySelector('#locator-online-tabpanel');

async function fetchData(form) {
  const loaded = form.dataset.status;
  if (loaded) return window.locatorData;

  form.dataset.status = 'loading';
  const src = 'https://main--thinktanked--davidnuescheler.aem.live/vitamix/storelocations-hh.json?sheet=US&limit=5000';
  const resp = await fetch(`https://little-forest-58aa.david8603.workers.dev/?url=${encodeURIComponent(src)}`);
  const { data } = await resp.json();
  data.forEach((item) => {
    item.lat = +item.LAT;
    item.lng = +item.LONG;
  });

  window.locatorData = data;
  form.dataset.status = 'loaded';
  return data;
}

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2)
    * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = R * c;
  // Convert kilometers to miles
  const distanceInMiles = distanceInKm * 0.621371;
  return distanceInMiles;
};

async function geoCode(address) {
  const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyCPlws-m9FD9W0nP-WRR-5ldW2a4nh-t4E`);
  const json = await resp.json();
  const { results } = json;
  return results[0]?.geometry?.location;
}

async function findResults(data, location) {
  // eslint-disable-next-line no-unused-vars

  // Retailers
  const filteredRetailers = window.locatorData.filter(
    (item) => item.TYPE === 'RETAILERS' && haversineDistance(location.lat, location.lng, item.lat, item.lng) < 100,
  );
  const retailers = filteredRetailers.sort(
    (a, b) => haversineDistance(location.lat, location.lng, a.lat, a.lng)
      - haversineDistance(location.lat, location.lng, b.lat, b.lng),
  );

  // Distributors
  const filteredDistributors = window.locatorData.filter((item) => item.TYPE === 'DEALER/DISTRIBUTOR');
  const distributors = filteredDistributors.sort(
    (a, b) => haversineDistance(location.lat, location.lng, a.lat, a.lng)
      - haversineDistance(location.lat, location.lng, b.lat, b.lng),
  );

  // Online
  const online = window.locatorData.filter((item) => item.TYPE === 'ONLINE');

  return { retailers, distributors, online };
}

function displayResults(results, location) {
  const { retailers, distributors, online } = results;

  const createOnlineResult = (result) => {
    const li = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = result.NAME;
    li.append(title);
    if (result.WEB_ADDRESS) {
      const label = document.createElement('span');
      label.textContent = 'Website: ';
      label.classList.add('locator-website-label');

      const website = document.createElement('a');
      website.href = result.WEB_ADDRESS.startsWith('https://') ? result.WEB_ADDRESS : `https://${result.WEB_ADDRESS}`;
      website.textContent = new URL(website.href).hostname;
      website.target = '_blank';
      website.rel = 'noopener noreferrer';
      website.classList.add('locator-website');
      label.append(website);
      li.append(label);
    }
    return li;
  };

  const createDistributorResult = (result) => {
    const li = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = result.NAME;
    li.append(title);

    const distance = document.createElement('span');
    distance.textContent = `${haversineDistance(location.lat, location.lng, result.lat, result.lng).toFixed(1)} miles away`;
    distance.classList.add('locator-distance');
    li.append(distance);

    const address = document.createElement('a');
    const addressQuery = `${result.NAME} ${result.ADDRESS_1}, ${result.CITY}, ${result.STATE_PROVINCE} ${result.POSTAL_CODE}`;
    address.href = `https://maps.google.com/?q=${encodeURIComponent(addressQuery)}`;
    address.target = '_blank';
    address.rel = 'noopener noreferrer';
    address.textContent = addressQuery;
    address.classList.add('locator-address');
    li.append(address);

    return li;
  };

  const createRetailerResult = (result) => {
    const li = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = result.NAME;
    li.append(title);

    const distance = document.createElement('span');
    distance.textContent = `${haversineDistance(location.lat, location.lng, result.lat, result.lng).toFixed(1)} miles away`;
    distance.classList.add('locator-distance');
    li.append(distance);

    const address = document.createElement('a');
    const addressQuery = `${result.NAME} ${result.ADDRESS_1}, ${result.CITY}, ${result.STATE_PROVINCE} ${result.POSTAL_CODE}`;
    address.href = `https://maps.google.com/?q=${encodeURIComponent(addressQuery)}`;
    address.target = '_blank';
    address.rel = 'noopener noreferrer';
    address.textContent = addressQuery;
    address.classList.add('locator-address');
    li.append(address);

    if (result.WEB_ADDRESS) {
      const label = document.createElement('span');
      label.textContent = 'Website: ';
      label.classList.add('locator-website-label');

      const website = document.createElement('a');
      website.href = result.WEB_ADDRESS.startsWith('https://') ? result.WEB_ADDRESS : `https://${result.WEB_ADDRESS}`;
      website.textContent = new URL(website.href).hostname;
      website.target = '_blank';
      website.rel = 'noopener noreferrer';
      website.classList.add('locator-website');
      label.append(website);
      li.append(label);
    }

    if (result.PHONE_NUMBER) {
      const label = document.createElement('span');
      label.textContent = 'Phone: ';
      label.classList.add('locator-phone-label');

      const phone = document.createElement('a');
      phone.textContent = result.PHONE_NUMBER;
      phone.href = `tel:${result.PHONE_NUMBER}`;
      phone.target = '_blank';
      phone.rel = 'noopener noreferrer';
      phone.classList.add('locator-phone');
      label.append(phone);
      li.append(label);
    }
    return li;
  };

  retailersResults.innerHTML = '';
  distributorsResults.innerHTML = '';
  onlineResults.innerHTML = '';

  if (retailers && retailers.length > 0) {
    const retailerList = document.createElement('ol');
    retailers.forEach((retailer) => {
      retailerList.appendChild(createRetailerResult(retailer));
    });
    retailersResults.appendChild(retailerList);
  } else {
    retailersResults.innerHTML = '<p>No retailers found</p>';
  }

  if (distributors && distributors.length > 0) {
    const distributorList = document.createElement('ol');
    distributors.forEach((distributor) => {
      distributorList.appendChild(createDistributorResult(distributor));
    });
    distributorsResults.appendChild(distributorList);
  } else {
    distributorsResults.innerHTML = '<p>No distributors found</p>';
  }

  if (online && online.length > 0) {
    const onlineList = document.createElement('ol');
    online.forEach((item) => {
      onlineList.appendChild(createOnlineResult(item));
    });
    onlineResults.appendChild(onlineList);
  } else {
    onlineResults.innerHTML = '<p>No online retailers found</p>';
  }
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    widget.querySelector('.locator-results').setAttribute('aria-hidden', false);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const location = await geoCode(data.address);
    if (location) {
      const results = await findResults(data, location);
      displayResults(results, location);
    } else {
      displayResults({});
    }
  });

  const tablistButtons = widget.querySelectorAll('.locator-results-tablist button');
  const tabpanels = widget.querySelectorAll('.locator-tabpanels .locator-tabpanel');
  tablistButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      tablistButtons.forEach((b) => b.removeAttribute('aria-selected'));
      button.setAttribute('aria-selected', 'true');
      tabpanels.forEach((panel) => panel.setAttribute('aria-hidden', true));
      const tabpanel = document.getElementById(button.getAttribute('aria-controls'));
      tabpanel.setAttribute('aria-hidden', false);
    });
  });
}
