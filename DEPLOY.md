# Yu 品牌独立站 · 阿里云 ECS 部署指南

本指南将项目部署到阿里云 ECS，使用 **MySQL 8** 数据库，Node 运行服务，Nginx 反向代理。

## 一、部署信息（本次环境）

| 项目 | 值 |
| --- | --- |
| 工程名 | `ygtq_yuquest`（`package.json` name） |
| 项目代码路径 | `/opt/ygtq/ygtq_yuquest` |
| 产品图片存储路径 | `/opt/ygtq/product` |
| 数据库名 | `yu_sports` |
| 数据库用户 | `yu` |
| 数据库密码 | `YuQuest@2026` |
| 应用监听端口 | `5000`（Nginx 对外 80/443） |
| 管理员账号 | `admin` / `ygtq@18618437055` |

> 目录关系：代码在 `/opt/ygtq/ygtq_yuquest`，图片在其**同级**目录 `/opt/ygtq/product`。后端默认会自动把上传目录解析为「项目同级 `product` 目录」，也可用环境变量 `UPLOAD_ROOT_DIR` 显式覆盖。

---

## 二、服务器环境准备

以 root 或具备 sudo 的用户登录 ECS（以下命令以 CentOS/Alibaba Cloud Linux 为例，Ubuntu 见括号内提示）。

### 1. 安装 Node.js 20 LTS

```bash
# CentOS / Alibaba Cloud Linux
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Ubuntu / Debian
# curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# apt-get install -y nodejs

node -v   # 期望 v20.x
npm -v
```

### 2. 安装 pnpm（项目强制使用 pnpm）

```bash
npm install -g pnpm@9
pnpm -v
```

### 3. 安装 MySQL 8

```bash
# CentOS / Alibaba Cloud Linux
yum install -y mysql-server
systemctl enable --now mysqld

# Ubuntu / Debian
# apt-get update && apt-get install -y mysql-server
# systemctl enable --now mysql
```

设置 root 密码并加固（如首次安装）：

```bash
mysql_secure_installation
```

### 4. 安装 Nginx 与进程管理工具 pm2

```bash
# CentOS / Alibaba Cloud Linux
yum install -y nginx
systemctl enable --now nginx

npm install -g pm2
```

---

## 三、创建数据库与授权

登录 MySQL（用 root 密码）：

```bash
mysql -u root -p
```

执行以下 SQL 创建数据库和业务用户（密码即本次给定值）：

```sql
CREATE DATABASE IF NOT EXISTS `yu_sports`
  DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'yu'@'localhost' IDENTIFIED BY 'YuQuest@2026';
CREATE USER IF NOT EXISTS 'yu'@'127.0.0.1' IDENTIFIED BY 'YuQuest@2026';

GRANT ALL PRIVILEGES ON `yu_sports`.* TO 'yu'@'localhost';
GRANT ALL PRIVILEGES ON `yu_sports`.* TO 'yu'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

> 若 MySQL 与应用不在同一台机器，还需创建 `'yu'@'%'` 用户并在安全组放行 3306；同机部署用 `localhost` 最安全。

---

## 四、创建目录并上传代码

### 1. 创建目录

```bash
mkdir -p /opt/ygtq/ygtq_yuquest      # 项目代码
mkdir -p /opt/ygtq/product      # 产品图片
```

### 2. 上传代码

在**本地电脑**把项目文件上传到服务器（排除 `node_modules`、`dist`、`.env`）：

```bash
# 方式 A：scp（在本地执行）
scp -r ./ygtq_yuquest/* root@<服务器公网IP>:/opt/ygtq/ygtq_yuquest/

# 方式 B：rsync（推荐，可增量同步）
rsync -avz --exclude node_modules --exclude dist --exclude .env \
  ./ygtq_yuquest/ root@<服务器公网IP>:/opt/ygtq/ygtq_yuquest/
```

> 也可先 `git clone` 仓库到 `/opt/ygtq/ygtq_yuquest`。

### 3. 设置图片目录权限

让运行 Node 的用户对图片目录有读写权限（假设用 root 跑 pm2，可跳过；用普通用户则把 `www` 换成该用户）：

```bash
chown -R root:root /opt/ygtq/product
chmod -R 755 /opt/ygtq/product
```

---

## 五、配置环境变量

进入项目目录，由示例文件生成 `.env`：

```bash
cd /opt/ygtq/ygtq_yuquest
cp .env.example .env
vi .env
```

确认/填写以下内容（已按本次环境预设，重点核对密码与路径）：

```ini
# 服务端口
PORT=5000
# 生产模式（关键：值为 PROD 时才会托管 dist/client 静态前端）
COZE_PROJECT_ENV=PROD

# JWT 密钥（请改成一段随机长字符串）
JWT_SECRET=please-change-this-to-a-long-random-secret

# MySQL 数据库
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=yu_sports
DB_USER=yu
DB_PASSWORD=YuQuest@2026

# 产品图片上传根目录（显式指定，与项目同级的 product 目录）
UPLOAD_ROOT_DIR=/opt/ygtq/product
```

> 生成随机 JWT 密钥可用：`openssl rand -hex 32`

---

## 六、初始化数据库表与种子数据

项目根目录已提供 `schema.sql`（含建表、管理员账号、分类、示例商品、上传目录配置）。

```bash
cd /opt/ygtq/ygtq_yuquest
mysql -u yu -p yu_sports < schema.sql
# 提示输入密码：YuQuest@2026
```

验证：

```bash
mysql -u yu -p -e "USE yu_sports; SHOW TABLES; SELECT username FROM admins;"
```

应看到 `admins`、`categories`、`products`、`config` 四张表，以及管理员 `admin`。

---

## 七、安装依赖并构建前端

```bash
cd /opt/ygtq/ygtq_yuquest

# 安装全部依赖（生产用 tsx 直接运行 TS，tsx 在 devDependencies 中，因此不要加 --prod）
pnpm install

# 构建前端静态资源到 dist/client
pnpm build:client
```

构建成功后会生成 `dist/client/index.html` 等资源。

---

## 八、启动应用（pm2 托管）

### 1. 用 pm2 启动

```bash
cd /opt/ygtq/ygtq_yuquest
COZE_PROJECT_ENV=PROD pm2 start "pnpm start:prod" --name ygtq_yuquest
```

`start:prod` 实际执行 `tsx server/server.ts`，会读取 `.env`、连接 MySQL、监听 5000 端口并托管 `dist/client`。

### 2. 设置开机自启

```bash
pm2 save
pm2 startup        # 按提示执行它输出的那条命令
```

### 3. 查看日志 / 状态

```bash
pm2 status
pm2 logs ygtq_yuquest --lines 50
```

正常应看到：

```
[config] upload root directory: /opt/ygtq/product
Serving static files from dist/client/
Server running on http://0.0.0.0:5000 [PROD]
```

### 4. 本机自测

```bash
curl -s http://127.0.0.1:5000/api/products | head
curl -I  http://127.0.0.1:5000/
```

---

## 九、配置 Nginx 反向代理

新建站点配置：

```bash
vi /etc/nginx/conf.d/ygtq_yuquest.conf
```

### 9.1 仅 HTTP（快速验证，暂无证书时）

```nginx
server {
    listen 80;
    server_name www.yuquest.com;   # 暂无域名可用 _;

    client_max_body_size 10m;       # 允许上传图片（≤5MB），留余量

    location / {
        proxy_pass http://127.0.0.1:5000;   # 端口与 .env 的 PORT 保持一致
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 9.2 配置 HTTPS（正式上线，使用已有 SSL 证书）

本项目证书路径：`/etc/ssl/certs/www.yuquest.com.pem` 与 `/etc/ssl/certs/www.yuquest.com.key`。
先确认 Nginx 可读取：`chmod 644 *.pem; chmod 600 *.key`。

```nginx
# HTTP -> 强制跳转 HTTPS
server {
    listen 80;
    server_name www.yuquest.com yuquest.com;
    location /.well-known/acme-challenge/ { root /usr/share/nginx/html; }
    location / { return 301 https://www.yuquest.com$request_uri; }
}

# HTTPS 主站点
server {
    listen 443 ssl;
    http2 on;
    server_name www.yuquest.com;

    ssl_certificate     /etc/ssl/certs/www.yuquest.com.pem;
    ssl_certificate_key /etc/ssl/certs/www.yuquest.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    client_max_body_size 10m;   # 允许上传图片（≤5MB），留余量

    location / {
        proxy_pass http://127.0.0.1:5000;   # 端口与 .env 的 PORT 保持一致
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout    120s;
        proxy_send_timeout    120s;
    }
}

# 裸域跳 www（若证书仅签了 www，可删除本段）
server {
    listen 443 ssl;
    http2 on;
    server_name yuquest.com;
    ssl_certificate     /etc/ssl/certs/www.yuquest.com.pem;
    ssl_certificate_key /etc/ssl/certs/www.yuquest.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    return 301 https://www.yuquest.com$request_uri;
}
```

> 关键点：`proxy_pass` 的端口必须与 `.env` 中 `PORT` 一致（如把应用改成 8080，这里也要写 8080）。

测试并重载：

```bash
nginx -t          # 语法 + 证书路径校验，必须 successful
systemctl reload nginx
```

> 图片上传走 `/api/upload`，上传后通过 `/uploads/文件名` 访问，Nginx 已整体反代到应用，无需额外配置。
> 若改用 certbot 自动签发：`yum install -y certbot python3-certbot-nginx && certbot --nginx -d www.yuquest.com`。

---

## 十、开放防火墙 / 安全组

1. **阿里云控制台 → ECS → 安全组**：放行入方向 **80**（HTTP）、**443**（HTTPS）。不要对外暴露 5000、3306。
2. 服务器本机防火墙（若开启 firewalld）：

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## 十一、验证上线

浏览器访问 `http://your-domain.com`（或公网 IP）：

- 首页、商品列表、商品详情、About 可正常浏览；
- 商品图片正常显示；
- 访问 `/admin/login`，用 `admin` / `ygtq@18618437055` 登录；
- 后台新增商品并**上传本地图片**（jpg/png，≤5MB），确认图片出现在 `/opt/ygtq/product/` 且页面能显示。

---

## 十二、日常运维命令

```bash
# 查看服务状态 / 日志
pm2 status
pm2 logs ygtq_yuquest

# 更新代码后重新发布
cd /opt/ygtq/ygtq_yuquest
git pull            # 或重新 rsync 上传
pnpm install        # 依赖有变化时
pnpm build:client
pm2 restart ygtq_yuquest

# 停止 / 删除
pm2 stop ygtq_yuquest
pm2 delete ygtq_yuquest
```

### 数据库备份（建议加入定时任务）

```bash
mysqldump -u yu -p'YuQuest@2026' yu_sports > /opt/ygtq/backup_$(date +%F).sql
```

### 图片备份

`/opt/ygtq/product` 目录即全部上传图片，随服务器快照或定期打包备份即可。

---

## 附：常见问题

| 现象 | 排查 |
| --- | --- |
| 页面 502 | 应用未起或 5000 未监听：`pm2 logs ygtq_yuquest`、`curl 127.0.0.1:5000` |
| 接口报数据库错误 | 核对 `.env` 的 `DB_*`；确认 `yu_sports` 已建、用户已授权、已导入 `schema.sql` |
| 前端能开但数据为空 | 未导入种子数据或连错库；执行第六步 |
| 上传图片失败/不显示 | 确认 `/opt/ygtq/product` 存在且可写；`UPLOAD_ROOT_DIR` 正确；Nginx `client_max_body_size` 足够大 |
| 样式/页面 404 | 未执行 `pnpm build:client`，或 `COZE_PROJECT_ENV` 不是 `PROD` |
