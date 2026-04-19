# Mailcheck（中文说明）

Mailcheck 是一个用于检查和纠正电子邮件地址拼写错误的工具。它可以帮助用户在输入邮箱时自动检测常见的域名错误（例如 `gamil.com` → `gmail.com`），从而提升数据准确性和用户体验。

## ✨ 功能特性

- 自动检测邮箱域名拼写错误
- 提供智能纠正建议
- 支持常见邮箱服务商（如 Gmail、Outlook、Yahoo 等）
- 轻量、易集成

## 📦 安装

根据项目实际情况选择安装方式，例如：

```bash
npm install mailcheck
```

或直接引入源码文件。

## 🚀 使用示例

```javascript
import Mailcheck from 'mailcheck';

const result = Mailcheck.run({
  email: 'user@gamil.com'
});

if (result) {
  console.log(`你是否想输入：${result.full}?`);
}
```

## ⚙️ 配置

你可以自定义支持的域名列表：

```javascript
Mailcheck.run({
  email: 'user@gnail.com',
  domains: ['gmail.com', 'yahoo.com']
});
```

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进本项目。

## 📄 许可证

请参考原仓库中的 LICENSE 文件。

---

如果你觉得这个项目对你有帮助，欢迎 ⭐️ 支持！
