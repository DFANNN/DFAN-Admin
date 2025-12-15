#!/bin/bash

set -e

echo "🚧 开始清理项目缓存和依赖..."

# 删除依赖与构建产物
rm -rf node_modules
rm -rf dist
rm -rf .vite

echo "🧹 清理 pnpm store（未被引用的缓存依赖）..."
pnpm store prune

echo "📦 重新安装依赖（pnpm install）..."
pnpm install

echo "🏗️ 开始 pnpm build 打包..."
pnpm build

echo "🎉 清理并打包完成！"
