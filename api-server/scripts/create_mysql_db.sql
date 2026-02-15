-- Create MySQL database for Django (Ai homework helper).
-- Run as a user with CREATE DATABASE permission.
--
-- Bash / Cmd:
--   mysql -u root -p < scripts/create_mysql_db.sql
--
-- PowerShell (from repo root):
--   Get-Content api-server\scripts\create_mysql_db.sql | mysql -u root -p
-- Or one-liner:
--   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ai_homework_helper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

CREATE DATABASE IF NOT EXISTS ai_homework_helper
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Optional: create a dedicated user (replace PASSWORD with a strong password)
-- CREATE USER IF NOT EXISTS 'ai_homework'@'localhost' IDENTIFIED BY 'PASSWORD';
-- GRANT ALL PRIVILEGES ON ai_homework_helper.* TO 'ai_homework'@'localhost';
-- FLUSH PRIVILEGES;
