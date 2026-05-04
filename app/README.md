The app's source code is contained in this directory.

## Install dependencies

To install project dependecies, run:

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
npm run dev
```
The app fetches images and audio from a restricted Cloudflare Worker, so to run it locally the following variables must first be updated to point to accessible resources:

- `textureSrc` in `/components/Book.tsx`
- `radioSrc` in `/overlays/OverlayInteraction2.tsx`



## Building

To create a production build run:

```bash
npm run build
```

This will create a `dist/` directory with the built app.
