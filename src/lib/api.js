import { applyTransforms, getDefinedViews, matchesView } from './config.js';
import { getHoldings } from './holdings.js';
import { getBusinessProfile } from './metadata.js';

export async function getHoldingsByView(view) {
  const holdings = (await getHoldings())
    .filter(
      (holding) => holding.marketValue > 0 && !matchesView(holding, 'exclude')
    )
    .map(applyTransforms);

  const keyedHoldings = {};
  const tickersByDescription = {};

  for (const holding of holdings) {
    const key =
      tickersByDescription[holding.description1] ||
      holding.ticker ||
      '@' + holding.id;

    tickersByDescription[holding.description1] = key;

    keyedHoldings[key] = keyedHoldings[key] || [];
    keyedHoldings[key].push(holding);
  }

  return Object.values(keyedHoldings)
    .map((group) => ({
      ...group[0],
      marketValue: group.reduce((s, h) => s + h.marketValue, 0),
      matchingViews: getDefinedViews().filter((view) =>
        group.some((h) => matchesView(h, view))
      ),
    }))
    .filter(
      ({ matchingViews }) => view === 'all' || matchingViews.includes(view)
    )
    .sort((a, b) => b.marketValue - a.marketValue);
}

export function hydrateMetadata(holdings) {
  return Promise.all(
    holdings.map(async (holding) => {
      holding.businessProfile = await getBusinessProfile(holding);
    })
  );
}
