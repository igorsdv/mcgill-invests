import fsCache from '../../lib/fs-cache.js';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.AUTH_TOKEN}`) {
    return res.status(403).send();
  }

  const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const q = params.get('q') ?? '';

  if (q === '') {
    return res.status(400).send();
  }

  res.status(200).json({ key: fsCache.filePath(q)[1] });
}
