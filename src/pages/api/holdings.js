import { getHoldings } from '../../lib/api.js';

export default async function handler(req, res) {
  const holdings = await getHoldings();

  res.status(200).json(holdings);
}
