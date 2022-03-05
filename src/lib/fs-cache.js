import { createHash } from 'crypto';
import { constants } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';
import { flock as callbackFlock, seek as callbackSeek } from 'fs-ext';

const flock = util.promisify(callbackFlock);
const seek = util.promisify(callbackSeek);

export default {
  cacheDir: path.resolve('./.cache'),
  queue: {},

  getFilePath(key) {
    const file = createHash('sha256')
      .update(key, 'utf-8')
      .digest()
      .slice(0, 16)
      .toString('hex');
    const dir = path.join(this.cacheDir, file[0], file[1]);

    return [dir, file];
  },

  async acquire(key) {
    if (this.queue[key]) {
      return new Promise((resolve) => {
        this.queue[key].push((filehandle) => resolve(filehandle));
      });
    }

    this.queue[key] = [];

    const [dir, file] = this.getFilePath(key);
    await fs.mkdir(dir, { recursive: true });

    const filehandle = await fs.open(
      path.join(dir, file),
      constants.O_RDWR | constants.O_CREAT
    );

    await flock(filehandle.fd, 'ex');

    return filehandle;
  },

  async release(key, filehandle) {
    const callback = this.queue[key].pop();

    if (callback) {
      return setImmediate(() => callback(filehandle));
    }

    delete this.queue[key];
    await filehandle.close();
  },

  async getOrFetch(key, fn) {
    const filehandle = await this.acquire(key);

    try {
      await seek(filehandle.fd, 0, 0);
      const value = await filehandle.readFile({ encoding: 'utf-8' });

      return JSON.parse(value);
    } catch {
      const value = fn();

      await filehandle.truncate();
      await filehandle.write(JSON.stringify(await value), 0);

      return value;
    } finally {
      await this.release(key, filehandle);
    }
  },

  delete(key) {
    return fs.rm(path.join(...this.getFilePath(key)), { force: true });
  },
};
