# 贡献指南

感谢你对设备巡检小程序的兴趣！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果你发现了 bug，请创建一个 Issue：

1. 使用清晰的标题描述问题
2. 提供详细的复现步骤
3. 说明预期行为和实际行为
4. 包含截图或错误日志（如果适用）

### 建议功能

如果你有功能建议，请创建一个 Issue：

1. 使用清晰的标题描述功能
2. 提供详细的功能描述
3. 解释为什么这个功能有用
4. 列出可能的实现方式

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/yourusername/equipment-inspection-miniprogram.git
   ```

2. **创建特性分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **提交更改**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **推送到分支**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **开启 Pull Request**
   - 提供清晰的 PR 描述
   - 链接相关的 Issue
   - 确保代码通过所有测试

## 📋 代码风格

### TypeScript
- 使用 TypeScript 编写代码
- 为所有函数添加类型注解
- 避免使用 `any` 类型

### 命名规范
- 文件名: `kebab-case` (例如: `user-profile.tsx`)
- 组件名: `PascalCase` (例如: `UserProfile`)
- 变量名: `camelCase` (例如: `userName`)
- 常量名: `UPPER_SNAKE_CASE` (例如: `MAX_RETRY_COUNT`)

### 代码格式
- 使用 2 个空格缩进
- 使用单引号
- 行长度不超过 100 个字符
- 在文件末尾添加空行

### 注释
- 为复杂逻辑添加注释
- 为公共 API 添加 JSDoc 注释
- 保持注释简洁明了

## 🧪 测试

- 为新功能添加测试
- 确保所有测试通过
- 保持测试覆盖率 > 80%

## 📝 提交信息

使用清晰的提交信息：

```
feat: 添加用户认证功能
fix: 修复报修单列表显示问题
docs: 更新 README
style: 格式化代码
refactor: 重构网络请求模块
test: 添加用户认证测试
chore: 更新依赖
```

## 🔄 Pull Request 流程

1. 确保你的代码遵循代码风格指南
2. 更新相关文档
3. 添加或更新测试
4. 确保所有测试通过
5. 提供清晰的 PR 描述

## 📚 文档

- 更新 README.md（如果添加了新功能）
- 添加代码注释
- 更新 API 文档（如果修改了 API）

## 🎯 开发流程

1. 从 `main` 分支创建新分支
2. 进行开发和测试
3. 提交 Pull Request
4. 等待代码审查
5. 根据反馈进行修改
6. 合并到 `main` 分支

## 📞 联系方式

- 创建 Issue 讨论
- 发送邮件: your.email@example.com
- 加入讨论组

## 🙏 致谢

感谢所有贡献者的支持！

---

**最后更新**: 2026-05-22
