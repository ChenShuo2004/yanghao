@echo off
chcp 65001 >nul
echo ========================================
echo    YouTube机器人定时调度器
echo ========================================
echo.
echo 正在激活虚拟环境...
call venv_new\Scripts\activate.bat
echo.
echo 启动调度器...
echo 按 Ctrl+C 停止调度器
echo.
python scheduler.py start
echo.
echo 调度器已停止
pause