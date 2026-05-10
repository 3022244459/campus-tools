# 数据库迁移说明

当前项目支持两种数据模式：

- `DATA_STORE=json`：默认模式，继续使用 `server/data/db.json`，便于本地演示和快速回滚。
- `DATA_STORE=sqlite`：使用 `server/data/campus.sqlite`，通过 migration 和 seed 初始化，适合试点部署验证。

## 初始化 SQLite

后端和数据库脚本会按“系统环境变量 > `.env.local` > `.env`”的优先级读取配置。

```bat
npm.cmd run db:migrate
npm.cmd run db:seed
set DATA_STORE=sqlite
npm.cmd run dev:api
```

普通 `db:seed` 是幂等的：SQLite 已存在 `app_state` 时会跳过重置；只有 `npm.cmd run db:seed -- --force` 才会覆盖为种子数据。

如需重置 SQLite 种子数据：

```bat
npm.cmd run db:seed -- --force
```

## 备份

试点环境在升级、迁移、发布 Android 包或替换后端前，应先执行一次本地备份：

```bat
set DATA_STORE=sqlite
npm.cmd run db:backup
```

默认输出目录为 `server/backups`，可通过 `BACKUP_DIR` 改写。SQLite 模式使用 `VACUUM INTO` 生成一致性备份；JSON 模式会复制 `server/data/db.json`。备份目录已加入 `.gitignore`，不要把真实备份文件提交到仓库。

## 恢复

恢复会覆盖当前本地数据，必须显式设置确认变量。脚本会在覆盖前把当前数据再保存到 `server/backups/pre-restore-*`，便于误操作回退。SQLite 恢复会使用 `VACUUM INTO` 生成一致的 pre-restore 备份，并在覆盖主库文件前清理 `-wal`、`-shm` 和 `-journal` sidecar 文件。

SQLite 示例：

```bat
set DATA_STORE=sqlite
set RESTORE_CONFIRM=overwrite-local-data
npm.cmd run db:restore -- server\backups\campus-sqlite-YYYY-MM-DD.sqlite
```

JSON 示例：

```bat
set DATA_STORE=json
set RESTORE_CONFIRM=overwrite-local-data
npm.cmd run db:restore -- server\backups\campus-json-YYYY-MM-DD.json
```

## 当前表结构

SQLite 现在包含两层存储：

- `app_state`：兼容层，保存完整 `DatabaseShape` 快照，保证现有 API 响应结构和 JSON 模式一致。
- 规范化业务表：保存上线试点中最关键、最常变更的数据。

已拆出的规范化表包括：

- `users`：学生、教师、管理员账号、密码哈希、资料和统计信息。
- `sessions`：登录会话 token、用户和过期时间。
- `announcements`：管理员公告。
- `audit_logs`：管理员、学生、教师关键操作审计记录。
- `takeout_orders`：代取订单。
- `repair_requests`：报修请求。
- `lost_found_items`：失物招领记录。
- `teacher_document_orders`：教师文件代送订单。
- `teacher_leave_applications`：教师端待审批请假申请。
- `teacher_student_affair_applications`：教师端待审批学生事务申请。
- `courier_accounts`、`courier_packages`：快递账户与包裹。
- `wallet_accounts`、`wallet_transactions`：校园钱包账户与交易流水。
- `compare_carriers`：快递比价承运商配置。

应用在 SQLite 模式下读取时会从规范化表回填现有 API 数据形状；写入时会同步更新 `app_state` 和规范化表。这样可以在不破坏前端页面与 API 合约的前提下，逐步把核心业务从原型聚合数据迁移到真实表结构。

SQLite 连接会显式启用 `PRAGMA foreign_keys = ON`、`PRAGMA busy_timeout = 5000` 和 `PRAGMA journal_mode = WAL`。写入时 `app_state` 兼容快照和规范化业务表在同一个事务中提交；如果外键或其他约束失败，事务会回滚，避免两层存储状态不一致。

## 仍需继续拆分的模块

后续应继续把数据访问从兼容快照推进到模块级 repository：

- 更细粒度的 `roles`、`permissions`
- 支付、统一认证、短信、真实物流等外部系统接入后的业务凭证与同步状态表
- 面向生产的备份、恢复、审计检索和数据保留策略

拆分完成后，服务层应只依赖模块级 repository，不再直接读写聚合对象。
