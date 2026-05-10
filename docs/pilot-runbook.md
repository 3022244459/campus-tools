# 试点部署运行手册

本手册用于把当前仓库部署到一个受控试点环境。真实域名、HTTPS 证书、短信、支付、学校统一认证、Android 签名证书和外部告警凭证仍由学校或试点项目方提供，不能写入仓库。

## 1. 准备环境变量

以 `.env.pilot.example` 为模板，在部署平台或主机环境中配置真实值。后端和数据库脚本会按“系统环境变量 > `.env.local` > `.env`”的优先级读取配置：

```bat
set APP_ENV=pilot
set DATA_STORE=sqlite
set SQLITE_DB_FILE=server/data/campus.sqlite
set CORS_ORIGINS=https://campus.example.edu,capacitor://localhost
set TRUST_PROXY=loopback
set RATE_LIMIT_WINDOW_MS=60000
set RATE_LIMIT_MAX_REQUESTS=120
set REQUEST_BODY_LIMIT=100kb
set SESSION_TTL_HOURS=168
set LOG_MAX_BYTES=5000000
set VITE_API_BASE_URL=https://campus.example.edu/api
set VITE_ENABLE_MOCK_FALLBACK=false
set VITE_SHOW_DEMO_CREDENTIALS=false
```

必须替换 `campus.example.edu`。如果设置 `ALERT_WEBHOOK_URL`，必须使用 HTTPS webhook，并确认 webhook 不需要把 token、密码或请求体发出去。

## 2. 安装与构建前检查

```bat
npm ci
npm.cmd run verify:pilot
```

`verify:pilot` 会执行迁移、seed、TypeScript 检查、服务端测试、Web 构建、Android sync，并扫描生成产物，防止演示账号或 mock 产物进入试点包。

## 3. 初始化或升级数据库

首次部署或升级前执行：

```bat
npm.cmd run db:migrate
npm.cmd run db:seed
```

普通 `db:seed` 是幂等的：SQLite 已存在 `app_state` 时会跳过重置；只有 `npm.cmd run db:seed -- --force` 才会覆盖为种子数据。

升级已有试点数据前先备份：

```bat
set DATA_STORE=sqlite
npm.cmd run db:backup
```

备份默认写入 `server/backups`，该目录不进入 git。发布记录中应保存备份文件名、发布时间、构建版本和操作者。

## 4. 启动 API

```bat
set APP_ENV=pilot
set DATA_STORE=sqlite
npm.cmd run start:api
```

API 进程前面应放置 HTTPS 网关或反向代理。反向代理负责 TLS 证书、域名、访问日志保留和请求大小限制；Express API 只接收来自受控网关或本机的流量，并通过 `REQUEST_BODY_LIMIT` 保留应用层 JSON 请求体上限。
API 进程收到 `SIGINT` 或 `SIGTERM` 时会停止接收新连接，并尝试在 10 秒内优雅退出；发布系统应先切走流量，再停止旧进程。

## 5. 验证就绪状态

部署后至少检查：

```text
GET https://campus.example.edu/api/health
GET https://campus.example.edu/api/health/ready
```

`/api/health/ready` 必须返回 `200`。如果返回 `503`，先检查 `APP_ENV`、`DATA_STORE`、SQLite 文件路径、迁移状态和 seed 数据。

## 6. 发布 Android 试点包

调试包：

```bat
npm.cmd run build:android
```

正式 release 链路：

```bat
npm.cmd run build:android:release
```

正式 release 需要通过受保护 secret 注入 `ANDROID_KEYSTORE_PATH`、`ANDROID_KEYSTORE_PASSWORD`、`ANDROID_KEY_ALIAS` 和 `ANDROID_KEY_PASSWORD`。未配置签名时只能用于内部链路验证，不能正式分发。

## 7. 冒烟检查

试点发布后人工走查：

- 学生登录、会话恢复、退出登录
- 教师登录、教师审批、文件代送提交
- 管理员登录、公告发布、审计日志、用户会话清退
- 代取发布、报修提交、失物招领发布
- 钱包、快递、快递比价读取
- `/api/admin/metrics` 不包含 token、密码、请求体或 query 明文
- Android 真机或模拟器能访问 HTTPS API

## 8. 回滚

回滚前保留当前数据：

```bat
set DATA_STORE=sqlite
npm.cmd run db:backup
```

恢复指定备份：

```bat
set DATA_STORE=sqlite
set RESTORE_CONFIRM=overwrite-local-data
npm.cmd run db:restore -- server\backups\campus-sqlite-YYYY-MM-DD.sqlite
```

恢复脚本会先生成 `pre-restore-*` 备份。SQLite 恢复会清理旧的 `-wal`、`-shm` 和 `-journal` sidecar 文件，避免旧 WAL 数据污染新恢复的主库。恢复后重新执行 `/api/health/ready` 和核心业务冒烟检查。
