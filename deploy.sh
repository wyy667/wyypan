#!/bin/bash

# 网懿云盘自动部署脚本
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查root权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "需要root权限运行"
        print_message "请使用: sudo $0"
        exit 1
    fi
}

# 检测系统类型
detect_system() {
    print_step "检测系统类型..."
    
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si)
        VER=$(lsb_release -sr)
    elif [[ -f /etc/debian_version ]]; then
        OS=Debian
        VER=$(cat /etc/debian_version)
    elif [[ -f /etc/redhat-release ]]; then
        OS=RedHat
    else
        OS=$(uname -s)
        VER=$(uname -r)
    fi
    
    print_message "检测到系统: $OS $VER"
}

# 安装依赖包
install_dependencies() {
    print_step "安装系统依赖..."
    
    if command -v apt-get &> /dev/null; then
        print_message "使用 apt-get 安装依赖..."
        apt-get update
        apt-get install -y python3 python3-pip python3-venv libmagic1 libmagic-dev unrar
    elif command -v yum &> /dev/null; then
        print_message "使用 yum 安装依赖..."
        yum update -y
        yum install -y python3 python3-pip python3-venv file-devel unrar
    elif command -v dnf &> /dev/null; then
        print_message "使用 dnf 安装依赖..."
        dnf update -y
        dnf install -y python3 python3-pip python3-venv file-devel unrar
    elif command -v pacman &> /dev/null; then
        print_message "使用 pacman 安装依赖..."
        pacman -Syu --noconfirm python python-pip file unrar
    else
        print_error "未找到支持的包管理器"
        exit 1
    fi
}

# 获取端口号
get_port() {
    while true; do
        echo -n "请输入端口号 (默认5000): "
        read -r port_input
        
        if [[ -z "$port_input" ]]; then
            PORT=5000
            break
        elif [[ "$port_input" =~ ^[0-9]+$ ]] && [[ "$port_input" -ge 1 ]] && [[ "$port_input" -le 65535 ]]; then
            PORT=$port_input
            break
        else
            print_error "端口号必须是1-65535之间的数字"
        fi
    done
    
    print_message "使用端口: $PORT"
}

# 创建项目目录
create_directories() {
    print_step "创建项目目录..."
    
    # 创建主目录
    if [[ ! -d "/root/网懿云盘" ]]; then
        mkdir -p /root/网懿云盘
        print_message "创建主目录: /root/网懿云盘"
    fi
    
    # 创建子目录
    mkdir -p /root/网懿云盘/templates
    mkdir -p /root/网懿云盘/static/css
    mkdir -p /root/网懿云盘/static/js
    mkdir -p /root/网懿云盘/static/images
    
    # 创建用户文件存储目录
    mkdir -p /root/网懿云盘/images
    print_message "创建用户文件存储目录: /root/网懿云盘/images"
    
    print_message "目录创建完成"
}

# 检查必要文件
check_required_files() {
    local target_dir="$1"
    local required_files=("app.py" "requirements.txt" "test.py" "README.md")
    local required_dirs=("templates" "static/css" "static/js")
    
    # 检查主文件
    for file in "${required_files[@]}"; do
        if [[ ! -f "$target_dir/$file" ]]; then
            print_error "必要文件不存在: $target_dir/$file"
            return 1
        fi
    done
    
    # 检查目录
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$target_dir/$dir" ]]; then
            print_error "必要目录不存在: $target_dir/$dir"
            return 1
        fi
    done
    
    return 0
}

# 复制项目文件
copy_files() {
    print_step "复制项目文件..."
    
    # 获取脚本所在目录
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    # 如果脚本就在目标目录中，检查必要文件
    if [[ "$SCRIPT_DIR" == "/root/网懿云盘" ]]; then
        print_message "脚本已在目标目录中，检查必要文件..."
        if check_required_files "/root/网懿云盘"; then
            print_message "所有必要文件已存在，跳过文件复制"
            return
        else
            print_error "目标目录中缺少必要文件，请确保所有项目文件都在正确位置"
            exit 1
        fi
    fi
    
    # 检查源文件是否存在
    if [[ ! -f "$SCRIPT_DIR/app.py" ]]; then
        print_error "源文件不存在: $SCRIPT_DIR/app.py"
        print_error "请确保在正确的项目目录中运行此脚本"
        exit 1
    fi
    
    # 复制主文件
    cp -f "$SCRIPT_DIR/app.py" /root/网懿云盘/
    cp -f "$SCRIPT_DIR/requirements.txt" /root/网懿云盘/
    cp -f "$SCRIPT_DIR/test.py" /root/网懿云盘/
    cp -f "$SCRIPT_DIR/README.md" /root/网懿云盘/
    
    # 复制模板文件
    if [[ -d "$SCRIPT_DIR/templates" ]]; then
        cp -f "$SCRIPT_DIR/templates/"*.html /root/网懿云盘/templates/ 2>/dev/null || true
    fi
    
    # 复制静态文件
    if [[ -d "$SCRIPT_DIR/static/css" ]]; then
        cp -f "$SCRIPT_DIR/static/css/"*.css /root/网懿云盘/static/css/ 2>/dev/null || true
    fi
    
    if [[ -d "$SCRIPT_DIR/static/js" ]]; then
        cp -f "$SCRIPT_DIR/static/js/"*.js /root/网懿云盘/static/js/ 2>/dev/null || true
    fi
    
    print_message "文件复制完成"
}

# 设置Python环境
setup_python_env() {
    print_step "设置Python环境..."
    cd /root/网懿云盘
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    print_message "Python环境设置完成"
}

# 创建用户文件
create_user_file() {
    print_step "创建用户文件..."
    mkdir -p /root/网懿云盘
    echo "admin:admin123" > /root/网懿云盘/admin.txt
    chmod 600 /root/网懿云盘/admin.txt
    print_message "默认用户: admin / admin123"
}

# 设置文件权限
set_permissions() {
    print_step "设置文件权限..."
    chown -R root:root /root/网懿云盘
    chmod -R 755 /root/网懿云盘
    chmod -R 777 /root/网懿云盘
    print_message "权限设置完成"
}

# 修改端口
update_port() {
    print_step "更新端口配置..."
    if [[ -f /root/网懿云盘/app.py ]]; then
        cp /root/网懿云盘/app.py /root/网懿云盘/app.py.bak
        sed -i "s/port=5000/port=$PORT/g" /root/网懿云盘/app.py
        print_message "端口配置更新完成"
    else
        print_warning "app.py文件不存在，跳过端口配置"
    fi
}

# 创建systemd服务
create_service() {
    print_step "创建系统服务..."
    
    cat > /etc/systemd/system/wangyi-cloud.service << EOF
[Unit]
Description=网懿云盘服务
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/网懿云盘
Environment=PATH=/root/网懿云盘/venv/bin
ExecStart=/root/网懿云盘/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable wangyi-cloud
    systemctl start wangyi-cloud
    print_message "系统服务创建完成"
}

# 配置防火墙
configure_firewall() {
    print_step "配置防火墙..."
    
    if command -v ufw &> /dev/null; then
        ufw allow $PORT/tcp
        print_message "UFW防火墙已配置"
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-port=$PORT/tcp
        firewall-cmd --reload
        print_message "firewalld已配置"
    else
        print_warning "请手动开放端口 $PORT"
    fi
}

# 获取服务器IP
get_server_ip() {
    print_step "获取服务器IP..."
    if command -v ip &> /dev/null; then
        SERVER_IP=$(ip route get 1.1.1.1 | awk '{print $7; exit}')
    else
        SERVER_IP=$(hostname -I | awk '{print $1}')
    fi
    print_message "服务器IP: $SERVER_IP"
}

# 显示部署结果
show_result() {
    echo ""
    echo "=========================================="
    print_message "网懿云盘部署完成！"
    echo "=========================================="
    echo ""
    echo "访问地址: http://$SERVER_IP:$PORT"
    echo "默认用户: admin"
    echo "默认密码: admin123"
    echo ""
    echo "管理命令:"
    echo "  启动服务: systemctl start wangyi-cloud"
    echo "  停止服务: systemctl stop wangyi-cloud"
    echo "  重启服务: systemctl restart wangyi-cloud"
    echo "  查看状态: systemctl status wangyi-cloud"
    echo "  查看日志: journalctl -u wangyi-cloud -f"
    echo ""
    echo "=========================================="
}



# 主函数
main() {
    echo "=========================================="
    echo "网懿云盘自动部署脚本"
    echo "=========================================="
    echo ""
    
    check_root
    detect_system
    get_port
    install_dependencies
    
    create_directories
    copy_files
    setup_python_env
    create_user_file
    set_permissions
    update_port
    create_service
    configure_firewall
    get_server_ip
    show_result
}

main "$@"
