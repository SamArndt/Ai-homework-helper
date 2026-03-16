# API server (Django)

Django 5.x backend — **API only** (no HTML frontend). Custom User model (email, role, image, email_verified). Uses MySQL.

**Database setup:** For step-by-step instructions on creating the MySQL database and configuring credentials, see **Step 3: Set up MySQL** below.

---

## Prerequisites

- Python 3.11+
- MySQL 8+

---

## Step 1: Create a virtual environment

From the `api-server` directory:

```bash
python -m venv venv
```

Activate it:

- **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
- **Windows (Cmd):** `venv\Scripts\activate.bat`
- **macOS/Linux:** `source venv/bin/activate`

---

## Step 2: Install dependencies

With the virtual environment active:

```bash
pip install -r requirements.txt
```

---

## Step 3: Set up MySQL

**Step 3a. Create the database**

Create the `ai_homework_helper` database in MySQL.

- **Bash / Cmd:**

  ```bash
  mysql -u root -p < scripts/create_mysql_db.sql
  ```

- **PowerShell:** (from repo root or `api-server`)

  ```powershell
  Get-Content scripts\create_mysql_db.sql | mysql -u root -p
  ```

  Or use the helper script (prompts for password):

  ```powershell
  .\scripts\create_mysql_db.ps1
  ```

**Step 3b. Configure environment variables**

1. Copy the example env file:

   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and set:

   ```env
   DB_ENGINE=mysql
   MYSQL_DATABASE=ai_homework_helper
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_HOST=127.0.0.1
   MYSQL_PORT=3306
   ```

   Replace `your_mysql_password` with your MySQL root (or app) password.

---

## Step 4: Run migrations

With the venv active and `.env` configured:

```bash
python manage.py migrate
```

This creates or updates all tables (auth, users, sessions, etc.).

---

## Step 5: (Optional) Create a superuser

To use Django admin and create users via the backend:

```bash
python manage.py createsuperuser
```

Use your **email** (no username) and a password.

---

## Step 6: Start the server

```bash
python manage.py runserver
```

- API base: **http://127.0.0.1:8000/api/v1/**
- Root: **http://127.0.0.1:8000/** (JSON info only)
- Admin: **http://127.0.0.1:8000/admin/** (if you created a superuser)

The React frontend (e.g. http://localhost:5173) should proxy `/api` requests to this server.

---

## API endpoints

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | `/api/v1/login/`   | Get auth token     |
| POST   | `/api/v1/signup/`  | Register user      |

Send `Authorization: Token <token>` for authenticated requests.
