# 校园宝

一个基于 React、Vite 和 Capacitor 构建的校园工具 App 原型，当前定位是“可安装体验的校园工具 App 原型”。

项目已经具备：

- Web 端本地开发与构建
- Android 壳工程与调试 APK 打包能力
- 学生端 / 教师端多页面原型界面

当前阶段仍以原型体验为主，页面中的大部分业务内容为静态展示数据，尚未完成真实后端、账号体系和正式业务联调。

## 技术栈

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Capacitor 8

## 本地运行

前置要求：

- Node.js
- npm

启动开发环境：

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

Windows 下也可以直接运行：

```bat
start-windows.bat
```

## 构建

构建 Web 产物：

```bash
npm run build
```

执行 TypeScript 检查：

```bash
npm run lint
```

同步 Capacitor 平台文件：

```bash
npm run cap:sync
```

构建 Android 调试包：

```bash
build-android.bat
```

## 项目结构

```text
src/                React 页面与组件
public/             静态图片资源
android/            Capacitor Android 工程
scripts/            辅助脚本
```

## 当前状态

- 适合界面演示、真机安装体验、流程走查
- 尚不适合直接作为正式校园业务系统上线

## 后续建议

- 接入真实后端与数据库
- 增加登录、身份认证与权限控制
- 替换页面中的静态演示数据
- 完善异常处理、表单校验和测试体系
