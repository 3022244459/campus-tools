# Android 发布准备

## 调试包

```bat
build-android.bat
```

Android Gradle plugin 需要 JDK 17 或更新版本。运行调试包或 release 包脚本前，请确认 `JAVA_HOME` 指向 JDK 17+；脚本会先做 Java 版本预检查，再执行 Web 构建、`cap sync android` 和 Gradle 构建。

## Release 包

```bat
build-android-release.bat
```

或：

```bat
npm.cmd run build:android:release
```

脚本会先运行 `npm.cmd run check`，再构建 Web 产物、同步 Capacitor，并执行 Gradle `assembleRelease`。

## 签名配置

正式发布必须由学校或试点项目方提供 Android 签名证书。不要把证书或密码提交到仓库。

本项目读取以下环境变量：

```env
ANDROID_KEYSTORE_PATH=
ANDROID_KEYSTORE_PASSWORD=
ANDROID_KEY_ALIAS=
ANDROID_KEY_PASSWORD=
```

未配置时，Gradle 会生成未签名 release 产物，仅用于内部验证构建链路，不能提交应用商店或正式分发。

签名变量必须全部为空或全部配置。只配置其中一部分会直接失败；配置完整时还会检查 `ANDROID_KEYSTORE_PATH` 指向的文件是否存在，避免误生成不可分发的 release 包。

## 网络配置

`android/app/src/main/res/xml/network_security_config.xml` 仅允许开发调试地址 `10.0.2.2`、`127.0.0.1`、`localhost` 使用明文 HTTP，便于模拟器连接本地 API。

正式试点上线应使用 HTTPS API 域名，并在发布前完成：

- 学校域名或项目域名
- HTTPS 证书
- API 网关或反向代理
- CORS 白名单更新
- `VITE_API_BASE_URL` 指向正式 HTTPS 地址

## 发布门禁

- `npm.cmd run check` 通过
- `npm.cmd run build` 通过
- `npx.cmd cap sync android` 通过
- Android Studio / Gradle Sync 通过
- 真机登录、会话恢复、管理员后台、代取、报修、失物招领、教师审批走查通过
- 隐私政策、用户协议和外部依赖清单确认
