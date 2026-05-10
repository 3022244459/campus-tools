# 运维与发布检查表

## 当前已开始

- 本地健康检查接口：`GET /api/health`
- 本地就绪检查接口：`GET /api/health/ready`，会验证当前 datastore 和核心种子数据
- 本地 API 日志：`server/logs/server.log`，达到 `LOG_MAX_BYTES` 前轮转为 `server.log.1`
- 管理员内存级运行指标：`GET /api/admin/metrics`
- 可选外部告警 webhook：`ALERT_WEBHOOK_URL`、`ALERT_MIN_STATUS_CODE`，仅发送脱敏失败摘要
- 管理员审计日志查询：`GET /api/admin/audit-logs?type=auth.login&limit=50`
- 管理员用户与会话摘要：`GET /api/admin/users?role=teacher&q=学院&limit=50`
- 管理员会话清退：`POST /api/admin/users/:userId/revoke-sessions`
- 会话生命周期：服务端仅保存 token 哈希；登录和鉴权查询会清理过期 session，管理员可清退指定用户活跃会话
- 写入记录 ID：业务记录、公告和审计日志使用时间戳加随机后缀，避免快速连续提交时出现 timestamp-only 碰撞
- 自动化检查脚本：`npm.cmd run check`
- 试点本地验收脚本：`npm.cmd run verify:pilot`
- 前端接口回退策略：仅开发/演示环境开启 `VITE_ENABLE_MOCK_FALLBACK=true`
- 演示账号预填：仅开发/演示环境开启 `VITE_SHOW_DEMO_CREDENTIALS=true`
- 管理员后台：`admin001 / campus123`，通过教师入口登录后进入后台
- 权限边界：普通校园业务 API 仅允许学生/教师访问，管理员接口仅允许管理员访问
- API CORS 白名单：通过 `CORS_ORIGINS` 配置
- 反向代理信任：试点、预发、生产环境通过 `TRUST_PROXY` 显式配置
- API 内存限流：通过 `RATE_LIMIT_WINDOW_MS` 和 `RATE_LIMIT_MAX_REQUESTS` 配置；试点配置必须是合法整数范围
- API 请求体上限：通过 `REQUEST_BODY_LIMIT` 配置，超过限制返回 `413`
- 登录 token 过期时间：通过 `SESSION_TTL_HOURS` 配置，试点值必须为 `1..720` 的整数
- API 日志大小上限：通过 `LOG_MAX_BYTES` 配置，试点值不得低于 `100000`
- API 安全响应头：默认返回 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Cross-Origin-Resource-Policy` 和 `Permissions-Policy`
- 生产类环境启动校验：`APP_ENV=staging|pilot|production` 时强制显式 CORS、禁用 mock fallback、使用当前已实现的 SQLite 存储
- 密码哈希：种子账号使用 PBKDF2-SHA256，后端兼容旧哈希用于迁移
- API 退出：进程收到 `SIGINT`/`SIGTERM` 后会停止接收新连接，并在 10 秒内优雅退出或强制失败退出
- SQLite 迁移/种子脚本：`npm.cmd run db:migrate`、`npm.cmd run db:seed`
- SQLite 核心业务表：`users`、`sessions`、`announcements`、`audit_logs`、`takeout_orders`、`repair_requests`、`lost_found_items`、`teacher_document_orders`、`teacher_leave_applications`、`teacher_student_affair_applications`、`courier_accounts`、`courier_packages`、`wallet_accounts`、`wallet_transactions`、`compare_carriers`
- 本地备份脚本：`npm.cmd run db:backup`，默认输出到 `server/backups`
- 受保护恢复脚本：`RESTORE_CONFIRM=overwrite-local-data npm.cmd run db:restore -- <backup-file>`
- Android release 构建脚本：`build-android-release.bat`
- GitHub Actions 基础 CI：`.github/workflows/ci.yml`，执行 `verify:pilot`
- 试点上线就绪审计：`docs/pilot-readiness-audit.md`
- 试点部署运行手册：`docs/pilot-runbook.md`
- 试点环境变量模板：`.env.pilot.example`，部署时必须替换真实 HTTPS 域名和外部服务地址

## 上线前待完成

- 继续推进模块级 repository，减少服务层对兼容快照的依赖。
- 接入学校统一认证，并把演示账号切换为仅开发环境可用。
- 管理员权限继续细化到菜单级、数据范围级和操作级。
- 接入正式外部错误监控和告警渠道；当前仓库只提供 webhook 发送边界，真实平台和密钥仍需外部提供。
- 建立测试环境、灰度环境和生产环境，隔离真实数据。
- 在 CI 基础上继续补齐受保护 secret、灰度发布和正式 release 归档流水线。
- 多实例部署时把限流和会话存储替换为 Redis 或数据库共享存储。
- 准备 HTTPS 证书、域名、短信服务、支付资质、学校统一认证、Android 签名证书等外部依赖。

## 建议的发布门禁

- `npm.cmd run check` 全通过
- `npm.cmd run build` 通过
- `npm.cmd run verify:pilot` 通过
- 试点、预发、生产环境确认 `VITE_ENABLE_MOCK_FALLBACK=false`
- 试点、预发、生产环境确认 `APP_ENV`、`DATA_STORE`、`CORS_ORIGINS`、`TRUST_PROXY`、`REQUEST_BODY_LIMIT`、`RATE_LIMIT_WINDOW_MS`、`RATE_LIMIT_MAX_REQUESTS`、`SESSION_TTL_HOURS`、`LOG_MAX_BYTES`、`ALERT_MIN_STATUS_CODE` 校验通过
- Android 调试包或正式包验证通过
- 登录、会话恢复、管理员后台、公告发布、钱包、快递、比价、代取、报修、失物招领关键链路走查通过
- 隐私政策与用户协议可访问
- 日志、指标、备份、告警和回滚方案明确
