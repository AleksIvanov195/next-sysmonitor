import { startNetworkMonitoring, stopNetworkMonitoring, isNetworkMonitoring } from "./networkInfo";
import { startCpuMonitoring, stopCpuMonitoring, isCpuMonitoring } from "./cpuInfo";
import { startMemoryMonitoring, stopMemoryMonitoring, isMemoryMonitoring } from "./memoryInfo";

export const startMonitoring = async (interval = 20000): Promise<void> => {
	try {
		await startNetworkMonitoring(interval);
		await startCpuMonitoring(interval);
		await startMemoryMonitoring(interval);
	} catch (error) {
		console.error("Failed to start monitoring:", error);
		await stopMonitoring();
		throw new Error(`Failed to start monitoring: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
};

export const stopMonitoring = async (): Promise<void> => {
	try {
		await stopNetworkMonitoring();
		await stopCpuMonitoring();
		await stopMemoryMonitoring();
	} catch (error) {
		console.error("Failed to stop monitoring:", error);
		throw new Error(`Failed to stop monitoring: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
};

export const restartMonitoring = async (interval = 20000): Promise<void> => {
	await stopMonitoring();
	await startMonitoring(interval);
};

export const isMonitoring = async (): Promise<boolean> => {
	try {
		return isNetworkMonitoring() && isCpuMonitoring() && isMemoryMonitoring();
	} catch (error) {
		throw new Error(`Failed to check monitoring status: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
};