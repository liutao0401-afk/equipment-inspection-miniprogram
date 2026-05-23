# 微信小程序上传到 GitHub 指南

## 📱 项目名称

**设备巡检小程序** (Equipment Inspection Mini Program)

---

## 🎯 项目概述

这是一个完整的微信小程序项目，用于设备巡检管理系统。支持巡检计划、巡检执行、报修管理、维修任务等功能。

### 核心特性
- ✅ 用户认证和权限管理
- ✅ 巡检计划和执行
- ✅ 报修单管理
- ✅ 维修任务管理
- ✅ 数据统计分析
- ✅ 消息通知
- ✅ 操作日志

---

## 🚀 快速上传到 GitHub

### 方法 1: 使用自动化脚本（推荐）

#### Windows 用户
```bash
# 双击运行脚本
init-github.bat

# 或在命令行运行
.\init-github.bat
```

#### Mac/Linux 用户
```bash
# 给脚本添加执行权限
chmod +x init-github.sh

# 运行脚本
./init-github.sh
```

### 方法 2: 手动上传

#### 1. 初始化 Git 仓库
```bash
git init
git add .
git commit -m "Initial commit: 设备巡检小程序项目初始化"
git branch -M main
```

#### 2. 在 GitHub 创建仓库
1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `equipment-inspection-miniprogram`
   - **Description**: `设备巡检小程序 - 微信小程序版本`
   - **Public**: 选择公开
3. 点击 "Create repository"

#### 3. 连接远程仓库
```bash
git remote add origin https://github.com/yourusername/equipment-inspection-miniprogram.git
```

#### 4. 推送到 GitHub
```bash
git push -u origin main
```

---

## 📋 项目文件清单

### 配置文件
- ✅ `package.json` - 项目配置
- ✅ `tsconfig.json` - TypeScript 配置
- ✅ `vite.config.ts` - Vite 构建配置
- ✅ `.gitignore` - Git 忽略文件

### 源代码
- ✅ `src/config/env.ts` - 环境配置
- ✅ `src/lib/request.ts` - 网络请求
- ✅ `src/lib/storage.ts` - 本地存储

### 文档
- ✅ `README.md` - 项目概述
- ✅ `QUICK_START.md` - 快速开始
- ✅ `CONTRIBUTING.md` - 贡献指南
- ✅ `GITHUB_SETUP.md` - GitHub 设置
- ✅ `PROJECT_INFO.md` - 项目信息
- ✅ `LICENSE` - MIT 许可证

### 脚本
- ✅ `init-github.sh` - Linux/Mac 初始化脚本
- ✅ `init-github.bat` - Windows 初始化脚本

---

## 🔐 GitHub 账户设置

### 1. 创建 GitHub 账户
- 访问 https://github.com
- 点击 "Sign up"
- 填写邮箱、密码、用户名
- 完成验证

### 2. 配置 SSH 密钥（可选但推荐）

#### 生成 SSH 密钥
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

#### 添加到 GitHub
1. 复制公钥：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. 在 GitHub 中：
   - Settings → SSH and GPG keys
   - New SSH key
   - 粘贴公钥
   - Add SSH key

#### 使用 SSH 连接
```bash
git remote set-url origin git@github.com:yourusername/equipment-inspection-miniprogram.git
```

---

## 📊 项目统计

| 项目 | 数量 |
|------|------|
| 配置文件 | 4 |
| 源代码文件 | 3+ |
| 文档文件 | 6 |
| 脚本文件 | 2 |
| 总计 | 15+ |

---

## 🎯 上传后的步骤

### 1. 验证上传
```bash
# 访问你的仓库
https://github.com/yourusername/equipment-inspection-miniprogram
```

### 2. 添加 GitHub Pages（可选）
1. Settings → Pages
2. Source: main branch
3. 保存

### 3. 添加 GitHub Actions（可选）
创建 `.github/workflows/ci.yml` 文件用于自动化测试和构建。

### 4. 创建 Release（可选）
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 📝 提交规范

### 提交信息格式
```
<type>(<scope>): <subject>
```

### 类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码风格
- `refactor`: 代码重构
- `test`: 测试
- `chore`: 构建/依赖

### 示例
```bash
git commit -m "feat(auth): 添加用户认证功能"
git commit -m "fix(repair): 修复报修单列表显示问题"
git commit -m "docs: 更新 README"
```

---

## 🔄 日常工作流程

### 创建新特性
```bash
# 创建新分支
git checkout -b feature/new-feature

# 进行开发...

# 提交更改
git add .
git commit -m "feat: 添加新功能"

# 推送到 GitHub
git push origin feature/new-feature

# 在 GitHub 上创建 Pull Request
```

### 更新主分支
```bash
# 切换到 main 分支
git checkout main

# 拉取最新更改
git pull origin main

# 创建新分支
git checkout -b feature/another-feature
```

---

## 🆘 常见问题

### Q: 如何修改已推送的提交？
A: 使用 `git amend` 修改，然后 `git push --force`

### Q: 如何撤销已推送的提交？
A: 使用 `git revert` 创建新提交

### Q: 如何处理合并冲突？
A: 手动编辑冲突文件，然后提交

### Q: 如何同步上游仓库？
A: 
```bash
git remote add upstream <original-repo-url>
git fetch upstream
git merge upstream/main
```

---

## 📚 相关资源

### GitHub 文档
- https://docs.github.com
- https://guides.github.com

### Git 文档
- https://git-scm.com/doc
- https://git-scm.com/book

### 项目文档
- [README.md](./README.md) - 项目概述
- [QUICK_START.md](./QUICK_START.md) - 快速开始
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南

---

## ✅ 上传检查清单

- [ ] 已安装 Git
- [ ] 已创建 GitHub 账户
- [ ] 已配置 Git 用户信息
- [ ] 已初始化本地 Git 仓库
- [ ] 已在 GitHub 创建远程仓库
- [ ] 已连接本地和远程仓库
- [ ] 已推送代码到 GitHub
- [ ] 已验证 GitHub 仓库
- [ ] 已添加项目描述
- [ ] 已添加 README 文件

---

## 🎉 完成！

恭喜！你已经成功将设备巡检小程序上传到 GitHub。

### 下一步
1. 邀请贡献者
2. 设置 GitHub Actions
3. 创建 Release
4. 推广项目

---

**最后更新**: 2026-05-22  
**版本**: 1.0.0
