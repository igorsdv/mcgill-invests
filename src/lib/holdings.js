import yahooFinance from 'yahoo-finance2';
import { applyTransforms, getDefinedViews, matchesView } from './config.js';
import cache from './fs-cache.js';
import sheets from './sheets.js';
import { sumMarketValue } from './util.js';

export function getRawHoldings() {
  return cache.getOrFetch('holdings', () => sheets.getRaw());
}

export function getAllHoldings() {
  return getHoldingsByView('all');
}

export async function getHoldingsByView(view) {
  const holdings = (await getRawHoldings())
    .filter(
      (holding) => holding.marketValue > 0 && !matchesView(holding, 'exclude')
    )
    .map(
      ({
        id,
        assetCategory,
        assetType,
        marketValue,
        description1,
        ticker,
        country,
      }) =>
        applyTransforms({
          id,
          assetCategory,
          assetType,
          marketValue,
          description1,
          ticker,
          country,
        })
    );

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
      marketValue: sumMarketValue(group),
      matchingViews: getDefinedViews().filter((view) =>
        group.some((h) => matchesView(h, view))
      ),
    }))
    .filter(
      ({ matchingViews }) => view === 'all' || matchingViews.includes(view)
    )
    .sort((a, b) => b.marketValue - a.marketValue);
}

export async function hydrateMetadata(holdings) {
  const metadata = await getMetadata();

  return Promise.all(
    holdings.map(async (holding) => {
      const ticker = (holding.ticker ?? '').split('.')[0];

      holding.businessProfile = await getBusinessProfile(holding);
      holding.metadata = metadata[ticker] ?? {};
    })
  );
}

function getMetadata() {
  return cache.getOrFetch('metadata', () => sheets.getMetadata());
}

function getBusinessProfile({ ticker }) {
  return cache.getOrFetch(`ticker-${ticker}`, () => getQuoteSummary(ticker));
}

async function getQuoteSummary(ticker) {
  console.log('Request ticker symbol', ticker);

  try {
    const data = await yahooFinance.quoteSummary(ticker, {
      modules: ['quoteType', 'summaryProfile'],
    });

    return {
      name: data.quoteType.longName || '',
      symbol: data.quoteType.symbol,
      description: Buffer.from(
        data.summaryProfile?.longBusinessSummary || '',
        'latin1'
      ).toString(),
    };
  } catch (e) {
    console.error(e.message);

    return {
      name: '',
      symbol: ticker,
      description: '',
    };
  }
}
