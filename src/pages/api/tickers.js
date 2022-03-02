import { appendFile, writeFile } from 'fs/promises';
import { getHoldingsByView, hydrateMetadata } from '../../lib/api.js';
import { getHoldings } from '../../lib/holdings.js';
import { chunk } from '../../lib/util.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send();
  }

  const raw = !!req.query.raw;
  const holdings = (
    await (raw ? getHoldings() : getHoldingsByView('all'))
  ).sort(
    (a, b) =>
      a.country.localeCompare(b.country) ||
      a.description1.localeCompare(b.description1)
  );

  res.status(200).send();

  const chunks = chunk(holdings, 20);
  const outputPath = raw ? '/tmp/raw-tickers.csv' : '/tmp/tickers.csv';

  await writeFile(outputPath, '');

  for (const [key, holdingsChunk] of Object.entries(chunks)) {
    console.log('Processing chunk', +key + 1, 'of', chunks.length);

    if (raw) {
      await appendFile(
        outputPath,
        holdingsChunk
          .map(
            ({ description1, ticker, country, marketValue }) =>
              [country, description1, ticker, marketValue].join(',') + '\n'
          )
          .join('')
      );
    } else {
      await hydrateMetadata(holdingsChunk);
      await appendFile(
        outputPath,
        holdingsChunk
          .map(
            ({
              description1,
              ticker,
              country,
              businessProfile: { name, symbol },
            }) => [country, description1, ticker, symbol, name].join(',') + '\n'
          )
          .join('')
      );
    }
  }
}
