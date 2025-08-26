#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
网懿云盘测试脚本
用于验证系统功能是否正常
"""

import os
import sys
import requests
import time
from pathlib import Path

def test_server_connection():
    """测试服务器连接"""
    print("🔍 测试服务器连接...")
    try:
        response = requests.get("http://localhost:5000", timeout=5)
        if response.status_code == 200:
            print("✅ 服务器连接正常")
            return True
        else:
            print(f"❌ 服务器响应异常: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 无法连接到服务器: {e}")
        return False

def test_login():
    """测试登录功能"""
    print("🔐 测试登录功能...")
    try:
        session = requests.Session()
        login_data = {
            'username': 'admin',
            'password': 'admin123'
        }
        response = session.post("http://localhost:5000/login", data=login_data, timeout=5)
        if response.status_code == 200 and 'logout' in response.text:
            print("✅ 登录功能正常")
            return session
        else:
            print("❌ 登录失败")
            return None
    except Exception as e:
        print(f"❌ 登录测试异常: {e}")
        return None

def test_file_operations(session):
    """测试文件操作"""
    print("📁 测试文件操作...")
    
    # 测试创建文件夹
    try:
        folder_data = {
            'path': '',
            'folder_name': 'test_folder'
        }
        response = session.post("http://localhost:5000/create_folder", data=folder_data, timeout=5)
        if response.status_code == 200:
            print("✅ 创建文件夹功能正常")
        else:
            print("❌ 创建文件夹失败")
    except Exception as e:
        print(f"❌ 创建文件夹测试异常: {e}")
    
    # 测试上传文件
    try:
        test_file_path = "test_file.txt"
        with open(test_file_path, 'w', encoding='utf-8') as f:
            f.write("这是一个测试文件\n用于验证云盘功能")
        
        with open(test_file_path, 'rb') as f:
            files = {'file': f}
            data = {'path': ''}
            response = session.post("http://localhost:5000/upload", files=files, data=data, timeout=10)
        
        if response.status_code == 200:
            print("✅ 文件上传功能正常")
        else:
            print("❌ 文件上传失败")
        
        # 清理测试文件
        os.remove(test_file_path)
        
    except Exception as e:
        print(f"❌ 文件上传测试异常: {e}")

def test_directory_structure():
    """测试目录结构"""
    print("📂 检查目录结构...")
    
    required_dirs = [
        '/root/网懿云盘',
        '/root/网懿云盘/templates',
        '/root/网懿云盘/static',
        '/root/网懿云盘/static/css',
        '/root/网懿云盘/static/js',
        '/root/网懿云盘/images'
    ]
    
    required_files = [
        '/root/网懿云盘/app.py',
        '/root/网懿云盘/requirements.txt',
        '/root/网懿云盘/admin.txt',
        '/root/网懿云盘/templates/login.html',
        '/root/网懿云盘/templates/index.html',
        '/root/网懿云盘/templates/preview.html',
        '/root/网懿云盘/static/css/style.css',
        '/root/网懿云盘/static/js/main.js',
        '/root/网懿云盘/static/js/preview.js'
    ]
    
    all_good = True
    
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"✅ 目录存在: {dir_path}")
        else:
            print(f"❌ 目录缺失: {dir_path}")
            all_good = False
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ 文件存在: {file_path}")
        else:
            print(f"❌ 文件缺失: {file_path}")
            all_good = False
    
    return all_good

def test_python_dependencies():
    """测试Python依赖"""
    print("🐍 检查Python依赖...")
    
    required_packages = [
        'flask',
        'flask_login',
        'werkzeug',
        'pillow',
        'magic'
    ]
    
    all_good = True
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} 已安装")
        except ImportError:
            print(f"❌ {package} 未安装")
            all_good = False
    
    return all_good

def main():
    """主测试函数"""
    print("🌸 网懿云盘功能测试")
    print("=" * 50)
    
    # 检查目录结构
    if not test_directory_structure():
        print("\n❌ 目录结构检查失败，请检查安装")
        return
    
    # 检查Python依赖
    if not test_python_dependencies():
        print("\n❌ Python依赖检查失败，请安装缺失的包")
        return
    
    # 等待服务器启动
    print("\n⏳ 等待服务器启动...")
    time.sleep(3)
    
    # 测试服务器连接
    if not test_server_connection():
        print("\n❌ 服务器连接失败，请检查服务是否启动")
        return
    
    # 测试登录
    session = test_login()
    if not session:
        print("\n❌ 登录测试失败")
        return
    
    # 测试文件操作
    test_file_operations(session)
    
    print("\n" + "=" * 50)
    print("🎉 测试完成！")
    print("\n💡 如果所有测试都通过，说明云盘系统运行正常")
    print("🌐 访问地址: http://localhost:5000")
    print("👤 默认账户: admin / admin123")

if __name__ == "__main__":
    main()
