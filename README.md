# Screeps AI

这是一个用 TypeScript 编写的 Screeps 游戏 AI 实现。本项目采用模块化设计，实现了智能化的资源管理、自动布局系统和高效的单位控制。

## 特色功能

1. **智能状态管理**

   - 基于状态机的 Creep 行为控制
   - 自动切换工作状态
   - 实时状态反馈（使用表情符号）

2. **高效采集系统**

   - 智能能量源分配
   - 多级能量获取策略
   - 自动避免拥堵

3. **自适应布局**
   - 基于房间等级的建筑规划
   - 智能道路网络生成
   - 优化的建筑位置分配

## 项目结构

```
src/
├── main.ts              # 主入口文件，游戏循环控制
└── modules/
    ├── errorMapper.js   # 错误追踪与映射模块，提供详细错误定位
    └── utils.ts         # 游戏核心逻辑模块，包含AI行为实现
```

## 核心模块说明

### main.ts

主程序入口，负责初始化游戏逻辑和调用各个模块的功能。

### modules/errorMapper.js

错误处理模块，提供源码映射功能，帮助在游戏控制台中准确定位错误发生的位置。

### modules/utils.ts

游戏核心逻辑模块，包含以下主要功能：

1. **Creep 管理系统**

   - 角色定义：采集者(Harvester)、升级者(Upgrader)、建筑者(Builder)、防御者(Defender)
   - 状态机工作流：采集(Harvesting)、运输(Transferring)、建造(Building)、升级(Upgrading)
   - 智能行为控制：自动切换工作状态、状态反馈
   - 防卡住机制：自动检测和处理卡住情况

2. **资源管理系统**

   - 分级能量获取策略：
     1. 优先从容器获取
     2. 从存储设施获取
     3. 收集掉落能量
     4. 直接从能量源采集
   - 智能目标选择：
     - 优先级分配系统
     - 自动平衡采集压力
     - 动态任务分配
   - 建筑能量补给优化：
     - Spawn/Extension 优先
     - 防御塔能量阈值控制
     - 存储设施智能填充

3. **自动布局系统**

   - 动态建筑规划：
     - 基于房间等级的建筑布局
     - 分级扩展布局
     - 优化的存储位置
   - 智能道路网络：
     - 环形主干道
     - 辐射状支路
     - 自动避开障碍
   - 建筑位置优化：
     - 关键建筑集中布置
     - 资源点便捷通道
     - 防御设施合理分布

4. **防御系统**
   - 智能防御塔控制：
     - 优先攻击敌对单位
     - 分级建筑维修
     - 能量使用优化
   - 主动防御机制：
     - 实时威胁评估
     - 自动召唤防御者
     - 动态防御部署
   - 建筑维护体系：
     - 重要建筑优先维护
     - 分级修复阈值
     - 智能资源分配

## 配置系统

项目采用多层级配置系统，实现灵活的游戏策略调整：

### 1. 防御配置 (DEFENSE_CONFIG)

```typescript
{
  // 防御塔控制参数
  TOWER_REPAIR_THRESHOLD: 0.8,    // 建筑维修阈值（提高到80%）
  TOWER_ENERGY_THRESHOLD: 0.6,    // 塔能量储备阈值（提高到60%）

  // 防御建筑生命值
  WALL_HITS_TARGET: 50000,       // 墙壁目标生命值（5万）
  WALL_MINIMUM_HITS: 5000,       // 墙壁最低生命值

  // 维修优先级
  CRITICAL_REPAIR_THRESHOLD: 0.3, // 紧急维修阈值

  // 城墙等级目标
  RAMPART_HITS_TARGETS: {
    RCL1: 10000,    // 1级房间
    RCL4: 100000,   // 4级房间
    RCL8: 2000000   // 8级房间
  }
}
```

### 2. 资源管理配置 (RESOURCE_CONFIG)

```typescript
{
  // 资源储备参数
  ENERGY_RESERVE_RATIO: 0.2,     // 能量储备比例
  CONTAINER_FILL_THRESHOLD: 0.8,  // 容器填充阈值
  STORAGE_BUFFER: 100000,        // 存储缓冲区大小
  TERMINAL_ENERGY_TARGET: 50000,  // 终端目标能量
  LINK_TRANSFER_THRESHOLD: 0.25,  // Link传输阈值

  // 能量分配优先级
  PRIORITY: {
    SPAWN: 1,      // 生成设施最优先
    EXTENSION: 2,   // 扩展次之
    TOWER: 3,      // 防御塔第三
    STORAGE: 4,    // 存储第四
    TERMINAL: 5,    // 终端第五
    CONTAINER: 6    // 容器最后
  }
}
```

### 3. 智能布局配置 (LAYOUT_CONFIG)

```typescript
{
  // 生成点布局
  SPAWNS: [
    { x: 25, y: 25, name: 'Spawn1' },  // 主生成点
    { x: 23, y: 25, name: 'Spawn2' },  // 副生成点
    { x: 27, y: 25, name: 'Spawn3' }   // 第三生成点
  ],

  // 道路网络参数
  ROAD_PATTERN: {
    RADIUS: 5,    // 环形主干道半径
    SPOKES: 8     // 辐射道路数量
  },

  // 建筑规模控制
  MAX_SPAWNS_PER_RCL: {
    1: 1,         // RCL 1可建1个spawn
    4: 2,         // RCL 4可建2个spawn
    7: 3          // RCL 7可建3个spawn
  }
}
```

## Creep 体型系统

项目实现了灵活的 Creep 体型配置系统：

```typescript
const BODY_PARTS = {
	// 工作型Creep体型配置
	WORKER: {
		BASIC: [WORK, CARRY, MOVE], // 基础体型 (300能量)
		STANDARD: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 标准体型 (400能量)
		HEAVY: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], // 重型体型 (600能量)
	},

	// 防御型Creep体型配置
	DEFENDER: {
		BASIC: [TOUGH, MOVE, ATTACK], // 基础防御者
		STANDARD: [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK], // 标准防御者
		HEAVY: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK], // 重型防御者
	},
};
```

## 开发环境配置

### 项目依赖

#### 核心依赖

- `source-map@0.6.1`: 源码映射支持
- `lodash`: 工具函数库
- `typescript`: TypeScript 支持

#### 构建工具

- `rollup`: 模块打包
- `rollup-plugin-typescript2`: TypeScript 编译
- `rollup-plugin-screeps`: Screeps 部署
- `rollup-plugin-clear`: 构建清理
- `rollup-plugin-copy`: 文件复制

#### 类型定义

- `@types/lodash`: Lodash 类型
- `@types/screeps`: Screeps API 类型

### 开发命令

```bash
# 安装依赖
npm install

# 开发构建
npm run build

# 部署服务器
npm run push   # 官方服务器
npm run local  # 本地服务器

# 代码检查
npm run lint
```

## 开发配置

### TypeScript 配置 (tsconfig.json)

```json
{
	"compilerOptions": {
		"target": "ES2017", // 编译目标版本
		"moduleResolution": "node", // 模块解析策略
		"sourceMap": true, // 启用源码映射
		"baseUrl": "./", // 基础路径
		"paths": {
			// 路径别名
			"@/*": ["src/*"]
		}
	}
}
```

### Rollup 配置 (rollup.config.js)

```javascript
{
  input: 'src/main.ts',          // 入口文件
  output: {
    dir: 'dist',                 // 输出目录
    format: 'cjs'                // CommonJS格式
  },
  plugins: [
    clear({ targets: ['dist'] }), // 清理构建目录
    typescript(),                 // 编译TypeScript
    screeps({                    // Screeps部署
      config: require('./.secret.json'),
      dryRun: false
    })
  ]
}
```

### 部署配置 (.secret.json)

```json
{
	"main": {
		// 官方服务器配置
		"token": "your-token",
		"protocol": "https",
		"hostname": "screeps.com",
		"port": 443,
		"path": "/"
	},
	"local": {
		// 本地服务器配置
		"copyPath": "path/to/local/mods"
	}
}
```

## AI 行为示例

### 采集者智能行为

```typescript
// 采集者状态机
function runHarvester(creep: Creep): void {
	// 状态更新
	if (creep.store.getFreeCapacity() === 0) {
		creep.memory.workingState = WORK_STATE.TRANSFERRING;
	} else if (creep.store[RESOURCE_ENERGY] === 0) {
		creep.memory.workingState = WORK_STATE.HARVESTING;
	}

	// 行为执行
	switch (creep.memory.workingState) {
		case WORK_STATE.HARVESTING:
			harvestEnergy(creep);
			break;
		case WORK_STATE.TRANSFERRING:
			transferEnergy(creep);
			break;
	}
}
```

## 参考资源

- [Screeps 搭建开发环境 - 导言](https://www.jianshu.com/p/895f05016ff2)
- [Screeps 官方文档](https://docs.screeps.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Lodash 文档](https://lodash.com/)
- [Rollup 文档](https://rollupjs.org/)
