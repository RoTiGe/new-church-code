// Express server for the statically-exported Next.js site.
// Serves the contents of ./out and exposes three JSON API endpoints
// previously implemented as Next.js route handlers.

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir, readFile } from 'node:fs/promises';
import { imageSize } from 'image-size';
import axios from 'axios';
import nodemailer from 'nodemailer';

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

// --- Contact form ----------------------------------------------------------

let mailTransporter = null;
function getMailTransporter() {
  if (mailTransporter) return mailTransporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = parseInt(SMTP_PORT || '587', 10);
  mailTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return mailTransporter;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message, website } = req.body || {};

  // Honeypot: bots fill hidden "website" field; real users won't.
  if (website) return res.status(200).json({ ok: true });

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (name.length > 200 || subject.length > 200 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Field too long.' });
  }

  const { CONTACT_TO, CONTACT_FROM, SMTP_USER } = process.env;
  const to = CONTACT_TO || 'info@aeg-koeln.de,kontakt@aeg-koeln.de';
  const from = CONTACT_FROM || SMTP_USER;

  const transporter = getMailTransporter();
  if (!transporter || !from) {
    return res.status(500).json({ error: 'Mail service is not configured.' });
  }

  try {
    await transporter.sendMail({
      from: `"EEC Cologne Website" <${from}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact] ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<hr/>
<p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
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
