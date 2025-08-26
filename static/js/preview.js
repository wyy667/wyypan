// 预览页面功能

// 复制文件链接
function copyUrl() {
    const urlInput = document.getElementById('fileUrl');
    const copyBtn = document.querySelector('.copy-btn');
    
    // 选择文本
    urlInput.select();
    urlInput.setSelectionRange(0, 99999); // 兼容移动设备
    
    try {
        // 复制到剪贴板
        document.execCommand('copy');
        
        // 显示成功提示
        showCopySuccess();
        
        // 更新按钮文本
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ 已复制';
        copyBtn.style.background = 'linear-gradient(45deg, #4CAF50, #66BB6A)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8fab)';
        }, 2000);
        
    } catch (err) {
        // 如果复制失败，显示提示
        showCopyError();
    }
}

// 显示复制成功提示
function showCopySuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'copy-notification success';
    successDiv.innerHTML = '链接已复制到剪贴板！';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 2000);
}

// 显示复制失败提示
function showCopyError() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'copy-notification error';
    errorDiv.innerHTML = '复制失败，请手动选择链接复制';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(244, 67, 54, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 3000);
}

// 打开全屏查看
function openFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'flex';
    
    // 添加可爱的加载动画
    const fullscreenBody = document.querySelector('.fullscreen-body');
    fullscreenBody.innerHTML = '<div class="loading">加载中...</div>';
    
    // 模拟加载完成
    setTimeout(() => {
        // 恢复原始内容
        location.reload();
    }, 500);
}

// 关闭全屏查看
function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'none';
}

// 图片预览功能
function initImagePreview() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        // 添加图片加载动画
        previewImage.style.opacity = '0';
        previewImage.style.transform = 'scale(0.8)';
        
        previewImage.onload = function() {
            this.style.transition = 'all 0.5s ease';
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        };
        
        // 添加图片点击放大功能
        previewImage.addEventListener('click', function() {
            openFullscreen();
        });
        
        // 添加图片悬停效果
        previewImage.addEventListener('mouseenter', function() {
            this.style.cursor = 'zoom-in';
            this.style.transform = 'scale(1.02)';
        });
        
        previewImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// 视频预览功能
function initVideoPreview() {
    const previewVideo = document.getElementById('previewVideo');
    if (previewVideo) {
        // 添加视频加载动画
        previewVideo.style.opacity = '0';
        previewVideo.style.transform = 'scale(0.8)';
        
        previewVideo.addEventListener('loadeddata', function() {
            this.style.transition = 'all 0.5s ease';
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // 添加视频控制提示
        const videoContainer = document.querySelector('.video-preview');
        const controlsHint = document.createElement('div');
        controlsHint.className = 'video-controls-hint';
        controlsHint.innerHTML = '点击播放按钮开始观看视频';
        controlsHint.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            opacity: 0.8;
            pointer-events: none;
        `;
        
        videoContainer.style.position = 'relative';
        videoContainer.appendChild(controlsHint);
        
        // 3秒后隐藏提示
        setTimeout(() => {
            controlsHint.style.opacity = '0';
            setTimeout(() => {
                controlsHint.remove();
            }, 500);
        }, 3000);
    }
}

// 音频预览功能
function initAudioPreview() {
    const previewAudio = document.getElementById('previewAudio');
    if (previewAudio) {
        // 添加音频加载动画
        previewAudio.style.opacity = '0';
        previewAudio.style.transform = 'scale(0.8)';
        
        previewAudio.addEventListener('loadeddata', function() {
            this.style.transition = 'all 0.5s ease';
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // 添加音频控制提示
        const audioContainer = document.querySelector('.audio-preview');
        const controlsHint = document.createElement('div');
        controlsHint.className = 'audio-controls-hint';
        controlsHint.innerHTML = '点击播放按钮开始收听音频';
        controlsHint.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            opacity: 0.8;
            pointer-events: none;
        `;
        
        audioContainer.style.position = 'relative';
        audioContainer.appendChild(controlsHint);
        
        // 3秒后隐藏提示
        setTimeout(() => {
            controlsHint.style.opacity = '0';
            setTimeout(() => {
                controlsHint.remove();
            }, 500);
        }, 3000);
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC: 关闭全屏
    if (e.key === 'Escape') {
        closeFullscreen();
    }
    
    // F: 全屏查看
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        openFullscreen();
    }
    
    // C: 复制链接
    if (e.key === 'c' || e.key === 'C') {
        if (e.ctrlKey) {
            e.preventDefault();
            copyUrl();
        }
    }
    
    // 空格: 播放/暂停视频
    if (e.key === ' ') {
        const video = document.querySelector('.preview-video');
        if (video) {
            e.preventDefault();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .preview-image {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .preview-video {
        transition: all 0.3s ease;
    }
    
    .loading {
        color: #ff6b9d;
        font-size: 1.2em;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    .preview-container {
        animation: fadeInUp 0.5s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .url-content {
        animation: fadeInUp 0.5s ease-out 0.2s both;
    }
    
    .file-info-bar {
        animation: fadeInDown 0.5s ease-out;
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .action-btn {
        transition: all 0.3s ease;
    }
    
    .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
    }
    
    .action-btn:active {
        transform: translateY(0) scale(0.95);
    }
    
    .copy-btn {
        transition: all 0.3s ease;
    }
    
    .copy-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
    }
    
    .url-input {
        transition: all 0.3s ease;
    }
    
    .url-input:focus {
        outline: none;
        border-color: #ff6b9d;
        box-shadow: 0 0 15px rgba(255, 107, 157, 0.3);
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化图片预览
    initImagePreview();
    
    // 初始化视频预览
    initVideoPreview();
    
    // 添加一些可爱的交互效果
    addCuteInteractions();
});

// 添加可爱的交互效果
function addCuteInteractions() {
    // 为按钮添加点击效果
    const buttons = document.querySelectorAll('.action-btn, .copy-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 为图片添加悬停效果
    const images = document.querySelectorAll('.preview-image');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(255, 107, 157, 0.4)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // 为视频添加悬停效果
    const videos = document.querySelectorAll('.preview-video');
    videos.forEach(video => {
        video.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(255, 107, 157, 0.4)';
        });
        
        video.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
    });
}

// 添加页面加载动画
window.addEventListener('load', function() {
    // 页面加载完成后的可爱动画
    const elements = document.querySelectorAll('.preview-container, .url-content, .file-info-bar');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// 添加一些可爱的提示信息
function showCuteMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `cute-message ${type}`;
    messageDiv.innerHTML = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        color: #ff6b9d;
        padding: 20px 30px;
        border-radius: 15px;
        z-index: 10000;
        animation: bounceIn 0.5s ease-out;
        box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
        border: 2px solid rgba(255, 107, 157, 0.2);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'bounceOut 0.5s ease-out';
        setTimeout(() => {
            messageDiv.remove();
        }, 500);
    }, 2000);
}

// 添加弹跳动画
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
        }
        70% {
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes bounceOut {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
        }
    }
`;
document.head.appendChild(bounceStyle);

// 下载文件功能
function downloadFile(filepath, filename) {
    // 显示下载进度条
    showDownloadProgress();
    
    // 模拟下载进度
    simulateDownloadProgress();
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = `/download/${filepath}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 显示下载进度条
function showDownloadProgress() {
    const progressContainer = document.getElementById('downloadProgress');
    if (progressContainer) {
        progressContainer.style.display = 'block';
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
    }
}

// 隐藏下载进度条
function hideDownloadProgress() {
    const progressContainer = document.getElementById('downloadProgress');
    if (progressContainer) {
        progressContainer.style.display = 'none';
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
    }
}

// 模拟下载进度
function simulateDownloadProgress() {
    const progressFill = document.getElementById('downloadProgressFill');
    const progressText = document.getElementById('downloadProgressText');
    const progressStatus = document.getElementById('downloadProgressStatus');
    
    if (!progressFill || !progressText || !progressStatus) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progressStatus.textContent = '下载完成！';
            
            // 延迟隐藏进度条
            setTimeout(() => {
                hideDownloadProgress();
            }, 1000);
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
        
        if (progress < 30) {
            progressStatus.textContent = '正在下载...';
        } else if (progress < 70) {
            progressStatus.textContent = '下载中...';
        } else if (progress < 100) {
            progressStatus.textContent = '即将完成...';
        }
    }, 150);
}
