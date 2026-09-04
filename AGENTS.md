# 项目上下文

## 技术栈

- **前端**: Vue 3 (Composition API + `<script setup>`), TypeScript, Vue Router, Pinia
- **后端**: Node.js, Express, TypeScript
- **数据库**: MySQL 8 (mysql2)，生产部署在阿里云 ECS；建表与种子见 `schema.sql`
- **构建工具**: Vite 7（前端构建产物输出到 `dist/client`）
- **样式**: Tailwind CSS 3
- **认证**: JWT (jsonwebtoken + bcryptjs)
- **配置**: dotenv 读取 `.env`（参考 `.env.example`）；部署说明见 `DEPLOY.md`

## 目录结构

```
├── scripts/            # 构建与启动脚本
│   ├── build.sh        # 构建脚本
│   ├── dev.sh          # 开发环境启动脚本
│   ├── prepare.sh      # 预处理脚本
│   └── start.sh        # 生产环境启动脚本
├── server/             # 服务端逻辑
│   ├── routes/         # API 路由
│   │   ├── index.ts    # 路由汇总
│   │   ├── auth.ts     # 认证路由 (登录/获取信息)
│   │   ├── products.ts # 商品 CRUD 路由 (含 batch-delete 批量删除)
│   │   ├── categories.ts # 分类 CRUD 路由
│   │   └── upload.ts    # 商品图片本地上传路由 (multer, ≤5MB jpg/png)
│   ├── lib/
│   │   ├── db.ts        # MySQL 连接池 (query/execute)
│   │   └── config.ts    # config 表键值配置 (上传根目录, 支持 UPLOAD_ROOT_DIR 覆盖)
│   ├── server.ts        # Express 服务入口
│   └── vite.ts          # Vite 中间件(dev) / 静态文件(prod) 集成
├── src/                # 前端源码
│   ├── app/
│   │   ├── api/        # API 客户端
│   │   ├── components/ # Vue 组件
│   │   ├── router/     # Vue Router 配置
│   │   ├── stores/     # Pinia 状态管理
│   │   ├── views/      # 页面视图
│   │   ├── App.vue     # 根组件
│   │   └── main.ts     # Vue 应用入口
│   └── index.css       # 全局样式 (Tailwind)
├── public/images/      # 静态图片资源
├── index.html          # 入口 HTML
├── package.json        # 项目依赖管理
├── tsconfig.json       # TypeScript 配置
├── tailwind.config.js  # Tailwind 配置
└── vite.config.ts      # Vite 配置
```

## 数据库

- 使用 **MySQL 8**（mysql2 连接池），建表与种子数据见项目根目录 `schema.sql`
- 表: `admins` (管理员), `categories` (分类), `products` (商品), `config` (键值配置)
- 初始化: `mysql -u yu -p yu_sports < schema.sql`
- 连接配置通过环境变量: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- 生产连接信息: 库 `yu_sports` / 用户 `yu`（见 `.env.example` 与 `DEPLOY.md`）
- 商品图片为本地磁盘存储，根目录由 `config.upload_root_dir` 或环境变量 `UPLOAD_ROOT_DIR` 决定（生产为 `/opt/ygtq/product`），通过 `/uploads/*` 静态访问

> 注意：沙箱开发环境无 MySQL，数据层面向阿里云生产；后端在连不上库时仅记录警告，不影响前端页面加载。

## API 接口

### 公开接口
- `GET /api/products` - 商品列表 (支持 ?category= 筛选)
- `GET /api/products/:id` - 商品详情
- `GET /api/categories` - 分类列表

### 认证接口
- `POST /api/auth/login` - 管理员登录
- `GET /api/auth/me` - 获取当前管理员信息 (需认证)

### 管理接口 (需 Bearer Token)
- `POST /api/products` - 创建商品
- `PUT /api/products/:id` - 更新商品
- `DELETE /api/products/:id` - 删除商品
- `POST /api/categories` - 创建分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类
- `POST /api/products/batch-delete` - 批量删除商品 (body: { ids: number[] })
- `POST /api/upload` - 上传商品图片 (multipart/formData, 返回 /uploads/文件名)

## 常用命令

- 开发: `pnpm dev`
- 类型检查: `pnpm ts-check`
- 生产构建前端: `pnpm build:client`（产物到 `dist/client`）
- 生产启动: `pnpm start:prod`（需 `COZE_PROJECT_ENV=PROD`，tsx 运行 server/server.ts）
- 完整部署步骤见 `DEPLOY.md`

## 前端路由

- `/` - 首页 (品牌介绍 + 精选商品)
- `/products` - 商品列表 (支持分类筛选)
- `/products/:id` - 商品详情
- `/about` - 关于我们
- `/admin/login` - 管理员登录
- `/admin` - 管理后台 (商品/分类 CRUD)

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

## 开发规范

- 使用 Tailwind CSS 进行样式开发
- Vue 组件使用 `<script setup lang="ts">` 语法
- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any` 和 `as any`
- 函数参数必须有类型标注

## 管理员默认账号

- 用户名: admin
- 密码: 
