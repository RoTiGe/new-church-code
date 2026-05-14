// Express server for the statically-exported Next.js site.
// Serves the contents of ./out and exposes three JSON API endpoints
// previously implemented as Next.js route handlers.

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir, readFile } from 'node:fs/promises';
import { imageSize } from 'image-size';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, 'out');
const GALLERY_DIR = path.join(ROOT, 'public', 'gallery');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));

// --- API routes -------------------------------------------------------------

app.get('/api/gallery', async (_req, res) => {
  try {
    let yearEntries;
    try {
      yearEntries = await readdir(GALLERY_DIR, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') return res.json([]);
      throw err;
    }

    const images = [];
    for (const yearEntry of yearEntries) {
      if (!yearEntry.isDirectory()) continue;
      const year = yearEntry.name;
      const yearPath = path.join(GALLERY_DIR, year);
      const files = await readdir(yearPath);

      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) continue;

        const filePath = path.join(yearPath, file);
        let width;
        let height;
        try {
          const buf = await readFile(filePath);
          ({ width, height } = imageSize(buf));
        } catch (err) {
          console.warn(`Could not read dimensions for ${filePath}:`, err.message);
        }

        images.push({
          id: `${year}/${file}`,
          url: `/gallery/${encodeURIComponent(year)}/${encodeURIComponent(file)}`,
          year,
          width,
          height,
        });
      }
    }

    res.json(images);
  } catch (err) {
    console.error('Gallery API error:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

function paypalApiBase() {
  return process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

async function getPaypalAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
  const tokenRes = await axios.post(
    `${paypalApiBase()}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET },
    },
  );
  return tokenRes.data.access_token;
}

app.post('/api/create-order', async (req, res) => {
  const { amount, currency } = req.body || {};
  const { APP_URL, PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
  if (!APP_URL || !PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    return res.status(500).json({ error: 'Missing PayPal or app configuration.' });
  }
  if (!amount) {
    return res.status(400).json({ error: 'Missing amount.' });
  }

  try {
    const accessToken = await getPaypalAccessToken();
    const orderRes = await axios.post(
      `${paypalApiBase()}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency || 'EUR',
              value: parseFloat(amount).toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${APP_URL}/donate/verify`,
          cancel_url: `${APP_URL}/donate/cancel`,
        },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    res.status(200).json(orderRes.data);
  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    console.error(`PayPal create-order error (${statusCode}):`, errorData);
    res.status(statusCode).json(errorData);
  }
});

app.post('/api/capture-order', async (req, res) => {
  const { orderID } = req.body || {};
  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
  if (!orderID) return res.status(400).json({ error: 'Missing PayPal orderID.' });
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    return res.status(500).json({ error: 'Missing PayPal credentials.' });
  }

  try {
    const accessToken = await getPaypalAccessToken();
    const captureRes = await axios.post(
      `${paypalApiBase()}/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const capture = captureRes.data.purchase_units?.[0]?.payments?.captures?.[0];
    const status = capture?.status || captureRes.data.status;
    res.status(200).json({ status, raw: captureRes.data });
  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    console.error(`PayPal capture-order error (${statusCode}):`, errorData);
    res.status(statusCode).json(errorData);
  }
});

// --- Static site -----------------------------------------------------------

app.use(express.static(OUT_DIR, { extensions: ['html'] }));

app.use((_req, res) => {
  res.status(404).sendFile(path.join(OUT_DIR, '404.html'), (err) => {
    if (err) res.type('text/plain').send('Not found');
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
