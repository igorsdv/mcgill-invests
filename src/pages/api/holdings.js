import { writeFile } from 'fs/promises';
import { getHoldingsByView } from '../../lib/api.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send();
  }

  const outputPath = '/tmp/holdings.csv';
  const holdings = await getHoldingsByView('all');

  await writeFile(
    outputPath,
    holdings
      .map(
        ({ ticker, country, description1 }) =>
          [country, description1, ticker].join(',') + '\n'
      )
      .join('')
  );

  res.status(200).send();
}
