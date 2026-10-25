@echo off
cd /d "%~dp0"
echo ========================================================
echo   Starting Azimxon Portfolio ^& Telegram Contact Server
echo ========================================================
echo.

if exist .venv\Scripts\python.exe (
    set "PY_EXE=.venv\Scripts\python.exe"
) else if exist "..\portfoli bot\.venv\Scripts\python.exe" (
    set "PY_EXE=..\portfoli bot\.venv\Scripts\python.exe"
) else if exist "%LocalAppData%\Python\pythoncore-3.15-64\python.exe" (
    set "PY_EXE=%LocalAppData%\Python\pythoncore-3.15-64\python.exe"
) else (
    set "PY_EXE=python"
)

echo Using Python: %PY_EXE%
echo Server URL: http://localhost:8000
echo.
%PY_EXE% run.py
pause
