# CRM Frontend

This is the Vite + React frontend for the CRM dashboard experience.

## Local development

1. Start the backend API (defaults to `http://localhost:3000`):

```bash
npm run dev
```

2. Start the frontend:

```bash
npm install
npm run dev
```

The dev server listens on `http://localhost:4173` by default.

### API configuration

The frontend uses Vite's dev proxy to forward `/api/*` requests to the backend at
`http://localhost:3000`. To target a different backend, set:

```bash
VITE_API_TARGET="http://localhost:3000"
```

If you deploy the frontend separately, you can also set:

```bash
VITE_API_BASE="https://your-api.example.com"
```

## Deploy (Vercel)

1. In Vercel, import the repository.
2. Set the **Root Directory** to `frontend`.
3. Use the default Vercel settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy.

`vercel.json` is included to enforce the root and build output.

## Deploy (Netlify)

1. In Netlify, create a new site from the repository.
2. Set the **Base directory** to `frontend`.
3. Use the defaults:
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Deploy.

`netlify.toml` is included so Netlify can auto-detect these settings.
