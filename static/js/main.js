// 全局变量
let currentPath = '';
let itemToDelete = '';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前路径
    const urlParams = new URLSearchParams(window.location.search);
    currentPath = urlParams.get('path') || '';
    
    // 添加一些可爱的动画效果
    addCuteAnimations();
});

// 添加可爱的动画效果
function addCuteAnimations() {
    // 为文件项添加点击波纹效果
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                return; // 不处理按钮和链接的点击
            }
            
            // 创建波纹效果
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 107, 157, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.clientX - item.offsetLeft) + 'px';
            ripple.style.top = (e.clientY - item.offsetTop) + 'px';
            ripple.style.width = ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';
            
            item.style.position = 'relative';
            item.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 文件上传功能
function submitUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    
    if (fileInput.files.length > 0) {
        // 显示上传进度条
        showUploadProgress();
        
        // 模拟上传进度
        simulateUploadProgress();
        
        // 提交表单
        uploadForm.submit();
    }
}

// 显示上传进度条
function showUploadProgress() {
    const progressContainer = document.getElementById('uploadProgress');
    progressContainer.style.display = 'block';
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 隐藏上传进度条
function hideUploadProgress() {
    const progressContainer = document.getElementById('uploadProgress');
    progressContainer.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 模拟上传进度
function simulateUploadProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressStatus = document.getElementById('progressStatus');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progressStatus.textContent = '上传完成！';
            
            // 延迟隐藏进度条
            setTimeout(() => {
                hideUploadProgress();
            }, 1000);
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
        
        if (progress < 30) {
            progressStatus.textContent = '正在上传...';
        } else if (progress < 70) {
            progressStatus.textContent = '上传中...';
        } else if (progress < 100) {
            progressStatus.textContent = '即将完成...';
        }
    }, 200);
}

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
    progressContainer.style.display = 'block';
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 隐藏下载进度条
function hideDownloadProgress() {
    const progressContainer = document.getElementById('downloadProgress');
    progressContainer.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 模拟下载进度
function simulateDownloadProgress() {
    const progressFill = document.getElementById('downloadProgressFill');
    const progressText = document.getElementById('downloadProgressText');
    const progressStatus = document.getElementById('downloadProgressStatus');
    
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

// 显示创建文件夹对话框
function showCreateFolder() {
    const modal = document.getElementById('folderModal');
    const input = document.getElementById('folderNameModal');
    
    modal.style.display = 'flex';
    input.focus();
    
    // 添加输入提示
    input.placeholder = '请输入文件夹名称';
}

// 隐藏创建文件夹对话框
function hideFolderModal() {
    const modal = document.getElementById('folderModal');
    modal.style.display = 'none';
    document.getElementById('folderNameModal').value = '';
}

// 创建文件夹
function createFolder() {
    const folderName = document.getElementById('folderNameModal').value.trim();
    
    if (!folderName) {
        showCuteAlert('请输入文件夹名称', 'error');
        return;
    }
    
    // 提交表单
    const form = document.getElementById('createFolderForm');
    document.getElementById('folderNameInput').value = folderName;
    form.submit();
}

// 删除项目
function deleteItem(itemPath, itemType) {
    itemToDelete = itemPath;
    
    const modal = document.getElementById('deleteModal');
    const deleteType = document.getElementById('deleteType');
    
    deleteType.textContent = itemType;
    modal.style.display = 'flex';
}

// 隐藏删除对话框
function hideDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
    itemToDelete = '';
}

// 确认删除
function confirmDelete() {
    if (!itemToDelete) {
        return;
    }
    
    // 创建删除表单
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/delete';
    
    const pathInput = document.createElement('input');
    pathInput.type = 'hidden';
    pathInput.name = 'path';
    pathInput.value = currentPath;
    
    const itemPathInput = document.createElement('input');
    itemPathInput.type = 'hidden';
    itemPathInput.name = 'item_path';
    itemPathInput.value = itemToDelete;
    
    form.appendChild(pathInput);
    form.appendChild(itemPathInput);
    document.body.appendChild(form);
    
    // 提交表单
    form.submit();
}

// 刷新页面
function refreshPage() {
    // 添加可爱的刷新动画
    const refreshBtn = event.target;
    refreshBtn.innerHTML = '刷新中...';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// 显示可爱的提示信息
function showCuteAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = message;
    
    const messages = document.querySelector('.messages');
    if (messages) {
        messages.appendChild(alertDiv);
    } else {
        const newMessages = document.createElement('div');
        newMessages.className = 'messages';
        newMessages.appendChild(alertDiv);
        document.querySelector('.main-content').insertBefore(newMessages, document.querySelector('.actions'));
    }
    
    // 自动消失
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 3000);
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl + N: 新建文件夹
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showCreateFolder();
    }
    
    // Ctrl + U: 上传文件
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        document.getElementById('fileInput').click();
    }
    
    // F5: 刷新页面
    if (e.key === 'F5') {
        e.preventDefault();
        refreshPage();
    }
    
    // ESC: 关闭模态框
    if (e.key === 'Escape') {
        hideDeleteModal();
        hideFolderModal();
    }
});

// 拖拽上传功能
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.querySelector('.main-content');
    
    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropZone.style.background = 'rgba(255, 107, 157, 0.1)';
            dropZone.style.border = '2px dashed #ff6b9d';
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            dropZone.style.background = '';
            dropZone.style.border = '';
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropZone.style.background = '';
            dropZone.style.border = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                // 创建文件输入并上传
                const fileInput = document.getElementById('fileInput');
                fileInput.files = files;
                submitUpload();
            }
        });
    }
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .file-item {
        cursor: pointer;
        user-select: none;
    }
    
    .file-item:hover {
        transform: translateY(-5px) scale(1.02);
    }
    
    .action-btn:active {
        transform: translateY(0) scale(0.95);
    }
    
    .alert {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .modal {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .modal-content {
        animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// 添加一些可爱的交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 为按钮添加点击音效（模拟）
    const buttons = document.querySelectorAll('button, .action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // 添加可爱的点击效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 为文件项添加悬停效果
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 添加页面加载动画
window.addEventListener('load', function() {
    // 页面加载完成后的可爱动画
    const elements = document.querySelectorAll('.file-item, .action-btn, .section-title');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 图片预览功能
function openImagePreview(imageSrc, imageName) {
    const modal = document.getElementById('imagePreviewModal');
    const image = document.getElementById('previewImage');
    
    image.src = imageSrc;
    image.alt = imageName;
    modal.style.display = 'flex';
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    modal.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 点击模态框背景关闭
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imagePreviewModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImagePreview();
            }
        });
    }
    
    // ESC键关闭图片预览
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImagePreview();
        }
    });
});

// 分享功能相关变量
let currentShareFile = {
    path: '',
    name: '',
    type: ''
};

// 显示分享选项
function showShareOptions(filePath, fileName, fileType) {
    currentShareFile = {
        path: filePath,
        name: fileName,
        type: fileType
    };
    
    const modal = document.getElementById('shareModal');
    const fileNameSpan = document.getElementById('shareFileName');
    const shareOptions = document.getElementById('shareOptions');
    
    fileNameSpan.textContent = fileName;
    
    // 根据文件类型生成不同的分享选项
    let optionsHTML = '';
    
    if (fileType === 'image') {
        // 图片文件的分享选项
        optionsHTML = `
            <div class="share-option" onclick="shareDownloadLink()">
                <div class="share-option-icon">⬇️</div>
                <div class="share-option-content">
                    <h4>下载链接</h4>
                    <p>生成直接下载链接，方便分享给他人</p>
                </div>
            </div>
            <div class="share-option" onclick="shareDirectLink()">
                <div class="share-option-icon">🔗</div>
                <div class="share-option-content">
                    <h4>直链链接</h4>
                    <p>生成直接访问链接，可用于图床等引用</p>
                </div>
            </div>
        `;
    } else if (fileType === 'video' || fileType === 'audio') {
        // 视频和音频文件的分享选项
        optionsHTML = `
            <div class="share-option" onclick="shareDownloadLink()">
                <div class="share-option-icon">⬇️</div>
                <div class="share-option-content">
                    <h4>下载链接</h4>
                    <p>生成直接下载链接，方便分享给他人</p>
                </div>
            </div>
            <div class="share-option" onclick="shareDirectLink()">
                <div class="share-option-icon">🔗</div>
                <div class="share-option-content">
                    <h4>直链链接</h4>
                    <p>生成直接访问链接，可用于在线播放</p>
                </div>
            </div>
        `;
    } else if (fileType === 'text') {
        // 文本文件的分享选项
        optionsHTML = `
            <div class="share-option" onclick="shareDownloadLink()">
                <div class="share-option-icon">⬇️</div>
                <div class="share-option-content">
                    <h4>下载链接</h4>
                    <p>生成直接下载链接，方便分享给他人</p>
                </div>
            </div>
        `;
    } else {
        // 其他文件的分享选项（只有下载链接）
        optionsHTML = `
            <div class="share-option" onclick="shareDownloadLink()">
                <div class="share-option-icon">⬇️</div>
                <div class="share-option-content">
                    <h4>下载链接</h4>
                    <p>生成直接下载链接，方便分享给他人</p>
                </div>
            </div>
        `;
    }
    
    shareOptions.innerHTML = optionsHTML;
    modal.style.display = 'flex';
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 隐藏分享选项
function hideShareModal() {
    const modal = document.getElementById('shareModal');
    modal.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 分享下载链接
function shareDownloadLink() {
    const downloadUrl = `${window.location.origin}/public/download/${currentShareFile.path}`;
    
    // 尝试复制到剪贴板
    copyToClipboard(downloadUrl, '下载链接已复制到剪贴板！');
    
    hideShareModal();
}

// 分享直链链接
function shareDirectLink() {
    const directUrl = `${window.location.origin}/public/files/${currentShareFile.path}`;
    
    // 尝试复制到剪贴板
    copyToClipboard(directUrl, '直链链接已复制到剪贴板！');
    
    hideShareModal();
}

// 复制到剪贴板的通用函数
function copyToClipboard(text, successMessage) {
    // 方法1: 使用现代剪贴板API（需要用户交互）
    if (navigator.clipboard && window.isSecureContext) {
        // 确保在用户交互的上下文中执行
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage, 'success');
        }).catch((err) => {
            console.log('现代剪贴板API失败:', err);
            // 如果现代API失败，使用备用方法
            fallbackCopyToClipboard(text, successMessage);
        });
    } else {
        // 方法2: 使用传统方法
        fallbackCopyToClipboard(text, successMessage);
    }
}

// 备用剪贴板复制方法
function fallbackCopyToClipboard(text, successMessage) {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.style.zIndex = '-1';
    document.body.appendChild(textArea);
    
    // 选择文本并复制
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length); // 确保全选
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(successMessage, 'success');
        } else {
            // 如果复制失败，显示链接供用户手动复制
            showNotification(`链接：${text}`, 'info');
        }
    } catch (err) {
        console.log('传统复制方法失败:', err);
        // 显示链接供用户手动复制
        showNotification(`链接：${text}`, 'info');
    }
    
    // 清理临时元素
    document.body.removeChild(textArea);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#ff6b9d' : '#ff8fab'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(255, 107, 157, 0.3);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // 添加动画样式
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 点击分享模态框背景关闭
document.addEventListener('DOMContentLoaded', function() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.addEventListener('click', function(e) {
            if (e.target === shareModal) {
                hideShareModal();
            }
        });
    }
    
    // ESC键关闭分享模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideShareModal();
        }
    });
});
