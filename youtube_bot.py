import asyncio
import random
import logging
import json

class YouTubeBot:
    """YouTube Shorts 自动化操作机器人
    
    负责执行 YouTube Shorts 的自动化操作，包括：
    - 视频浏览
    - 点赞互动
    - 订阅频道
    
    Attributes:
        browser_id (str): 浏览器实例的唯一标识
        ws_endpoint (str): WebSocket 连接端点
        browser: Playwright 浏览器实例
        context: 浏览器上下文
        page: 当前页面对象
        stats (dict): 操作统计信息
        xpath_config (dict): XPath 选择器配置
    """
    
    def __init__(self, browser_id: str, ws_endpoint: str):
        """初始化 YouTube 机器人
        
        Args:
            browser_id: 浏览器实例ID
            ws_endpoint: WebSocket 连接地址
        """
        self.browser_id = browser_id
        self.ws_endpoint = ws_endpoint
        self.browser = None
        self.context = None
        self.page = None
        # 加载 XPath 配置
        with open('xpath_config.json', 'r') as f:
            self.xpath_config = json.load(f)['selectors']
        # 统计信息
        self.stats = {
            'total_videos': 0,
            'likes': {'success': 0, 'failed': 0},
            'subscribes': {'success': 0, 'failed': 0}
        }
    
    async def random_delay(self, min_seconds: float, max_seconds: float):
        """随机延迟等待
        
        Args:
            min_seconds: 最小等待时间（秒）
            max_seconds: 最大等待时间（秒）
        """
        delay = random.uniform(min_seconds, max_seconds)
        await asyncio.sleep(delay)
    
    async def simulate_human_scroll(self):
        """模拟人类的滚动行为"""
        # 随机决定是快速还是慢速滚动
        if random.random() < 0.3:  # 30%概率慢速滚动
            steps = random.randint(3, 6)
            for _ in range(steps):
                await self.page.mouse.wheel(0, 20)
                await self.random_delay(0.1, 0.3)
        else:  # 70%概率正常滚动
            await self.page.keyboard.press('ArrowDown')
    
    async def simulate_human_watch(self, base_time):
        """模拟人类的观看行为
        
        Args:
            base_time: 基础观看时间
        """
        # 随机决定是否中途暂停视频
        if random.random() < 0.2:  # 20%概率暂停视频
            await self.random_delay(1, base_time * 0.3)  # 观看一段时间后
            await self.page.keyboard.press('k')  # 暂停视频
            await self.random_delay(0.5, 2)  # 暂停一会
            await self.page.keyboard.press('k')  # 继续播放
            
        # 随机决定是否来回观看
        if random.random() < 0.15:  # 15%概率重复观看
            await self.random_delay(base_time * 0.3, base_time * 0.5)
            await self.page.keyboard.press('ArrowUp')  # 回到上一个视频
            await self.random_delay(1, 3)
            await self.page.keyboard.press('ArrowDown')  # 再次前进
    
    async def simulate_human_mouse(self):
        """模拟人类的鼠标移动"""
        # 随机在页面上移动鼠标
        viewport = await self.page.evaluate("""() => ({
            width: window.innerWidth,
            height: window.innerHeight
        })""")
        x = random.randint(0, viewport['width'])
        y = random.randint(0, viewport['height'])
        await self.page.mouse.move(x, y)
        
        # 有时候会在视频区域停留
        if random.random() < 0.3:
            center_x = viewport['width'] // 2
            center_y = viewport['height'] // 2
            await self.page.mouse.move(center_x, center_y)
            await self.random_delay(0.5, 1.5)
    
    async def init(self):
        """初始化浏览器页面
        
        - 连接到浏览器实例
        - 获取浏览器上下文
        - 创建新标签页
        - 设置视口大小
        - 访问 YouTube Shorts
        """
        try:
            print(f"[{self.browser_id}] 开始初始化浏览器...")
            
            from playwright.async_api import async_playwright
            playwright = await async_playwright().start()
            self.browser = await playwright.chromium.connect_over_cdp(self.ws_endpoint)
            print(f"[{self.browser_id}] 成功连接到浏览器")
            
            # 获取已有的context
            self.context = self.browser.contexts[0]
            print(f"[{self.browser_id}] 获取到浏览器上下文")
            
            # 在当前context中创建新标签页
            self.page = await self.context.new_page()
            print(f"[{self.browser_id}] 创建新标签页")
            
            # 加载配置文件获取窗口大小
            with open('config.json', 'r') as f:
                config = json.load(f)
            window_width = config['settings']['window_width']
            window_height = config['settings']['window_height']
            
            # 设置视口大小为配置文件中指定的大小
            await self.page.set_viewport_size({"width": window_width, "height": window_height})
            print(f"[{self.browser_id}] 设置视口大小: {window_width}x{window_height}")
            
            # 访问YouTube Shorts
            print(f"[{self.browser_id}] 正在访问YouTube Shorts...")
            await self.page.goto('https://www.youtube.com/shorts')
            print(f"[{self.browser_id}] 成功加载YouTube Shorts")
            
            # 关闭其他标签页
            print(f"[{self.browser_id}] 正在关闭其他标签页...")
            pages = self.context.pages
            for page in pages:
                if page != self.page:
                    await page.close()
            print(f"[{self.browser_id}] 已关闭所有其他标签页")
            
        except Exception as e:
            print(f"[{self.browser_id}] 初始化失败: {str(e)}")
            raise
    
    async def watch_shorts(self, settings):
        """浏览 Shorts 视频并进行互动
        
        Args:
            settings: 包含互动配置的字典
                - watch_time_min: 最短观看时间
                - watch_time_max: 最长观看时间
                - like_probability: 点赞概率
                - subscribe_probability: 订阅概率
                - scroll_count: 观看视频数量
        """
        try:
            print(f"[{self.browser_id}] 开始浏览Shorts视频")
            
            # 确保页面已加载
            await self.random_delay(3, 6)
            
            # 循环观看视频
            for i in range(settings['scroll_count']):
                try:
                    print(f"\n[{self.browser_id}] === 正在观看第 {i+1}/{settings['scroll_count']} 个视频 ===")
                    self.stats['total_videos'] += 1
                    
                    # 随机观看时长
                    watch_time = random.uniform(
                        settings['watch_time_min'],
                        settings['watch_time_max']
                    )
                    print(f"[{self.browser_id}] 观看时长: {int(watch_time)}秒")
                    
                    # 模拟人类观看行为
                    await self.simulate_human_mouse()  # 随机鼠标移动
                    await self.simulate_human_watch(watch_time)  # 模拟观看行为
                    
                    # 随机点赞
                    if random.random() < settings['like_probability']:
                        # 先移动鼠标到点赞按钮附近
                        like_button = self.page.locator(self.xpath_config['like_button']).nth(0)
                        if await like_button.count() > 0:
                            await self.random_delay(0.2, 0.8)  # 短暂停顿
                            print(f"[{self.browser_id}] 尝试点赞...")
                            await like_button.click()
                            print(f"[{self.browser_id}] 点赞成功")
                            self.stats['likes']['success'] += 1
                            await self.random_delay(1, 3)
                        else:
                            print(f"[{self.browser_id}] 点赞失败：未找到点赞按钮")
                            self.stats['likes']['failed'] += 1
                    
                    # 随机订阅
                    if random.random() < settings['subscribe_probability']:
                        print(f"[{self.browser_id}] 检查订阅状态...")
                        # 先检查订阅按钮状态
                        sub_status = await self.page.evaluate(f"""
                            () => {{
                                const element = document.evaluate(
                                    '{self.xpath_config['subscribe_text']}',
                                    document,
                                    null,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                                    null
                                ).singleNodeValue;
                                return element ? element.textContent.trim() : '';
                            }}
                        """)
                        print(f"[{self.browser_id}] 订阅按钮状态: {sub_status}")
                        
                        # 只有在未订阅状态下才执行订阅
                        if sub_status not in ['已订阅', 'Subscribe']:
                            print(f"[{self.browser_id}] 尝试订阅...")
                            sub_button = self.page.locator(self.xpath_config['subscribe_button']).nth(0)
                            if await sub_button.count() > 0:
                                # 移动鼠标到订阅按钮附近
                                await self.random_delay(0.2, 0.8)  # 短暂停顿
                                await sub_button.click()
                                print(f"[{self.browser_id}] 订阅成功")
                                self.stats['subscribes']['success'] += 1
                                await self.random_delay(1, 3)
                            else:
                                print(f"[{self.browser_id}] 订阅失败：未找到订阅按钮")
                                self.stats['subscribes']['failed'] += 1
                        else:
                            print(f"[{self.browser_id}] 已经订阅过此频道")
                    
                    # 向下滑动到下一个视频
                    print(f"[{self.browser_id}] 滑动到下一个视频")
                    await self.simulate_human_scroll()  # 使用模拟人类的滚动
                    await self.random_delay(1, 3)
                    
                except Exception as e:
                    print(f"[{self.browser_id}] 处理视频时出错: {str(e)}")
                    continue
                    
        except Exception as e:
            print(f"[{self.browser_id}] 浏览Shorts时出错: {str(e)}")
        finally:
            # 记录统计信息到日志文件
            logging.info(f"[{self.browser_id}] 统计信息 - "
                        f"总视频数: {self.stats['total_videos']}, "
                        f"点赞: {self.stats['likes']['success']}/{self.stats['likes']['success'] + self.stats['likes']['failed']}, "
                        f"订阅: {self.stats['subscribes']['success']}/{self.stats['subscribes']['success'] + self.stats['subscribes']['failed']}")
    
    async def cleanup(self):
        """清理资源
        
        关闭浏览器页面和连接
        """
        try:
            if self.page:
                await self.page.close()
                print(f"[{self.browser_id}] 关闭标签页")
            if self.browser:
                await self.browser.close()
                print(f"[{self.browser_id}] 关闭浏览器连接")
        except Exception as e:
            print(f"[{self.browser_id}] 清理资源时出错: {str(e)}")