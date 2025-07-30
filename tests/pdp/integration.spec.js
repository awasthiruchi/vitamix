/* eslint-disable no-console */
import { test, expect } from '@playwright/test';
import {
  getCurrentBranch,
  buildProductUrl,
  assertPDPElements,
  assertElementExists,
  assertElementText,
  waitForElement,
} from '../utils/test-helpers.js';

/**
 * Integration tests for Product Detail Pages (PDP)
 * These tests verify that key elements exist and function correctly
 */

test.describe('PDP Integration Tests', () => {
  let currentBranch;

  test.beforeAll(async () => {
    currentBranch = await getCurrentBranch();
    console.log(`Running tests against branch: ${currentBranch}`);
  });

  test.describe('Ascent X3 Product Page', () => {
    const productPath = '/us/en_us/products/ascent-x3';

    test('should load Ascent X3 product page with all required elements', async ({ page }) => {
      const productUrl = buildProductUrl(productPath, currentBranch);
      console.log(`Testing URL: ${productUrl}`);

      // Navigate to the product page
      await page.goto(productUrl);

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Assert that the page title contains the product name
      await expect(page).toHaveTitle(/Ascent X3/i);

      // Assert that key PDP elements exist
      await assertPDPElements(page);

      // Assert specific elements for this product
      await assertElementExists(page, '.pdp-gallery', 'Product Gallery');
      await assertElementExists(page, '.pdp-title', 'Product Title');
      await assertElementExists(page, '.pdp-pricing', 'Product Pricing');
      await assertElementExists(page, '.pdp-add-to-cart-button', 'Add to Cart Button');

      // Assert that the product title contains "Ascent X3"
      await assertElementText(page, 'h1', 'Ascent X3', 'Product Title');

      // Assert that pricing information is displayed
      const pricingElement = page.locator('.pdp-pricing');
      await expect(pricingElement).toBeVisible();

      // Assert that product options are available (if this product has variants)
      const optionsContainer = page.locator('.pdp-options');
      if (await optionsContainer.count() > 0) {
        await expect(optionsContainer).toBeVisible();
        console.log('✓ Product options are available');
      }

      // Assert that specifications section exists
      await assertElementExists(page, '.specifications', 'Product Specifications');

      // Assert that FAQ section exists
      await assertElementExists(page, '.faq-container', 'FAQ Section');

      // Assert that share buttons exist
      await assertElementExists(page, '.pdp-share-container', 'Share Buttons');

      // Assert that compare functionality exists
      await assertElementExists(page, '.pdp-compare-container', 'Compare Functionality');
    });

    test('should display product images in gallery', async ({ page }) => {
      const productUrl = buildProductUrl(productPath, currentBranch);
      await page.goto(productUrl);

      // Wait for gallery to load
      await waitForElement(page, '.gallery');

      // Assert that product images are displayed
      const images = page.locator('.gallery img');
      await expect(images.first()).toBeVisible();

      // Assert that multiple images are available (if applicable)
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
      console.log(`✓ Product gallery contains ${imageCount} images`);
    });

    test('should have functional add to cart button', async ({ page }) => {
      const productUrl = buildProductUrl(productPath, currentBranch);
      await page.goto(productUrl);

      // Wait for add to cart button
      await waitForElement(page, '.pdp-add-to-cart-button');

      // Assert that add to cart button is enabled
      const addToCartButton = page.locator('.pdp-add-to-cart-button');
      await expect(addToCartButton).toBeEnabled();

      // Assert that button has proper text
      await expect(addToCartButton).toContainText(/add to cart/i);

      console.log('✓ Add to Cart button is functional');
    });

    test('should display product specifications', async ({ page }) => {
      const productUrl = buildProductUrl(productPath, currentBranch);
      await page.goto(productUrl);

      // Wait for specifications section
      await waitForElement(page, '.specifications');

      // Assert that specifications content is present
      const specsContent = page.locator('.specifications');
      await expect(specsContent).toBeVisible();

      // Assert that specifications have content
      const specsText = await specsContent.textContent();
      expect(specsText.length).toBeGreaterThan(0);

      console.log('✓ Product specifications are displayed');
    });

    test('should have working share functionality', async ({ page }) => {
      const productUrl = buildProductUrl(productPath, currentBranch);
      await page.goto(productUrl);

      // Wait for share container
      await waitForElement(page, '.pdp-share-container');

      // Assert that share buttons exist
      const shareButtons = page.locator('.pdp-share-container a');
      await expect(shareButtons.first()).toBeVisible();

      // Assert that multiple share options are available
      const shareCount = await shareButtons.count();
      expect(shareCount).toBeGreaterThan(0);

      console.log(`✓ Share functionality has ${shareCount} options`);
    });
  });

  test.describe('Product Page Navigation', () => {
    test('should handle product variant selection', async ({ page }) => {
      const productUrl = buildProductUrl('/us/en_us/products/ascent-x3', currentBranch);
      await page.goto(productUrl);

      // Look for variant options (like color selection)
      const variantOptions = page.locator('.pdp-options button, .pdp-options input[type="radio"]');

      if (await variantOptions.count() > 0) {
        // Click on the first variant option
        await variantOptions.first().click();

        // Wait for any updates to complete
        await page.waitForTimeout(1000);

        // Assert that the selection was made
        await expect(variantOptions.first()).toHaveAttribute('aria-selected', 'true');

        console.log('✓ Product variant selection works');
      } else {
        console.log('ℹ No variant options found for this product');
      }
    });

    test('should display free shipping message when eligible', async ({ page }) => {
      const productUrl = buildProductUrl('/us/en_us/products/ascent-x3', currentBranch);
      await page.goto(productUrl);

      // Check for free shipping message
      const freeShippingElement = page.locator('.pdp-free-shipping-container');

      if (await freeShippingElement.count() > 0) {
        await expect(freeShippingElement).toBeVisible();
        await expect(freeShippingElement).toContainText(/free shipping/i);
        console.log('✓ Free shipping message is displayed');
      } else {
        console.log('ℹ Product is not eligible for free shipping');
      }
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work across different browsers', async ({ page, browserName }) => {
      const productUrl = buildProductUrl('/us/en_us/products/ascent-x3', currentBranch);
      await page.goto(productUrl);

      // Basic functionality test that works across browsers
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.pdp-buy-box')).toBeVisible();

      console.log(`✓ Basic PDP functionality works in ${browserName}`);
    });
  });
});
