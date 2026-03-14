import { createServer } from 'http';
import { readFile, stat, open } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = join(__dirname, decodeURIComponent(urlPath));
  const ext = extname(filePath).toLowerCase();
  const contentType = mime[ext] || 'application/octet-stream';

  try {
    const stats = await stat(filePath);
    const fileSize = stats.size;
    const rangeHeader = req.headers.range;

    // Handle range requests (needed for video streaming)
    if (rangeHeader && contentType.startsWith('video/')) {
      const [startStr, endStr] = rangeHeader.replace('bytes=', '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : Math.min(start + 1024 * 1024, fileSize - 1);
      const chunkSize = end - start + 1;

      const fd = await open(filePath, 'r');
      const buffer = Buffer.alloc(chunkSize);
      await fd.read(buffer, 0, chunkSize, start);
      await fd.close();

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });
      res.end(buffer);
    } else {
      // For large files, stream instead of reading all at once
      if (fileSize > 10 * 1024 * 1024) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': fileSize,
          'Accept-Ranges': 'bytes',
        });
        const fd = await open(filePath, 'r');
        const CHUNK = 1024 * 1024;
        let pos = 0;
        while (pos < fileSize) {
          const size = Math.min(CHUNK, fileSize - pos);
          const buf = Buffer.alloc(size);
          await fd.read(buf, 0, size, pos);
          res.write(buf);
          pos += size;
        }
        await fd.close();
        res.end();
      } else {
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType, 'Accept-Ranges': 'bytes' });
        res.end(data);
      }
    }
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`The Dessert Chapter server → http://localhost:${PORT}`));
