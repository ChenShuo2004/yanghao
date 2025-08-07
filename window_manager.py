import asyncio
from typing import Dict
import logging
from bit_api import openBrowser, closeBrowser

class WindowManager:
    def __init__(self):
        self.windows: Dict[str, dict] = {}
        self.setup_logging()
    
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            filename='youtube_bot.log'
        )
    
    async def close_window(self, browser_id: str):
        """关闭指定的浏览器窗口"""
        try:
            if browser_id in self.windows:
                closeBrowser(browser_id)
                del self.windows[browser_id]
                logging.info(f'Closed window {browser_id}')
        except Exception as e:
            logging.error(f'Failed to close window {browser_id}: {str(e)}')
    
    async def close_all_windows(self):
        """关闭所有浏览器窗口"""
        for browser_id in list(self.windows.keys()):
            await self.close_window(browser_id) 