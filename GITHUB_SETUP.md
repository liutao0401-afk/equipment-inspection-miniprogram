# GitHub 上传指南

本指南将帮助你将设备巡检小程序上传到 GitHub。

## 📋 前置条件

- 已安装 Git
- 拥有 GitHub 账户
- 已配置 Git 用户信息

## 🚀 上传步骤

### 1. 创建 GitHub 仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角的 "+" 按钮
3. 选择 "New repository"
4. 填写仓库信息：
   - **Repository name**: `equipment-inspection-miniprogram`
   - **Description**: `设备巡检小程序 - 微信小程序版本`
   - **Public/Private**: 选择 Public（公开）
   - **Initialize this repository with**: 不勾选任何选项
5. 点击 "Create repository"

### 2. 初始化本地仓库

```bash
# 进入项目目录
cd equipment-inspection-miniprogram

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: 设备巡检小程序项目初始化"
```

### 3. 连接远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/yourusername/equipment-inspection-miniprogram.git

# 验证远程仓库
git remote -v
```

### 4. 推送到 GitHub

```bash
# 重命名分支为 main（如果需要）
git branch -M main

# 推送到 GitHub
git push -u origin main
```

## 🔐 使用 SSH 密钥（推荐）

### 1. 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### 2. 添加 SSH 密钥到 GitHub

1. 复制公钥内容：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. 在 GitHub 中：
   - 点击右上角头像 → Settings
   - 选择 "SSH and GPG keys"
   - 点击 "New SSH key"
   - 粘贴公钥内容
   - 点击 "Add SSH key"

### 3. 使用 SSH 连接

```bash
# 修改远程仓库 URL
git remote set-url origin git@github.com:yourusername/equipment-inspection-miniprogram.git

# 验证连接
git remote -v
```

## 📝 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (type)

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

## 🔄 日常工作流程

### 创建新特性

```bash
# 创建并切换到新分支
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

# 创建新分支进行开发
git checkout -b feature/another-feature
```

### 同步上游仓库

```bash
# 添加上游仓库
git remote add upstream https://github.com/original-owner/equipment-inspection-miniprogram.git

# 拉取上游更改
git fetch upstream

# 合并上游更改
git merge upstream/main
```

## 📊 GitHub 配置

### 1. 添加 README

已包含 `README.md` 文件，包含：
- 项目描述
- 功能特性
- 快速开始
- 项目结构
- API 接口
- 开发指南

### 2. 添加 LICENSE

已包含 `LICENSE` 文件（MIT License）

### 3. 添加 .gitignore

已包含 `.gitignore` 文件，忽略：
- node_modules
- dist
- .env
- .DS_Store
- 等等

### 4. 添加 CONTRIBUTING

已包含 `CONTRIBUTING.md` 文件，说明：
- 如何报告 bug
- 如何建议功能
- 如何提交代码
- 代码风格指南

## 🏷️ 发布版本

### 创建 Release

```bash
# 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

### 在 GitHub 上创建 Release

1. 进入仓库主页
2. 点击 "Releases"
3. 点击 "Create a new release"
4. 填写版本信息：
   - **Tag version**: v1.0.0
   - **Release title**: Version 1.0.0
   - **Description**: 版本说明
5. 点击 "Publish release"

## 🔍 仓库设置

### 1. 分支保护

1. 进入 Settings → Branches
2. 点击 "Add rule"
3. 设置规则：
   - **Branch name pattern**: main
   - **Require pull request reviews**: 勾选
   - **Require status checks to pass**: 勾选

### 2. 代码所有者

创建 `.github/CODEOWNERS` 文件：

```
# 全局所有者
* @yourusername

# 特定文件所有者
/src/pages/ @yourusername
/src/components/ @yourusername
```

### 3. 问题模板

创建 `.github/ISSUE_TEMPLATE/bug_report.md`：

```markdown
---
name: Bug report
about: 报告一个 bug
---

## 描述
清晰简洁地描述 bug。

## 复现步骤
1. 进入 '...'
2. 点击 '...'
3. 看到错误

## 预期行为
应该发生什么。

## 实际行为
实际发生了什么。

## 环境
- 操作系统: [例如 Windows 10]
- 浏览器: [例如 Chrome]
- 版本: [例如 1.0.0]
```

## 📈 GitHub Actions

### 创建 CI/CD 工作流

创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm install
    - run: npm run build
    - run: npm run lint
```

## 🎯 最佳实践

1. **定期提交**: 频繁提交小的、有意义的更改
2. **清晰的提交信息**: 使用清晰的提交信息
3. **代码审查**: 在合并前进行代码审查
4. **文档更新**: 更新相关文档
5. **版本管理**: 使用语义化版本
6. **标签使用**: 为重要提交添加标签

## 🆘 常见问题

### Q: 如何修改已推送的提交？
A: 使用 `git amend` 修改最后一个提交，然后使用 `git push --force` 推送。

### Q: 如何撤销已推送的提交？
A: 使用 `git revert` 创建一个新的提交来撤销更改。

### Q: 如何合并分支？
A: 使用 `git merge` 或在 GitHub 上创建 Pull Request。

### Q: 如何处理合并冲突？
A: 手动编辑冲突文件，然后提交解决方案。

## 📞 获取帮助

- GitHub 文档: https://docs.github.com
- Git 文档: https://git-scm.com/doc
- 项目 Issues: https://github.com/yourusername/equipment-inspection-miniprogram/issues

---

**最后更新**: 2026-05-22
