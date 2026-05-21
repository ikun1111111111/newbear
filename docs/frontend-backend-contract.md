# 前后端协作接口契约

本文档用于支持前后端分离开发。

## 当前结论

- 当前项目已经具备前后端分离开发基础。
- 前端通过 HTTP 接口读取和提交数据，不依赖服务端模板。
- 当前主要耦合点不在代码调用，而在 `state` 响应结构。
- 只要接口路径、请求参数、鉴权方式、返回 JSON 结构保持稳定，前端可以独立重构并在最后直接替换接入。

## 当前耦合风险

- 后端当前同时承担静态资源托管和 API 服务。
- 前端大量依赖 `GET /api/state` 及各类操作接口返回的完整 `state` 快照。
- `state` 字段较多，且部分字段是深层嵌套结构，不能随意改名或删除。

## 协作约定

- 后端允许新增字段，但不要删除已有字段。
- 后端允许字段补充更多内容，但不要修改已有字段类型。
- 后端不要修改接口路径。
- 后端不要修改 Cookie 名称 `newbear_session`。
- 前端对不存在或为 `null` 的可选字段要做兜底。
- 前端开发期间默认以 mock 数据和本文档中的类型为准。

## 鉴权约定

- 鉴权方式：Cookie Session
- Cookie 名称：`newbear_session`
- 前端请求需携带：`credentials: "include"`

## 接口清单

### 1. 获取当前登录状态

- 方法：`GET`
- 路径：`/api/auth/me`

成功响应：

```json
{
  "authenticated": true,
  "user": {
    "user_id": 1,
    "username": "test01",
    "session_id": "abc123"
  }
}
```

未登录响应：

```json
{
  "authenticated": false
}
```

### 2. 注册

- 方法：`POST`
- 路径：`/api/auth/register`

请求体：

```json
{
  "username": "test01",
  "password": "123456"
}
```

成功响应：

```json
{
  "ok": true,
  "user": {
    "user_id": 1,
    "username": "test01",
    "session_id": "abc123"
  },
  "state": {}
}
```

失败响应：

```json
{
  "error": "用户名已存在"
}
```

### 3. 登录

- 方法：`POST`
- 路径：`/api/auth/login`

请求体：

```json
{
  "username": "test01",
  "password": "123456"
}
```

成功响应：同注册。

### 4. 退出登录

- 方法：`POST`
- 路径：`/api/auth/logout`

成功响应：

```json
{
  "ok": true
}
```

### 5. 获取完整世界状态

- 方法：`GET`
- 路径：`/api/state`

成功响应：

```json
{
  "state": {}
}
```

未登录响应：

```json
{
  "error": "Unauthorized"
}
```

### 6. 重置世界

- 方法：`POST`
- 路径：`/api/reset`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 7. 推进一步

- 方法：`POST`
- 路径：`/api/step`

请求体：

```json
{
  "affair": "今天先整理需求"
}
```

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 8. 进入会议

- 方法：`POST`
- 路径：`/api/meeting/enter`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 9. 开始会议

- 方法：`POST`
- 路径：`/api/meeting/start`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 10. 会议发言

- 方法：`POST`
- 路径：`/api/meeting/say`

请求体：

```json
{
  "message": "我建议先拆需求"
}
```

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 11. 会议推进

- 方法：`POST`
- 路径：`/api/meeting/tick`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 12. 结束会议

- 方法：`POST`
- 路径：`/api/meeting/finish`

成功响应：

```json
{
  "ok": true,
  "result": {},
  "state": {}
}
```

### 13. 关闭会议页

- 方法：`POST`
- 路径：`/api/meeting/close`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 14. 茶水间发言

- 方法：`POST`
- 路径：`/api/pantry/say`

请求体：

```json
{
  "message": "今天有点累"
}
```

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 15. 茶水间推进

- 方法：`POST`
- 路径：`/api/pantry/tick`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 16. 离开茶水间

- 方法：`POST`
- 路径：`/api/pantry/leave`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

### 17. 关闭报告

- 方法：`POST`
- 路径：`/api/report/close`

成功响应：

```json
{
  "ok": true,
  "state": {}
}
```

## 核心状态对象说明

后端当前采用“服务端权威状态快照”模式。大多数操作成功后，都会返回完整的 `state`，前端应以新状态整体覆盖本地 store，而不是手动拼局部状态。

`state` 顶层字段：

- `company`
- `actors`
- `user_inputs`
- `map`
- `encounters`
- `pending_incident`
- `incidents`
- `active_meeting`
- `meetings`
- `active_pantry`
- `active_report`
- `onboarding`

## 推荐协作方式

### 后端负责

- 保持接口路径稳定
- 保持字段命名稳定
- 提供真实接口和 mock 样例
- 新增字段前同步前端

### 前端负责

- 按 `state` schema 建立 TypeScript 类型
- 以 mock 数据先完成页面重构
- 对 `null`、空数组、缺省文本做好兜底
- 将接口请求统一收口到 API Client

## 推荐下一步

- 后端补一份真实 `state` 样例 JSON
- 前端按类型文件开始拆 React 页面
- 双方把“可改”和“不可改”的字段列表正式定下来
