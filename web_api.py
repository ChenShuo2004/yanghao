from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import asyncio
import json
import threading
import time
from datetime import datetime
import logging
from window_manager import WindowManager
from youtube_bot import YouTubeBot
from bit_api import openBrowser, arrangeWindows, check_api_server, createBrowser
import sys
from io import StringIO

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 全局变量
bot_status = {
    'running': False,
    'windows': {},
    'logs': [],
    'start_time': None,
    'stats': {
        'videos_watched': 0,
        'likes_given': 0,
        'subscriptions': 0,
        'runtime': 0
    }
}

window_manager = None
bot_thread = None

# 配置日志捕获
class LogCapture:
    def __init__(self):
        self.logs = []
        
    def write(self, message):
        if message.strip():
            timestamp = datetime.now().strftime('%H:%M:%S')
            self.logs.append(f"[{timestamp}] {message.strip()}")
            # 只保留最近100条日志
            if len(self.logs) > 100:
                self.logs = self.logs[-100:]
                
    def flush(self):
        pass
        
    def get_logs(self):
        return self.logs.copy()

log_capture = LogCapture()

@app.route('/', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'success': True,
        'message': 'Web API服务器运行正常',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    """获取机器人状态"""
    if bot_status['start_time']:
        bot_status['stats']['runtime'] = int(time.time() - bot_status['start_time'])
    
    return jsonify({
        'success': True,
        'data': {
            'running': bot_status['running'],
            'windows': bot_status['windows'],
            'stats': bot_status['stats'],
            'logs': log_capture.get_logs()[-20:]  # 返回最近20条日志
        }
    })

@app.route('/api/start', methods=['POST'])
def start_bot():
    """启动机器人"""
    global bot_thread, window_manager
    
    if bot_status['running']:
        return jsonify({
            'success': False,
            'message': '机器人已在运行中'
        })
    
    try:
        # 获取配置
        config_data = request.json
        if not config_data:
            return jsonify({
                'success': False,
                'message': '请提供配置数据'
            })
        
        # 保存配置到文件
        with open('config.json', 'w', encoding='utf-8') as f:
            json.dump(config_data, f, indent=2, ensure_ascii=False)
        
        # 重置状态
        bot_status['running'] = True
        bot_status['start_time'] = time.time()
        bot_status['windows'] = {}
        bot_status['stats'] = {
            'videos_watched': 0,
            'likes_given': 0,
            'subscriptions': 0,
            'runtime': 0
        }
        log_capture.logs.clear()
        
        # 启动机器人线程
        bot_thread = threading.Thread(target=run_bot_async, args=(config_data,))
        bot_thread.daemon = True
        bot_thread.start()
        
        return jsonify({
            'success': True,
            'message': '机器人启动成功'
        })
        
    except Exception as e:
        bot_status['running'] = False
        return jsonify({
            'success': False,
            'message': f'启动失败: {str(e)}'
        })

@app.route('/api/stop', methods=['POST'])
def stop_bot():
    """停止机器人"""
    global window_manager
    
    try:
        bot_status['running'] = False
        
        # 关闭所有窗口
        if window_manager:
            for browser_id in bot_status['windows']:
                try:
                    # 这里可以添加关闭浏览器的逻辑
                    pass
                except:
                    pass
        
        bot_status['windows'] = {}
        log_capture.logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] 机器人已停止")
        
        return jsonify({
            'success': True,
            'message': '机器人已停止'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'停止失败: {str(e)}'
        })

@app.route('/api/check-browser', methods=['GET'])
def check_browser_api():
    """检查比特浏览器API是否可用"""
    try:
        api_available = check_api_server()
        return jsonify({
            'success': True,
            'available': api_available,
            'message': '比特浏览器API可用' if api_available else '比特浏览器API不可用，请确保比特浏览器已启动'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'available': False,
            'message': f'检查失败: {str(e)}'
        })

@app.route('/api/create-browser', methods=['POST'])
def create_browser_api():
    """创建新的浏览器实例"""
    try:
        browser_id = createBrowser()
        if browser_id:
            return jsonify({
                'success': True,
                'browser_id': browser_id,
                'message': f'成功创建浏览器实例: {browser_id}'
            })
        else:
            return jsonify({
                'success': False,
                'message': '创建浏览器实例失败'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'创建失败: {str(e)}'
        })

def run_bot_async(config):
    """异步运行机器人"""
    try:
        # 重定向输出到日志捕获
        old_stdout = sys.stdout
        sys.stdout = log_capture
        
        asyncio.run(run_bot_main(config))
        
    except Exception as e:
        log_capture.write(f"机器人运行出错: {str(e)}")
        bot_status['running'] = False
    finally:
        sys.stdout = old_stdout
        bot_status['running'] = False

async def run_bot_main(config):
    """机器人主要运行逻辑"""
    global window_manager
    
    try:
        log_capture.write("机器人开始运行...")
        
        # 初始化窗口管理器
        window_manager = WindowManager()
        
        # 获取窗口ID列表
        if 'windows' in config:
            window_ids = [window['browser_id'] for window in config['windows']]
        elif 'browser_ids' in config:
            window_ids = config['browser_ids']
        else:
            log_capture.write("配置中未找到浏览器ID")
            return
        log_capture.write(f"获取到的窗口ID: {window_ids}")
        
        # 检查API可用性
        api_available = check_api_server()
        log_capture.write(f"比特浏览器API可用: {api_available}")
        
        if not api_available:
            log_capture.write("比特浏览器API不可用，请确保比特浏览器已启动")
            return
        
        # 打开所有窗口
        log_capture.write("正在打开浏览器窗口...")
        open_tasks = []
        for browser_id in window_ids:
            if bot_status['running']:  # 检查是否仍在运行
                open_tasks.append(
                    asyncio.create_task(open_browser_web(browser_id, window_manager))
                )
        
        if open_tasks:
            await asyncio.gather(*open_tasks)
            log_capture.write("所有窗口已打开")
            
            # 等待窗口完全打开
            await asyncio.sleep(5)
            
            # 自动排列窗口
            arrange_result = arrangeWindows()
            if arrange_result:
                log_capture.write("窗口排列成功")
            
            # 运行机器人
            bot_tasks = []
            for browser_id, window_info in window_manager.windows.items():
                if bot_status['running'] and 'ws' in window_info:
                    bot_tasks.append(
                        asyncio.create_task(
                            init_and_run_bot_web(browser_id, window_info['ws'], config)
                        )
                    )
            
            if bot_tasks:
                await asyncio.gather(*bot_tasks, return_exceptions=True)
        
    except Exception as e:
        log_capture.write(f"运行出错: {str(e)}")
        bot_status['running'] = False

async def open_browser_web(browser_id, window_manager):
    """打开浏览器窗口"""
    try:
        if not browser_id:
            log_capture.write("浏览器ID为空，尝试创建新实例...")
            new_browser_id = createBrowser()
            if new_browser_id:
                browser_id = new_browser_id
                log_capture.write(f"成功创建新浏览器实例: {browser_id}")
            else:
                log_capture.write("创建新浏览器实例失败")
                return
        
        res = openBrowser(browser_id)
        if res and 'data' in res and 'ws' in res['data']:
            ws_endpoint = res['data']['ws']
            window_manager.windows[browser_id] = {
                'ws': ws_endpoint,
                'status': 'opened'
            }
            bot_status['windows'][browser_id] = {
                'status': 'opened',
                'ws': ws_endpoint
            }
            log_capture.write(f"成功打开窗口: {browser_id}")
        else:
            log_capture.write(f"打开窗口失败: {browser_id}")
            
    except Exception as e:
        log_capture.write(f"打开窗口出错 {browser_id}: {str(e)}")

async def init_and_run_bot_web(browser_id, ws_endpoint, config):
    """初始化并运行机器人"""
    try:
        log_capture.write(f"正在为窗口 {browser_id} 初始化机器人...")
        
        bot = YouTubeBot(browser_id, ws_endpoint)
        await bot.init()
        
        bot_status['windows'][browser_id]['status'] = 'running'
        log_capture.write(f"窗口 {browser_id} 机器人开始运行")
        
        # 运行机器人
        await bot.watch_shorts(config)
        
        # 更新统计信息
        if hasattr(bot, 'stats'):
            bot_status['stats']['videos_watched'] = bot.stats['total_videos']
            bot_status['stats']['likes_given'] = bot.stats['likes']['success']
            bot_status['stats']['subscriptions'] = bot.stats['subscribes']['success']
                
    except Exception as e:
        log_capture.write(f"机器人初始化失败 {browser_id}: {str(e)}")
        bot_status['windows'][browser_id]['status'] = 'error'

if __name__ == '__main__':
    print("启动Web API服务器...")
    print("访问地址: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)