# YouTube机器人定时调度器使用说明

## 概述

这个定时调度器可以让YouTube自动化机器人按照预设的时间表自动运行，无需手动启动。支持多种调度模式，包括每日、每小时、每周等。

## 功能特性

- ✅ **多种调度模式**: 支持每日、每小时、每周定时运行
- ✅ **配置文件管理**: 通过JSON配置文件轻松管理调度设置
- ✅ **日志记录**: 详细的运行日志，便于监控和调试
- ✅ **进程管理**: 防止重复运行，确保系统稳定
- ✅ **灵活配置**: 可以启用/禁用特定的调度任务
- ✅ **错误处理**: 完善的错误处理和恢复机制

## 快速开始

### 1. 启动调度器

**方法一：使用批处理文件（推荐）**
```bash
# 双击运行
start_scheduler.bat
```

**方法二：使用PowerShell脚本**
```powershell
# 右键 -> 使用PowerShell运行
.\start_scheduler.ps1
```

**方法三：命令行启动**
```bash
# 激活虚拟环境
.\venv_new\Scripts\Activate.ps1

# 启动调度器
python scheduler.py start
```

### 2. 查看调度计划

```bash
python scheduler.py schedule
```

### 3. 立即运行一次（测试用）

```bash
python scheduler.py run
```

## 配置文件说明

调度器的配置保存在 `scheduler_config.json` 文件中：

### 基本设置

```json
{
    "scheduler_settings": {
        "enabled": true,                    // 是否启用调度器
        "timezone": "Asia/Shanghai",        // 时区设置
        "log_level": "INFO",               // 日志级别
        "max_concurrent_runs": 1,          // 最大并发运行数
        "execution_timeout_minutes": 120   // 执行超时时间（分钟）
    }
}
```

### 调度任务配置

#### 每日定时任务
```json
{
    "name": "morning_run",
    "enabled": true,
    "type": "daily",
    "time": "09:00",
    "description": "每天上午9点运行"
}
```

#### 每小时任务
```json
{
    "name": "hourly_run",
    "enabled": false,
    "type": "hourly",
    "interval": 2,
    "description": "每2小时运行一次"
}
```

#### 每周任务
```json
{
    "name": "weekly_run",
    "enabled": false,
    "type": "weekly",
    "day": "monday",
    "time": "10:00",
    "description": "每周一上午10点运行"
}
```

## 默认调度计划

系统默认配置了以下调度任务：

- 🌅 **上午9点**: 每天上午9点运行
- 🌞 **下午2点**: 每天下午2点运行  
- 🌙 **晚上8点**: 每天晚上8点运行

## 日志文件

调度器会生成以下日志文件：

- `scheduler.log`: 调度器运行日志
- `youtube_bot.log`: 机器人执行日志

## 常用操作

### 修改调度时间

1. 编辑 `scheduler_config.json` 文件
2. 修改对应任务的 `time` 字段
3. 重启调度器

### 添加新的调度任务

在 `scheduler_config.json` 的 `schedules` 数组中添加新任务：

```json
{
    "name": "custom_run",
    "enabled": true,
    "type": "daily",
    "time": "12:00",
    "description": "自定义中午12点运行"
}
```

### 禁用特定任务

将任务的 `enabled` 字段设置为 `false`：

```json
{
    "name": "evening_run",
    "enabled": false,
    "type": "daily",
    "time": "20:00",
    "description": "每天晚上8点运行（已禁用）"
}
```

### 临时禁用所有调度

在 `scheduler_settings` 中设置：

```json
{
    "scheduler_settings": {
        "enabled": false
    }
}
```

## 故障排除

### 调度器无法启动

1. **检查虚拟环境**:
   ```bash
   .\venv_new\Scripts\Activate.ps1
   pip list | findstr schedule
   ```

2. **检查配置文件**:
   - 确保 `scheduler_config.json` 格式正确
   - 使用JSON验证工具检查语法

3. **查看日志**:
   ```bash
   type scheduler.log
   ```

### 任务没有按时执行

1. **检查系统时间**: 确保系统时间正确
2. **查看调度状态**: `python scheduler.py schedule`
3. **检查日志**: 查看 `scheduler.log` 中的错误信息

### 机器人执行失败

1. **手动测试**: `python scheduler.py run`
2. **检查依赖**: 确保所有依赖包已安装
3. **查看机器人日志**: `type youtube_bot.log`

## 高级配置

### 设置执行超时

```json
{
    "scheduler_settings": {
        "execution_timeout_minutes": 180  // 3小时超时
    }
}
```

### 防止并发运行

```json
{
    "scheduler_settings": {
        "max_concurrent_runs": 1  // 同时只允许一个实例运行
    }
}
```

## 注意事项

1. **系统要求**: 确保计算机在调度时间处于开机状态
2. **网络连接**: 确保网络连接稳定
3. **资源占用**: 长时间运行可能占用系统资源
4. **合规使用**: 遵守YouTube使用条款和相关法律法规
5. **定期维护**: 定期检查日志文件，清理过期日志

## 命令参考

```bash
# 启动调度器（持续运行）
python scheduler.py start

# 显示调度计划
python scheduler.py schedule

# 立即运行一次
python scheduler.py run

# 显示帮助信息
python scheduler.py
```

## 更新日志

- **v1.0.0**: 初始版本，支持基本的定时调度功能
- 支持每日、每小时、每周调度模式
- 配置文件管理
- 完善的日志记录
- 错误处理和恢复机制

---

如有问题或建议，请查看日志文件或联系技术支持。