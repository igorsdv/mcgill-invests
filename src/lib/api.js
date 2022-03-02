import { applyTransforms, getDefinedViews, matchesView } from './config.js';
import { getHoldings } from './holdings.js';
import { getBusinessProfile } from './metadata.js';

export async function getHoldingsByView(view) {
  const holdings = (await getHoldings(view))
    .filter(
      (holding) =>
        holding.marketValue > 0 &&
        !matchesView(holding, 'exclude') &&
        (view === 'all' || matchesView(holding, view))
    )
    .map(applyTransforms);

  const keyedHoldings = holdings.reduce(
    (result, holding) => {
      let id = null;

      if (result.descriptions[holding.description1] !== undefined) {
        id = result.descriptions[holding.description1];
      } else if (result.tickers[holding.ticker] !== undefined) {
        id = result.tickers[holding.ticker];
      }

      if (id === null) {
        result.ids[holding.id] = [holding];
        result.descriptions[holding.description1] = holding.id;

        if (holding.ticker) {
          result.tickers[holding.ticker] = holding.id;
        }
      } else {
        result.ids[id].push(holding);
      }

      return result;
    },
    {
      ids: {},
      descriptions: {},
      tickers: {},
    }
  );

  return Object.values(keyedHoldings.ids)
    .map((group) => ({
      ...group[0],
      marketValue: group.reduce((s, h) => s + h.marketValue, 0),
      matchingViews: getDefinedViews().filter((view) =>
        matchesView(group[0], view)
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
