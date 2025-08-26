#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import hashlib
import zipfile
import tarfile
import rarfile
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, session, send_file, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
import magic
from PIL import Image
import mimetypes

app = Flask(__name__)
app.secret_key = '网懿云盘超级可爱密钥2024'

# 配置
UPLOAD_FOLDER = '/root/网懿云盘/images'
ADMIN_FILE = '/root/网懿云盘/admin.txt'
ALLOWED_EXTENSIONS = set()  # 允许所有文件类型

# 确保目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(ADMIN_FILE), exist_ok=True)

# Flask-Login 配置
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, username):
        self.id = username
        self.username = username

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

def allowed_file(filename):
    return True  # 允许所有文件类型

def get_file_type(filepath):
    """获取文件类型"""
    mime = magic.Magic(mime=True)
    file_mime = mime.from_file(filepath)
    
    if file_mime.startswith('image/'):
        return 'image'
    elif file_mime.startswith('video/'):
        return 'video'
    elif file_mime.startswith('audio/'):
        return 'audio'
    elif file_mime.startswith('text/'):
        return 'text'
    elif file_mime in ['application/zip', 'application/x-rar-compressed', 'application/x-tar', 'application/gzip']:
        return 'archive'
    else:
        return 'other'

def get_file_size(filepath):
    """获取文件大小"""
    size = os.path.getsize(filepath)
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"

@app.route('/')
@login_required
def index():
    path = request.args.get('path', '')
    current_path = os.path.join(UPLOAD_FOLDER, path)
    
    if not os.path.exists(current_path):
        current_path = UPLOAD_FOLDER
        path = ''
    
    files = []
    folders = []
    
    try:
        for item in os.listdir(current_path):
            item_path = os.path.join(current_path, item)
            if os.path.isdir(item_path):
                folders.append({
                    'name': item,
                    'path': os.path.join(path, item),
                    'created': datetime.fromtimestamp(os.path.getctime(item_path)).strftime('%Y-%m-%d %H:%M:%S')
                })
            else:
                file_type = get_file_type(item_path)
                files.append({
                    'name': item,
                    'path': os.path.join(path, item),
                    'size': get_file_size(item_path),
                    'type': file_type,
                    'created': datetime.fromtimestamp(os.path.getctime(item_path)).strftime('%Y-%m-%d %H:%M:%S')
                })
    except PermissionError:
        flash('❌ 没有权限访问该目录', 'error')
        return redirect(url_for('index'))
    
    # 按名称排序
    folders.sort(key=lambda x: x['name'])
    files.sort(key=lambda x: x['name'])
    
    return render_template('index.html', 
                         folders=folders, 
                         files=files, 
                         current_path=path,
                         breadcrumbs=get_breadcrumbs(path))

def get_breadcrumbs(path):
    """生成面包屑导航"""
    if not path:
        return [{'name': '首页', 'path': ''}]
    
    parts = path.split('/')
    breadcrumbs = [{'name': '首页', 'path': ''}]
    current_path = ''
    
    for part in parts:
        if part:
            current_path = os.path.join(current_path, part)
            breadcrumbs.append({'name': part, 'path': current_path})
    
    return breadcrumbs

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # 读取用户文件
        try:
            with open(ADMIN_FILE, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        stored_username, stored_password = line.strip().split(':', 1)
                        if username == stored_username and password == stored_password:
                            user = User(username)
                            login_user(user)
                            flash('欢迎回来！', 'success')
                            return redirect(url_for('index'))
        except FileNotFoundError:
            # 如果文件不存在，创建默认用户
            os.makedirs(os.path.dirname(ADMIN_FILE), exist_ok=True)
            with open(ADMIN_FILE, 'w', encoding='utf-8') as f:
                f.write('admin:admin123\n')
            flash('已创建默认用户：admin/admin123', 'info')
        
        flash('用户名或密码错误', 'error')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('下次再见！', 'success')
    return redirect(url_for('login'))

@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    path = request.form.get('path', '')
    current_path = os.path.join(UPLOAD_FOLDER, path)
    
    if 'file' not in request.files:
        flash('没有选择文件', 'error')
        return redirect(url_for('index', path=path))
    
    files = request.files.getlist('file')
    
    for file in files:
        if file.filename == '':
            continue
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(current_path, filename)
            
            # 如果文件已存在，添加数字后缀
            counter = 1
            while os.path.exists(filepath):
                name, ext = os.path.splitext(filename)
                filename = f"{name}_{counter}{ext}"
                filepath = os.path.join(current_path, filename)
                counter += 1
            
            file.save(filepath)
            flash(f'文件 {filename} 上传成功！', 'success')
        else:
            flash(f'文件 {file.filename} 格式不支持', 'error')
    
    return redirect(url_for('index', path=path))

@app.route('/create_folder', methods=['POST'])
@login_required
def create_folder():
    path = request.form.get('path', '')
    folder_name = request.form.get('folder_name', '').strip()
    
    if not folder_name:
        flash('请输入文件夹名称', 'error')
        return redirect(url_for('index', path=path))
    
    current_path = os.path.join(UPLOAD_FOLDER, path)
    new_folder_path = os.path.join(current_path, folder_name)
    
    if os.path.exists(new_folder_path):
        flash('文件夹已存在', 'error')
    else:
        try:
            os.makedirs(new_folder_path)
            flash(f'文件夹 {folder_name} 创建成功！', 'success')
        except Exception as e:
            flash(f'创建文件夹失败：{str(e)}', 'error')
    
    return redirect(url_for('index', path=path))

@app.route('/download/<path:filepath>')
@login_required
def download_file(filepath):
    full_path = os.path.join(UPLOAD_FOLDER, filepath)
    
    if not os.path.exists(full_path) or not os.path.isfile(full_path):
        flash('文件不存在', 'error')
        return redirect(url_for('index'))
    
    return send_file(full_path, as_attachment=True)

@app.route('/public/download/<path:filepath>')
def public_download_file(filepath):
    """公开下载路由，无需登录"""
    full_path = os.path.join(UPLOAD_FOLDER, filepath)
    
    if not os.path.exists(full_path) or not os.path.isfile(full_path):
        return '文件不存在', 404
    
    return send_file(full_path, as_attachment=True)

@app.route('/preview/<path:filepath>')
@login_required
def preview_file(filepath):
    full_path = os.path.join(UPLOAD_FOLDER, filepath)
    
    if not os.path.exists(full_path):
        flash('文件不存在', 'error')
        return redirect(url_for('index'))
    
    file_type = get_file_type(full_path)
    mime_type, _ = mimetypes.guess_type(full_path)
    
    # 处理文本文件预览 - 只支持txt和sh文件
    content = None
    if filepath.lower().endswith(('.txt', '.sh')):
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(full_path, 'r', encoding='gbk') as f:
                    content = f.read()
            except:
                content = "无法读取文件内容，可能不是文本文件或编码不支持。"
        except Exception as e:
            content = f"读取文件时出错: {str(e)}"
    
    return render_template('preview.html', 
                         filepath=filepath, 
                         filename=os.path.basename(filepath),
                         file_type=file_type,
                         mime_type=mime_type,
                         content=content)



@app.route('/delete', methods=['POST'])
@login_required
def delete_item():
    path = request.form.get('path', '')
    item_path = request.form.get('item_path', '')
    
    if not item_path:
        flash('请选择要删除的项目', 'error')
        return redirect(url_for('index', path=path))
    
    full_path = os.path.join(UPLOAD_FOLDER, item_path)
    
    if not os.path.exists(full_path):
        flash('项目不存在', 'error')
        return redirect(url_for('index', path=path))
    
    try:
        if os.path.isdir(full_path):
            import shutil
            shutil.rmtree(full_path)
            flash('文件夹删除成功！', 'success')
        else:
            os.remove(full_path)
            flash('文件删除成功！', 'success')
    except Exception as e:
        flash(f'删除失败：{str(e)}', 'error')
    
    return redirect(url_for('index', path=path))

def extract_archive(filepath, extract_to):
    """解压压缩包"""
    try:
        if filepath.lower().endswith('.zip'):
            with zipfile.ZipFile(filepath, 'r') as zip_ref:
                zip_ref.extractall(extract_to)
        elif filepath.lower().endswith('.tar.gz') or filepath.lower().endswith('.tgz'):
            with tarfile.open(filepath, 'r:gz') as tar_ref:
                tar_ref.extractall(extract_to)
        elif filepath.lower().endswith('.tar'):
            with tarfile.open(filepath, 'r') as tar_ref:
                tar_ref.extractall(extract_to)
        elif filepath.lower().endswith('.rar'):
            with rarfile.RarFile(filepath, 'r') as rar_ref:
                rar_ref.extractall(extract_to)
        return True
    except Exception as e:
        print(f"解压失败: {e}")
        return False

@app.route('/extract/<path:filepath>')
@login_required
def extract_file(filepath):
    """解压文件"""
    full_path = os.path.join(UPLOAD_FOLDER, filepath)
    
    if not os.path.exists(full_path):
        flash('文件不存在', 'error')
        return redirect(url_for('index'))
    
    # 创建解压目录
    extract_dir = os.path.splitext(full_path)[0]
    if os.path.exists(extract_dir):
        flash('解压目录已存在', 'error')
        return redirect(url_for('index'))
    
    os.makedirs(extract_dir, exist_ok=True)
    
    if extract_archive(full_path, extract_dir):
        flash('压缩包解压成功', 'success')
    else:
        flash('压缩包解压失败', 'error')
        if os.path.exists(extract_dir):
            import shutil
            shutil.rmtree(extract_dir)
    
    return redirect(url_for('index'))



@app.route('/files/<path:filepath>')
@login_required
def serve_file(filepath):
    full_path = os.path.join(UPLOAD_FOLDER, filepath)
    
    if not os.path.exists(full_path):
        return '文件不存在', 404
    
    return send_file(full_path)

@app.route('/public/files/<path:filepath>')
def public_serve_file(filepath):
    """公开文件服务路由，无需登录，用于图床等直接引用"""
    full_path = os.path.join(UPLOAD_FOLDER, filepath)
    
    if not os.path.exists(full_path):
        return '文件不存在', 404
    
    return send_file(full_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
