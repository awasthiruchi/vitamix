import { cartApi } from '../../scripts/minicart/api.js';

export default async function addToCart(sku, options, quantity) {
  cartApi.addToCart(sku, options, quantity);
}
