@echo off

set SCRIPT_DIR=%~dp0
set SOLUTION_DIR=%SCRIPT_DIR%..\Solution
set TEMP_DIR=%SCRIPT_DIR%..\Temp

if not exist "%TEMP_DIR%" (
    mkdir "%TEMP_DIR%"
)

python "%SCRIPT_DIR%cli.py" generate ^
    --solution-path "%SOLUTION_DIR%" ^
    --log-file-path "%TEMP_DIR%"

pause