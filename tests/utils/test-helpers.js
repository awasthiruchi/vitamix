/* eslint-disable no-console */
/* eslint-disable global-require */
import { expect } from '@playwright/test';

/**
 * Utility functions for Vitamix integration tests
 */

/**
 * Get the base URL for the current branch
 * @param {string} branch - The branch name (defaults to 'main')
 * @returns {string} The base URL for the branch
 */
export function getBaseUrl(branch = 'main') {
  const baseUrl = process.env.BASE_URL || `https://${branch}--vitamix--aemsites.aem.network`;
  return baseUrl;
}

/**
 * Get the current branch name from environment or git
 * @returns {Promise<string>} The current branch name
 */
export async function getCurrentBranch() {
  // Check if branch is provided via environment variable
  if (process.env.BRANCH) {
    return process.env.BRANCH;
  }

  // Try to get branch from git (if available)
  try {
    const { execSync } = require('child_process');
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch;
  } catch (error) {
    console.warn('Could not determine git branch, using "main"');
    return 'main';
  }
}

/**
 * Build a product URL for testing
 * @param {string} productPath - The product path (e.g., '/us/en_us/products/ascent-x3')
 * @param {string} branch - The branch name
 * @returns {string} The full product URL
 */
export function buildProductUrl(productPath, branch = 'main') {
  const baseUrl = getBaseUrl(branch);
  return `${baseUrl}${productPath}`;
}

/**
 * Common assertions for PDP elements
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function assertPDPElements(page) {
  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Assert that key PDP elements exist
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.pdp-buy-box')).toBeVisible();
  await expect(page.locator('.gallery')).toBeVisible();

  // Assert that pricing information is present
  const pricingElement = page.locator('.pricing-final');
  await expect(pricingElement).toBeVisible();

  // Assert that add to cart button exists
  const addToCartButton = page.locator('.quantity-container button');
  await expect(addToCartButton).toBeVisible();

  // Assert that product options exist (if applicable)
  const optionsContainer = page.locator('.pdp-color-options');
  if (await optionsContainer.count() > 0) {
    await expect(optionsContainer).toBeVisible();
  }

  // Assert that product details section exists
  const detailsSection = page.locator('.details');
  await expect(detailsSection).toBeVisible();

  // Assert that specifications section exists
  const specsSection = page.locator('.specifications');
  await expect(specsSection).toBeVisible();

  // Assert that FAQ section exists
  const faqSection = page.locator('.faq-container');
  await expect(faqSection).toBeVisible();

  // Assert that share buttons exist
  const shareContainer = page.locator('.pdp-share-container');
  await expect(shareContainer).toBeVisible();
}

/**
 * Assert that a specific element exists and is visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the element
 * @param {string} description - Description of the element for error messages
 */
export async function assertElementExists(page, selector, description) {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  console.log(`✓ ${description} is visible`);
}

/**
 * Assert that a specific element contains expected text
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the element
 * @param {string} expectedText - Expected text content
 * @param {string} description - Description of the element for error messages
 */
export async function assertElementText(page, selector, expectedText, description) {
  const element = page.locator(selector);
  await expect(element).toContainText(expectedText);
  console.log(`✓ ${description} contains expected text: "${expectedText}"`);
}

/**
 * Wait for and assert that a specific element is present
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector for the element
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
export async function waitForElement(page, selector, timeout = 10000) {
  await page.waitForSelector(selector, { timeout });
  console.log(`✓ Element found: ${selector}`);
}
