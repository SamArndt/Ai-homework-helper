# Project Ai homework helper

This repository contains a unified ecosystem for our platform, consisting of a Django-powered backend and a React-based Admin Dashboard.

## Repository Structure

- **`api-server/`**: The core Django 5.x project.
  - _Web Portal_: Server-rendered HTML templates located in `apps/main/templates`.
  - _REST API_: Django Rest Framework (DRF) endpoints located in `apps/main/api`.
- **`dashboard-react/`**: The React frontend (Vite/TS) used for internal administration and complex UI.
- **`docker-compose.yml`**: Orchestration for local development.

---

## Tech Stack

- **Backend:** Python, Django, Django Rest Framework, PostgreSQL
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
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

```bash
cd api-server
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
