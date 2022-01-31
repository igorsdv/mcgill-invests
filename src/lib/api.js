import cache from './fs-cache.js';
import sheets from './sheets.js';

export function getHoldings() {
  return cache.getOrFetch('holdings', () => sheets.getRaw());
}

export function getMetadata() {
  return cache.getOrFetch('metadata', () => sheets.getMetadata());
}
