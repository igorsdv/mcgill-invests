import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';
import { flock as callbackFlock } from 'fs-ext';

const flock = util.promisify(callbackFlock);

export default {
  cacheDir: path.resolve('./.cache'),

  filePath(key) {
    const file = createHash('sha256')
      .update(key, 'utf-8')
      .digest()
      .slice(0, 16)
      .toString('hex');
    const dir = path.join(this.cacheDir, file[0], file[1]);

    return [dir, file];
  },

  async get(key) {
    const file = path.join(...this.filePath(key));
    const filehandle = await fs.open(file, 'r');

    await flock(filehandle.fd, 'sh');

    const value = await filehandle.readFile({ encoding: 'utf-8' });
    await filehandle.close();

    return JSON.parse(value);
  },

  async set(key, value) {
    const [dir, file] = this.filePath(key);

    await fs.mkdir(dir, { recursive: true });

    const filehandle = await fs.open(path.join(dir, file), 'w');

    await flock(filehandle.fd, 'ex');

    await filehandle.writeFile(JSON.stringify(await value));
    await filehandle.close();
  },

  getOrFetch(key, fn) {
    return this.get(key).catch(async () => {
      const value = fn();
      await this.set(key, value);

      return value;
    });
  },
};
