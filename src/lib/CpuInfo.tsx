import si from "systeminformation";
import { CpuInfo, CpuTemp, SystemLoad } from "./types/system";
import { CpuMetric } from "./types/system";

let cpuInfo: CpuInfo | null = null;
const cpuHistory: CpuMetric[] = [];

export const getCpuInfo = async () => {
	if (!cpuInfo) {
		cpuInfo = await si.cpu();
	}
	return cpuInfo;
};

export const getCpuMetrics = async (): Promise<{ load: SystemLoad; temp: CpuTemp }> => {
	try {
		const [currentLoad, cpuTemp] : [SystemLoad, CpuTemp ] = await Promise.all([si.currentLoad(), si.cpuTemperature()]);

		const data = {
			timestamp: Date.now(),
			load: currentLoad,
			temp: cpuTemp,
		};

		cpuHistory.push(data);

		return { load: data.load, temp: data.temp };
	} catch (error) {
		console.error("Error getting CPU metrics:", error);
		return {
			load: { avgLoad: 0, currentLoad: 0 },
			temp: { main: 0 },
		};
	}
};

export const getCpuHistory = () => {
	return [...cpuHistory];
};

export const startCpuMonitoring = (interval = 10000): () => void => {
	const cpuTimer = setInterval(() => getCpuMetrics(), interval);
	return () => clearInterval(cpuTimer);
};