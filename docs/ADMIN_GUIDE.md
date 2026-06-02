# Website Administration Guide

This guide explains how to administer **eec-cologne.com** — primarily the
events system and basic operational tasks.

---

## 1. Logging in

1. Open <https://eec-cologne.com/admin/login/> in any modern browser.
2. Enter the admin password (the value of `ADMIN_PASSWORD` set on Render).
3. Click **Sign in**.

> The username field, if shown, is not validated by the server — only the
> password matters.

After successful login you are taken to the events manager at
`/admin/events/`. A session cookie keeps you logged in until you click
**Log out** or close the browser.

### Wrong password
- After 5 failed attempts from the same IP within 15 minutes, further
  attempts are blocked for a short time. Wait and try again with the
  correct password.

### Forgot the password
- Only the person with access to the Render dashboard can change it.
  Update the `ADMIN_PASSWORD` env var on Render and trigger a redeploy.

---

## 2. Posting an event

On `/admin/events/`:

1. Click **+ New event** at the top of the page (or scroll to the form).
2. Fill in the fields:

   | Field | Required | Notes |
   |---|---|---|
   | Event Date | ✅ | Date picker. Events past this date auto-hide from the public `/events/` page. |
   | Event Time | optional | Free text, e.g. `18:00 – 20:00` |
   | Location | optional | Free text, e.g. `Regentenstraße 78-80, Köln` |
   | Title — English | ✅ | Shown as the card heading |
   | Description — English | ✅ | Body text |
   | Title — German | optional | Falls back to English if blank |
   | Description — German | optional | Falls back to English if blank |
   | Title — Amharic | optional | Falls back to English if blank |
   | Description — Amharic | optional | Falls back to English if blank |
   | Images | optional | Up to 5 files, JPEG/PNG/WEBP, max 5 MB each |

3. Click **Save**. The event appears on `/events/` immediately.

### Rules and limits
- Maximum **5 active events** at any time. Delete an old one before adding
  a 6th, or wait until the oldest expires automatically.
- Events whose date is in the past are **hidden from the public page**
  but remain visible in the admin list (so you can delete them).
- The **first uploaded image** becomes the cover image shown on the
  events card. Additional images appear as thumbnails below the
  description.

---

## 3. Editing an event

1. On `/admin/events/`, find the event in the list.
2. Click the **pencil / Edit** icon next to it.
3. Update any field. Existing images stay unless you replace them.
4. Click **Save**.

---

## 4. Deleting an event

1. Click the **trash / Delete** icon next to the event.
2. Confirm in the popup.
3. The event and all its images are removed.

---

## 5. Logging out

Click **Log out** at the top of `/admin/events/`. The session cookie is
cleared and you must enter the password again to return.

For safety, always log out when you finish — especially on shared or
public computers.

---

## 6. Where data lives

| What | Location on the server | Backup needed? |
|---|---|---|
| Event text (title, date, etc.) | `data/events.json` | ✅ yes |
| Uploaded event images | `data/event-images/` | ✅ yes |
| Admin-uploaded gallery photos | `data/gallery-uploads/<year>/` | ✅ yes |
| Gallery captions (admin comments) | `data/gallery-meta.json` | ✅ yes |
| Photo gallery (repo-committed) | `public/gallery/<year>/` | only updated by developer commits |

**⚠️ Important if you are on Render without a persistent disk:** the
`data/` folder is wiped on every redeploy. See `docs/RENDER_SETUP.md`
for the persistent-disk setup. This wipes admin-uploaded gallery
photos and all captions too.

---

## 7. Managing the photo gallery

Open <https://eec-cologne.com/admin/gallery/> (use the **Gallery** tab in
the admin top nav after logging in).

### Uploading photos
1. In the **Upload new photos** form, pick a **Year** (defaults to the
   current year). This becomes the year-tab on the public gallery.
2. Click **Choose Files** and select one or more images
   (JPEG / PNG / WEBP, max 5 MB each, up to 20 per upload).
3. Optionally type a **comment / caption**. If filled in, it is applied
   to every photo in this batch. You can edit captions individually
   afterwards.
4. Click **Upload**. The photos appear immediately under
   **Existing photos** and on the public `/gallery/` page.

### Captions
- Each photo has a caption box. Edit it and click **Save caption**.
- Captions are shown under the photo when a visitor clicks it on the
  public gallery (in the lightbox).
- Leave the caption empty to remove it.

### Deleting photos
- Only photos marked **Uploaded** (yellow badge) can be deleted from the
  admin panel. Click **Delete** and confirm.
- Photos marked **Committed** (dark badge) are stored in the source
  repository (`public/gallery/<year>/`) and must be removed by a
  developer via a git commit. You can still set/edit their captions.

### Year filter
Use the **Year** dropdown above the photo grid to narrow the list to a
single year.

---

## 8. Password rotation (recommended every 6 months)

1. Open Render dashboard → service → **Environment**.
2. Edit `ADMIN_PASSWORD` to a new strong value (16+ random chars).
3. Save — Render will redeploy automatically.
4. Tell anyone else who logs in what the new password is.

---

## 9. Troubleshooting quick reference

| Symptom | Likely cause | Fix |
|---|---|---|
| `/admin/login/` returns HTTP 500 | `ADMIN_PASSWORD` or `SESSION_SECRET` env var missing | Check Render env vars |
| Login keeps failing | Wrong password, or rate-limit triggered | Wait 15 min, double-check password |
| Posted event vanished after a few days | Render filesystem wiped on redeploy | Attach a persistent disk |
| Uploaded gallery photo vanished | Same as above — `data/gallery-uploads/` is on the ephemeral disk | Attach a persistent disk |
| "Only uploaded gallery images can be deleted" | Tried to delete a committed photo | Ask the developer to remove it from `public/gallery/` |
| Image upload fails | File over 5 MB, or wrong format | Use JPEG/PNG/WEBP under 5 MB |
| Contact form doesn't send mail | SMTP env vars missing/wrong on Render | Check `SMTP_*` vars |
| Donations don't work | PayPal env vars missing or in sandbox mode | Check `PAYPAL_*` vars |

---

## 10. Getting help

For anything outside this guide (design tweaks, new pages, gallery
uploads, password resets when locked out, deployment issues), contact
the developer who maintains the repositories:

- Source repo: <https://github.com/RoTiGe/Church_Website>
- Deploy repo: <https://github.com/RoTiGe/new-church-code>
