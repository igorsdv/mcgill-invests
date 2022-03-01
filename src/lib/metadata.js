import yahooFinance from 'yahoo-finance2';
import cache from './fs-cache.js';
import sheets from './sheets.js';

const suffixes = {
  'Australia': 'AX',
  'Belgium': 'BR',
  'Bermuda': 'L',
  'Canada': 'TO',
  'Denmark': 'CO',
  'Finland': 'HE',
  'France': 'PA',
  'Germany': 'DE',
  'Hong Kong': 'HK', // pad to 4 digits
  'Israel': 'TA',
  'Italy': 'MI',
  'Japan': 'T',
  'Luxemburg': 'F',
  'Mexico': 'MX',
  'Netherlands': 'AS',
  'New Zealand': 'NZ',
  'Norway': 'OL',
  'Portugal': 'LS',
  'Spain': 'MC',
  'Sweden': 'ST',
  'Switzerland': 'VX',
  'United Kingdom': 'L',
};

export async function getBusinessProfile({ ticker, country }) {
  // for Canadian tickers like BAM/A
  ticker = ticker.replace('/', '-');

  // pad numeric tickers
  if (!isNaN(ticker)) {
    while (ticker.length < 4) {
      ticker = '0' + ticker;
    }
  }

  if (suffixes[country] !== undefined) {
    ticker = `${ticker}.${suffixes[country]}`;
  }

  console.log('Request ticker symbol', ticker);

  try {
    const data = await yahooFinance.quoteSummary(ticker, {
      modules: ['quoteType', 'summaryProfile'],
    });

    return {
      name: data.quoteType.longName || '',
      description: data.summaryProfile?.longBusinessSummary || '',
    };
  } catch (e) {
    console.error(e.message);

    return {
      name: '',
      description: '',
    };
  }
}

export function getMetadata() {
  return cache.getOrFetch('metadata', () => sheets.getMetadata());
}
