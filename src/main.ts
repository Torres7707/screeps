// filepath: /Users/torreswang/Desktop/keep-learning/screeps/src/main.ts
import { runBasicSystem } from './modules/utils';

// 简单的错误处理包装器
const errorHandler = (fn: () => void) => {
	try {
		fn();
	} catch (error) {
		console.log(`[${Game.time}] 错误：${error}`);
		if (error instanceof Error) {
			console.log(`堆栈信息：${error.stack}`);
		}
	}
};

export const loop = () => {
	errorHandler(() => {
		// 清理内存
		for (const name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
			}
		}

		// 运行基础系统
		runBasicSystem();
	});
};
