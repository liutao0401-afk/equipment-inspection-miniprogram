#!/bin/bash

# 设备巡检小程序 - GitHub 初始化脚本
# 此脚本将帮助你快速初始化 GitHub 仓库

set -e

echo "=========================================="
echo "设备巡检小程序 - GitHub 初始化"
echo "=========================================="
echo ""

# 检查 Git 是否已安装
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

echo "✅ Git 已安装"
echo ""

# 获取用户信息
read -p "请输入你的 GitHub 用户名: " github_username
read -p "请输入你的 GitHub 仓库名 (默认: equipment-inspection-miniprogram): " repo_name
repo_name=${repo_name:-equipment-inspection-miniprogram}

echo ""
echo "=========================================="
echo "配置信息:"
echo "GitHub 用户名: $github_username"
echo "仓库名: $repo_name"
echo "=========================================="
echo ""

# 初始化 Git 仓库
if [ -d ".git" ]; then
    echo "⚠️  Git 仓库已存在，跳过初始化"
else
    echo "📝 初始化 Git 仓库..."
    git init
    echo "✅ Git 仓库已初始化"
fi

echo ""

# 配置 Git 用户信息
read -p "请输入你的 Git 用户名 (用于提交): " git_username
read -p "请输入你的 Git 邮箱 (用于提交): " git_email

echo "📝 配置 Git 用户信息..."
git config user.name "$git_username"
git config user.email "$git_email"
echo "✅ Git 用户信息已配置"

echo ""

# 添加所有文件
echo "📝 添加所有文件..."
git add .
echo "✅ 文件已添加"

echo ""

# 创建初始提交
echo "📝 创建初始提交..."
git commit -m "Initial commit: 设备巡检小程序项目初始化"
echo "✅ 初始提交已创建"

echo ""

# 重命名分支
echo "📝 重命名分支为 main..."
git branch -M main
echo "✅ 分支已重命名"

echo ""

# 添加远程仓库
echo "📝 添加远程仓库..."
git remote add origin https://github.com/$github_username/$repo_name.git
echo "✅ 远程仓库已添加"

echo ""

# 验证远程仓库
echo "📝 验证远程仓库..."
git remote -v
echo "✅ 远程仓库已验证"

echo ""
echo "=========================================="
echo "✅ GitHub 初始化完成！"
echo "=========================================="
echo ""
echo "下一步:"
echo "1. 在 GitHub 上创建仓库: https://github.com/new"
echo "   - Repository name: $repo_name"
echo "   - Description: 设备巡检小程序 - 微信小程序版本"
echo "   - Public"
echo ""
echo "2. 推送到 GitHub:"
echo "   git push -u origin main"
echo ""
echo "3. 验证推送:"
echo "   https://github.com/$github_username/$repo_name"
echo ""
echo "=========================================="
