# 校园宝

一个基于 React、Vite、Capacitor、Express API 和 SQLite 试点存储构建的校园工具 App。

当前定位是“可本地运行、可 Android 同步、可自动验收的试点基础版”。仓库已经具备真实登录、会话持久化、SQLite migration/seed/backup/restore、管理员后台、审计日志、基础安全配置、CI 验收和 Android 调试 / release 构建链路；学校统一认证、HTTPS 域名、短信/支付、正式签名证书和外部监控仍需在试点环境由外部平台提供并完成联调。

## 当前能力

- 学生端 / 教师端 / 管理员三类角色
- 本地 Express API，支持 JSON 开发存储与 SQLite 试点存储
- SQLite 迁移、种子、备份、恢复和生成数据防误提交规则
- 登录、会话恢复、401 失效处理和管理员会话清退
- 首页、个人中心、快递、钱包、代取、报修、失物招领等页面联调
- 个人活动历史页
  - 我的代取订单
  - 我的报修
  - 我的发布
- 开发模式下 API 不可用时可回退到 mock 数据，试点/生产构建禁止回退
- Capacitor Android 工程同步、调试 APK 和签名 release 构建链路
- `npm.cmd run verify:pilot` 自动执行迁移、seed、检查、构建、Android sync 和生成产物扫描

## 演示账号

- 学生：`student001 / campus123`
- 教师：`teacher001 / campus123`
- 管理员：请选择教师入口，使用 `admin001 / campus123`

## 技术栈

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Capacitor 8
- Express 4
- Node.js 22

## 本地运行

前置要求：

- Node.js 22+
- npm

安装依赖：

```bash
npm.cmd install
```

分别启动前端和后端：

```bash
npm.cmd run dev:api
npm.cmd run dev:web
```

默认访问地址：

```text
Web: http://localhost:3000
API: http://127.0.0.1:8787
```

健康检查接口：

```text
GET /api/health
GET /api/health/ready
```

`/api/health/ready` 会加载当前 `DATA_STORE` 并检查学生、教师、管理员、公告、快递、钱包、比价和教师办公种子数据是否可用；未就绪时返回 `503`。

后端和数据库脚本会按“系统环境变量 > `.env.local` > `.env`”的优先级读取配置。试点部署前至少需要配置：

```env
API_PORT=8787
APP_ENV=development
DATA_STORE=json
SQLITE_DB_FILE=server/data/campus.sqlite
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,capacitor://localhost,http://localhost
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
REQUEST_BODY_LIMIT=100kb
SESSION_TTL_HOURS=168
LOG_MAX_BYTES=5000000
ALERT_WEBHOOK_URL=
ALERT_MIN_STATUS_CODE=500
VITE_API_BASE_URL=/api
VITE_ENABLE_MOCK_FALLBACK=true
VITE_SHOW_DEMO_CREDENTIALS=true
```

`SESSION_TTL_HOURS` controls login token lifetime. Production-like environments require an explicit integer between `1` and `720`.
Production-like numeric settings such as `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `LOG_MAX_BYTES`, and `ALERT_MIN_STATUS_CODE` are validated instead of silently falling back to defaults.

当 `APP_ENV=staging`、`pilot` 或 `production` 时，后端会在启动时校验：`CORS_ORIGINS` 必须显式配置且不能为 `*`，`TRUST_PROXY` 必须为反向代理场景显式开启，`REQUEST_BODY_LIMIT` 必须显式配置，`LOG_MAX_BYTES` 不能过小，`VITE_ENABLE_MOCK_FALLBACK` 不能开启，`DATA_STORE` 必须使用当前已实现的 `sqlite`。

试点环境不要直接使用本地演示 `.env.example`。请以 `.env.pilot.example` 作为模板，通过部署平台或受控环境变量注入真实 HTTPS 域名、API 地址、告警 webhook 和 Android 签名信息。

当前默认使用 JSON 数据文件以兼容已有演示数据。要切换到 SQLite：

```bat
npm.cmd run db:migrate
npm.cmd run db:seed
set DATA_STORE=sqlite
npm.cmd run dev:api
```

普通 `db:seed` 是幂等的：SQLite 已存在 `app_state` 时会跳过重置；只有 `npm.cmd run db:seed -- --force` 才会覆盖为种子数据。

SQLite 模式会把当前 `server/data/db.json` 作为种子写入 `server/data/campus.sqlite`。当前已拆出 `users`、`sessions`、`announcements`、`audit_logs`、`takeout_orders`、`repair_requests`、`lost_found_items`、`teacher_document_orders`、`teacher_leave_applications`、`teacher_student_affair_applications`、`courier_accounts`、`courier_packages`、`wallet_accounts`、`wallet_transactions`、`compare_carriers` 等规范化表，同时保留 `app_state` 兼容快照以维持现有 API 合约。

发布、升级或重置数据前建议先备份：
```bat
set DATA_STORE=sqlite
npm.cmd run db:backup
```
备份默认输出到 `server/backups`，可通过 `BACKUP_DIR` 改写；生成的备份文件不会进入 git。
恢复备份需要显式确认，避免误覆盖本地数据：
```bat
set DATA_STORE=sqlite
set RESTORE_CONFIRM=overwrite-local-data
npm.cmd run db:restore -- server\backups\campus-sqlite-YYYY-MM-DD.sqlite
```
恢复前脚本会把当前数据再复制一份到 `server/backups/pre-restore-*`。

Windows 下也可以直接运行：

```bat
start-windows.bat
```

这个脚本会：

1. 检查 Node 和 npm
2. 自动创建 `.env.local`
3. 安装依赖
4. 执行 SQLite migration
5. 执行 SQLite seed
6. 以 `DATA_STORE=sqlite` 启动本地 API
7. 启动前端开发服务器

## Android 预览

### 方式一：在 Android Studio 中预览已构建版本

先执行：

```bash
npm.cmd run build
npx.cmd cap sync android
```

然后用 Android Studio 打开 [android](./android)。

在 Android Studio 中：

1. 等待 Gradle Sync 完成
2. 选择一个模拟器或已连接真机
3. 点击 `Run 'app'`
4. 应用启动后即可预览当前 Web 构建结果

说明：

- Capacitor 会读取 `dist/` 里的前端产物
- 所以前端改动后，如果要在 Android Studio 里看到最新内容，需要重新执行：

```bash
npm.cmd run build
npx.cmd cap sync android
```

### 方式二：一键生成调试 APK

Windows 下可以直接运行：

```bat
build-android.bat
```

Android 调试包和 release 包都需要本机 `JAVA_HOME` 指向 JDK 17 或更新版本；脚本会在执行 Gradle 前检查 Java 版本。

这个脚本会自动执行：

1. Java 17+ 预检查
2. `npm.cmd run build`
3. `npx.cmd cap sync android`
4. `android/gradlew assembleDebug`

生成的 APK 默认在：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release 构建准备

```bat
build-android-release.bat
```

正式 release 需要外部提供 Android 签名证书，并通过环境变量配置签名信息。详见 [Android 发布准备](./docs/android-release.md)。

基础 CI 已配置在 `.github/workflows/ci.yml`，会在 Windows runner 上执行 `npm.cmd run verify:pilot`，覆盖数据库迁移/seed、检查、Web 构建、Android sync 和生成产物扫描。正式签名 release 仍需要受保护的外部 secret。

## 质量检查

前端类型检查：

```bash
npm.cmd run lint
```

后端类型检查：

```bash
npm.cmd run lint:server
```

后端测试：

```bash
npm.cmd run test:server
```

完整检查：

```bash
npm.cmd run check
```

Windows 下建议使用：

```bat
npm.cmd run check
```

试点交付前可以运行完整本地验收：

```bat
npm.cmd run verify:pilot
```

该命令会检查关键代码、文档、迁移和脚本是否存在，并执行 `db:migrate`、`db:seed`、`check`、`build`、`build:android`。构建完成后还会扫描 `dist/` 和 Android Web 资源，确保试点产物中不包含演示账号、mock 回退 chunk 或前端 mock 标识。

## 构建

构建 Web：

```bash
npm.cmd run build
```

同步 Capacitor：

```bash
npm.cmd run cap:sync
```

打开 Android Studio：

```bash
npx.cmd cap open android
```

## 真实 API 与 mock 回退策略

当前项目没有移除 mock 数据，而是采用“真实 API 优先，开发模式可回退”的策略：

- 登录成功后优先读取本地后端数据
- 本地演示可设置 `VITE_ENABLE_MOCK_FALLBACK=true`，接口不可用时自动回退到 mock 数据
- 本地演示可设置 `VITE_SHOW_DEMO_CREDENTIALS=true` 预填演示账号；试点、预发、生产环境必须关闭
- 试点、预发、生产环境应设置 `VITE_ENABLE_MOCK_FALLBACK=false`，接口错误必须显式暴露，避免把演示数据误当真实数据
- 未显式设置时，Vite 开发环境默认允许回退，生产构建默认不回退

当前已接入或已开始接入真实链路的内容包括：

- 登录 / 会话恢复
- 首页摘要
- 个人中心摘要
- 快递
- 钱包
- 代取发布
- 报修提交
- 失物招领发布
- 我的代取订单 / 我的报修 / 我的发布
- 管理员后台概览 / 公告发布 / 审计日志概览

## 前端路由

前端当前使用轻量 hash route registry，不额外引入路由依赖：

- 路由定义与标题集中在 `src/lib/routes.ts`
- 页面状态会同步到 URL hash，例如 `#/home`、`#/teacher/leave`、`#/admin`
- 浏览器返回/前进会恢复对应页面
- 未登录访问业务 hash 会回到登录页；管理员只允许进入后台页

## 权限与安全基线

- 账号具有 `student`、`teacher`、`admin` 三类角色，学生/教师身份流保持兼容；普通校园业务 API 仅允许学生/教师访问，管理员通过 RBAC 访问 `/api/admin/*`。
- 会话有过期时间；服务端只保存 token 哈希，登录和鉴权查询会清理过期会话，避免试点环境长期累积无效 token。
- 密码种子数据使用 PBKDF2-SHA256 哈希，后端仍兼容旧 SHA-256 哈希用于平滑迁移。
- API 默认启用 CORS 白名单，不再使用全开放 `*`。
- API 默认启用内存 rate limit，生产或多实例部署时应替换为 Redis / 数据库共享限流。
- API 默认限制 JSON 请求体大小，可通过 `REQUEST_BODY_LIMIT` 配置；超过限制会返回 `413`。
- 登录 token 过期时间通过 `SESSION_TTL_HOURS` 配置；试点/预发/生产环境必须显式设置 `1..720` 的整数。
- 本地 API 请求日志写入 `server/logs/server.log`，达到 `LOG_MAX_BYTES` 前会轮转到 `server.log.1`，日志仍不记录 body、query 或 token。
- API 支持 `TRUST_PROXY` 配置，试点/生产类环境必须显式开启，以便在 HTTPS 网关或反向代理后正确处理客户端 IP。
- API 默认设置 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Cross-Origin-Resource-Policy` 和 `Permissions-Policy` 等基础安全响应头。
- API 进程处理 `SIGINT`/`SIGTERM`，会先停止接收新连接并尝试在 10 秒内优雅退出。
- 审计日志记录登录、登出、核心业务提交、教师审批与管理员公告发布，不记录密码和 token。
- 管理员可访问 `GET /api/admin/metrics` 查看内存级请求量、状态码分布、延迟和最近失败请求；指标不包含请求体、token 或 query 参数。
- 可通过 `ALERT_WEBHOOK_URL` 配置外部告警 webhook；告警只发送服务名、环境、method、path、状态码、耗时和时间，不发送 body、query、密码或 token。
- 管理员可访问 `GET /api/admin/audit-logs?type=auth.login&limit=50` 查询业务审计日志；支持 `type`、`actorId` 和 `limit` 过滤，响应不包含密码或 token。
- 管理员可访问 `GET /api/admin/users?role=teacher&q=学院&limit=50` 查询用户与会话摘要；响应只包含公开账号资料和会话数量，不返回密码哈希、salt 或 token。
- 管理员可访问 `POST /api/admin/users/:userId/revoke-sessions` 清退指定用户会话；接口不返回 token，并禁止管理员从该接口清退自己的当前会话。

## 项目结构

```text
src/                React 页面与组件
src/lib/            API 客户端、路由注册表、mock 数据、持久化工具
server/             本地后端、数据层、校验与测试
server/controllers/ Express 控制器，承接请求/响应
server/routes/      API 路由装配
server/repositories/数据访问边界
server/validators/  输入校验导出边界
server/middlewares/ 鉴权、安全与横切中间件
server/migrations/  SQLite migration
public/             静态图片资源
android/            Capacitor Android 工程
scripts/            辅助脚本
docs/               隐私、运维与发布文档
```

## 当前仍未完成

- 学校统一认证、短信、支付、热水/电费缴费、餐饮运营、勤工助学、社团管理、教师通讯、真实物流/校园卡/工资等外部系统尚未接入
- HTTPS 域名、证书、API 网关或反向代理需要由试点环境提供
- Android 正式签名证书、受保护 release secret、正式归档和灰度流程仍需接入真实平台
- 外部错误监控、告警 webhook 密钥和生产告警渠道仍需配置
- 多实例部署前需要把内存 rate limit 和本地 session 扩展为 Redis 或数据库共享方案
- 菜单级、数据范围级、操作级 RBAC 仍需根据学校组织架构继续细化

## 文档

- [隐私政策草案](./docs/privacy-policy.md)
- [运维与发布检查表](./docs/operations-checklist.md)
- [数据库迁移说明](./docs/database.md)
- [Android 发布准备](./docs/android-release.md)
- [CI/CD 说明](./docs/ci-cd.md)
- [试点部署运行手册](./docs/pilot-runbook.md)
- [试点上线就绪审计](./docs/pilot-readiness-audit.md)
