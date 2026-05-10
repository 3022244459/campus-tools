# CI/CD 说明

当前仓库包含 `.github/workflows/ci.yml`，用于在 push 和 pull request 时执行基础验证。

## CI 覆盖范围

Workflow 使用 `windows-latest`，与本项目本地 Windows 命令保持一致：

```bat
npm ci
npm.cmd run verify:pilot
```

`verify:pilot` 会执行数据库迁移和 seed、TypeScript/服务端测试、Web 生产构建、Capacitor Android sync，并扫描生成的 `dist/` 与 Android Web 资源，避免演示账号或 mock 产物进入试点构建。CI 不会执行正式签名 release 构建，也不会读取 Android keystore、短信、支付、学校统一认证等生产凭证。

## Release 构建

正式 Android release 仍应在受控环境执行：

```bat
npm.cmd run build:android:release
```

该命令需要由学校或试点项目方提供签名证书，并通过环境变量注入：

```env
ANDROID_KEYSTORE_PATH=
ANDROID_KEYSTORE_PASSWORD=
ANDROID_KEY_ALIAS=
ANDROID_KEY_PASSWORD=
```

不要把证书、密码、短信服务密钥、统一认证密钥或支付凭证写入仓库。CI/CD 平台应使用受保护 secret store，并按环境区分测试、灰度和生产。

## 后续发布流水线

上线前还需要补齐：

- 灰度环境和生产环境隔离
- HTTPS 域名和 CORS 白名单切换
- Android 签名产物归档
- 数据库备份与回滚步骤
- 外部错误告警和审计日志检索
