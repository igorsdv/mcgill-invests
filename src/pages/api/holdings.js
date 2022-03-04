import { getHoldingsByView, hydrateMetadata } from '../../lib/api.js';

const pageSize = 24;

function splitTokens(str) {
  return str
    .toLowerCase()
    .split(' ')
    .filter((t) => t !== '');
}

export default async function handler(req, res) {
  const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const searchTokens = splitTokens(params.get('q') ?? '');
  const page = parseInt(params.get('page'), 10) || 1;

  if (searchTokens.length === 0) {
    return res.status(200).json({ holdings: [], totalPages: 0 });
  }

  const allHoldings = (await getHoldingsByView('all')).filter(
    ({ description1, ticker }) => {
      const tokens = [...splitTokens(description1), ...splitTokens(ticker)];

      return searchTokens.every((st) => tokens.some((t) => t.includes(st)));
    }
  );

  const totalPages = Math.ceil(allHoldings.length / pageSize);
  const holdings = allHoldings.slice((page - 1) * pageSize, page * pageSize);

  await hydrateMetadata(holdings);

  res.status(200).json({ holdings, totalPages });
}
