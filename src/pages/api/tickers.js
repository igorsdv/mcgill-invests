import { appendFile, writeFile } from 'fs/promises';
import { getHoldingsByView, hydrateMetadata } from '../../lib/api.js';
import { chunk } from '../../lib/util.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send();
  }

  const outputPath = '/tmp/tickers.csv';
  const holdings = (await getHoldingsByView('all')).sort(
    (a, b) => b.marketValue - a.marketValue
    // a.country.localeCompare(b.country) ||
    // a.description1.localeCompare(b.description1)
  );

  const chunks = chunk(holdings, 20);

  res.status(200).send();

  await writeFile(outputPath, '');

  for (const [key, holdingsChunk] of Object.entries(chunks)) {
    console.log('Processing chunk', +key + 1, 'of', chunks.length);

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
