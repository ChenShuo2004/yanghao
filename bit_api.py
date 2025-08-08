import requests
import json
import time
import logging

# 官方文档地址
# https://doc2.bitbrowser.cn/jiekou/liu-lan-qi-jie-kou.html

url = "http://127.0.0.1:54345"
headers = {'Content-Type': 'application/json'}

def check_api_server():
    """检查比特浏览器API服务是否可用"""
    try:
        response = requests.get(url)
        return response.status_code == 200
    except:
        return False

def createBrowser():
    try:
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

        # 使用原始的API路径
        response = requests.post(f"{url}/browser/update",
                            data=json.dumps(json_data), headers=headers)
        
        if response.status_code != 200:
            print(f"创建浏览器失败: {response.status_code}")
            print(f"错误信息: {response.text}")
            return None
            
        res = response.json()
        print(f"创建浏览器响应: {res}")
        
        if not res.get('success', False):
            print(f"创建浏览器失败: {res.get('msg', '未知错误')}")
            return None
            
        if 'data' in res and 'id' in res['data']:
            browserId = res['data']['id']
            print(f"创建的浏览器ID: {browserId}")
            return browserId
        else:
            print("响应中没有浏览器ID")
            return None
    except Exception as e:
        print(f"创建浏览器时发生异常: {str(e)}")
        return None

def updateBrowser():
    json_data = {'ids': ['93672cf112a044f08b653cab691216f0'],
                 'remark': '我是一个备注', 'browserFingerPrint': {}}
    res = requests.post(f"{url}/browser/update/partial",
                        data=json.dumps(json_data), headers=headers).json()
    print(res)

def openBrowser(id):
    """打开浏览器窗口，并设置初始尺寸"""
    try:
        # 检查API服务是否可用
        if not check_api_server():
            print("比特浏览器未启动或API服务不可用")
            return None

        print(f"正在打开窗口 {id}")
        
        # 打开窗口
        json_data = {
            "id": f'{id}',
            "useragent": "",
            "remark": ""
        }
        
        open_response = requests.post(f"{url}/browser/open",
                                    data=json.dumps(json_data), headers=headers)
        
        if open_response.status_code != 200:
            print(f"打开窗口失败: {open_response.status_code}")
            print(f"错误信息: {open_response.text}")
            return None
            
        res = open_response.json()
        print(f"窗口打开响应: {res}")
        
        # 等待窗口完全打开
        time.sleep(2)
        
        # 从配置文件读取窗口大小
        with open('config.json', 'r') as f:
            config = json.load(f)
        window_width = config['window']['width']
        window_height = config['window']['height']
        
        # 设置窗口尺寸
        size_data = {
            "type": "box",
            "startX": 0,
            "startY": 0,
            "width": window_width,
            "height": window_height,
            "col": 4,
            "spaceX": 20,
            "spaceY": 20,
            "offsetX": 0,
            "offsetY": 0,
            "orderBy": "asc",
            "seqlist": []
        }
        
        size_response = requests.post(f"{url}/windowbounds",
                                    data=json.dumps(size_data), headers=headers)
        
        if size_response.status_code != 200:
            print(f"设置窗口尺寸失败: {size_response.status_code}")
            print(f"错误信息: {size_response.text}")
        
        return res
        
    except Exception as e:
        print(f"打开窗口时发生错误: {str(e)}")
        return None

def closeBrowser(id):
    try:
        json_data = {'id': f'{id}'}
        response = requests.post(f"{url}/browser/close",
                               data=json.dumps(json_data), headers=headers)
        print(f"关闭窗口 {id} 响应: {response.text}")
    except Exception as e:
        print(f"关闭窗口时发生错误: {str(e)}")

def deleteBrowser(id):
    try:
        json_data = {'id': f'{id}'}
        response = requests.post(f"{url}/browser/delete",
                               data=json.dumps(json_data), headers=headers)
        print(f"删除窗口 {id} 响应: {response.text}")
    except Exception as e:
        print(f"删除窗口时发生���误: {str(e)}")

def arrangeWindows():
    """自动排列所有窗口"""
    try:
        # 从配置文件读取窗口大小
        with open('config.json', 'r') as f:
            config = json.load(f)
        window_width = config['window']['width']
        window_height = config['window']['height']
        
        json_data = {
            "type": "box",
            "startX": 0,
            "startY": 0,
            "width": window_width,
            "height": window_height,
            "col": 4,
            "spaceX": 20,
            "spaceY": 20,
            "offsetX": 0,
            "offsetY": 0,
            "orderBy": "asc",
            "seqlist": []
        }
        
        response = requests.post(f"{url}/windowbounds",
                               data=json.dumps(json_data), headers=headers)
        
        if response.status_code == 200:
            print("Windows arranged successfully")
            return response.json()
        else:
            print(f"Error arranging windows: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"Exception in arrangeWindows: {str(e)}")
        return None

if __name__ == '__main__':
    if check_api_server():
        browser_id = createBrowser()
        openBrowser(browser_id)
        time.sleep(10)
        closeBrowser(browser_id)
        time.sleep(10)
        deleteBrowser(browser_id)
    else:
        print("比特浏览器未启动或API服务不可用")
