# 项目上下文

## 技术栈

- **前端**: Vue 3 (Composition API + `<script setup>`), TypeScript, Vue Router, Pinia
- **后端**: Node.js, Express, TypeScript
- **数据库**: MySQL 8 (mysql2)
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 3
- **认证**: JWT (jsonwebtoken + bcryptjs)

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
│   │   ├── products.ts # 商品 CRUD 路由
│   │   └── categories.ts # 分类 CRUD 路由
│   ├── lib/
│   │   └── db.ts        # MySQL 连接池 (mysql2/promise)
│   ├── server.ts       # Express 服务入口
│   └── vite.ts         # Vite 中间件集成
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

- 使用 MySQL 8，驱动 `mysql2/promise` 连接池
- 数据库: `yu_sports` (utf8mb4)
- 默认连接: host=127.0.0.1 port=3306 user=root password=YuQuest@2026
- 连接配置通过环境变量覆盖: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- 启动脚本 `scripts/ensure-mysql.sh` 会在 dev/start 前自动启动 mysqld 并建库
- 表: admins (管理员), categories (分类), products (商品)
- products.category_id 外键关联 categories.id (ON DELETE SET NULL)

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
- 密码: admin123
