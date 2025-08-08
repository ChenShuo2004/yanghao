import asyncio
from window_manager import WindowManager
from youtube_bot import YouTubeBot
from bit_api import openBrowser, arrangeWindows
import json
import logging
import time
import sys

async def main():
    # 直接打印到控制台，确保能看到输出
    print("程序开始执行...")
    
    # 配置日志
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # 文件处理器
    file_handler = logging.FileHandler('youtube_bot.log')
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(file_handler)
    
    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(console_handler)
    
    print("日志配置完成...")

    # 加载配置
    print("正在加载配置...")
    with open('config.json', 'r') as f:
        config = json.load(f)
    print(f"配置加载完成: {config}")
    
    # 初始化窗口管理器
    print("正在初始化窗口管理器...")
    window_manager = WindowManager()
    print("窗口管理器初始化完成...")
    
    try:
        # 获取所有窗口ID
        window_ids = [window['browser_id'] for window in config['windows']]
        print(f"获取到的窗口ID: {window_ids}")
        
        # 检查比特浏览器API是否可用
        from bit_api import check_api_server, createBrowser
        api_available = check_api_server()
        print(f"比特浏览器API是否可用: {api_available}")
        
        if not api_available:
            print("错误: 比特浏览器未启动或API服务不可用，请先启动比特浏览器！")
            return
            
        # 尝试创建新的浏览器实例
        print("尝试创建新的浏览器实例...")
        try:
            # 直接使用比特浏览器API创建浏览器
            print("使用比特浏览器API创建浏览器...")
            json_data = {
                'name': 'google',
                'remark': 'YouTube Bot',
                'proxyMethod': 2,
                'proxyType': 'noproxy',
                'host': '',
                'port': '',
                'proxyUserName': '',
                "browserFingerPrint": {
                    'coreVersion': '124'
                }
            }
            
            import requests
            response = requests.post(f"http://127.0.0.1:54345/browser/update",
                                data=json.dumps(json_data), headers={'Content-Type': 'application/json'})
            
            print(f"API响应状态码: {response.status_code}")
            try:
                # 尝试打印响应内容，处理编码问题
                print(f"API响应内容: {response.content.decode('utf-8', errors='ignore')}")
            except Exception as e:
                print(f"打印响应内容时出错: {str(e)}")
            
            if response.status_code == 200:
                res = response.json()
                if res.get('success', False) and 'data' in res and 'id' in res['data']:
                    browser_id = res['data']['id']
                    print(f"成功创建浏览器实例，ID: {browser_id}")
                    # 更新配置中的浏览器ID
                    config['windows'][0]['browser_id'] = browser_id
                    window_ids = [browser_id]
                else:
                    print(f"创建浏览器实例失败: {res.get('msg', '未知错误')}")
                    print("将使用配置文件中的ID")
            else:
                print(f"创建浏览器实例失败，状态码: {response.status_code}")
                print("将使用配置文件中的ID")
        except Exception as e:
            print(f"创建浏览器实例时出错: {str(e)}")
            print("将使用配置文件中的ID继续执行")
        
        # 打开所有窗口并直接访问YouTube Shorts
        print("正在打开所有窗口...")
        open_tasks = []
        for browser_id in window_ids:
            open_tasks.append(
                asyncio.create_task(open_browser(browser_id, window_manager))
            )
        
        # 等待所有窗口打开
        await asyncio.gather(*open_tasks)
        print('所有窗口已打开')
        logging.info('All windows opened')
        
        # 等待窗口完全打开
        await asyncio.sleep(8)
        
        # 自动排列窗口
        logging.info('Arranging windows...')
        arrange_result = arrangeWindows()
        if arrange_result:
            logging.info('Windows arranged successfully')
        else:
            logging.warning('Failed to arrange windows')
        
        # 再次等待以确保排列完成
        await asyncio.sleep(3)
        
        # 为每个窗口创建任务
        tasks = []
        for window in config['windows']:
            browser_id = window['browser_id']
            if browser_id in window_manager.windows:
                ws_endpoint = window_manager.windows[browser_id]['ws']
                
                # 创建异步任务
                task = asyncio.create_task(init_and_run_bot(browser_id, ws_endpoint, config))
                tasks.append(task)
            else:
                logging.error(f'Window {browser_id} not found in manager')
                    
        # 等待所有任务完成
        if tasks:
            await asyncio.gather(*tasks)
        else:
            logging.error('No tasks created, all windows failed to open')
        
    except Exception as e:
        logging.error(f'Main error: {str(e)}')
    finally:
        # 关闭所有窗口
        await window_manager.close_all_windows()

async def open_browser(browser_id, window_manager):
    """异步打开浏览器"""
    try:
        # 检查浏览器ID是否为空
        if not browser_id:
            print("浏览器ID为空，尝试创建新的浏览器实例...")
            try:
                from bit_api import createBrowser
                new_browser_id = createBrowser()
                if new_browser_id:
                    print(f"成功创建新的浏览器实例，ID: {new_browser_id}")
                    browser_id = new_browser_id
                else:
                    print("创建新的浏览器实例失败")
                    return
            except Exception as e:
                print(f"创建新的浏览器实例时出错: {str(e)}")
                return
                
        res = openBrowser(browser_id)
        if res and 'data' in res and 'ws' in res['data']:
            ws_endpoint = res['data']['ws']
            window_manager.windows[browser_id] = {
                'ws': ws_endpoint,
                'status': 'opened'
            }
            logging.info(f'Successfully opened window {browser_id}')
        else:
            logging.error(f'Failed to open window {browser_id}: {res}')
    except Exception as e:
        logging.error(f'Error opening window {browser_id}: {str(e)}')

async def init_and_run_bot(browser_id, ws_endpoint, config):
    """初始化并运行机器人"""
    try:
        bot = YouTubeBot(browser_id, ws_endpoint)
        await bot.init()
        await bot.watch_shorts(config)
    except Exception as e:
        logging.error(f"Bot error for window {browser_id}: {str(e)}")

if __name__ == "__main__":
    print("程序入口点被执行...")
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"主程序执行出错: {str(e)}")
    print("程序执行完毕...")