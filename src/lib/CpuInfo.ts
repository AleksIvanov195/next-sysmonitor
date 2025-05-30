import si from "systeminformation";
import { CpuInfo, CpuTemp, SystemLoad, Response } from "./types/system";
import { CpuMetric } from "./types/system";
import { readHistory, writeHistory } from "./history/historyManager";
import { waitForUnlock } from "./utils/waitForUnlock";
import { minIntervalWait } from "./utils/minIntervalWait";

// let cpuInfo: CpuInfo | null = null;
let cpuTimer: NodeJS.Timeout | null = null;

let isFirstRun = true;
let lastRequestTime = 0;
let isRequestInProgress = false;
let currentMonitoringInterval = 20000;
let maxCpuHistoryPoints = 0;
let isMonitoringActive = false;
const fileName = "cpuHistory";


/* export const getCpuInfo = async () => {
	if (cpuInfo) return cpuInfo;

	return await refreshCpuInfo();
};*/

export const getCpuInfo = async () : Promise<CpuInfo>=> {
	// cpuInfo = await si.cpu();
	return await si.cpu();
};

export const fetchCpuMetrics = async (): Promise<CpuMetric> => {
	// The library calculates CPU load and temperature based on the time between calls.
	// If si.currentLoad() or si.cpuTemperature() is called too frequently or concurrently results may be inaccurate and that is why there are artifical locks introduced
	if (isRequestInProgress) {
		await waitForUnlock(() => isRequestInProgress);
	}
	isRequestInProgress = true;
	try {
		if (isFirstRun) {
			await si.currentLoad();
			isFirstRun = false;
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
		lastRequestTime = Date.now();
		return data;
	} catch (error) {
		console.error("Error getting CPU metrics:", error);
		return {
			timestamp: Date.now(),
			load: { currentLoad: 0 },
			temp: { main: 0 },
		};
	} finally {
		isRequestInProgress = false;
	}
};

export const getCpuMetrics = async (): Promise<CpuMetric> => {
	return fetchCpuMetrics();
};

const logCpuMetrics = async (): Promise<void> => {
	try {
		await minIntervalWait(currentMonitoringInterval, lastRequestTime);
		const dataPoint = await fetchCpuMetrics();
		writeHistory(fileName, dataPoint, maxCpuHistoryPoints);
	} catch (error) {
		console.error("Error recording CPU metrics:", error);
	}
};

export const getCpuHistory = async () => {
	const fileHistory = readHistory<CpuMetric>(fileName);
	return fileHistory;
};

export const startCpuMonitoring = async (interval = 20000): Promise<Response> => {
	try {
		if (cpuTimer) {
			throw new Error("CPU monitoring already running");
		}
		currentMonitoringInterval = interval;
		console.log("Starting CPU monitoring...");
		// Collect first data point immediately
		logCpuMetrics();
		cpuTimer = setInterval(logCpuMetrics, interval);
		isMonitoringActive = true;

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
		if (!cpuTimer) {
			throw new Error("CPU monitoring is not running");
		}
		clearInterval(cpuTimer);
		cpuTimer = null;
		isMonitoringActive = false;
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
	maxCpuHistoryPoints = points;
};

export const isCpuMonitoring = (): boolean => isMonitoringActive;