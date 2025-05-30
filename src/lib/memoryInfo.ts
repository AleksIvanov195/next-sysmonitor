import si from "systeminformation";
import { MemoryMetric } from "./types/system";
import { Response } from "./types/system";
import { readHistory, writeHistory } from "./history/historyManager";
import { minIntervalWait } from "./utils/minIntervalWait";

let memoryTimer: NodeJS.Timeout | null = null;

let lastRequestTime = 0;
let currentMonitoringInterval = 20000;
let maxMemoryHistoryPoints = 0;
let isMonitoringActive = false;
const fileName = "memoryHistory";

export const fetchMemoryStats = async () : Promise<MemoryMetric> => {
	try {
		const memoryStats = await si.mem();

		const { total, used, free, available } = memoryStats;

		const dataPoint = {
			timestamp: Date.now(),
			total,
			used,
			free,
			available,
		};
		lastRequestTime = Date.now();
		return dataPoint;
	} catch (error) {
		console.error("Error getting memory stats:", error);
		return { total: 0, used: 0, free: 0, available: 0, timestamp: Date.now() };
	}
};

export const getMemoryStats = async () : Promise<MemoryMetric> => {
	return fetchMemoryStats();
};

const logMemoryStats = async () : Promise<void>=> {
	try {
		await minIntervalWait(currentMonitoringInterval, lastRequestTime);
		const dataPoint = await fetchMemoryStats();

		writeHistory(fileName, dataPoint, maxMemoryHistoryPoints);
	} catch (error) {
		console.error("Error recording memory stats:", error);
	}
};

export const getMemoryHistory = async () => {
	const fileHistory = readHistory<MemoryMetric>(fileName);
	return fileHistory;
};

export const startMemoryMonitoring = async (interval = 20000) : Promise<Response> => {
	try {
		if (memoryTimer) {
			throw new Error("Memory monitoring already running");
		}
		currentMonitoringInterval = interval;
		console.log("Starting memory monitoring...");
		// Collect first data point immediately
		logMemoryStats();
		memoryTimer = setInterval(logMemoryStats, interval);
		isMonitoringActive = true;

		return {
			success: true,
			message: "Memory monitoring started successfully",
		};
	} catch (error) {
		console.error("Failed to start memory monitoring:", error);
		throw error;
	}
};

export const stopMemoryMonitoring = async () : Promise<Response> => {
	try {
		if (!memoryTimer) {
			throw new Error("Memory monitoring is not running");
		}
		clearInterval(memoryTimer);
		memoryTimer = null;
		isMonitoringActive = false;
		console.log("Stopped memory monitoring.");
		return {
			success: true,
			message: "Memory monitoring stopped successfully",
		};
	} catch (error) {
		console.error("Failed to stop Memory monitoring:", error);
		throw error;
	}
};

export const setMaxMemoryHistoryPoints = (points: number) : void => {
	maxMemoryHistoryPoints = points;
};

export const isMemoryMonitoring = (): boolean => isMonitoringActive;