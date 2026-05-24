# newbear（熊心壮职）

newbear 是一个职场模拟互动原型。玩家进入一家虚构创业公司，在一天的工作流程中与 NPC 互动，经历会议、茶水间交流、突发事件和日报反馈，最终得到一份基于行为的职场人格报告。

当前项目处于 v0.1 原型到 v0.2 可复玩版本的过渡阶段。Phase 1 的重点是引入参数化种子系统，让同一用户多次游玩时，每局的公司状态、事件组合和 NPC 对话主题都能产生差异。

## 项目目标

- 支持用户注册、登录和会话保持
- 展示职场地图、角色状态、会议、茶水间和日报流程
- 通过后端 world 模块推进游戏时间和事件状态
- 引入多局 session 记录和用户画像，为复玩体验做准备
- 前端主线逐步迁移到 React + TypeScript

## 技术栈

### 后端

- Python
- 标准库 `http.server`
- SQLite
- 火山引擎 Ark API（用于 LLM 对话和报告生成）

### 前端

- React
- TypeScript
- Vite
- Zustand
- 原生 CSS

### 数据与资源

- SQLite 数据库：`backend/data/newbear.db`
- 旧版前端资源：`frontend/web/assets`
- React 前端工程：`frontend/app`

## 目录结构

```text
newbear/
├── backend/
│   ├── server.py                 # 后端 HTTP 服务入口
│   ├── data/                     # SQLite 数据库
│   ├── test_seed_loader.py       # 当前已有测试
│   └── src/core/
│       ├── auth/                 # 登录、注册、会话
│       ├── config/               # 公司、事件、会议、报告等配置
│       ├── db/                   # 数据库访问层
│       ├── llm/                  # Ark LLM 客户端
│       ├── map/                  # 地图数据与语义
│       └── world/                # 世界状态、时间推进、事件、会议、茶水间、报告
├── frontend/
│   ├── app/                      # React + TypeScript 前端主工程
│   ├── contracts/                # 前后端共享契约
│   └── web/                      # 旧版原生 JS 前端和静态资源
├── docs/                         # 项目文档
├── tools/                        # 工具脚本
└── README.md
```

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/funqueen775/newbear.git
cd newbear
```

### 2. 启动后端

```bash
python backend/server.py
```

后端默认运行在：

```text
http://localhost:8501
```

后端会同时提供 API 和旧版 `frontend/web` 静态页面。

### 3. 启动 React 前端

进入 React 前端目录：

```bash
cd frontend/app
```

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

Vite 会输出本地访问地址，通常是：

```text
http://localhost:5173
```

React 前端已经配置代理：

- `/api` 会转发到 `http://localhost:8501`
- `/assets` 会转发到 `http://localhost:8501`

## 环境变量

如果需要启用 LLM 对话和报告生成，需要配置 Ark API Key。

PowerShell 示例：

```powershell
$env:ARK_API_KEY="你的 Ark API Key"
```

可选环境变量：

```text
ARK_API_URL     Ark API 地址，默认使用火山引擎 chat completions 地址
ARK_API_KEY     Ark API Key
ARK_MODEL       Ark 模型 ID
```

如果没有配置 `ARK_API_KEY`，涉及 LLM 的功能可能会失败或走 fallback 逻辑。

## 常用命令

### 后端

```bash
python backend/server.py
```

```bash
python backend/test_seed_loader.py
```

### 前端

```bash
cd frontend/app
npm run dev
```

```bash
cd frontend/app
npm run build
```

```bash
cd frontend/app
npm run lint
```

## 当前开发重点

Phase 1 当前重点：

- 新增 `user_profiles` 和 `session_records`
- 实现参数化 `SessionSeed`
- 将固定事件、会议、茶水间和报告内容改为内容池
- 实现跨 session 用户画像和趋势数据
- 在 React + TypeScript 前端中完成历史页、复玩流程和报告页复玩入口

## 分支协作规范

团队成员不要直接在 `main` 上开发。

推荐流程：

1. 从 `main` 创建自己的功能分支
2. 在功能分支中开发
3. 提交并 push 到自己的分支
4. 发起 Pull Request
5. Review 后再合并到 `main`

分支命名建议：

```text
feature/db-profile
feature/seed-generator
feature/content-pool
feature/personality-analyzer
feature/react-history
```

提交示例：

```bash
git checkout -b feature/react-history
git add .
git commit -m "feat: add session history page"
git push origin feature/react-history
```

## 成员分工

| 成员 | 方向 | 主要职责 |
|---|---|---|
| 秦梓源 | 后端集成 | 数据库扩展、接口契约、world_factory、server API |
| 孙迦勒 | 后端生成逻辑 | seed generator、content pool、配置层重写 |
| 陈鸿淼 | 人格分析 | personality analyzer、profile/trend 数据层 |
| 方坤 | 前端与验收 | React 前端、历史页、复玩流程、联调验收 |

## 项目状态

当前版本仍是开发中的课程/原型项目，代码结构和接口会继续调整。`frontend/web` 是旧版原生 JS 前端，后续新增功能优先放在 `frontend/app`。

## License

当前项目暂未声明开源许可证。
