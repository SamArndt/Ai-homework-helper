# Create ai_homework_helper database. Prompts for MySQL root password.
# Run from repo root: .\api-server\scripts\create_mysql_db.ps1
# Optional: set $env:MYSQL_EXE to your mysql.exe path (e.g. "C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe")

$mysqlExe = $env:MYSQL_EXE
if (-not $mysqlExe -or -not (Test-Path $mysqlExe)) {
    $mysqlExe = "C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe"
}
if (-not (Test-Path $mysqlExe)) {
    $mysqlExe = "mysql.exe"  # fallback if on PATH
}

$password = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR) | Out-Null

$query = "CREATE DATABASE IF NOT EXISTS ai_homework_helper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
& $mysqlExe -u root "-p$plainPassword" -e $query
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database ai_homework_helper created (or already exists)." -ForegroundColor Green
} else {
    Write-Host "Failed. Check your password and that MySQL is running." -ForegroundColor Red
}
