# Screeps AI

这是一个用 TypeScript 编写的 Screeps 游戏 AI 实现。

## 项目结构

```
src/
├── main.ts              # 主入口文件
└── modules/
    ├── errorMapper.js   # 错误追踪与映射模块
    └── utils.ts         # 通用工具和游戏逻辑模块
```

## 核心模块说明

### main.ts

主程序入口，负责初始化游戏逻辑和调用各个模块的功能。

### modules/errorMapper.js

错误处理模块，提供源码映射功能，帮助在游戏控制台中准确定位错误发生的位置。

### modules/utils.ts

游戏核心逻辑模块，包含以下主要功能：

1. **Creep 管理**

   - 角色定义：采集者、升级者、建筑者、防御者
   - 自动生成与补充
   - 角色行为控制

2. **资源管理系统**

   - 能量分配优先级
   - 存储管理
   - 资源阈值控制
   - 建筑物能量补给

3. **自动布局系统**

   - 基于控制器等级的建筑布局
   - 道路网络规划（环形+辐射状）
   - 建筑位置优化

4. **防御系统**
   - 自动防御塔控制
   - 敌对单位检测
   - 建筑修复优先级
   - 防御者 creep 控制

## 配置说明

### 基础配置

项目使用了多个配置文件来管理不同方面的参数：

1. **防御配置 (DEFENSE_CONFIG)**

   ```typescript
   {
     TOWER_REPAIR_THRESHOLD: 0.7,  // 建筑维修阈值
     TOWER_ENERGY_THRESHOLD: 0.5,  // 塔能量储备阈值
     WALL_HITS_TARGET: 10000      // 墙壁目标生命值
   }
   ```

2. **资源配置 (RESOURCE_CONFIG)**

   ```typescript
   {
     ENERGY_RESERVE_RATIO: 0.2,    // 能量储备比例
     CONTAINER_FILL_THRESHOLD: 0.8, // 容器填充阈值
     STORAGE_BUFFER: 100000,       // 存储缓冲区大小
     TERMINAL_ENERGY_TARGET: 50000  // 终端目标能量
   }
   ```

3. **布局配置 (LAYOUT_CONFIG)**
   ```typescript
   {
     SPAWN_POSITION: { x: 25, y: 25 }, // 主生成点位置
     ROAD_PATTERN: {                   // 道路模式
       RADIUS: 5,                      // 主要道路半径
       SPOKES: 8                       // 辐射道路数量
     }
   }
   ```

## 开发环境设置

### 依赖项说明

#### 生产依赖

- `source-map@0.6.1`: 提供源码映射功能，用于调试和错误追踪

#### 开发依赖

- `@rollup/plugin-commonjs`: 将 CommonJS 模块转换为 ES6
- `@rollup/plugin-node-resolve`: 解析 node_modules 中的模块
- `@types/lodash`: Lodash 类型定义
- `@types/screeps`: Screeps 游戏 API 的 TypeScript 类型定义
- `rollup`: 打包工具
- `rollup-plugin-clear`: 清理构建目录
- `rollup-plugin-copy`: 复制构建文件
- `rollup-plugin-screeps`: Screeps 专用部署插件
- `rollup-plugin-typescript2`: TypeScript 编译插件
- `typescript`: TypeScript 编译器

### 构建命令

```bash
# 部署到 Screeps 官方服务器
npm run push

# 部署到本地服务器
npm run local

# 仅构建不部署
npm run build
```

## 配置文件

### tsconfig.json

TypeScript 配置文件，设置了编译选项：

- 目标版本：ES2017
- 模块解析：Node
- 启用源码映射
- 设置模块别名

### rollup.config.js

Rollup 打包配置：

- 清理构建目录
- 编译 TypeScript
- 解析依赖
- 部署到指定目标（本地或远程）

### .secret.json

包含服务器连接配置：

- 官方服务器 token 和连接信息
- 本地开发服务器路径

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request
