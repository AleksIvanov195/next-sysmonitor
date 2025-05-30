import si from "systeminformation";
import { MemoryMetric } from "./types/system";
import { Response } from "./types/system";
import { readHistory, writeHistory } from "./history/historyManager";
import { minIntervalWait } from "./utils/minIntervalWait";

const memoryState = {
	timer: null as NodeJS.Timeout | null,
	lastRequestTime: 0,
	currentMonitoringInterval: 20000,
	maxHistoryPoints: 0,
	isMonitoringActive: false,
	fileName: "memoryHistory",
};

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
		memoryState.lastRequestTime = Date.now();
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
		await minIntervalWait(memoryState.currentMonitoringInterval, memoryState.lastRequestTime);
		const dataPoint = await fetchMemoryStats();

		writeHistory(memoryState.fileName, dataPoint, memoryState.maxHistoryPoints);
	} catch (error) {
		console.error("Error recording memory stats:", error);
	}
};

export const getMemoryHistory = async () => {
	const fileHistory = readHistory<MemoryMetric>(memoryState.fileName);
	return fileHistory;
};

export const startMemoryMonitoring = async (interval = 20000) : Promise<Response> => {
	try {
		if (memoryState.timer) {
			throw new Error("Memory monitoring already running");
		}
		memoryState.currentMonitoringInterval = interval;
		console.log("Starting memory monitoring...");
		// Collect first data point immediately
		logMemoryStats();
		memoryState.timer = setInterval(logMemoryStats, interval);
		memoryState.isMonitoringActive = true;

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
		if (!memoryState.timer) {
			throw new Error("Memory monitoring is not running");
		}
		clearInterval(memoryState.timer);
		memoryState.timer = null;
		memoryState.isMonitoringActive = false;
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
	memoryState.maxHistoryPoints = points;
};

export const isMemoryMonitoring = (): boolean => memoryState.isMonitoringActive;