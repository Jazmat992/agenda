import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fs from 'fs';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const BASE_DIR = join(process.cwd().split('first_task')[0], 'first_task');
const BUCKETS = 'buckets.json';
const LOCATIONS = 'locations.json';

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.get('/api/data/locations', (req, res) => {
  fs.readFile(join(BASE_DIR, LOCATIONS), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error reading file' });
    } else {
      const locData: string[] = JSON.parse(data);
      res.json(locData.sort());
    }
  });

});

app.get('/api/data/buckets', (req, res) => {
  fs.readFile(join(BASE_DIR, BUCKETS), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error reading file' });
    } else {
      const buckets: any[] = JSON.parse(data);
      res.json(buckets.map(bucket => {
        return {name: bucket.name, location: bucket.location}
      }));
    }
  });

});

app.get('/api/data/bucket-detail/:id',  (req, res) => {
  try {
    const bucketId = parseInt(req.params.id);

    fs.readFile(join(BASE_DIR, BUCKETS), 'utf-8',(err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error reading file' });
      } else {
        res.json(JSON.parse(data)[bucketId]);
      }

    });
  } catch {
    res.status(500).json({ error: 'Error reading file' });
  }
});

app.post('/api/data/buckets', express.json(), (req, res) => {
  try {
    const locData: string[] = JSON.parse(fs.readFileSync(join(BASE_DIR, LOCATIONS), 'utf-8'));
    const locIndex = locData.findIndex(loc => loc.toLowerCase() == req.body.location.toLowerCase())
    if (locIndex == -1) {
      locData.push(req.body.location);
      fs.writeFileSync(join(BASE_DIR, LOCATIONS), JSON.stringify(locData), 'utf-8');
    } else {
      req.body.location = locData[locIndex];
    }
    const data = JSON.parse(fs.readFileSync(join(BASE_DIR, BUCKETS),'utf-8'));
    if (!req.body.files) req.body['files'] = [];
    data.push(req.body);
    fs.writeFile(join(BASE_DIR, BUCKETS), JSON.stringify(data, null, 2), 'utf-8', err => {
      if (err) {
        res.status(500).json({error: 'Error writing file'});
      } else {
        res.json({success: 'Insert successful'});
      }
    });
  } catch {
    res.status(500).json({ error: 'Error saving the file' });
  }
  
});

app.patch('/api/data/buckets', express.json(), (req, res) => {
  try {
    fs.readFile(join(BASE_DIR, BUCKETS),'utf-8', (err, data) => {
      if (err) {
        res.status(500).json({error: 'Error reading file'});
      } else {
        const buckets = JSON.parse(data);
        const id = req.body.id;
        if (req.body.addFiles) {
          buckets[id].files = buckets[id].files.concat(req.body.addFiles);
        }
        if (req.body.removeFiles) {
          buckets[id].files = buckets[id].files.filter((file: any,index: number) => !req.body.removeFiles.includes(index));
        }
        fs.writeFile(join(BASE_DIR, BUCKETS), JSON.stringify(buckets, null, 2), 'utf-8', err => {
          if (err) {
            res.status(500).json({error: 'Error writing file'});
          } else {
            res.json({success: 'Insert successful'});
          }
        });
      }
    });
  } catch {
    res.status(500).json({ error: 'Error saving the file' });
  }
});

app.delete('/api/data/buckets/:id', express.json(), (req, res) => {
  try {
    fs.readFile(join(BASE_DIR, BUCKETS), 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error reading the file' });
      } else {
        const id = parseInt(req.params.id);
        const jsonContent = JSON.parse(data).filter((bucket: any, index: number) => index != id);
        fs.writeFile(join(BASE_DIR, BUCKETS), JSON.stringify(jsonContent, null, 2), 'utf8', (err) => {
          if (err) {
            res.status(500).json({ error: 'Error writing to the file' });
          }
          res.json({ success: 'File updated successfully!' });
        });
      }
    });
  } catch {
    res.status(500).json({ error: 'Error writing to the file' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
