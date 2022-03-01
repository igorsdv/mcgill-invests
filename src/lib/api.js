import definitions from './definitions.js';
import { getHoldings } from './holdings.js';
import { getBusinessProfile } from './metadata.js';

function matchesView(holding, view) {
  return Object.entries(definitions[view]).some(([field, values]) =>
    values.includes(holding[field])
  );
}

export async function getHoldingsByView(view) {
  const holdings = (await getHoldings(view)).filter(
    (holding) =>
      holding.marketValue > 0 &&
      Object.entries(definitions['exclude']).every(
        ([field, values]) => !values.includes(holding[field])
      ) &&
      (view === 'all' || matchesView(holding, view))
  );

  const keyedHoldings = holdings.reduce((result, holding) => {
    const key = holding.ticker || holding.description1;

    (result[key] = result[key] || []).push(holding);

    return result;
  }, {});

  return Object.values(keyedHoldings)
    .map((group) => ({
      ...group[0],
      marketValue: group.reduce((s, h) => s + h.marketValue, 0),
      matchingViews: Object.keys(definitions).filter(
        (view) => view !== 'exclude' && matchesView(group[0], view)
      ),
    }))
    .sort((a, b) => b.marketValue - a.marketValue);
}

export function hydrateMetadata(holdings) {
  return Promise.all(
    holdings.map(async (holding) => {
      holding.businessProfile = await getBusinessProfile(holding);
    })
  );
}
