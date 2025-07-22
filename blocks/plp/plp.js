import { fetchPlaceholders, readBlockConfig } from '../../scripts/aem.js';

// Mock lookupPages function since it's not available
const lookupPages = async () => [];

// Simple product card creation function to replace carousel dependency
const createProductCard = (product) => {
  const card = document.createElement('div');
  card.className = 'plp-product-card';

  const image = document.createElement('img');
  image.src = product.image || product.images?.[0]?.url || '';
  image.alt = product.title || product.name || '';
  image.loading = 'lazy';

  const title = document.createElement('h4');
  const link = document.createElement('a');
  link.href = product.path || product.url || '#';
  link.textContent = product.title || product.name || '';
  title.appendChild(link);

  const price = document.createElement('p');
  price.textContent = product.price || '';

  card.appendChild(image);
  card.appendChild(title);
  card.appendChild(price);

  return card;
};

export default async function decorate(block) {
  const ph = await fetchPlaceholders();

  const addEventListeners = (elements, event, callback) => {
    elements.forEach((e) => {
      e.addEventListener(event, callback);
    });
  };

  let config = [...document.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  if (!config.length) config = readBlockConfig(block);

  block.innerHTML = `<div class="plp-controls"><input id="fulltext" placeholder="${ph.typeToSearch}">
      <p class="plp-results-count"><span id="plp-results-count"></span> ${ph.results}</p>
      <button class="plp-filter-button secondary">${ph.filter}</button>
      <button class="plp-sort-button secondary">${ph.sort}</button>
    </div>
    <div class="plp-facets">
    </div>
    <div class="plp-sortby">
      <p>${ph.sortBy} <span data-sort="best" id="plp-sortby">${ph.bestMatch}</span></p>
      <ul>
        <li data-sort="best">${ph.bestMatch}</li>
        <li data-sort="position">${ph.position}</li>
        <li data-sort="price-desc">${ph.priceHighToLow}</li>
        <li data-sort="price-asc">${ph.priceLowToHigh}</li>
        <li data-sort="name">${ph.productName}</li>
      </ul>
    </div>
  </div>
  <div class="plp-results">
  </div>`;

  const resultsElement = block.querySelector('.plp-results');
  const facetsElement = block.querySelector('.plp-facets');
  block.querySelector('.plp-filter-button').addEventListener('click', () => {
    block.querySelector('.plp-facets').classList.toggle('visible');
  });

  addEventListeners([
    block.querySelector('.plp-sort-button'),
    block.querySelector('.plp-sortby p'),
  ], 'click', () => {
    block.querySelector('.plp-sortby ul').classList.toggle('visible');
  });

  const sortList = block.querySelector('.plp-sortby ul');
  const selectSort = (selected) => {
    [...sortList.children].forEach((li) => li.classList.remove('selected'));
    selected.classList.add('selected');
    const sortBy = document.getElementById('plp-sortby');
    sortBy.textContent = selected.textContent;
    sortBy.dataset.sort = selected.dataset.sort;
    document.getElementById('plp-sortby').textContent = selected.textContent;
    block.querySelector('.plp-sortby ul').classList.remove('visible');
    // eslint-disable-next-line no-use-before-define
    runSearch(createFilterConfig());
  };

  sortList.addEventListener('click', (event) => {
    selectSort(event.target);
  });

  const highlightResults = (res) => {
    const fulltext = document.getElementById('fulltext').value;
    if (fulltext) {
      res.querySelectorAll('h4').forEach((title) => {
        const content = title.textContent;
        const offset = content.toLowerCase().indexOf(fulltext.toLowerCase());
        if (offset >= 0) {
          title.innerHTML = `${content.substr(0, offset)}<span class="highlight">${content.substr(offset, fulltext.length)}</span>${content.substr(offset + fulltext.length)}`;
        }
      });
    }
  };

  const displayResults = async (results) => {
    resultsElement.innerHTML = '';
    results.forEach((product) => {
      resultsElement.append(createProductCard(product));
    });
    highlightResults(resultsElement);
  };

  const getSelectedFilters = () => [...block.querySelectorAll('input[type="checkbox"]:checked')];

  const createFilterConfig = () => {
    const filterConfig = { ...config };
    getSelectedFilters().forEach((checked) => {
      const facetKey = checked.name;
      const facetValue = checked.value;
      if (filterConfig[facetKey]) filterConfig[facetKey] += `, ${facetValue}`;
      else filterConfig[facetKey] = facetValue;
    });
    filterConfig.fulltext = document.getElementById('fulltext').value;
    return (filterConfig);
  };

  const displayFacets = (facets, filters) => {
    const selected = getSelectedFilters().map((check) => check.value);
    facetsElement.innerHTML = `<div><div class="plp-filters"><h2>${ph.filters}</h2>
    <div class="plp-filters-selected"></div>
    <p><button class="plp-filters-clear secondary">${ph.clearAll}</button></p>
    <div class="plp-filters-facetlist"></div>
    </div>
    <div class="plp-apply-filters">
      <button>See Results</button>
    </div></div>`;

    addEventListeners([
      facetsElement.querySelector('.plp-apply-filters button'),
      facetsElement.querySelector(':scope > div'),
      facetsElement,
    ], 'click', (event) => {
      if (event.currentTarget === event.target) block.querySelector('.plp-facets').classList.remove('visible');
    });

    const selectedFilters = block.querySelector('.plp-filters-selected');
    selected.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'plp-filters-tag';
      span.textContent = tag;
      span.addEventListener('click', () => {
        document.getElementById(`plp-filter-${tag}`).checked = false;
        const filterConfig = createFilterConfig();
        // eslint-disable-next-line no-use-before-define
        runSearch(filterConfig);
      });
      selectedFilters.append(span);
    });

    facetsElement.querySelector('.plp-filters-clear').addEventListener('click', () => {
      selected.forEach((tag) => {
        document.getElementById(`plp-filter-${tag}`).checked = false;
      });
      const filterConfig = createFilterConfig();
      // eslint-disable-next-line no-use-before-define
      runSearch(filterConfig);
    });

    /* list facets */
    const facetsList = block.querySelector('.plp-filters-facetlist');
    const facetKeys = Object.keys(facets);
    facetKeys.forEach((facetKey) => {
      const filter = filters[facetKey];
      const filterValues = filter ? filter.split(',').map((t) => t.trim()) : [];
      const div = document.createElement('div');
      div.className = 'plp-facet';
      const h3 = document.createElement('h3');
      h3.innerHTML = ph[facetKey];
      div.append(h3);
      const facetValues = Object.keys(facets[facetKey]);
      facetValues.forEach((facetValue) => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = facetValue;
        input.checked = filterValues.includes(facetValue);
        input.id = `plp-filter-${facetValue}`;
        input.name = facetKey;
        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.textContent = `${facetValue} (${facets[facetKey][facetValue]})`;
        div.append(input, label);
        input.addEventListener('change', () => {
          const filterConfig = createFilterConfig();
          // eslint-disable-next-line no-use-before-define
          runSearch(filterConfig);
        });
      });
      facetsList.append(div);
    });
  };

  const getPrice = (string) => +string.substr(1);

  const runSearch = async (filterConfig = config) => {
    const facets = { colors: {}, sizes: {} };
    const sorts = {
      name: (a, b) => a.title.localeCompare(b.title),
      'price-asc': (a, b) => getPrice(a.price) - getPrice(b.price),
      'price-desc': (a, b) => getPrice(b.price) - getPrice(a.price),
    };
    const results = await lookupPages(filterConfig, facets);
    const sortBy = document.getElementById('plp-sortby') ? document.getElementById('plp-sortby').dataset.sort : 'best';
    if (sortBy && sorts[sortBy]) results.sort(sorts[sortBy]);
    block.querySelector('#plp-results-count').textContent = results.length;
    displayResults(results, null);
    displayFacets(facets, filterConfig);
  };

  const fulltextElement = block.querySelector('#fulltext');
  fulltextElement.addEventListener('input', () => {
    runSearch(createFilterConfig());
  });

  if (!Object.keys(config).includes('fulltext')) {
    fulltextElement.style.display = 'none';
  }

  runSearch(config);
}
