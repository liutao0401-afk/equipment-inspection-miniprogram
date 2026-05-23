# 快速开始指南

## 📱 设备巡检小程序

欢迎使用设备巡检小程序！本指南将帮助你快速上手。

## 🚀 5 分钟快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 打开浏览器

访问 http://localhost:5177

### 4. 登录

使用测试账户登录：
- 用户名: `inspector`
- 密码: `123456`

## 📋 主要功能

### 首页
- 查看统计信息
- 快速入口
- 最近任务

### 巡检执行
- 扫描设备二维码
- 填写巡检数据
- 拍摄设备照片
- 提交巡检记录

### 报修单
- 查看报修列表
- 创建新报修
- 查看报修详情
- 维修员接单

### 待维修
- 查看待派单任务
- 接单维修
- 完成维修
- 上传维修照片

### 个人信息
- 查看用户信息
- 查看班组信息
- 查看权限信息

## 🔐 测试账户

| 用户名 | 密码 | 角色 |
|--------|------|------|
| inspector | 123456 | 巡检员 |
| maintenance | 123456 | 维修员 |
| admin | 123456 | 管理员 |

## 🌐 环境配置

### 开发环境（内网）
```
API 端点: http://192.188.88.48:3000/api
```

### 生产环境（外网）
```
API 端点: https://weixin.hazlai.com/api
```

修改 `src/config/env.ts` 切换环境。

## 📁 项目结构

```
src/
├── pages/          # 页面
├── components/     # 组件
├── config/         # 配置
├── lib/            # 工具库
├── app.tsx         # 应用入口
└── index.css       # 全局样式
```

## 🛠️ 常用命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 📚 常见操作

### 创建报修单

1. 进入"报修单"页面
2. 点击"新增"按钮
3. 选择设备
4. 填写故障描述
5. 拍摄现场照片
6. 点击"提交"

### 接单维修

1. 进入"待维修"页面
2. 查看待派单任务
3. 点击"接单"按钮
4. 确认接单

### 完成维修

1. 进入"待维修"页面
2. 查看维修中任务
3. 点击"完成"按钮
4. 填写维修详情
5. 上传维修照片
6. 点击"完成维修"

## 🐛 常见问题

### Q: 无法连接到 API？
A: 检查 `src/config/env.ts` 中的 API 端点配置。

### Q: 如何切换用户？
A: 点击"个人信息"页面的"退出登录"按钮，然后使用其他账户登录。

### Q: 如何拍照上传？
A: 在需要上传照片的地方，点击"拍照"或"上传"按钮。

### Q: 如何查看错误日志？
A: 打开浏览器开发者工具（F12），查看 Console 标签。

## 📖 更多文档

- [README.md](./README.md) - 项目概述
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - GitHub 上传指南

## 🆘 获取帮助

- 查看项目 Issues: https://github.com/yourusername/equipment-inspection-miniprogram/issues
- 发送邮件: your.email@example.com
- 查看文档: 本项目的 docs 目录

## ✨ 下一步

1. 阅读 [README.md](./README.md) 了解项目详情
2. 查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何贡献
3. 开始开发你的功能！

---

**最后更新**: 2026-05-22  
**版本**: 1.0.0
