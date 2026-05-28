// Express server for the statically-exported Next.js site.
// Serves the contents of ./out and exposes three JSON API endpoints
// previously implemented as Next.js route handlers.

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir, readFile, writeFile, mkdir, unlink, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { imageSize } from 'image-size';
import axios from 'axios';
import nodemailer from 'nodemailer';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, 'out');
const GALLERY_DIR = path.join(ROOT, 'public', 'gallery');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const EVENT_IMAGES_DIR = path.join(DATA_DIR, 'event-images');
const ADMIN_COOKIE = 'admin_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_IMAGES_PER_EVENT = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MIME_EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

await mkdir(DATA_DIR, { recursive: true });
await mkdir(EVENT_IMAGES_DIR, { recursive: true });
if (!existsSync(EVENTS_FILE)) await writeFile(EVENTS_FILE, '[]', 'utf8');

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());

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

// --- Admin auth ------------------------------------------------------------

function getSessionSecret() {
  return process.env.SESSION_SECRET || '';
}

function signToken(payload) {
  const secret = getSessionSecret();
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  const secret = getSessionSecret();
  if (!secret || !token || typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); }
  catch { return null; }
  if (!payload?.exp || Date.now() > payload.exp) return null;
  return payload;
}

function requireAdmin(req, res, next) {
  const session = verifyToken(req.cookies?.[ADMIN_COOKIE]);
  if (!session) return res.status(401).json({ error: 'Unauthorized.' });
  req.adminSession = session;
  next();
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body || {};
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected || !getSessionSecret()) {
    return res.status(500).json({ error: 'Admin login is not configured on the server.' });
  }
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Missing password.' });
  }
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Invalid password.' });
  }
  const token = signToken({ sub: 'admin', iat: Date.now(), exp: Date.now() + SESSION_TTL_MS });
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
    path: '/',
  });
  res.json({ ok: true });
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie(ADMIN_COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/session', (req, res) => {
  const session = verifyToken(req.cookies?.[ADMIN_COOKIE]);
  res.json({ authenticated: Boolean(session) });
});

// --- Events ----------------------------------------------------------------

async function loadEvents() {
  try {
    const raw = await readFile(EVENTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

async function saveEvents(events) {
  const tmp = `${EVENTS_FILE}.tmp`;
  await writeFile(tmp, JSON.stringify(events, null, 2), 'utf8');
  await rename(tmp, EVENTS_FILE);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: MAX_IMAGES_PER_EVENT },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
    }
    cb(null, true);
  },
});

function sanitizeTranslations(body) {
  const langs = ['en', 'de', 'am'];
  const out = {};
  for (const lang of langs) {
    const title = String(body[`title_${lang}`] || '').trim().slice(0, 200);
    const description = String(body[`description_${lang}`] || '').trim().slice(0, 5000);
    out[lang] = { title, description };
  }
  return out;
}

function validateEventInput(body) {
  const translations = sanitizeTranslations(body);
  if (!translations.en.title || !translations.en.description) {
    return { error: 'English title and description are required.' };
  }
  const expiresAt = String(body.expiresAt || '').trim();
  if (!expiresAt || Number.isNaN(Date.parse(expiresAt))) {
    return { error: 'A valid expiry date is required.' };
  }
  const eventDate = body.eventDate ? String(body.eventDate).trim() : '';
  const eventTime = body.eventTime ? String(body.eventTime).trim().slice(0, 32) : '';
  const location = body.location ? String(body.location).trim().slice(0, 300) : '';
  return { translations, expiresAt: new Date(expiresAt).toISOString(), eventDate, eventTime, location };
}

async function saveUploadedImages(eventId, files) {
  const saved = [];
  for (const file of files) {
    const ext = MIME_EXT[file.mimetype] || '.bin';
    const filename = `${eventId}_${randomUUID()}${ext}`;
    await writeFile(path.join(EVENT_IMAGES_DIR, filename), file.buffer);
    saved.push(filename);
  }
  return saved;
}

async function deleteImages(filenames) {
  for (const filename of filenames || []) {
    if (typeof filename !== 'string' || filename.includes('/') || filename.includes('\\')) continue;
    try { await unlink(path.join(EVENT_IMAGES_DIR, filename)); } catch { /* ignore */ }
  }
}

app.get('/api/events', async (_req, res) => {
  try {
    const events = await loadEvents();
    const now = Date.now();
    const visible = events
      .filter((e) => Date.parse(e.expiresAt) > now)
      .sort((a, b) => Date.parse(a.eventDate || a.expiresAt) - Date.parse(b.eventDate || b.expiresAt));
    res.json(visible);
  } catch (err) {
    console.error('Events list error:', err);
    res.status(500).json({ error: 'Failed to load events.' });
  }
});

app.get('/api/admin/events', requireAdmin, async (_req, res) => {
  try { res.json(await loadEvents()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Failed to load events.' }); }
});

app.post('/api/admin/events', requireAdmin, upload.array('images', MAX_IMAGES_PER_EVENT), async (req, res) => {
  const valid = validateEventInput(req.body);
  if (valid.error) return res.status(400).json({ error: valid.error });
  const id = randomUUID();
  const images = await saveUploadedImages(id, req.files || []);
  const now = new Date().toISOString();
  const event = { id, createdAt: now, updatedAt: now, ...valid, images };
  const events = await loadEvents();
  events.push(event);
  await saveEvents(events);
  res.status(201).json(event);
});

app.put('/api/admin/events/:id', requireAdmin, upload.array('images', MAX_IMAGES_PER_EVENT), async (req, res) => {
  const valid = validateEventInput(req.body);
  if (valid.error) return res.status(400).json({ error: valid.error });
  const events = await loadEvents();
  const idx = events.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found.' });
  let keepImages = [];
  try { keepImages = JSON.parse(req.body.keepImages || '[]'); } catch { keepImages = []; }
  const existing = events[idx].images || [];
  const toDelete = existing.filter((f) => !keepImages.includes(f));
  await deleteImages(toDelete);
  const newImages = await saveUploadedImages(req.params.id, req.files || []);
  const finalImages = [...existing.filter((f) => keepImages.includes(f)), ...newImages].slice(0, MAX_IMAGES_PER_EVENT);
  events[idx] = { ...events[idx], ...valid, images: finalImages, updatedAt: new Date().toISOString() };
  await saveEvents(events);
  res.json(events[idx]);
});

app.delete('/api/admin/events/:id', requireAdmin, async (req, res) => {
  const events = await loadEvents();
  const idx = events.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found.' });
  await deleteImages(events[idx].images);
  events.splice(idx, 1);
  await saveEvents(events);
  res.json({ ok: true });
});

app.use((err, _req, res, next) => {
  if (err && (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' || err.message?.includes('images are allowed'))) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// --- Static site -----------------------------------------------------------

app.use('/event-images', express.static(EVENT_IMAGES_DIR, { maxAge: '7d', immutable: true }));
app.use(express.static(OUT_DIR, { extensions: ['html'] }));

app.use((_req, res) => {
  res.status(404).sendFile(path.join(OUT_DIR, '404.html'), (err) => {
    if (err) res.type('text/plain').send('Not found');
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
