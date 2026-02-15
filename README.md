# Project Ai homework helper

This repository contains a unified ecosystem: a **React frontend** (all UI) and a **Django backend** (API only).

## Architecture

- **React app** (`dashboard-react/`) — **The entire frontend.** Login, signup, dashboard, and all UI live here. It runs at http://localhost:5173 and talks to Django only via API requests (proxied to http://127.0.0.1:8000/api/v1/).
- **Django** (`api-server/`) — **API only.** No server-rendered login/signup pages. It provides REST endpoints (e.g. `/api/v1/login/`, `/api/v1/signup/`) and Django admin at `/admin/`.

## Repository Structure

- **`api-server/`**: Django 5.x API (DRF). Auth endpoints under `apps/users`; no HTML frontend.
- **`dashboard-react/`**: React (Vite) app — all frontend: login, signup, dashboard, routing.

---

## Workflow for the team

Follow this order so the backend and frontend stay in sync and the repo structure stays consistent.

1. **Backend first (Python / Django)**  
   In `api-server/`:
   - Add or change **models** in the right app (e.g. `apps/users/models.py`).
   - Run **migrations**: `python manage.py makemigrations` then `python manage.py migrate`.
   - Add **serializers** and **views** (DRF) for the new or updated resources.
   - Register **URLs** under `api/v1/` (e.g. in `apps/users/urls.py` and `config/urls.py`).
   - Test the endpoints (browser, Postman, or curl). The backend is **API only** — no HTML or styling here.

2. **Frontend next (React)**  
   In `dashboard-react/`:
   - **Create a React component** (e.g. `src/SomeFeature.jsx`) that will call the Django API.
   - **Add a dedicated styling file** for that component (e.g. `SomeFeature.css` or `SomeFeature.module.css`) and import it in the component. Keep **all styling in the frontend** (CSS or JS-based), not in Django.
   - Use **axios** (or fetch) to call `http://localhost:5173/api/...` (Vite proxies to the Django server). Send the auth token in the `Authorization` header when needed.
   - Add the **route** in `App.jsx` (and a link in the nav if needed).

3. **Conventions**  
   - **Styling lives in the React app** — use `.css` files (or CSS-in-JS) next to or near the component. Do not add UI styling in the Django project.
   - **Backend = data and logic** (Django). **Frontend = UI and styling** (React). Keep this split so the Django backend stays a clean API and the React app owns the look and feel.

---

## Tech Stack

- **Backend:** Python, Django, Django Rest Framework, MySQL
- **Frontend:** React, Vite (all UI; API requests to Django)
- **DevOps:** Docker, GitHub Actions

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional but recommended)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com
   cd where ever you cloned the repo
   ```

#### 1. Backend (Django)

The backend uses **MySQL**. For full step-by-step setup (venv, database, `.env`, migrations), see **[api-server/README.md](api-server/README.md)**.

Short version:

- From `api-server/`: create venv, activate it, `pip install -r requirements.txt`
- Create the MySQL database and set `.env` (see **Step 3** in [api-server/README.md](api-server/README.md))
- `python manage.py migrate` then `python manage.py runserver`

#### 2. Frontend (React dashboard)

From the repo root:

```bash
npm start
# or
cd dashboard-react && npm run dev
```

Then open the URL shown (e.g. http://localhost:5173).

**Notes:**
- Run the **Django server first** (port 8000), then the React app (port 5173). The React app proxies `/api` to Django, so both must be running for login/signup to work.
- Always run `npm start` from **this repo's root** (`Ai-homework-helper`). If you run it from a parent folder that has another `package.json` (e.g. an Expo app), npm may use that project instead and you can get the wrong app or Metro permission errors.

---

## What to watch for

- **Backend:** Full backend setup (MySQL, `.env`, migrations) is in [api-server/README.md](api-server/README.md). Don't skip the database step.
- **Frontend:** All UI and styling live in `dashboard-react/`. Use a separate `.css` (or module) per feature; call the API at `/api/...` (Vite proxies to Django).
- **Secrets:** Never commit `.env`. It's in `.gitignore`. Use `.env.example` as a template.
- **Clone URL:** Replace the placeholder `git clone` URL with your real repo URL when you share the project.
