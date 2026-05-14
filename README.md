# Church Website

A multilingual Next.js website for a church community, including pages for donations, ministries, gallery, statement of faith, and an imprint (Impressum).

## Project Structure

- `src/app/` - application routes and pages
- `src/components/` - reusable UI components
- `src/context/` - language context and state handling
- `src/lib/` - language utilities and message loading
- `src/messages/` - localized content for English, German, and Amharic
- `public/images/` - image assets used across the site

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Supported Pages

- Home page
- Donate page with payment handling and verification
- Gallery
- Ministries (Children, Youth)
- Statement of Faith
- Impressum
- About page

## Localization

This project supports multiple languages using JSON-based message files in `src/messages/`.

## Deployment

Build the production version with:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

For static hosting or deployment platforms, use the built output from `.next`.

## Environment Variables

The donation flow uses PayPal, so you must configure your environment variables before running the app.

Create a `.env.local` file with at least:

```bash
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret-key
```

If you use a different environment file setup, make sure the values are accessible to your server and client where required.

## Notes

- The app uses the Next.js App Router with `src/app` pages.
- Language selection is managed by `src/context/LanguageContext.jsx` and `src/lib/language.js`.
- Donation and order handling are implemented in API routes under `src/app/api/`.
- PayPal is used for donation processing.
