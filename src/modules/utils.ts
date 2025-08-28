import _ from 'lodash';

// Creep 角色定义
export enum CreepRole {
	HARVESTER = 'harvester',
	UPGRADER = 'upgrader',
	BUILDER = 'builder',
	DEFENDER = 'defender',
}

// 防御配置
export const DEFENSE_CONFIG = {
	TOWER_REPAIR_THRESHOLD: 0.7, // 建筑维修阈值（低于最大生命值的70%时修复）
	TOWER_ENERGY_THRESHOLD: 0.5, // 塔能量储备阈值（保持50%以上）
	WALL_HITS_TARGET: 10000, // 墙壁目标生命值
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
};

// 扩展 CreepMemory 接口，添加 role 属性
declare global {
	interface CreepMemory {
		role: CreepRole;
		building?: boolean;
	}
}

// 房间布局配置
export const LAYOUT_CONFIG = {
	SPAWN_POSITION: { x: 25, y: 25 }, // 主生成点位置
	EXTENSIONS_PATTERN: [
		// 扩展的相对位置模式
		{ x: -1, y: -1 },
		{ x: 1, y: -1 },
		{ x: -1, y: 1 },
		{ x: 1, y: 1 },
		{ x: 0, y: -2 },
		{ x: 0, y: 2 },
		{ x: -2, y: 0 },
		{ x: 2, y: 0 },
	],
	STORAGE_OFFSET: { x: 3, y: 0 }, // 存储相对于spawn的偏移
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
	},
};

// 生成 creep 的配置
export const CREEP_CONFIGS = {
	[CreepRole.HARVESTER]: {
		parts: [WORK, CARRY, MOVE],
		name: 'Harvester',
		minCount: 2,
	},
	[CreepRole.UPGRADER]: {
		parts: [WORK, CARRY, MOVE],
		name: 'Upgrader',
		minCount: 1,
	},
	[CreepRole.BUILDER]: {
		parts: [WORK, CARRY, MOVE],
		name: 'Builder',
		minCount: 1,
	},
	[CreepRole.DEFENDER]: {
		parts: [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK],
		name: 'Defender',
		minCount: 0, // 只在发现敌人时生成
	},
};

// 生成 creep
export function spawnCreep(
	spawn: StructureSpawn,
	role: CreepRole
): ScreepsReturnCode {
	const config = CREEP_CONFIGS[role];
	const newName = `${config.name}_${Game.time}`;

	return spawn.spawnCreep(config.parts, newName, {
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
				LAYOUT_CONFIG.SPAWN_POSITION.x,
				LAYOUT_CONFIG.SPAWN_POSITION.y,
				room.name
			);
			room.createConstructionSite(spawnPos, STRUCTURE_SPAWN);
		}

		if (level >= 2) {
			// 放置扩展
			LAYOUT_CONFIG.EXTENSIONS_PATTERN.forEach((offset) => {
				const pos = new RoomPosition(
					LAYOUT_CONFIG.SPAWN_POSITION.x + offset.x,
					LAYOUT_CONFIG.SPAWN_POSITION.y + offset.y,
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
				LAYOUT_CONFIG.SPAWN_POSITION.x + LAYOUT_CONFIG.STORAGE_OFFSET.x,
				LAYOUT_CONFIG.SPAWN_POSITION.y + LAYOUT_CONFIG.STORAGE_OFFSET.y,
				room.name
			);
			room.createConstructionSite(storagePos, STRUCTURE_STORAGE);
		}

		// 规划道路
		planRoads(room);
	}
}

// 规划道路网络
function planRoads(room: Room): void {
	const center = new RoomPosition(
		LAYOUT_CONFIG.SPAWN_POSITION.x,
		LAYOUT_CONFIG.SPAWN_POSITION.y,
		room.name
	);

	// 创建环形道路
	for (let radius = 1; radius <= LAYOUT_CONFIG.ROAD_PATTERN.RADIUS; radius++) {
		for (let i = 0; i < 360; i += 45) {
			const angle = (i * Math.PI) / 180;
			const x = Math.round(center.x + radius * Math.cos(angle));
			const y = Math.round(center.y + radius * Math.sin(angle));

			if (x > 0 && x < 49 && y > 0 && y < 49) {
				room.createConstructionSite(x, y, STRUCTURE_ROAD);
			}
		}
	}

	// 创建辐射状道路
	for (let i = 0; i < LAYOUT_CONFIG.ROAD_PATTERN.SPOKES; i++) {
		const angle = (i * 2 * Math.PI) / LAYOUT_CONFIG.ROAD_PATTERN.SPOKES;
		for (let r = 1; r <= LAYOUT_CONFIG.ROAD_PATTERN.RADIUS; r++) {
			const x = Math.round(center.x + r * Math.cos(angle));
			const y = Math.round(center.y + r * Math.sin(angle));

			if (x > 0 && x < 49 && y > 0 && y < 49) {
				room.createConstructionSite(x, y, STRUCTURE_ROAD);
			}
		}
	}
}

export function runBasicSystem(): void {
	console.log(`当前游戏时间: ${Game.time}`);

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
				(creep) => creep.memory.role === CreepRole.DEFENDER
			);
			if (defenders.length < hostiles.length) {
				// 找到房间内的 spawn
				const spawns = room.find(FIND_MY_SPAWNS);
				if (spawns.length > 0) {
					spawnCreep(spawns[0], CreepRole.DEFENDER);
				}
			}
		}
	}

	for (const spawnName in Game.spawns) {
		const spawn = Game.spawns[spawnName];

		// 检查并创建基础 creep
		const harvesters = _.filter(
			Game.creeps,
			(creep) => creep.memory.role === CreepRole.HARVESTER
		);
		const upgraders = _.filter(
			Game.creeps,
			(creep) => creep.memory.role === CreepRole.UPGRADER
		);
		const builders = _.filter(
			Game.creeps,
			(creep) => creep.memory.role === CreepRole.BUILDER
		);

		// 优先确保有足够的采集者
		if (harvesters.length < CREEP_CONFIGS[CreepRole.HARVESTER].minCount) {
			spawnCreep(spawn, CreepRole.HARVESTER);
		}
		// 然后创建升级者
		else if (upgraders.length < CREEP_CONFIGS[CreepRole.UPGRADER].minCount) {
			spawnCreep(spawn, CreepRole.UPGRADER);
		}
		// 在有足够的采集者和升级者后，创建建筑者
		else if (
			harvesters.length >= CREEP_CONFIGS[CreepRole.HARVESTER].minCount &&
			upgraders.length >= CREEP_CONFIGS[CreepRole.UPGRADER].minCount &&
			builders.length < CREEP_CONFIGS[CreepRole.BUILDER].minCount
		) {
			spawnCreep(spawn, CreepRole.BUILDER);
		}

		if (spawn.spawning) {
			console.log(`${spawnName} 正在生成: ${spawn.spawning.name}`);
		}
	}

	// 控制 creeps 行为
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];

		switch (creep.memory.role) {
			case CreepRole.HARVESTER:
				runHarvester(creep);
				break;
			case CreepRole.UPGRADER:
				runUpgrader(creep);
				break;
			case CreepRole.BUILDER:
				runBuilder(creep);
				break;
			case CreepRole.DEFENDER:
				runDefender(creep);
				break;
		}
	}
}

// 添加升级者的行为函数
function runUpgrader(creep: Creep): void {
	// 如果 creep 没有能量，去采集能量
	if (creep.store[RESOURCE_ENERGY] === 0) {
		const source = creep.pos.findClosestByPath(FIND_SOURCES);
		if (source) {
			if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {
					visualizePathStyle: { stroke: '#ffaa00' },
				});
			}
		}
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
function runHarvester(creep: Creep): void {
	if (creep.store.getFreeCapacity() > 0) {
		// 寻找最近的能量源
		const source = creep.pos.findClosestByPath(FIND_SOURCES);
		if (source) {
			if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
				creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
			}
		}
	} else {
		// 按优先级寻找需要能量的建筑
		const target = findEnergyTarget(creep.room);
		if (target) {
			if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
			}
		}
	}
}

// 根据优先级寻找能量目标
function findEnergyTarget(room: Room): Structure | null {
	// 按优先级检查建筑
	const priorities = [
		{ type: STRUCTURE_SPAWN, priority: RESOURCE_CONFIG.PRIORITY.SPAWN },
		{ type: STRUCTURE_EXTENSION, priority: RESOURCE_CONFIG.PRIORITY.EXTENSION },
		{ type: STRUCTURE_TOWER, priority: RESOURCE_CONFIG.PRIORITY.TOWER },
		{ type: STRUCTURE_STORAGE, priority: RESOURCE_CONFIG.PRIORITY.STORAGE },
		{ type: STRUCTURE_TERMINAL, priority: RESOURCE_CONFIG.PRIORITY.TERMINAL },
		{ type: STRUCTURE_CONTAINER, priority: RESOURCE_CONFIG.PRIORITY.CONTAINER },
	];

	// 按优先级排序建筑类型
	priorities.sort((a, b) => a.priority - b.priority);

	for (const p of priorities) {
		const structures = room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				if (structure.structureType !== p.type) return false;

				switch (structure.structureType) {
					case STRUCTURE_SPAWN:
					case STRUCTURE_EXTENSION:
						return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					case STRUCTURE_TOWER:
						return (
							structure.store.getUsedCapacity(RESOURCE_ENERGY) <
							structure.store.getCapacity(RESOURCE_ENERGY) *
								DEFENSE_CONFIG.TOWER_ENERGY_THRESHOLD
						);
					case STRUCTURE_STORAGE:
						return (
							structure.store.getFreeCapacity(RESOURCE_ENERGY) >
							RESOURCE_CONFIG.STORAGE_BUFFER
						);
					case STRUCTURE_TERMINAL:
						return (
							structure.store.getUsedCapacity(RESOURCE_ENERGY) <
							RESOURCE_CONFIG.TERMINAL_ENERGY_TARGET
						);
					case STRUCTURE_CONTAINER:
						return (
							structure.store.getFreeCapacity(RESOURCE_ENERGY) >
							structure.store.getCapacity(RESOURCE_ENERGY) *
								(1 - RESOURCE_CONFIG.CONTAINER_FILL_THRESHOLD)
						);
					default:
						return false;
				}
			},
		});

		if (structures.length > 0) {
			return structures[0];
		}
	}

	return null;
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
		// 寻找建筑工地
		const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if (targets.length) {
			if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {
					visualizePathStyle: { stroke: '#ffffff' },
				});
			}
		} else {
			// 如果没有建筑工地，寻找需要维修的建筑
			const repairTargets = creep.room.find(FIND_STRUCTURES, {
				filter: (object) => object.hits < object.hitsMax,
			});
			if (repairTargets.length) {
				if (creep.repair(repairTargets[0]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(repairTargets[0], {
						visualizePathStyle: { stroke: '#ffffff' },
					});
				}
			}
		}
	}
	// 采集模式
	else {
		const source = creep.pos.findClosestByPath(FIND_SOURCES);
		if (source) {
			if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {
					visualizePathStyle: { stroke: '#ffaa00' },
				});
			}
		}
	}
}
