# Dashboard (React frontend)

All UI for Ai Homework Helper. Login, signup, dashboard, and any new screens live here. It talks to the Django API only (no server-rendered pages from Django).

## Run locally

From repo root:

```bash
npm start
```

Or from this folder:

```bash
npm run dev
```

Then open **http://localhost:5173**.

**Requirement:** The Django API must be running on **http://127.0.0.1:8000**. Vite proxies `/api` to that server, so login/signup and other API calls only work when both are running.

## Structure

- **Components:** `src/*.jsx` (e.g. `Login.jsx`, `Signup.jsx`, `Dashboard.jsx`).
- **Styling:** Use a `.css` file per feature (e.g. `Auth.css`) and import it in the component. Keep all styling in this app.
- **API calls:** Use `axios` or `fetch` to `/api/v1/...`. The dev server proxies `/api` to Django. Send `Authorization: Token <token>` for protected endpoints.
- **Routes:** Defined in `App.jsx`. Add new routes and links as you add features.

## Scripts

- `npm run dev` — Start Vite dev server (with proxy).
- `npm run build` — Production build.
- `npm run preview` — Preview production build locally.
