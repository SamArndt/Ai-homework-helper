# Welcome to the AI Homework Helper application

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- **Python 3.10+**

- **TODO**
  - **MySQL Server** (Ensure it is running)
  - **mysqlclient dependencies** (System-level libraries)
  - _Ubuntu/Debian:_ `sudo apt install python3-dev default-libmysqlclient-dev build-essential`
  - _macOS:_ `brew install mysql-client`

### Installation & Setup

1. **Create and activate a virtual environment**

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: venv\Scripts\activate

   ```

1. **Install dependencies**

   ```bash
   pip install -r requirements.txt

   ```

1. Database Configuration
1. Create a MySQL database:

   ```sql
   CREATE DATABASE your_db_name CHARACTER SET utf8mb4;

   ```

1. Create a .env file in the project root and add your credentials:

   ```env
   DB_NAME=your_db_name
   DB_USER=your_mysql_user
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306

   ```

1. Run migrations:

````bash
python manage.py migrate
1. Start the Development Server
```bash
python manage.py runserver
1.  Visit the app at http://localhost:8000/

### Project Structure
* requirements/: Modular dependency files (base.txt, dev.txt, prod.txt).
* apps/: Main application logic.
* static/: CSS, JavaScript, and images.

### Running Tests
To run the automated test suite:
```bash
pytest  # Or python manage.py test
````
