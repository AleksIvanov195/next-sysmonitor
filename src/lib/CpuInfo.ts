import si from "systeminformation";
import { CpuInfo, CpuTemp, SystemLoad, Response } from "./types/system";
import { CpuMetric } from "./types/system";
import { readHistory, writeHistory } from "./history/historyManager";
import { waitForUnlock } from "./utils/waitForUnlock";
import { minIntervalWait } from "./utils/minIntervalWait";

const cpuState = {
	timer: null as NodeJS.Timeout | null,
	isFirstRun: true,
	lastRequestTime: 0,
	isRequestInProgress: false,
	currentMonitoringInterval: 20000,
	maxHistoryPoints: 0,
	isMonitoringActive: false,
	fileName: "cpuHistory",
};

export const getCpuInfo = async () : Promise<CpuInfo>=> {
	return await si.cpu();
};

export const fetchCpuMetrics = async (): Promise<CpuMetric> => {
	// The library calculates CPU load and temperature based on the time between calls.
	// If si.currentLoad() or si.cpuTemperature() is called too frequently or concurrently results may be inaccurate and that is why there are artifical locks introduced
	if (cpuState.isRequestInProgress) {
		await waitForUnlock(() => cpuState.isRequestInProgress);
	}
	cpuState.isRequestInProgress = true;
	try {
		if (cpuState.isFirstRun) {
			await si.currentLoad();
			cpuState.isFirstRun = false;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		const [currentLoadRaw, cpuTemp]: [SystemLoad, CpuTemp] = await Promise.all([
			si.currentLoad(),
			si.cpuTemperature(),
		]);

		// Remove the 'cpus' property from currentLoadRaw
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { cpus, ...currentLoad } = currentLoadRaw;

		const data = {
			timestamp: Date.now(),
			load: { currentLoad: currentLoad.currentLoad },
			temp: cpuTemp.main ? cpuTemp : { main: 0 },
		};
		cpuState.lastRequestTime = Date.now();
		return data;
	} catch (error) {
		console.error("Error getting CPU metrics:", error);
		return {
			timestamp: Date.now(),
			load: { currentLoad: 0 },
			temp: { main: 0 },
		};
	} finally {
		cpuState.isRequestInProgress = false;
	}
};

export const getCpuMetrics = async (): Promise<CpuMetric> => {
	return fetchCpuMetrics();
};

const logCpuMetrics = async (): Promise<void> => {
	try {
		await minIntervalWait(cpuState.currentMonitoringInterval, cpuState.lastRequestTime);
		const dataPoint = await fetchCpuMetrics();
		writeHistory(cpuState.fileName, dataPoint, cpuState.maxHistoryPoints);
	} catch (error) {
		console.error("Error recording CPU metrics:", error);
	}
};

export const getCpuHistory = async () => {
	const fileHistory = readHistory<CpuMetric>(cpuState.fileName);
	return fileHistory;
};

export const startCpuMonitoring = async (interval = 20000): Promise<Response> => {
	try {
		if (cpuState.timer) {
			throw new Error("CPU monitoring already running");
		}
		cpuState.currentMonitoringInterval = interval;
		console.log("Starting CPU monitoring...");
		// Collect first data point immediately
		logCpuMetrics();
		cpuState.timer = setInterval(logCpuMetrics, interval);
		cpuState.isMonitoringActive = true;

		return {
			success: true,
			message: "CPU monitoring started successfully",
		};
	} catch (error) {
		console.error("Failed to start CPU monitoring:", error);
		throw error;
	}
};

export const stopCpuMonitoring = async (): Promise<Response> => {
	try {
		if (!cpuState.timer) {
			throw new Error("CPU monitoring is not running");
		}
		clearInterval(cpuState.timer);
		cpuState.timer = null;
		cpuState.isMonitoringActive = false;
		console.log("Stopped CPU monitoring.");
		return {
			success: true,
			message: "CPU monitoring stopped successfully",
		};
	} catch (error) {
		console.error("Failed to stop CPU monitoring:", error);
		throw error;
	}
};

export const setMaxCpuHistoryPoints = (points: number) : void => {
	cpuState.maxHistoryPoints = points;
};

export const isCpuMonitoring = (): boolean => cpuState.isMonitoringActive;