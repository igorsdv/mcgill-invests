import fsCache from '../../lib/fs-cache.js';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.AUTH_TOKEN}`) {
    return res.status(403).send();
  }

  if (!['GET', 'DELETE'].includes(req.method)) {
    return res.status(405).send();
  }

  const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const key = params.get('key') ?? '';

  if (key === '') {
    return res.status(400).send();
  }

  const hash = fsCache.getFilePath(key)[1];

  if (req.method === 'DELETE') {
    await fsCache.delete(key);
    res.status(200).send(`Deleted cache entry: ${hash}`);
  } else {
    res.status(200).send(hash);
  }
}
