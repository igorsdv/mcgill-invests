import yahooFinance from 'yahoo-finance2';
import cache from './fs-cache.js';
import sheets from './sheets.js';

export function getHoldings() {
  return cache.getOrFetch('holdings', () => sheets.getRaw());
}

export function getMetadata() {
  return cache.getOrFetch('metadata', () => sheets.getMetadata());
}

export function getBusinessProfile({ ticker }) {
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
