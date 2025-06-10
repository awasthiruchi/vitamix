// eslint-disable-next-line import/no-unresolved
import { cartApi } from 'https://uat.vitamix.com/scripts/minicart/api.js';

export default async function addToCart(sku, options, quantity) {
  cartApi.addToCart(sku, options, quantity);
}
