import { stringify } from 'csv-stringify/sync';
import { getAllHoldings } from '../../lib/api.js';

export default async function handler(req, res) {
  const headers = [
    'Reporting Account Name',
    'Asset Type Category',
    'Asset Type Name',
    'Market Value',
    'Units',
    'Security Description 1',
    'Security Description 2',
    'Cusip',
    'ISIN',
    'Ticker',
    'Country of Issue Name',
  ];

  const holdings = (await getAllHoldings()).map(
    ({
      account,
      assetCategory,
      assetType,
      marketValue,
      units,
      description1,
      description2,
      cusip,
      isin,
      ticker,
      country,
    }) => ({
      account,
      assetCategory,
      assetType,
      marketValue,
      units,
      description1,
      description2,
      cusip,
      isin,
      ticker,
      country,
    })
  );

  const result = stringify([headers]) + stringify(holdings);

  res.setHeader('content-disposition', 'attachment; filename=holdings.csv');
  res.status(200).send(result);
}
