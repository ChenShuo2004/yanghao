import schedule
import time
import subprocess
import logging
import sys
import os
import json
from datetime import datetime
import threading
from typing import Dict, List

class YouTubeBotScheduler:
    """YouTube机器人定时调度器
    
    负责按照设定的时间表自动运行YouTube自动化机器人
    支持多种调度模式：每日、每小时、每周等
    """
    
    def __init__(self, config_file='scheduler_config.json'):
        self.config_file = config_file
        self.config = self.load_config()
        self.setup_logging()
        self.is_running = False
        self.current_process = None
        
    def load_config(self) -> Dict:
        """加载调度器配置"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # 返回默认配置
                return {
                    "scheduler_settings": {
                        "enabled": True,
                        "log_level": "INFO",
                        "max_concurrent_runs": 1,
                        "execution_timeout_minutes": 120
                    },
                    "schedules": []
                }
        except Exception as e:
            print(f"加载配置文件失败: {str(e)}，使用默认配置")
            return {
                "scheduler_settings": {
                    "enabled": True,
                    "log_level": "INFO",
                    "max_concurrent_runs": 1,
                    "execution_timeout_minutes": 120
                },
                "schedules": []
            }
        
    def setup_logging(self):
        """设置日志配置"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('scheduler.log', encoding='utf-8'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def run_bot(self):
        """运行YouTube机器人"""
        if self.is_running:
            self.logger.warning("机器人已在运行中，跳过本次执行")
            return
            
        try:
            self.is_running = True
            self.logger.info("开始执行YouTube自动化机器人...")
            
            # 检查虚拟环境
            python_path = self.get_python_path()
            
            # 运行main.py
            cmd = [python_path, "main.py"]
            self.current_process = subprocess.Popen(
                cmd,
                cwd=os.getcwd(),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding='utf-8'
            )
            
            # 等待进程完成
            stdout, stderr = self.current_process.communicate()
            
            if self.current_process.returncode == 0:
                self.logger.info("YouTube机器人执行完成")
                if stdout:
                    self.logger.info(f"输出: {stdout}")
            else:
                self.logger.error(f"YouTube机器人执行失败，返回码: {self.current_process.returncode}")
                if stderr:
                    self.logger.error(f"错误: {stderr}")
                    
        except Exception as e:
            self.logger.error(f"执行YouTube机器人时出错: {str(e)}")
        finally:
            self.is_running = False
            self.current_process = None
            
    def get_python_path(self):
        """获取Python解释器路径"""
        # 检查是否在虚拟环境中
        if os.path.exists("venv_new/Scripts/python.exe"):
            return "venv_new/Scripts/python.exe"
        elif os.path.exists("venv/bin/python"):
            return "venv/bin/python"
        else:
            return sys.executable
            
    def stop_current_execution(self):
        """停止当前正在执行的机器人"""
        if self.current_process and self.current_process.poll() is None:
            self.logger.info("正在停止当前执行的机器人...")
            self.current_process.terminate()
            try:
                self.current_process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.current_process.kill()
            self.logger.info("机器人已停止")
            
    def setup_schedules(self):
        """设置调度任务"""
        # 清除所有现有的调度任务
        schedule.clear()
        
        if not self.config.get('scheduler_settings', {}).get('enabled', True):
            self.logger.info("调度器已禁用")
            return
            
        schedules_config = self.config.get('schedules', [])
        active_schedules = []
        
        for schedule_item in schedules_config:
            if not schedule_item.get('enabled', True):
                continue
                
            schedule_type = schedule_item.get('type')
            name = schedule_item.get('name', 'unnamed')
            
            try:
                if schedule_type == 'daily':
                    time_str = schedule_item.get('time')
                    if time_str:
                        schedule.every().day.at(time_str).do(self.run_bot).tag(name)
                        active_schedules.append(f"每天 {time_str} ({schedule_item.get('description', name)})")
                        
                elif schedule_type == 'hourly':
                    interval = schedule_item.get('interval', 1)
                    schedule.every(interval).hours.do(self.run_bot).tag(name)
                    active_schedules.append(f"每{interval}小时 ({schedule_item.get('description', name)})")
                    
                elif schedule_type == 'weekly':
                    day = schedule_item.get('day', 'monday').lower()
                    time_str = schedule_item.get('time')
                    if time_str:
                        getattr(schedule.every(), day).at(time_str).do(self.run_bot).tag(name)
                        active_schedules.append(f"每周{day} {time_str} ({schedule_item.get('description', name)})")
                        
            except Exception as e:
                self.logger.error(f"设置调度任务 {name} 失败: {str(e)}")
        
        if active_schedules:
            self.logger.info("调度任务已设置:")
            for schedule_desc in active_schedules:
                self.logger.info(f"- {schedule_desc}")
        else:
            self.logger.warning("没有启用的调度任务")
        
    def run_scheduler(self):
        """运行调度器主循环"""
        self.logger.info("YouTube机器人调度器启动")
        self.setup_schedules()
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # 每分钟检查一次
        except KeyboardInterrupt:
            self.logger.info("收到停止信号，正在关闭调度器...")
            self.stop_current_execution()
        except Exception as e:
            self.logger.error(f"调度器运行时出错: {str(e)}")
        finally:
            self.logger.info("调度器已停止")
            
    def run_once_now(self):
        """立即运行一次机器人（用于测试）"""
        self.logger.info("立即执行一次YouTube机器人...")
        self.run_bot()
        
    def show_next_runs(self):
        """显示下次运行时间"""
        jobs = schedule.get_jobs()
        if jobs:
            self.logger.info("下次运行时间:")
            for job in jobs:
                self.logger.info(f"- {job.next_run}")
        else:
            self.logger.info("没有设置调度任务")

def main():
    """主函数"""
    scheduler = YouTubeBotScheduler()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "run":
            # 立即运行一次
            scheduler.run_once_now()
        elif command == "schedule":
            # 显示下次运行时间
            scheduler.setup_schedules()
            scheduler.show_next_runs()
        elif command == "start":
            # 启动调度器
            scheduler.run_scheduler()
        else:
            print("使用方法:")
            print("  python scheduler.py start    - 启动定时调度器")
            print("  python scheduler.py run      - 立即运行一次机器人")
            print("  python scheduler.py schedule - 显示下次运行时间")
    else:
        # 默认启动调度器
        scheduler.run_scheduler()

if __name__ == "__main__":
    main()