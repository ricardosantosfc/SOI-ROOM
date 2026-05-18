The app is contained in this directory.

## Install dependencies

To install project dependecies, run:

```bash
npm install
```
## Before running
The app is currently configured to access images and audio from a source path defined in a Vite environment variable, `VITE_MEDIA_SRC`; without it the app will not load correctly.

This variable must therefore be defined in a local `.env` file (not included in this repo) before starting a local development server:
```bash
#.env (local file)
VITE_MEDIA_SRC = your_source_path
```
It must also be configured manually in the production environment.

Likewise, the data structures defined in `src/data/BookData.tsx` and `src/data/RadioData.tsx` must also point to accessible resources.


## Development server

To start a local development server, run:

```bash
npm run dev
```


## Building

To create a production build run:

```bash
npm run build
```

This will create a `dist/` directory with the built app.
