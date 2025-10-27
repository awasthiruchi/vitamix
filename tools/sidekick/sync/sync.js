import {
  buildBlock, decorateBlock, loadBlock, loadCSS,
} from '../../../scripts/aem.js';

const SYNC_WORKER_URL = 'https://vitamix-catalog-sync.adobeaem.workers.dev/';

/**
 * Creates a product sync modal dialog
 *
 * @returns {Promise<{dialog: HTMLDialogElement, showModal: () => Promise<void>}>}
 */
export async function createSyncModal() {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  await loadCSS(`${window.hlx.codeBasePath}/tools/sidekick/sync/sync.css`);

  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');

  const urlPath = window.location.pathname;
  const pathParts = urlPath.split('/').filter((part) => part); // Remove empty strings

  // Expected format: /ca/en_us/products/ascent-x5
  const storeCode = pathParts[0];
  const storeViewCode = pathParts[1];
  const urlKey = pathParts[3];

  // pull the sku from the sku meta tag
  const skuMeta = document.querySelector('meta[name="sku"]');
  const sku = skuMeta ? skuMeta.content : null;

  const h3 = document.createElement('h3');
  h3.textContent = `Syncing ${urlKey}...`;
  dialogContent.append(h3);

  const p = document.createElement('p');
  p.innerHTML = `
    <strong>Store:</strong> ${storeCode}<br>
    <strong>Store View:</strong> ${storeViewCode}<br>
    <strong>SKU:</strong> ${sku || 'Unknown'}<br>
    <strong>URL Key:</strong> ${urlKey}
  `;
  dialogContent.append(p);

  // Create status container
  const statusContainer = document.createElement('div');
  statusContainer.classList.add('sync-status');
  dialogContent.append(statusContainer);

  dialog.append(dialogContent);

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.setAttribute('data-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.prepend(closeButton);

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });

  block.innerHTML = '';
  block.id = 'sync';
  block.append(dialog);

  // Function to call the worker
  async function performSync() {
    // Show spinner
    statusContainer.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
        <p>Syncing product...</p>
      </div>
    `;

    try {
      // Call the worker endpoint
      const response = await fetch(SYNC_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeCode,
          storeViewCode,
          sku,
          urlKey,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        statusContainer.innerHTML = `
          <div>
            <h3 class="sync-success">Success!</h3>
            <p>${result.message}</p>
            <button type="button" class="reload-button">Reload Page</button>
          </div>
        `;

        const reloadButton = statusContainer.querySelector('.reload-button');
        reloadButton.addEventListener('click', () => {
          window.location.reload(true); // true forces a hard reload from server
        });
      } else {
        // Failure
        statusContainer.innerHTML = `
          <div class="sync-error">
            <h3>Sync Failed</h3>
            <p><strong>Error:</strong> ${result.error || 'Unknown error'}</p>
            ${result.message ? `<p><strong>Details:</strong> ${result.message}</p>` : ''}
          </div>
        `;
      }
    } catch (error) {
      // Network or other error
      statusContainer.innerHTML = `
        <div class="sync-error">
          <h3>Sync Failed</h3>
          <p><strong>Error:</strong> Network error</p>
          <p><strong>Details:</strong> ${error.message}</p>
        </div>
      `;
    }
  }

  return {
    dialog,
    showModal: async () => {
      dialog.showModal();
      document.body.classList.add('modal-open');
      await performSync();
    },
  };
}

export async function openSyncModal() {
  const { dialog, showModal } = await createSyncModal();
  showModal();
  return dialog;
}
