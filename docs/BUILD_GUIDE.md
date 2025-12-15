# Build Guide

The Whymotrex project ships as a standard Vite web app and as an offline-first Windows desktop executable that bundles the site with Electron. This guide walks through every build target plus troubleshooting tips.

## 1. Prerequisites

- Windows 10/11
- [Node.js 18+](https://nodejs.org/) (includes npm)
- Enough disk space in the repo for the `dist/` (web) and `release/` (desktop) outputs

Install dependencies once after cloning:

```bash
npm install
```

## 2. Web Development Workflow

Start the usual Vite dev server:

```bash
npm run dev
```

Vite hosts the site at http://127.0.0.1:5173. Any changes under `App.tsx`, `components/`, `public/`, etc. hot-reload in the browser.

## 3. Desktop Development Workflow

The repository ships with a lightweight Electron wrapper in `electron/main.cjs`. Use it when validating kiosk/Desktop-specific behaviors.

```bash
npm run desktop:dev
```

What happens:

1. Vite starts on http://127.0.0.1:5173
2. Electron waits for the dev server and then opens a BrowserWindow against it

This gives you the exact UI that will later ship inside the offline executable, but with React/Vite hot-reload.

## 4. Offline Desktop Preview (no dev server)

Build the static assets and point Electron at the generated HTML bundle:

```bash
npm run desktop:preview
```

Steps performed:

1. `npm run build` produces `dist/`
2. Electron launches against `dist/index.html`

Because everything is read directly from disk, this is the quickest way to confirm that assets, fonts, and API fallbacks work without any network access.

## 5. Production Desktop Build (Windows .exe)

Run the packaging script whenever you need an installable `.exe` or a portable binary for distribution:

```bash
npm run desktop:dist
```

This command:

1. Builds the Vite app (`dist/`)
2. Invokes `electron-builder` with the config embedded in `package.json`
3. Outputs signed artifacts under `release/`

Artifacts generated under `release/`:

- `Whymotrex-<version>-x64.exe` – Portable binary that runs immediately from a USB drive
- `Whymotrex-Setup-<version>-x64.exe` – NSIS installer that creates shortcuts/start menu entries

> Tip: bump the `version` field inside `package.json` whenever you need a new installer label.

## 6. Other Useful Scripts

| Command | Description | Output |
|---------|-------------|--------|
| `npm run build` | Standard production web build only | `dist/` |
| `npm run preview` | Serve the production web build on http://127.0.0.1:4173 | n/a |
| `npm run desktop:preview` | Run Electron from the production bundle (offline) | uses `dist/` |
| `npm run desktop:dist` | Produce Windows installer + portable executable | `release/` |

## 7. Project Structure (build-related)

```
whymotrex/
├── electron/
│   ├── main.cjs        # Electron entry that loads Vite output
│   └── preload.cjs     # Placeholder for context-bridge APIs
├── dist/               # Populated by `npm run build`
├── release/            # Populated by `npm run desktop:dist`
├── public/             # Static assets copied into the build
└── package.json        # Scripts + electron-builder config
```

## 8. Troubleshooting

- **Port already in use** – `desktop:dev` expects Vite on port 5173. Override by editing the `dev` script in `package.json` and update the `VITE_DEV_SERVER_URL` inside the script accordingly.
- **Blank Electron window (desktop:preview/dist)** – Make sure `npm run build` succeeded and that `dist/index.html` exists before running Electron. Delete `dist/` if needed and rebuild.
- **Builder fails because files are missing** – Confirm that `electron/main.cjs` and `electron/preload.cjs` exist and that `npm install` completed. The builder only packages the files listed under `"build.files"` in `package.json`.
- **Antivirus flagging the .exe** – Electron/NSIS unsigned binaries are sometimes flagged on first run. Distribute via trusted channels and whitelist the executable if required.

Once these steps complete successfully, you will have a fully offline Windows desktop executable that embeds the Whymotrex web experience.
