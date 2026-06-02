# Render Deployment — Environment Variable Setup

This document lists every environment variable the site reads, what to set it to,
and how to configure it in the Render dashboard.

The deployed repository is `RoTiGe/new-church-code` (the `eec-cologne-static` repo).

---

## How to set env vars on Render

1. Open <https://dashboard.render.com> and sign in.
2. Click the service for `eec-cologne-static`.
3. In the left sidebar, click **Environment**.
4. Under **Environment Variables**, click **Add Environment Variable**.
5. For each row in the tables below, enter the **Key** and **Value**, then click **Save**.
6. After saving all of them, click **Manual Deploy → Clear build cache & deploy**
   so the new values take effect.
7. For sensitive values (passwords, secrets, API keys), click the **Secret** /
   eye-icon toggle next to the value before saving so they are hidden in the UI.

---

## Required — the site will be broken without these

| Key | Value | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | A strong password (16+ random chars) | Used to log into `/admin/login`. **Never use a short or guessable value in production.** |
| `SESSION_SECRET` | A long random string (40+ chars) | Signs the admin session cookie. Generate once and never share. |
| `NODE_ENV` | `production` | Makes session cookies HTTPS-only. |
| `APP_URL` | `https://eec-cologne.com` | Used to build PayPal return URLs. |

### Generating a strong `SESSION_SECRET`

Run this on your local machine and copy the output:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Required for PayPal donations

| Key | Value |
|---|---|
| `PAYPAL_CLIENT_ID` | From PayPal Developer dashboard → My Apps → your live app |
| `PAYPAL_SECRET` | Same app, **Secret** field |
| `PAYPAL_MODE` | `live` (or `sandbox` while testing) |

---

## Required for the contact form (SMTP)

| Key | Value | Notes |
|---|---|---|
| `SMTP_HOST` | e.g. `smtp.gmail.com` or your provider's host | |
| `SMTP_PORT` | `587` (STARTTLS) or `465` (SSL) | Default `587` if unset |
| `SMTP_USER` | The full email address you send from | |
| `SMTP_PASS` | The SMTP password (or app password for Gmail) | |
| `SMTP_SECURE` | `true` for port 465, otherwise leave unset | |
| `CONTACT_TO` | `info@eec-cologne.com,kontakt@eec-cologne.com` | Optional — already the default |
| `CONTACT_FROM` | Display address shown to recipients | Optional — defaults to `SMTP_USER` |

---

## Recommended

| Key | Value | Why |
|---|---|---|
| `NODE_VERSION` | `22` | Pins Node so Render can't silently upgrade and break the build |
| `DATA_DIR` | e.g. `/var/data` | **Only set this if you attach a Render persistent disk** (see below) |

---

## Automatic — do NOT add these

- `PORT` — Render injects this automatically; the server already reads it.

---

## ⚠️ Important: persistent storage on Render

By default Render's filesystem is **ephemeral**. Every time the service redeploys
or restarts, these folders are wiped:

- `data/events.json` (all admin-posted events)
- `data/event-images/` (uploaded event photos)
- `data/gallery-uploads/<year>/` (admin-uploaded gallery photos)
- `data/gallery-meta.json` (gallery captions)

To keep this data between deploys you must either:

1. **Attach a Render persistent disk** (≈ $1/month per GB):
   - Render dashboard → your service → **Disks** → **Add Disk**
   - Mount path: `/var/data` · size: `1 GB` is plenty
   - Then set the env var `DATA_DIR=/var/data`
   - Redeploy

2. Or move events to a hosted database and images to object storage (S3 etc.).
   This requires code changes — ask before going this route.

Until one of these is done, **assume any event you post or gallery photo
you upload may disappear at the next deploy.**

---

## After saving env vars

1. Render will trigger an automatic redeploy. If not, click **Manual Deploy**.
2. Visit <https://eec-cologne.com/admin/login/> and log in with `ADMIN_PASSWORD`.
3. If the login endpoint returns HTTP 500, that almost always means
   `ADMIN_PASSWORD` or `SESSION_SECRET` is missing or empty.
4. Visit <https://eec-cologne.com/contact/> and send a test message to confirm SMTP.
5. Make a small test donation through <https://eec-cologne.com/donate/> in
   sandbox mode to confirm PayPal credentials.

---

## Quick reference: full list of env vars

```
ADMIN_PASSWORD         (secret, required)
SESSION_SECRET         (secret, required)
NODE_ENV=production    (required)
APP_URL                (required)

PAYPAL_CLIENT_ID       (required for donations)
PAYPAL_SECRET          (secret, required for donations)
PAYPAL_MODE=live       (or sandbox)

SMTP_HOST              (required for contact form)
SMTP_PORT=587
SMTP_USER              (required for contact form)
SMTP_PASS              (secret, required for contact form)
SMTP_SECURE            (optional)
CONTACT_TO             (optional)
CONTACT_FROM           (optional)

NODE_VERSION=22        (recommended)
DATA_DIR=/var/data     (only with persistent disk)
```
