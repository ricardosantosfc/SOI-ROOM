The app's source code is contained in this directory.

## Install dependencies

To install project dependecies, run:

```bash
npm install
```
## Before running/building
The app is currently configured to access images and audio from a source provided via a Vite environment variable, `VITE_MEDIA_SRC`; without it the app will not load correctly.

This variable must thus be defined before running/building, through a `.env` file (not included in this repo) for local development, and/or configured directly in the production environment at build time: 

```bash
#.env (local file)
VITE_MEDIA_SRC = path_to_files
```


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
