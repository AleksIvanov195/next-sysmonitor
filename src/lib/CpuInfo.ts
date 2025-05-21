import si from "systeminformation";
import { CpuInfo, CpuTemp, SystemLoad, Response } from "./types/system";
import { CpuMetric } from "./types/system";
import { readHistory, writeHistory } from "./history";

let cpuInfo: CpuInfo | null = null;
let cpuTimer: NodeJS.Timeout | null = null;

let isFirstRun = true;
let lastRequestTime = 0;
let isRequestInProgress = false;
let currentMonitoringInterval = 20000;
let maxCpuHistoryPoints = 0;
const fileName = "cpuHistory";


export const getCpuInfo = async () => {
	if (!cpuInfo) {
		cpuInfo = await si.cpu();
	}
	return cpuInfo;
};

export const fetchCpuMetrics = async (): Promise<CpuMetric> => {
	if (isRequestInProgress) {
		await new Promise(resolve => {
			const checkLock = () => {
				if (!isRequestInProgress) {
					resolve(null);
				} else {
					setTimeout(checkLock, 50);
				}
			};
			checkLock();
		});
	}

	isRequestInProgress = true;
	try {
		if (isFirstRun) {
			await si.currentLoad();
			isFirstRun = false;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		const [currentLoad, cpuTemp]: [SystemLoad, CpuTemp] = await Promise.all([
			si.currentLoad(),
			si.cpuTemperature(),
		]);

		const data = {
			timestamp: Date.now(),
			load: currentLoad,
			temp: cpuTemp,
		};
		lastRequestTime = Date.now();
		return data;
	} catch (error) {
		console.error("Error getting CPU metrics:", error);
		return {
			timestamp: Date.now(),
			load: { avgLoad: 0, currentLoad: 0 },
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
	console.log("CPU POINTS", maxCpuHistoryPoints);
	try {
		const minInterval = Math.min(5000, Math.max(1000, Math.round(currentMonitoringInterval * 0.2)));

		const timeSinceLastRequest = Date.now() - lastRequestTime;
		if (timeSinceLastRequest < minInterval) {
			await new Promise(resolve =>
				setTimeout(resolve, minInterval - timeSinceLastRequest),
			);
		}

		const dataPoint = await fetchCpuMetrics();
		const fileHistory = await readHistory<CpuMetric>(fileName);
		const updatedHistory = [...fileHistory, dataPoint];

		await writeHistory(fileName, updatedHistory, maxCpuHistoryPoints);
	} catch (error) {
		console.error("Error recording CPU metrics:", error);
	}
};

export const getCpuHistory = async () => {
	const fileHistory = await readHistory<CpuMetric>(fileName);
	return fileHistory;
};

export const startCpuMonitoring = async (interval = 10000): Promise<Response> => {
	try {
		if (cpuTimer) {
			throw new Error("CPU monitoring already running");
		}
		currentMonitoringInterval = interval;
		console.log("Starting CPU monitoring...");
		// Collect first data point immediately
		logCpuMetrics();
		cpuTimer = setInterval(logCpuMetrics, interval);

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

export const isCpuMonitoring = (): boolean => !!cpuTimer;