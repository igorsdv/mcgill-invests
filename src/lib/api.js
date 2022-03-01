import definitions from './definitions.js';
import cache from './fs-cache.js';
import sheets from './sheets.js';

export function getHoldings() {
  return cache.getOrFetch('holdings', () => sheets.getRaw());
}

export async function getHoldingsByView(view) {
  const holdings = await getHoldings();

  return holdings.filter(
    (holding) =>
      Object.entries(definitions['exclude']).every(
        ([field, values]) => !values.includes(holding[field])
      ) &&
      holding.marketValue > 0 &&
      (view === 'all' ||
        Object.entries(definitions[view]).some(([field, values]) =>
          values.includes(holding[field])
        ))
  );
}

export async function getGroupedHoldingsByView(view) {
  const holdings = await getHoldingsByView(view);

  const groupedHoldings = holdings.reduce((result, holding) => {
    if (result[holding.description1] === undefined) {
      result[holding.description1] = [];
    }

    result[holding.description1].push(holding);

    return result;
  }, {});

  return Object.values(groupedHoldings)
    .map((group) => ({
      ...group[0],
      marketValue: group.reduce((s, h) => s + h.marketValue, 0),
    }))
    .sort((a, b) => b.marketValue - a.marketValue);
}

export function getMetadata() {
  return cache.getOrFetch('metadata', () => sheets.getMetadata());
}
