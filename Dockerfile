# 使用Node.js官方镜像作为基础镜像
# 阶段1: 构建应用
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

# 阶段2: 运行应用
FROM node:20-alpine AS runner

WORKDIR /app

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装pnpm
RUN npm install -g pnpm

# 安装生产依赖
RUN pnpm install --prod

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 暴露9506端口
EXPOSE 9506

# 启动应用
CMD ["pnpm", "start:prod"]