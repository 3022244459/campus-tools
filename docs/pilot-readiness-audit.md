# 试点上线就绪审计

本审计把原始目标拆成可验证交付项，并映射到当前仓库中的实际产物。结论：项目已经从演示原型推进到可本地运行、可 SQLite 持久化、可 Android sync、可执行自动化检查的试点基础版本；仍不能声明“正式上线完成”，因为学校统一认证、HTTPS 域名、短信/支付、Android 正式签名、外部告警和生产环境资源需要由外部提供并完成联调。

## 交付项对照

| 要求 | 当前证据 | 状态 |
| --- | --- | --- |
| 前端正式路由和更清晰架构 | `src/lib/routes.ts`、`src/lib/useScreenRouting.ts`、`src/lib/useShellData.ts`、`src/components/AppScreenRenderer.tsx` | 已完成试点版 |
| `App.tsx` 降低复杂度 | `src/App.tsx` 主要保留组合、登录/登出和导航事件 | 已完成试点版 |
| 后端拆分为 routes/controllers/services/repositories/validators/middlewares | `server/routes`、`server/controllers`、`server/repositories`、`server/validators`、`server/middlewares` | 已完成试点版 |
| 控制器不直接访问底层数据库 | auth/campus/teacher/admin 控制器均通过 repository 调用 | 已完成试点版 |
| 正式数据库、migration、seed | `server/migrations/001_app_state.sql` 到 `004_wallet_courier.sql`、`server/scripts/migrate.ts`、`server/scripts/seed.ts` | 已完成试点版 |
| 核心业务表 | 用户、会话、公告、审计、代取、报修、失物招领、教师审批、快递、钱包、比价均已拆到 SQLite 表 | 已完成试点版 |
| SQLite 连接与写入一致性 | 连接启用 foreign keys、busy timeout 和 WAL；`app_state` 与规范化表在同一事务提交，约束失败会回滚 | 已完成试点版 |
| 三类角色和权限控制 | `student`、`teacher`、`admin`，`requireAuth`、`requireCampusUser`、`requireTeacher`、`requireRole`；HTTP smoke test 覆盖管理员访问普通校园 API 返回 `403` | 已完成基础 RBAC |
| 管理员后台 | `src/components/AdminDashboardScreen.tsx`、`/api/admin/overview`、`/api/admin/announcements`、`/api/admin/metrics`、`/api/admin/audit-logs`、`/api/admin/users`、`/api/admin/users/:userId/revoke-sessions` | 已完成试点版 |
| 真实 API + 数据库闭环 | 代取、报修、失物招领、教师文件代送、教师审批、公告发布、审计日志均由 API 写入数据库兼容层和规范化表 | 已完成试点版 |
| 写入记录 ID | 业务记录、公告和审计日志使用时间戳加随机后缀生成 ID，避免快速连续提交时出现 timestamp-only 碰撞 | 已完成试点版 |
| mock 只保留开发/演示模式 | `VITE_ENABLE_MOCK_FALLBACK` 控制回退，`VITE_SHOW_DEMO_CREDENTIALS` 控制演示账号预填；试点/生产均由后端配置校验禁止开启 | 已完成配置约束 |
| 密码哈希 | PBKDF2-SHA256，兼容旧 SHA-256 迁移 | 已完成 |
| token/session | 本地 token session、服务端哈希化保存 token、`SESSION_TTL_HOURS` 可配置过期时间、SQLite session 表；登录和鉴权查询会清理过期 session，测试覆盖 `createSession` TTL、哈希存储和 `removeExpiredSessions` | 已完成试点版 |
| 用户与会话巡检 | `GET /api/admin/users` 返回公开用户资料、角色、活跃会话数量和最近登录时间，不返回密码哈希、salt 或 token | 已完成试点版 |
| 会话清退 | 管理员可清退指定用户会话，禁止从该接口清退自己的当前管理员会话，并写入 `admin.sessions.revoke` 审计日志 | 已完成试点版 |
| CORS 白名单 | `CORS_ORIGINS` 和 `createCorsMiddleware` | 已完成 |
| 反向代理信任配置 | `TRUST_PROXY`、`getServerConfig` 和 `app.set('trust proxy', ...)`，试点模板和 `verify:pilot` 均要求显式开启 | 已完成 |
| 基础安全响应头 | `createSecurityHeadersMiddleware` 默认设置 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Cross-Origin-Resource-Policy` 和 `Permissions-Policy`，HTTP smoke test 覆盖 | 已完成 |
| rate limit | `RATE_LIMIT_WINDOW_MS`、`RATE_LIMIT_MAX_REQUESTS`、生产类环境数值校验和内存限流中间件 | 已完成单实例版 |
| JSON 请求体上限 | `REQUEST_BODY_LIMIT`、`express.json({limit})` 和 HTTP smoke test 覆盖超限请求返回 `413` | 已完成 |
| 生产环境配置校验 | `APP_ENV=staging|pilot|production` 时强制显式 CORS、`TRUST_PROXY`、`REQUEST_BODY_LIMIT`、`SESSION_TTL_HOURS`、禁用 mock fallback、使用当前已实现的 SQLite 存储；PostgreSQL 未实现前不会被接受 | 已完成基础版 |
| 试点环境变量模板 | `.env.pilot.example` 提供非 mock、SQLite、HTTPS API 和 Capacitor origin 的安全默认值，`verify:pilot` 会校验模板 | 已完成 |
| API 就绪检查 | `GET /api/health/ready` 加载当前 datastore 并验证核心种子数据，不就绪时返回 `503` | 已完成试点版 |
| API 进程退出 | `server/index.ts` 处理 `SIGINT`/`SIGTERM`，停止接收新连接并设置 10 秒强制退出保护 | 已完成 |
| 前端密钥暴露防护 | Vite 不再向浏览器 bundle 注入 API key，仓库不保留示例 AI 密钥 | 已完成 |
| 日志脱敏和审计 | 请求日志不记录 body/token/query；业务审计日志不记录密码和 token；管理员可通过 `/api/admin/audit-logs` 按 `type`、`actorId` 和 `limit` 查询 | 已完成试点版 |
| 本地日志轮转 | `LOG_MAX_BYTES` 控制 `server/logs/server.log` 大小，超限前轮转为 `server.log.1`，测试覆盖轮转行为 | 已完成基础版 |
| 告警发送边界 | `ALERT_WEBHOOK_URL` 可选启用外部 webhook，发送内容仅包含服务、环境、method、path、状态码、耗时和时间 | 已完成代码边界 |
| 运行指标 | `GET /api/admin/metrics` 返回请求量、状态码、延迟和失败摘要 | 已完成基础版 |
| 数据备份与恢复 | `npm.cmd run db:backup`，SQLite 使用 `VACUUM INTO`，JSON 复制文件；`npm.cmd run db:restore` 需要 `RESTORE_CONFIRM=overwrite-local-data`，会先生成一致性 pre-restore 备份并清理旧 SQLite sidecar 文件 | 已完成本地版 |
| Android 构建准备 | `build-android.bat`、`build-android-release.bat`、`build:android`、`build:android:release`、签名环境变量 | 已完成准备 |
| Android 网络配置 | `android/app/src/main/res/xml/network_security_config.xml` 限定本地明文调试地址 | 已完成 |
| 测试 | `server/tests/run.ts` 覆盖认证、管理员、学生业务、教师业务、SQLite 表写入和 HTTP smoke | 已完成试点覆盖 |
| 本地验收脚本 | `npm.cmd run verify:pilot` 检查关键产物并执行 migrate、seed、check、build、build:android，并扫描 `dist/` 与 Android Web 资源中的演示账号和 mock 产物 | 已完成 |
| CI | `.github/workflows/ci.yml` 执行 `verify:pilot`，覆盖检查、构建、Android sync 和生成产物扫描 | 已完成基础 CI |
| 部署和运维文档 | `README.md`、`docs/database.md`、`docs/android-release.md`、`docs/operations-checklist.md`、`docs/ci-cd.md`、`docs/pilot-runbook.md` | 已完成试点文档 |
| 外部依赖清单 | README 和 docs 已列域名、HTTPS、短信、统一认证、支付、签名证书等 | 已完成清单 |

## 2026-05-09 补充审计

| 补充项 | 当前证据 | 状态 |
| --- | --- | --- |
| 后端环境变量加载 | `server/loadEnv.ts`，`server/index.ts` 和 DB 脚本显式调用；优先级为系统环境变量 > `.env.local` > `.env` | 已补齐 |
| Windows 完整本地启动 | `start-windows.bat` 会执行 SQLite migration/seed，并以 `DATA_STORE=sqlite` 启动本地 API | 已补齐 |
| Windows helper 命令一致性 | `start-windows.bat`、`build-android.bat`、`build-android-release.bat` 使用 `npm.cmd`/`npx.cmd`，`verify:pilot` 会检查 | 已补齐 |
| README Windows 命令一致性 | README 示例命令统一使用 `npm.cmd`/`npx.cmd`，`verify:pilot` 会检查 | 已补齐 |
| 环境加载回归测试 | `server/tests/run.ts` 覆盖 `.env.local` 优先于 `.env`、系统环境变量最高优先级 | 已补齐 |
| 数据、备份和日志防误提交 | `.gitignore` 忽略 `server/data/*.sqlite`、`server/backups/*` 和 `server/logs/*`，只允许 `.gitkeep` 占位 | 已补齐 |
| 隐私草案同步当前存储 | `docs/privacy-policy.md` 已说明 JSON 开发存储、SQLite 试点存储、备份和日志边界 | 已补齐 |
| 前端会话失效收口 | `src/lib/api.ts` 对带 Authorization 的 `401` 统一发出会话失效事件，`src/App.tsx` 清理本地会话并回到登录页；管理员后台也显式处理 `401` | 已补齐 |
| 管理员运行指标可视化 | `src/components/AdminDashboardScreen.tsx` 调用 `/api/admin/metrics`，展示请求总量、延迟、状态码、告警状态、高频路径和最近失败请求 | 已补齐 |
| Vite 本地开发稳定性 | `vite.config.ts` 将依赖预优化入口限制为 `index.html`，并忽略 `dist` 与 Android 生成 Web 资源，避免 `cap sync` 后扫描生成产物 | 已补齐 |
| 外部服务占位不误导 | 热水、电费、食堂、勤工助学、社团和教师消息页面显示待接入说明，支付/报名/发消息类按钮禁用，避免试点用户误认为外部系统已上线 | 已补齐 |

## 当前仍不可视为正式上线完成的事项

- 学校统一认证尚未接入；当前仍使用本地演示账号。
- 短信服务、支付资质、热水/电费缴费、餐饮运营、勤工助学、社团管理、教师通讯、真实物流/校园卡/工资系统尚未接入。
- HTTPS 域名、证书、API 网关或反向代理需要外部提供。
- Android 正式签名证书未提供；release 构建只能验证链路，不能替代正式分发。
- 内存 rate limit 和本地 session 适合单实例试点；多实例需要 Redis 或数据库共享限流/会话。
- 外部错误监控、告警渠道、告警 webhook 密钥和灰度发布流程仍需接入真实平台。
- 菜单级、数据范围级、操作级 RBAC 仍需根据学校组织架构继续细化。

## 本地验收命令

试点交付前至少执行：

```bat
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run check
npm.cmd run build
npm.cmd run build:android
npm.cmd run verify:pilot
```

正式发布前还需要在受控环境执行：

```bat
npm.cmd run db:backup
npm.cmd run build:android:release
```

`build:android:release` 必须通过环境变量注入 Android 签名证书信息，不能把密钥写入仓库。
