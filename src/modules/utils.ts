import _ from 'lodash';

// Creep 角色常量
export const CREEP_ROLE = {
	HARVESTER: 'harvester',
	UPGRADER: 'upgrader',
	BUILDER: 'builder',
	DEFENDER: 'defender',
} as const;

export type CreepRole = (typeof CREEP_ROLE)[keyof typeof CREEP_ROLE];

// Creep 工作状态
export const WORK_STATE = {
	HARVESTING: 'harvesting',
	TRANSFERRING: 'transferring',
	BUILDING: 'building',
	UPGRADING: 'upgrading',
	REPAIRING: 'repairing',
} as const;

export type WorkState = (typeof WORK_STATE)[keyof typeof WORK_STATE];

// 扩展 CreepMemory 接口
declare global {
	interface CreepMemory {
		role: CreepRole;
		building?: boolean;
		sourceId?: Id<Source>;
		targetId?: Id<_HasId>;
		workingState?: WorkState;
		path?: RoomPosition[];
		lastPos?: { x: number; y: number };
		stuckCount?: number;
	}
}

declare global {
	// 扩展 CreepMemory 接口，添加更多功能
	interface CreepMemory {
		role: CreepRole;
		building?: boolean;
		sourceId?: Id<Source>;
		targetId?: Id<_HasId>;
		workingState?:
			| 'harvesting'
			| 'transferring'
			| 'building'
			| 'upgrading'
			| 'repairing';
		path?: RoomPosition[];
		lastPos?: { x: number; y: number };
		stuckCount?: number;
	}
}

// 防御配置
export const DEFENSE_CONFIG = {
	TOWER_REPAIR_THRESHOLD: 0.8, // 建筑维修阈值（低于最大生命值的80%时修复，提前维护）
	TOWER_ENERGY_THRESHOLD: 0.6, // 塔能量储备阈值（保持60%以上，确保有足够能量应对突发情况）
	WALL_HITS_TARGET: 50000, // 墙壁目标生命值（提高到5万，增强防御能力）

	// 建筑维修优先级阈值
	CRITICAL_REPAIR_THRESHOLD: 0.3, // 建筑生命值低于30%时优先维修
	WALL_MINIMUM_HITS: 5000, // 墙壁最低生命值（低于此值时优先修理）

	// 分级维修目标
	RAMPART_HITS_TARGETS: {
		RCL1: 10000, // 控制器等级1时的目标生命值
		RCL2: 20000, // 等级2
		RCL3: 50000, // 等级3
		RCL4: 100000, // 等级4
		RCL5: 200000, // 等级5
		RCL6: 500000, // 等级6
		RCL7: 1000000, // 等级7
		RCL8: 2000000, // 等级8
	},
};

// 资源管理配置
export const RESOURCE_CONFIG = {
	ENERGY_RESERVE_RATIO: 0.2, // 能量储备比例
	CONTAINER_FILL_THRESHOLD: 0.8, // 容器填充阈值
	STORAGE_BUFFER: 100000, // 存储缓冲区大小
	TERMINAL_ENERGY_TARGET: 50000, // 终端目标能量
	LINK_TRANSFER_THRESHOLD: 0.25, // Link传输阈值

	// 能量分配优先级
	PRIORITY: {
		SPAWN: 1,
		EXTENSION: 2,
		TOWER: 3,
		STORAGE: 4,
		TERMINAL: 5,
		CONTAINER: 6,
	},

	// 工作者获取能量的优先级
	WORKER_COLLECT_PRIORITY: {
		CONTAINER: 1, // 优先从容器获取
		STORAGE: 2, // 其次从存储获取
		DROPPED_ENERGY: 3, // 再次是掉落的能量
		SOURCE: 4, // 最后才直接采集
	},
};

// 扩展 CreepMemory 接口，添加 role 属性
declare global {
	interface CreepMemory {
		role: CreepRole;
		building?: boolean;
		sourceId?: Id<Source>; // 为采集者添加能量源ID
	}
}

// 房间布局配置
export const LAYOUT_CONFIG = {
	SPAWNS: [
		{ x: 25, y: 25, name: 'Spawn1' }, // 主生成点
		{ x: 23, y: 25, name: 'Spawn2' }, // 第二生成点
		{ x: 27, y: 25, name: 'Spawn3' }, // 第三生成点
	],
	EXTENSIONS_PATTERN: [
		// 扩展的相对位置模式（围绕主要生成点）
		{ x: -1, y: -1 },
		{ x: 1, y: -1 },
		{ x: -1, y: 1 },
		{ x: 1, y: 1 },
		{ x: 0, y: -2 },
		{ x: 0, y: 2 },
		{ x: -2, y: 0 },
		{ x: 2, y: 0 },
		// 围绕第二生成点
		{ x: -3, y: -1 },
		{ x: -3, y: 1 },
		{ x: -4, y: 0 },
		// 围绕第三生成点
		{ x: 3, y: -1 },
		{ x: 3, y: 1 },
		{ x: 4, y: 0 },
	],
	STORAGE_OFFSET: { x: 3, y: 0 }, // 存储相对于主spawn的偏移
	TOWER_POSITIONS: [
		// 防御塔的位置
		{ x: 23, y: 23 },
		{ x: 27, y: 23 },
		{ x: 23, y: 27 },
		{ x: 27, y: 27 },
	],
	ROAD_PATTERN: {
		// 道路模式
		RADIUS: 5, // 主要道路半径
		SPOKES: 8, // 辐射道路数量
		MAX_DISTANCE: 10, // 最大建造距离
		MIN_STRUCTURES: 2, // 最小周边建筑数
		BUILD_THRESHOLD: 0.7, // 道路建造进度阈值

		// 道路优先级
		PRIORITY: {
			RESOURCE_PATH: 1, // 资源路径最高优先级
			CONTROLLER_PATH: 2, // 控制器路径次优先级
			CONSTRUCTION_PATH: 3, // 建筑路径最低优先级
		},

		// 道路检查
		CHECK_INTERVAL: 1000, // 检查间隔（ticks）
		REPAIR_THRESHOLD: 0.5, // 维修阈值
	},

	// 每个控制器等级允许的最大spawn数量
	MAX_SPAWNS_PER_RCL: {
		1: 1,
		2: 1,
		3: 2,
		4: 2,
		5: 2,
		6: 2,
		7: 3,
		8: 3,
	},
};

// creep体型配置
const BODY_PARTS = {
	// 工作体型
	WORKER: {
		BASIC: [WORK, CARRY, MOVE], // 基础体型
		STANDARD: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 标准体型
		HEAVY: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], // 重型体型
	},
	// 防御体型
	DEFENDER: {
		BASIC: [TOUGH, MOVE, ATTACK],
		STANDARD: [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK],
		HEAVY: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK],
	},
};

// 生成 creep 的配置
export const CREEP_CONFIGS = {
	[CREEP_ROLE.HARVESTER]: {
		parts: (energy: number) => {
			if (energy >= 600) return BODY_PARTS.WORKER.HEAVY;
			if (energy >= 400) return BODY_PARTS.WORKER.STANDARD;
			return BODY_PARTS.WORKER.BASIC;
		},
		name: 'Harvester',
		minCount: (rcl: number) => Math.min(rcl * 2, 6), // RCL越高需要更多采集者，但最多6个
	},
	[CREEP_ROLE.UPGRADER]: {
		parts: (energy: number) => {
			if (energy >= 600) return BODY_PARTS.WORKER.HEAVY;
			if (energy >= 400) return BODY_PARTS.WORKER.STANDARD;
			return BODY_PARTS.WORKER.BASIC;
		},
		name: 'Upgrader',
		minCount: (rcl: number) => Math.max(1, Math.floor(rcl / 2)), // RCL越高需要更多升级者
	},
	[CREEP_ROLE.BUILDER]: {
		parts: (energy: number) => {
			if (energy >= 600) return BODY_PARTS.WORKER.HEAVY;
			if (energy >= 400) return BODY_PARTS.WORKER.STANDARD;
			return BODY_PARTS.WORKER.BASIC;
		},
		name: 'Builder',
		minCount: (rcl: number) => Math.max(1, Math.floor(rcl / 3)), // 根据RCL调整建造者数量
	},
	[CREEP_ROLE.DEFENDER]: {
		parts: (energy: number) => {
			if (energy >= 600) return BODY_PARTS.DEFENDER.HEAVY;
			if (energy >= 400) return BODY_PARTS.DEFENDER.STANDARD;
			return BODY_PARTS.DEFENDER.BASIC;
		},
		name: 'Defender',
		minCount: (rcl: number) => 0, // 只在发现敌人时生成
	},
};

// 智能移动函数
function moveToTarget(
	creep: Creep,
	target: RoomPosition | { pos: RoomPosition }
): void {
	// 检查是否卡住
	const currentPos = creep.pos;
	if (
		creep.memory.lastPos &&
		currentPos.x === creep.memory.lastPos.x &&
		currentPos.y === creep.memory.lastPos.y
	) {
		creep.memory.stuckCount = (creep.memory.stuckCount || 0) + 1;
	} else {
		creep.memory.stuckCount = 0;
	}

	// 更新上一次位置
	creep.memory.lastPos = { x: currentPos.x, y: currentPos.y };

	// 如果卡住超过3个tick，尝试随机移动
	if (creep.memory.stuckCount && creep.memory.stuckCount > 3) {
		const directions = [
			TOP,
			TOP_RIGHT,
			RIGHT,
			BOTTOM_RIGHT,
			BOTTOM,
			BOTTOM_LEFT,
			LEFT,
			TOP_LEFT,
		];
		const randomDirection =
			directions[Math.floor(Math.random() * directions.length)];
		creep.move(randomDirection);
		creep.memory.stuckCount = 0;
		creep.say('🚫 卡住了');
		return;
	}

	// 正常移动
	creep.moveTo(target, {
		reusePath: 20,
		visualizePathStyle: { stroke: '#ffffff' },
		maxRooms: 1,
		range: 1,
		plainCost: 2,
		swampCost: 10,
		costCallback: (roomName, costMatrix) => {
			// 获取房间
			const room = Game.rooms[roomName];
			if (!room) return costMatrix;

			// 标记其他 creeps 的位置为高成本
			room.find(FIND_CREEPS).forEach((otherCreep) => {
				if (otherCreep.id !== creep.id) {
					costMatrix.set(otherCreep.pos.x, otherCreep.pos.y, 255);
				}
			});

			return costMatrix;
		},
	});
}

// 生成 creep
export function spawnCreep(
	spawn: StructureSpawn,
	role: CreepRole
): ScreepsReturnCode {
	const config = CREEP_CONFIGS[role];
	const newName = `${config.name}_${Game.time}`;
	const room = spawn.room;
	const rcl = room.controller ? room.controller.level : 1;
	const energy = spawn.room.energyAvailable;

	// 根据可用能量和房间等级决定体型
	const bodyParts = config.parts(energy);

	return spawn.spawnCreep(bodyParts, newName, {
		memory: { role: role },
	});
}

// 运行基础系统
// 防御塔控制函数
function runTower(tower: StructureTower): void {
	// 优先攻击敌对单位
	const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
	if (hostiles.length > 0) {
		const target = _.minBy(hostiles, (creep) => creep.hits);
		tower.attack(target);
		return;
	}

	// 如果能量充足，修理建筑
	if (
		tower.store.getUsedCapacity(RESOURCE_ENERGY) >
		tower.store.getCapacity(RESOURCE_ENERGY) *
			DEFENSE_CONFIG.TOWER_ENERGY_THRESHOLD
	) {
		// 优先修理重要建筑
		const criticalStructures = tower.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (
					(structure.structureType === STRUCTURE_CONTAINER ||
						structure.structureType === STRUCTURE_SPAWN ||
						structure.structureType === STRUCTURE_EXTENSION) &&
					structure.hits <
						structure.hitsMax * DEFENSE_CONFIG.TOWER_REPAIR_THRESHOLD
				);
			},
		});

		if (criticalStructures.length > 0) {
			tower.repair(criticalStructures[0]);
			return;
		}

		// 其次修理墙壁和城墙
		const walls = tower.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (
					(structure.structureType === STRUCTURE_WALL ||
						structure.structureType === STRUCTURE_RAMPART) &&
					structure.hits < DEFENSE_CONFIG.WALL_HITS_TARGET
				);
			},
		});

		if (walls.length > 0) {
			const target = _.minBy(walls, (wall) => wall.hits);
			tower.repair(target);
		}
	}
}

// 防御者行为函数
function runDefender(creep: Creep): void {
	const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
	if (hostiles.length > 0) {
		const closestHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			if (creep.attack(closestHostile) === ERR_NOT_IN_RANGE) {
				creep.moveTo(closestHostile, {
					visualizePathStyle: { stroke: '#ff0000' },
				});
			}
		}
	} else {
		// 巡逻到房间中心
		creep.moveTo(25, 25, {
			visualizePathStyle: { stroke: '#ffaa00' },
		});
	}
}

// 自动布局系统
function manageRoomLayout(room: Room): void {
	// 检查是否需要新建建筑
	if (room.controller && room.controller.my) {
		const level = room.controller.level;

		// 根据控制器等级规划建筑
		if (level >= 1) {
			// 放置生成点
			const spawnPos = new RoomPosition(
				LAYOUT_CONFIG.SPAWNS[0].x,
				LAYOUT_CONFIG.SPAWNS[0].y,
				room.name
			);
			room.createConstructionSite(spawnPos, STRUCTURE_SPAWN);
		}

		if (level >= 2) {
			// 放置扩展
			LAYOUT_CONFIG.EXTENSIONS_PATTERN.forEach((offset) => {
				const pos = new RoomPosition(
					LAYOUT_CONFIG.SPAWNS[0].x + offset.x,
					LAYOUT_CONFIG.SPAWNS[0].y + offset.y,
					room.name
				);
				room.createConstructionSite(pos, STRUCTURE_EXTENSION);
			});
		}

		if (level >= 3) {
			// 放置防御塔
			LAYOUT_CONFIG.TOWER_POSITIONS.slice(0, 1).forEach((pos) => {
				room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
			});
		}

		if (level >= 4) {
			// 放置存储
			const storagePos = new RoomPosition(
				LAYOUT_CONFIG.SPAWNS[0].x + LAYOUT_CONFIG.STORAGE_OFFSET.x,
				LAYOUT_CONFIG.SPAWNS[0].y + LAYOUT_CONFIG.STORAGE_OFFSET.y,
				room.name
			);
			room.createConstructionSite(storagePos, STRUCTURE_STORAGE);
		}

		// 规划道路
		planRoads(room);
	}
}

// 检查位置是否适合建造道路
function isValidRoadPosition(pos: RoomPosition, room: Room): boolean {
	const terrain = room.getTerrain();

	// 检查地形
	if (terrain.get(pos.x, pos.y) === TERRAIN_MASK_WALL) {
		return false; // 不在墙上建路
	}

	// 检查现有建筑
	const structures = pos.lookFor(LOOK_STRUCTURES);
	for (const struct of structures) {
		if (
			struct.structureType === 'constructedWall' ||
			struct.structureType === 'rampart'
		) {
			return false; // 不在墙或城墙上建路
		}
	}

	// 检查建筑工地
	const sites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
	for (const site of sites) {
		if (site.structureType === 'road' && site.progress > 40000) {
			if (terrain.get(pos.x, pos.y) === TERRAIN_MASK_WALL) {
				site.remove(); // 移除在墙上的高进度道路工地
				console.log(`移除位于墙上的高进度道路工地 at ${pos.x},${pos.y}`);
				return false;
			}
		}
	}

	// 检查周边是否有重要建筑
	const nearbyStructures = pos.findInRange(FIND_STRUCTURES, 2);
	const validNearby = nearbyStructures.filter((s) =>
		['spawn', 'extension', 'storage', 'container', 'tower'].includes(
			s.structureType
		)
	);

	// 如果附近没有重要建筑，检查是否在资源点或控制器附近
	if (validNearby.length === 0) {
		const nearbySources = pos.findInRange(FIND_SOURCES, 2);
		const controller = room.controller;
		const nearController = controller && pos.getRangeTo(controller) <= 3;

		if (!nearbySources.length && !nearController) {
			return false; // 没有足够理由在这里建路
		}
	}

	return true;
}

// 计算路径的建造成本
function calculatePathCost(path: RoomPosition[], room: Room): number {
	let totalCost = 0;
	path.forEach((pos) => {
		const terrain = room.getTerrain();
		if (terrain.get(pos.x, pos.y) === TERRAIN_MASK_WALL) {
			totalCost += 45000; // 墙壁成本极高，应该避免
		} else if (terrain.get(pos.x, pos.y) === TERRAIN_MASK_SWAMP) {
			totalCost += 2000; // 沼泽地成本较高
		} else {
			totalCost += 1000; // 平原基础成本
		}

		// 检查周围的建筑和地形
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const nx = pos.x + dx;
				const ny = pos.y + dy;

				if (nx >= 0 && nx < 50 && ny >= 0 && ny < 50) {
					// 周围的墙增加成本
					if (terrain.get(nx, ny) === TERRAIN_MASK_WALL) {
						totalCost += 5000; // 靠近墙的惩罚
					}

					// 检查周围的建筑
					const structures = room.lookForAt(LOOK_STRUCTURES, nx, ny);
					for (const struct of structures) {
						if (
							struct.structureType === 'constructedWall' ||
							struct.structureType === 'rampart'
						) {
							totalCost += 10000; // 靠近防御建筑的惩罚
						}
					}
				}
			}
		}

		// 检查现有建筑工地
		const sites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
		sites.forEach((site) => {
			if (site.structureType === 'road' && site.progress > 40000) {
				totalCost += 50000; // 重复的高进度道路工地，应该避免
			}
		});
	});
	return totalCost;
} // 尝试在位置建造道路
function tryBuildRoad(pos: RoomPosition, room: Room): boolean {
	// 首先验证位置的合适性
	if (!isValidRoadPosition(pos, room)) {
		return false;
	}

	// 已有道路或建筑工地则跳过
	const existingRoad = pos
		.lookFor(LOOK_STRUCTURES)
		.find((s) => s.structureType === 'road');
	const existingSite = pos
		.lookFor(LOOK_CONSTRUCTION_SITES)
		.find((s) => s.structureType === 'road');
	if (existingRoad || existingSite) {
		return false;
	}

	// 检查周边重要建筑
	const nearbyStructures = pos.findInRange(FIND_STRUCTURES, 2);
	const importantNearby = nearbyStructures.some((s) =>
		['spawn', 'extension', 'storage', 'container', 'tower'].includes(
			s.structureType
		)
	);

	// 在重要位置、资源点附近或控制器附近建路
	if (
		importantNearby ||
		pos.findInRange(FIND_SOURCES, 2).length > 0 ||
		(room.controller && pos.getRangeTo(room.controller) <= 3)
	) {
		// 计算建路成本
		const pathCost = calculatePathCost([pos], room);
		if (pathCost >= 45000) {
			return false; // 建造成本过高，可能是不合适的位置
		}

		// 尝试建造道路
		const result = room.createConstructionSite(pos.x, pos.y, 'road');
		if (result === OK) {
			console.log(`在 ${pos.x},${pos.y} 新建道路工地`);
			return true;
		}
	}

	return false;
}

// 规划道路网络
function planRoads(room: Room): void {
	const mainSpawn = LAYOUT_CONFIG.SPAWNS[0];
	const center = new RoomPosition(mainSpawn.x, mainSpawn.y, room.name);

	// 检查现有建设情况
	const existingConstructionSites = room.find(FIND_CONSTRUCTION_SITES, {
		filter: (site) => site.structureType === STRUCTURE_ROAD,
	});

	// 检查错误建造的道路
	const highProgressRoads = existingConstructionSites.filter((site) => {
		if (site.structureType !== STRUCTURE_ROAD) return false;
		if (site.progress > 40000) {
			const terrain = room.getTerrain();
			if (terrain.get(site.pos.x, site.pos.y) === TERRAIN_MASK_WALL) {
				site.remove(); // 移除墙上的道路工地
				return true;
			}
		}
		return false;
	});

	if (highProgressRoads.length > 0) {
		console.log(
			`发现 ${highProgressRoads.length} 个不当位置的高进度道路工地，已移除`
		);
	}

	// 检查现有道路工地进度
	if (existingConstructionSites.length >= 5) {
		let totalProgress = 0;
		let totalRequired = 0;

		existingConstructionSites.forEach((site) => {
			totalProgress += site.progress;
			totalRequired += site.progressTotal;
		});

		// 如果现有工地进度不理想，暂停新建设
		if (
			totalRequired > 0 &&
			totalProgress / totalRequired < LAYOUT_CONFIG.ROAD_PATTERN.BUILD_THRESHOLD
		) {
			console.log(
				`道路建设进度不足 (${Math.floor(
					(totalProgress / totalRequired) * 100
				)}%)，暂停新建设`
			);
			return;
		}
	}

	// 获取房间中的关键位置
	const sources = room.find(FIND_SOURCES).filter((source) => {
		// 只处理合适距离内的能量源
		const distance = center.getRangeTo(source.pos);
		if (distance > LAYOUT_CONFIG.ROAD_PATTERN.MAX_DISTANCE) return false;

		// 检查地形和建筑情况
		const terrain = room.getTerrain();
		const nearbyWalls = source.pos.findInRange(FIND_STRUCTURES, 1, {
			filter: (s) => s.structureType === STRUCTURE_WALL,
		});

		// 如果周围都是墙，跳过这个能量源
		let hasNonWallPath = false;
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				const x = source.pos.x + dx;
				const y = source.pos.y + dy;
				if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
					hasNonWallPath = true;
					break;
				}
			}
			if (hasNonWallPath) break;
		}

		return hasNonWallPath;
	});

	const controller = room.controller;
	const minerals = room.find(FIND_MINERALS).filter((mineral) => {
		// 只在房间等级足够时考虑连接矿物
		if (room.controller && room.controller.level < 6) return false;
		// 只处理合适距离内的矿物
		const distance = center.getRangeTo(mineral.pos);
		return distance <= LAYOUT_CONFIG.ROAD_PATTERN.MAX_DISTANCE;
	}); // 检查现有道路建设情况
	const existingRoads = room.find(FIND_STRUCTURES, {
		filter: (s) => s.structureType === STRUCTURE_ROAD,
	});

	const constructionSites = room.find(FIND_CONSTRUCTION_SITES, {
		filter: (s) => s.structureType === STRUCTURE_ROAD,
	});

	// 如果建设中的道路超过阈值，暂停新建道路
	if (constructionSites.length > 0) {
		const totalProgress = constructionSites.reduce(
			(sum, site) => sum + site.progress,
			0
		);
		const totalProgressRequired = constructionSites.reduce(
			(sum, site) => sum + site.progressTotal,
			0
		);
		if (
			totalProgress / totalProgressRequired <
			LAYOUT_CONFIG.ROAD_PATTERN.BUILD_THRESHOLD
		) {
			return; // 等待现有道路完工
		}
	}

	// 创建到各个资源点的道路
	sources.forEach((source) => {
		// 检查与资源点的距离
		const distance = center.getRangeTo(source);
		if (distance > LAYOUT_CONFIG.ROAD_PATTERN.MAX_DISTANCE) {
			return; // 跳过距离过远的资源点
		}

		// 检查资源点是否有可行的建筑空间
		const terrain = room.getTerrain();
		let hasValidBuildSpace = false;

		// 检查资源点周围的位置
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const x = source.pos.x + dx;
				const y = source.pos.y + dy;
				if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
					hasValidBuildSpace = true;
					break;
				}
			}
			if (hasValidBuildSpace) break;
		}

		if (!hasValidBuildSpace) {
			return; // 跳过被墙完全包围的资源点
		}

		// 检查周边建筑情况
		const nearbyStructures = source.pos.findInRange(FIND_STRUCTURES, 3);
		const validNearby = nearbyStructures.filter((s) =>
			['spawn', 'extension', 'storage', 'container', 'tower'].includes(
				s.structureType
			)
		);

		if (validNearby.length < LAYOUT_CONFIG.ROAD_PATTERN.MIN_STRUCTURES) {
			return; // 跳过周边建筑较少的区域
		}

		const pfResult = PathFinder.search(
			center,
			{ pos: source.pos, range: 1 },
			{
				plainCost: 2,
				swampCost: 10,
				roomCallback: (roomName: string) => {
					const costs = new PathFinder.CostMatrix();
					const terrain = room.getTerrain();

					// 设置基础地形成本
					for (let y = 0; y < 50; y++) {
						for (let x = 0; x < 50; x++) {
							const terrainType = terrain.get(x, y);
							if (terrainType === TERRAIN_MASK_WALL) {
								costs.set(x, y, 255); // 墙壁完全不可通行
							} else if (terrainType === TERRAIN_MASK_SWAMP) {
								costs.set(x, y, 10); // 沼泽地代价较高
							}
						}
					}

					// 处理现有建筑
					room.find(FIND_STRUCTURES).forEach((struct) => {
						const pos = struct.pos;
						if (struct.structureType === 'road') {
							costs.set(pos.x, pos.y, 1); // 已有道路成本最低
						} else if (
							struct.structureType === 'constructedWall' ||
							struct.structureType === 'rampart'
						) {
							// 墙和城墙完全不可通行，并增加周围区域成本
							costs.set(pos.x, pos.y, 255);

							// 增加周围区域的成本以避免在墙附近建路
							for (let dy = -1; dy <= 1; dy++) {
								for (let dx = -1; dx <= 1; dx++) {
									const nx = pos.x + dx;
									const ny = pos.y + dy;
									if (nx >= 0 && nx < 50 && ny >= 0 && ny < 50) {
										const currentCost = costs.get(nx, ny);
										if (currentCost < 255) {
											costs.set(nx, ny, Math.min(currentCost + 20, 254));
										}
									}
								}
							}
						}
					});

					// 处理建筑工地，特别关注高进度的道路工地
					room.find(FIND_CONSTRUCTION_SITES).forEach((site) => {
						if (site.structureType === STRUCTURE_ROAD) {
							if (site.progress > 40000) {
								// 检查是否在墙上或墙附近
								if (terrain.get(site.pos.x, site.pos.y) === TERRAIN_MASK_WALL) {
									costs.set(site.pos.x, site.pos.y, 255);
									site.remove(); // 移除不合适的道路工地
									console.log(
										`移除位于墙上的高进度道路工地 at ${site.pos.x},${site.pos.y}`
									);
								}
							}
						} else {
							costs.set(site.pos.x, site.pos.y, 255);

							// 增加其他建筑工地周围的成本
							for (let dy = -1; dy <= 1; dy++) {
								for (let dx = -1; dx <= 1; dx++) {
									const nx = site.pos.x + dx;
									const ny = site.pos.y + dy;
									if (nx >= 0 && nx < 50 && ny >= 0 && ny < 50) {
										const currentCost = costs.get(nx, ny);
										if (currentCost < 255) {
											costs.set(nx, ny, Math.min(currentCost + 15, 254));
										}
									}
								}
							}
						}
					});

					return costs;
				},
			}
		); // 智能建造道路
		pfResult.path.forEach((pos) => {
			// 检查是否已存在道路或建设工地
			const existingRoad = pos
				.lookFor(LOOK_STRUCTURES)
				.find((s) => s.structureType === STRUCTURE_ROAD);
			const existingSite = pos
				.lookFor(LOOK_CONSTRUCTION_SITES)
				.find((s) => s.structureType === STRUCTURE_ROAD);

			if (!existingRoad && !existingSite) {
				// 检查周边的建筑和道路数量
				const nearbyStructures = pos.findInRange(FIND_STRUCTURES, 2);
				const nearbyRoads = nearbyStructures.filter(
					(s) => s.structureType === STRUCTURE_ROAD
				);

				// 只在有足够建筑支持的地方建路
				if (
					nearbyStructures.length >=
						LAYOUT_CONFIG.ROAD_PATTERN.MIN_STRUCTURES ||
					nearbyRoads.length > 0
				) {
					room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
				}
			}
		});
	});

	// 创建到控制器的道路
	if (controller) {
		// 检查与控制器的距离
		const distance = center.getRangeTo(controller);
		if (distance <= LAYOUT_CONFIG.ROAD_PATTERN.MAX_DISTANCE) {
			const pfResult = PathFinder.search(
				center,
				{ pos: controller.pos, range: 1 },
				{
					swampCost: 2,
					plainCost: 2,
					roomCallback: (roomName: string) => {
						const costs = new PathFinder.CostMatrix();
						room.find(FIND_STRUCTURES).forEach((struct) => {
							if (struct.structureType === STRUCTURE_ROAD) {
								costs.set(struct.pos.x, struct.pos.y, 1);
							} else if (
								struct.structureType === STRUCTURE_WALL ||
								struct.structureType === STRUCTURE_RAMPART
							) {
								costs.set(struct.pos.x, struct.pos.y, 255);
							}
						});
						return costs;
					},
				}
			);

			// 智能建造道路
			pfResult.path.forEach((pos) => {
				const existingRoad = pos
					.lookFor(LOOK_STRUCTURES)
					.find((s) => s.structureType === STRUCTURE_ROAD);
				const existingSite = pos
					.lookFor(LOOK_CONSTRUCTION_SITES)
					.find((s) => s.structureType === STRUCTURE_ROAD);

				if (!existingRoad && !existingSite) {
					// 检查周边是否有足够的建筑支持修建道路
					const nearbyStructures = pos.findInRange(FIND_STRUCTURES, 2);
					if (
						nearbyStructures.length >= LAYOUT_CONFIG.ROAD_PATTERN.MIN_STRUCTURES
					) {
						room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
					}
				}
			});
		}
	}

	// 创建到矿物的道路（如果有的话且房间等级足够）
	if (room.controller && room.controller.level >= 6) {
		minerals.forEach((mineral) => {
			const distance = center.getRangeTo(mineral);
			if (distance <= LAYOUT_CONFIG.ROAD_PATTERN.MAX_DISTANCE) {
				const pfResult = PathFinder.search(
					center,
					{ pos: mineral.pos, range: 1 },
					{
						swampCost: 2,
						plainCost: 2,
						roomCallback: (roomName: string) => {
							const costs = new PathFinder.CostMatrix();
							room.find(FIND_STRUCTURES).forEach((struct) => {
								if (struct.structureType === STRUCTURE_ROAD) {
									costs.set(struct.pos.x, struct.pos.y, 1);
								} else if (
									struct.structureType === STRUCTURE_WALL ||
									struct.structureType === STRUCTURE_RAMPART
								) {
									costs.set(struct.pos.x, struct.pos.y, 255);
								}
							});
							return costs;
						},
					}
				);

				// 智能建造道路
				pfResult.path.forEach((pos) => {
					const existingRoad = pos
						.lookFor(LOOK_STRUCTURES)
						.find((s) => s.structureType === STRUCTURE_ROAD);
					const existingSite = pos
						.lookFor(LOOK_CONSTRUCTION_SITES)
						.find((s) => s.structureType === STRUCTURE_ROAD);

					if (!existingRoad && !existingSite) {
						// 检查周边是否有足够的建筑支持修建道路
						const nearbyStructures = pos.findInRange(FIND_STRUCTURES, 2);
						if (
							nearbyStructures.length >=
							LAYOUT_CONFIG.ROAD_PATTERN.MIN_STRUCTURES
						) {
							room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
						}
					}
				});
			}
		});
	}

	// 创建spawn之间的连接道路
	for (let i = 1; i < LAYOUT_CONFIG.SPAWNS.length; i++) {
		const spawnPos = new RoomPosition(
			LAYOUT_CONFIG.SPAWNS[i].x,
			LAYOUT_CONFIG.SPAWNS[i].y,
			room.name
		);

		const path = room.findPath(center, spawnPos, {
			ignoreCreeps: true,
			ignoreRoads: true,
			swampCost: 2,
			plainCost: 2,
		});

		path.forEach((pos) => {
			room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
		});
	}

	// 在主要建筑周围创建环形道路
	for (let dx = -2; dx <= 2; dx++) {
		for (let dy = -2; dy <= 2; dy++) {
			if (Math.abs(dx) === 2 || Math.abs(dy) === 2) {
				const x = center.x + dx;
				const y = center.y + dy;
				if (x > 0 && x < 49 && y > 0 && y < 49) {
					room.createConstructionSite(x, y, STRUCTURE_ROAD);
				}
			}
		}
	}
}

// 清理内存中无效的 creep
function cleanDeadCreeps(): void {
	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('清除无效 creep 内存:', name);
		}
	}
}

export function runBasicSystem(): void {
	console.log(`当前游戏时间: ${Game.time}`);

	// 清理无效 creep
	cleanDeadCreeps();

	// 遍历所有房间进行防御检查和布局管理
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName];

		// 管理房间布局
		manageRoomLayout(room);

		// 运行防御塔
		const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, {
			filter: (structure) => structure.structureType === STRUCTURE_TOWER,
		});
		towers.forEach((tower) => runTower(tower));

		// 检查房间是否有敌人
		const hostiles = room.find(FIND_HOSTILE_CREEPS);
		if (hostiles.length > 0) {
			const username = hostiles[0].owner.username;
			Game.notify(`用户 ${username} 的 creeps 入侵房间 ${roomName}`);
			console.log(`警告！房间 ${roomName} 发现敌人！`);

			// 如果有敌人，确保有防御者
			const defenders = _.filter(
				Game.creeps,
				(creep) => creep.memory.role === CREEP_ROLE.DEFENDER
			);
			if (defenders.length < hostiles.length) {
				// 找到房间内的 spawn
				const spawns = room.find(FIND_MY_SPAWNS);
				if (spawns.length > 0) {
					spawnCreep(spawns[0], CREEP_ROLE.DEFENDER);
				}
			}
		}
	}

	for (const spawnName in Game.spawns) {
		const spawn = Game.spawns[spawnName];

		// 检查并创建基础 creep
		const harvesters = _.filter(
			Game.creeps,
			(creep) => creep.memory.role === CREEP_ROLE.HARVESTER
		);
		const upgraders = _.filter(
			Game.creeps,
			(creep) => creep.memory.role === CREEP_ROLE.UPGRADER
		);
		const builders = _.filter(
			Game.creeps,
			(creep) => creep.memory.role === CREEP_ROLE.BUILDER
		);

		const rcl = spawn.room.controller ? spawn.room.controller.level : 1;

		// 优先确保有足够的采集者
		if (harvesters.length < CREEP_CONFIGS[CREEP_ROLE.HARVESTER].minCount(rcl)) {
			spawnCreep(spawn, CREEP_ROLE.HARVESTER);
		}
		// 然后创建升级者
		else if (
			upgraders.length < CREEP_CONFIGS[CREEP_ROLE.UPGRADER].minCount(rcl)
		) {
			spawnCreep(spawn, CREEP_ROLE.UPGRADER);
		}
		// 在有足够的采集者和升级者后，创建建筑者
		else if (
			harvesters.length >= CREEP_CONFIGS[CREEP_ROLE.HARVESTER].minCount(rcl) &&
			upgraders.length >= CREEP_CONFIGS[CREEP_ROLE.UPGRADER].minCount(rcl) &&
			builders.length < CREEP_CONFIGS[CREEP_ROLE.BUILDER].minCount(rcl)
		) {
			spawnCreep(spawn, CREEP_ROLE.BUILDER);
		}

		if (spawn.spawning) {
			console.log(`${spawnName} 正在生成: ${spawn.spawning.name}`);
		}
	}

	// 控制 creeps 行为
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];

		switch (creep.memory.role) {
			case CREEP_ROLE.HARVESTER:
				runHarvester(creep);
				break;
			case CREEP_ROLE.UPGRADER:
				runUpgrader(creep);
				break;
			case CREEP_ROLE.BUILDER:
				runBuilder(creep);
				break;
			case CREEP_ROLE.DEFENDER:
				runDefender(creep);
				break;
		}
	}
}

// 添加升级者的行为函数
function runUpgrader(creep: Creep): void {
	// 如果 creep 没有能量，从储存设施获取能量
	if (creep.store[RESOURCE_ENERGY] === 0) {
		getEnergy(creep);
	}
	// 如果有能量，去升级控制器
	else {
		if (creep.room.controller) {
			if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {
					visualizePathStyle: { stroke: '#ffffff' },
				});
			}
		}
	}
}

// 采集者的基础行为
/**
 * 管理采集者的能量采集行为
 * @param creep 需要管理的采集者
 */
function harvestEnergy(creep: Creep): void {
	let source;

	// 检查是否已分配能量源
	if (creep.memory.sourceId) {
		source = Game.getObjectById(creep.memory.sourceId as Id<Source>);
	}

	// 如果没有分配能量源或原来的能量源无效，重新分配
	if (!source) {
		assignHarvesterSource(creep);
		source = Game.getObjectById(creep.memory.sourceId as Id<Source>);
		if (!source) {
			creep.say('❌ 无能源');
			return;
		}
	}

	// 采集能量
	if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
		creep.moveTo(source, {
			visualizePathStyle: { stroke: '#ffaa00' },
			reusePath: 20,
		});
	} else {
		creep.say('⛏️ 采集中');
	}
}

/**
 * 管理采集者的能量转移行为
 * @param creep 需要管理的采集者
 */
function transferEnergy(creep: Creep): void {
	const target = findEnergyTarget(creep.room);
	if (target) {
		const result = creep.transfer(target, RESOURCE_ENERGY);
		if (result === ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {
				visualizePathStyle: { stroke: '#ffffff' },
				reusePath: 20,
			});
		} else if (result === OK) {
			creep.say('🔋 存储中');
		}
	} else {
		// 如果没有建筑需要能量，等待
		creep.say('⌛ 等待中');
	}
}

/**
 * 采集者的主要行为控制函数
 * @param creep 需要控制的采集者
 */
function runHarvester(creep: Creep): void {
	// 更新工作状态
	if (creep.store.getFreeCapacity() === 0) {
		creep.memory.workingState = WORK_STATE.TRANSFERRING;
	} else if (creep.store[RESOURCE_ENERGY] === 0) {
		creep.memory.workingState = WORK_STATE.HARVESTING;
	}

	// 如果没有工作状态，设置为采集状态
	if (!creep.memory.workingState) {
		creep.memory.workingState = WORK_STATE.HARVESTING;
	}

	// 根据工作状态执行相应行为
	switch (creep.memory.workingState) {
		case WORK_STATE.HARVESTING:
			harvestEnergy(creep);
			break;
		case WORK_STATE.TRANSFERRING:
			transferEnergy(creep);
			break;
	}
}

// 为采集者分配能量源
function assignHarvesterSource(creep: Creep): void {
	// 获取房间中所有能量源
	const sources = creep.room.find(FIND_SOURCES);
	if (sources.length === 0) return;

	// 统计每个能量源当前的采集者数量
	const sourceHarvesters = new Map<Id<Source>, number>();
	sources.forEach((source) => sourceHarvesters.set(source.id, 0));

	// 计算每个能量源当前的采集者数量
	for (const name in Game.creeps) {
		const otherCreep = Game.creeps[name];
		if (
			otherCreep.memory.role === CREEP_ROLE.HARVESTER &&
			otherCreep.memory.sourceId
		) {
			const count =
				sourceHarvesters.get(otherCreep.memory.sourceId as Id<Source>) || 0;
			sourceHarvesters.set(otherCreep.memory.sourceId as Id<Source>, count + 1);
		}
	}

	// 找到采集者最少的能量源
	let minHarvesters = Infinity;
	let selectedSource: Source | null = null;

	sources.forEach((source) => {
		const harvesterCount = sourceHarvesters.get(source.id) || 0;
		if (harvesterCount < minHarvesters) {
			minHarvesters = harvesterCount;
			selectedSource = source;
		}
	});

	if (selectedSource) {
		creep.memory.sourceId = selectedSource.id;
		creep.say('🔄 分配源');
	}
}

// 根据优先级寻找能量目标
function findEnergyTarget(room: Room): Structure | null {
	// 检查 Spawn 和 Extension 是否需要能量
	const spawnOrExtension = room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (
				(structure.structureType === STRUCTURE_SPAWN ||
					structure.structureType === STRUCTURE_EXTENSION) &&
				structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
			);
		},
	});

	if (spawnOrExtension.length > 0) {
		return spawnOrExtension[0];
	}

	// 检查塔是否需要能量
	const towers = room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (
				structure.structureType === STRUCTURE_TOWER &&
				structure.store.getUsedCapacity(RESOURCE_ENERGY) <
					structure.store.getCapacity(RESOURCE_ENERGY) *
						DEFENSE_CONFIG.TOWER_ENERGY_THRESHOLD
			);
		},
	});

	if (towers.length > 0) {
		return towers[0];
	}

	// 检查是否有容器需要填充
	const containers = room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (
				structure.structureType === STRUCTURE_CONTAINER &&
				structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
			);
		},
	});

	if (containers.length > 0) {
		// 找到最空的容器
		return _.minBy(containers as StructureContainer[], (container) =>
			container.store.getUsedCapacity(RESOURCE_ENERGY)
		);
	}

	// 最后检查存储
	if (room.storage && room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
		return room.storage;
	}

	return null;
}

// 获取能量的通用函数
function getEnergy(creep: Creep): boolean {
	// 1. 尝试从容器获取能量
	const containers = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (
				structure.structureType === STRUCTURE_CONTAINER &&
				structure.store.getUsedCapacity(RESOURCE_ENERGY) >
					creep.store.getFreeCapacity()
			);
		},
	});

	if (containers.length > 0) {
		const container = creep.pos.findClosestByPath(containers);
		if (container) {
			if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
			}
			return true;
		}
	}

	// 2. 尝试从存储获取能量
	const storage = creep.room.storage;
	if (storage && storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
		if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
		}
		return true;
	}

	// 3. 寻找掉落的能量
	const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
		filter: (resource) => resource.resourceType === RESOURCE_ENERGY,
	});

	if (droppedEnergy) {
		if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
			creep.moveTo(droppedEnergy, {
				visualizePathStyle: { stroke: '#ffaa00' },
			});
		}
		return true;
	}

	// 4. 最后才考虑直接采集
	const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
	if (source) {
		if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
			creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
		}
		return true;
	}

	return false;
}

// 建筑者的行为函数
function runBuilder(creep: Creep): void {
	// 如果正在建造但能量用完了，切换到采集模式
	if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
		creep.memory.building = false;
		creep.say('🔄 采集');
	}
	// 如果不在建造且能量满了，切换到建造模式
	if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
		creep.memory.building = true;
		creep.say('🚧 建造');
	}

	// 建造模式
	if (creep.memory.building) {
		// 首先寻找建筑工地
		const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if (targets.length) {
			if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {
					visualizePathStyle: { stroke: '#ffffff' },
				});
			}
		} else {
			// 如果没有建筑工地，按优先级寻找需要维修的建筑
			// 1. 首先修理危险状态的重要建筑
			const criticalStructures = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					const isImportant =
						structure.structureType === STRUCTURE_CONTAINER ||
						structure.structureType === STRUCTURE_SPAWN ||
						structure.structureType === STRUCTURE_EXTENSION ||
						structure.structureType === STRUCTURE_ROAD ||
						structure.structureType === STRUCTURE_STORAGE;

					// 对于重要建筑，如果生命值低于危险阈值，优先修理
					return (
						isImportant &&
						structure.hits / structure.hitsMax <
							DEFENSE_CONFIG.CRITICAL_REPAIR_THRESHOLD
					);
				},
			});

			if (criticalStructures.length > 0) {
				const target = _.minBy(criticalStructures, (s) => s.hits / s.hitsMax);
				if (creep.repair(target) === ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {
						visualizePathStyle: { stroke: '#ffffff' },
					});
				}
				return;
			}

			// 2. 修理危险状态的防御建筑
			const defenseStructures = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					if (
						structure.structureType !== STRUCTURE_WALL &&
						structure.structureType !== STRUCTURE_RAMPART
					) {
						return false;
					}

					// 如果生命值低于最低阈值，优先修理
					if (structure.hits < DEFENSE_CONFIG.WALL_MINIMUM_HITS) {
						return true;
					}

					// 根据控制器等级决定目标生命值
					const roomLevel = creep.room.controller
						? creep.room.controller.level
						: 1;
					const targetHits =
						structure.structureType === STRUCTURE_RAMPART
							? DEFENSE_CONFIG.RAMPART_HITS_TARGETS[`RCL${roomLevel}`]
							: DEFENSE_CONFIG.WALL_HITS_TARGET;

					return structure.hits < targetHits;
				},
			});

			if (defenseStructures.length > 0) {
				const target = _.minBy(defenseStructures, (s) => s.hits);
				if (creep.repair(target) === ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {
						visualizePathStyle: { stroke: '#ffffff' },
					});
				}
				return;
			}

			// 3. 修理一般状态的重要建筑
			const normalRepairStructures = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					const isImportant =
						structure.structureType === STRUCTURE_CONTAINER ||
						structure.structureType === STRUCTURE_SPAWN ||
						structure.structureType === STRUCTURE_EXTENSION ||
						structure.structureType === STRUCTURE_ROAD ||
						structure.structureType === STRUCTURE_STORAGE;

					// 对于重要建筑，如果生命值低于维修阈值但高于危险阈值
					const hitsRatio = structure.hits / structure.hitsMax;
					return (
						isImportant &&
						hitsRatio < DEFENSE_CONFIG.TOWER_REPAIR_THRESHOLD &&
						hitsRatio >= DEFENSE_CONFIG.CRITICAL_REPAIR_THRESHOLD
					);
				},
			});

			if (normalRepairStructures.length > 0) {
				const target = _.minBy(
					normalRepairStructures,
					(s: Structure) => s.hits / s.hitsMax
				);
				if (creep.repair(target) === ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {
						visualizePathStyle: { stroke: '#ffffff' },
					});
				}
			}
		}
	}
	// 采集模式
	else {
		getEnergy(creep);
	}
}
