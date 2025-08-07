# YouTube机器人定时调度器启动脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    YouTube机器人定时调度器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查虚拟环境是否存在
if (Test-Path "venv_new\Scripts\Activate.ps1") {
    Write-Host "正在激活虚拟环境..." -ForegroundColor Yellow
    & .\venv_new\Scripts\Activate.ps1
    
    Write-Host ""
    Write-Host "启动调度器..." -ForegroundColor Green
    Write-Host "按 Ctrl+C 停止调度器" -ForegroundColor Yellow
    Write-Host ""
    
    try {
        python scheduler.py start
    }
    catch {
        Write-Host "启动调度器时出错: $_" -ForegroundColor Red
    }
    finally {
        Write-Host ""
        Write-Host "调度器已停止" -ForegroundColor Yellow
    }
}
else {
    Write-Host "错误: 未找到虚拟环境 venv_new" -ForegroundColor Red
    Write-Host "请确保已正确设置虚拟环境" -ForegroundColor Red
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")