# 设备巡检小程序 (Equipment Inspection Mini Program)

一个基于微信小程序的设备巡检管理系统，支持巡检计划、巡检执行、报修管理等功能。

## 📱 功能特性

### 核心功能
- ✅ 巡检计划管理
- ✅ 巡检执行记录
- ✅ 设备台账查询
- ✅ 报修单管理
- ✅ 待维修列表
- ✅ 个人信息管理
- ✅ 消息通知
- ✅ 操作日志

### 技术特点
- 🎨 现代化 UI 设计
- 📱 完全响应式布局
- 🔐 权限控制系统
- 🌐 多环境支持 (内网/外网)
- 📸 照片拍摄和上传
- 🔔 实时通知提醒
- 📊 数据统计分析

---

## 🚀 快速开始

### 环境要求
- 微信开发者工具
- Node.js 14+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/equipment-inspection-miniprogram.git
cd equipment-inspection-miniprogram
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境**
编辑 `src/config/env.ts` 配置 API 端点：
```typescript
// 内网环境
API_BASE_URL = 'http://192.188.88.48:3000/api'

// 外网环境
API_BASE_URL = 'https://weixin.hazlai.com/api'
```

4. **开发模式**
```bash
npm run dev
```

5. **构建**
```bash
npm run build
```

---

## 📋 项目结构

```
equipment-inspection-miniprogram/
├── src/
│   ├── pages/                    # 页面文件
│   │   ├── index/               # 首页
│   │   ├── tasks/               # 任务记录
│   │   ├── inspect/             # 巡检执行
│   │   ├── repair/              # 报修单
│   │   ├── maintenance/         # 待维修
│   │   ├── profile/             # 个人信息
│   │   ├── notifications/       # 消息通知
│   │   └── settings/            # 系统设置
│   │
│   ├── components/              # 组件
│   │   ├── layout/              # 布局组件
│   │   ├── common/              # 通用组件
│   │   └── ui/                  # UI 组件
│   │
│   ├── config/                  # 配置文件
│   │   ├── env.ts               # 环境配置
│   │   └── constants.ts         # 常量定义
│   │
│   ├── lib/                     # 工具库
│   │   ├── request.ts           # 网络请求
│   │   ├── storage.ts           # 本地存储
│   │   └── utils.ts             # 工具函数
│   │
│   ├── app.tsx                  # 应用入口
│   └── index.css                # 全局样式
│
├── public/                      # 静态资源
├── dist/                        # 构建输出
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔐 用户角色

### 巡检员 (Inspector)
- 查看巡检计划
- 执行巡检任务
- 记录巡检结果
- 创建报修单
- 查看个人信息

### 维修员 (Maintenance)
- 查看待派单报修
- 接单维修任务
- 完成维修并上传照片
- 查看维修记录
- 查看个人信息

### 管理员 (Admin)
- 查看所有数据
- 管理用户权限
- 查看系统日志
- 系统设置

---

## 🌐 网络配置

### 内网环境
```
API 端点: http://192.188.88.48:3000/api
协议: HTTP
端口: 3000
```

### 外网环境
```
API 端点: https://weixin.hazlai.com/api
协议: HTTPS
端口: 443
域名: weixin.hazlai.com
```

---

## 📱 页面说明

### 首页 (Index)
- 显示统计信息
- 快捷入口
- 最近任务列表

### 任务记录 (Tasks)
- 巡检任务列表
- 任务详情
- 任务搜索和筛选

### 巡检执行 (Inspect)
- 扫描二维码
- 设备信息显示
- 巡检数据录入
- 照片拍摄

### 报修单 (Repair)
- 报修单列表
- 创建报修
- 报修详情
- 维修员接单

### 待维修 (Maintenance)
- 待分配任务
- 维修中任务
- 维修完成记录
- 维修详情

### 个人信息 (Profile)
- 用户信息
- 班组信息
- 权限信息

### 消息通知 (Notifications)
- 系统通知
- 任务提醒
- 维修通知

### 系统设置 (Settings)
- 账户设置
- 隐私设置
- 关于应用

---

## 🔌 API 接口

### 认证相关
```
POST   /api/auth/login           # 登录
POST   /api/auth/logout          # 登出
GET    /api/auth/profile         # 获取用户信息
```

### 巡检相关
```
GET    /api/inspection/plans     # 获取巡检计划
POST   /api/inspection/execute   # 执行巡检
GET    /api/inspection/records   # 获取巡检记录
```

### 报修相关
```
GET    /api/repairs              # 获取报修单
POST   /api/repairs              # 创建报修单
PUT    /api/repairs/:id          # 更新报修单
```

### 维修相关
```
GET    /api/maintenance          # 获取维修记录
POST   /api/maintenance/from-repair  # 创建维修记录
PUT    /api/maintenance/:id      # 更新维修记录
```

---

## 🧪 测试账户

| 用户名 | 密码 | 角色 | 班组 |
|--------|------|------|------|
| inspector | 123456 | 巡检员 | 巡检一班 |
| maintenance | 123456 | 维修员 | 维修班 |
| admin | 123456 | 管理员 | - |

---

## 📸 功能演示

### 巡检执行流程
1. 打开小程序
2. 进入"巡检执行"页面
3. 扫描设备二维码
4. 填写巡检数据
5. 拍摄设备照片
6. 提交巡检记录

### 报修流程
1. 进入"报修单"页面
2. 点击"新增"按钮
3. 选择设备
4. 填写故障描述
5. 拍摄现场照片
6. 提交报修单

### 维修流程
1. 进入"待维修"页面
2. 查看待派单任务
3. 点击"接单"按钮
4. 进行维修操作
5. 填写维修详情
6. 上传维修完成照片
7. 提交维修完成

---

## 🛠️ 开发指南

### 添加新页面
1. 在 `src/pages` 中创建新目录
2. 创建 `index.tsx` 和 `index.css`
3. 在 `src/app.tsx` 中添加路由

### 添加新组件
1. 在 `src/components` 中创建新文件
2. 导出组件
3. 在需要的地方导入使用

### 调用 API
```typescript
import { request } from '@/lib/request'

// GET 请求
const data = await request('/api/repairs')

// POST 请求
const result = await request('/api/repairs', {
  method: 'POST',
  body: JSON.stringify({ ... })
})
```

### 本地存储
```typescript
import { storage } from '@/lib/storage'

// 保存数据
storage.setItem('key', value)

// 获取数据
const value = storage.getItem('key')

// 删除数据
storage.removeItem('key')
```

---

## 🐛 常见问题

### Q: 如何切换内网/外网环境？
A: 编辑 `src/config/env.ts` 文件，修改 `API_BASE_URL` 的值。

### Q: 如何拍照上传？
A: 使用微信小程序的 `wx.chooseImage` 和 `wx.uploadFile` API。

### Q: 如何处理网络错误？
A: 在 `src/lib/request.ts` 中添加错误处理逻辑。

### Q: 如何添加新的权限？
A: 在后端 API 中定义权限，在前端检查用户权限。

---

## 📚 相关文档

- [快速开始指南](./docs/QUICK_START.md)
- [API 文档](./docs/API.md)
- [开发指南](./docs/DEVELOPER.md)
- [部署指南](./docs/DEPLOYMENT.md)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交流程
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

## 📞 联系方式

- 项目主页: https://github.com/yourusername/equipment-inspection-miniprogram
- 问题反馈: https://github.com/yourusername/equipment-inspection-miniprogram/issues
- 邮箱: your.email@example.com

---

## 🙏 致谢

感谢所有贡献者和使用者的支持！

---

**最后更新**: 2026-05-22  
**版本**: 1.0.0  
**状态**: 开发中
