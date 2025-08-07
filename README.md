# 项目说明

这是一个YouTube Shorts自动化浏览工具。它可以模拟真实用户行为，自动观看、点赞和订阅视频。

## 环境配置
1. 创建虚拟环境
```bash
python -m venv venv
```

2. 激活虚拟环境
- Windows:
```bash
.\venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

## 功能特点
- 多窗口并行操作
- 自动观看视频
- 智能点赞互动
- 智能订阅频道
- 随机等待时间
- 详细的操作日志
- 可配置的窗口大小

## 配置说明
配置文件 `config.json` 包含以下设置：

```json
{
    "windows": [  // 浏览器窗口配置
        {
            "browser_id": "浏览器ID"  // 每个窗口的唯一标识
        }
    ],
    "settings": {
        "window_width": 400,        // 窗口宽度（像素）
        "window_height": 600,       // 窗口高度（像素）
        "watch_time_min": 5,        // 最短观看时间（秒）
        "watch_time_max": 30,       // 最长观看时间（秒）
        "like_probability": 0.3,    // 点赞概率
        "subscribe_probability": 0.2,// 订阅概率
        "scroll_count": 50          // 观看视频数量
    }
}
```

### 窗口大小设置
- `window_width`: 设置浏览器窗口和视口的宽度
- `window_height`: 设置浏览器窗口和视口的高度
- 建议设置合适的窗口大小以获得最佳的Shorts观看体验
- 推荐尺寸：
  * 手机视图：400x600
  * 平板视图：600x800
  * 桌面视图：800x1000

## 运行说明
确保虚拟环境已激活后，直接运行：
```bash
python main.py
```

## 运行日志
程序运行日志保存在 `youtube_bot.log` 文件中，包含：
- 窗口打开/关闭状态
- 视频观看记录
- 互动操作结果
- 错误信息
- 统计数据

## 注意事项
- 确保网络连接稳定
- 适当调整互动概率，避免操作过于频繁
- 定期检查日志文件了解运行状态
- 遵守 YouTube 使用条款和政策
- 根据实际需求调整窗口大小配置