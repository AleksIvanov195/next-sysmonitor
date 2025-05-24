import { startNetworkMonitoring, stopNetworkMonitoring, isNetworkMonitoring } from "./NetworkInfo";
import { startCpuMonitoring, stopCpuMonitoring, isCpuMonitoring } from "./CpuInfo";
import { Response } from "./types/system";

interface MonitoringResponse extends Response {
	isMonitoring: boolean;
}

export const startMonitoring = async (interval = 20000) : Promise<Response> => {
	try {
		// Start both monitoring services
		await startNetworkMonitoring(interval);
		await startCpuMonitoring(interval);

		return {
			success: true,
			message: "Monitoring services started successfully",
		};
	} catch (error) {
		console.error("Failed to start monitoring:", error);
		stopMonitoring();
		return {
			success: false,
			message: `Failed to start monitoring: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
};

export const stopMonitoring = async () : Promise<Response> => {
	try {
		await stopNetworkMonitoring();
		await stopCpuMonitoring();
		return {
			success: true,
			message: "Monitoring services stopped successfully",
		};
	} catch (error) {
		console.error("Failed to stop monitoring:", error);
		return {
			success: false,
			message: `Failed to stop monitoring: ${error instanceof Error ? error.message : "Unknown error"}`,

		};
	}
};

export const restartMonitoring = async (interval = 20000): Promise<Response> => {
	await stopMonitoring();
	return startMonitoring(interval);
};

export const isMonitoring = async (): Promise<MonitoringResponse> => {
	try {
		if (isNetworkMonitoring() && isCpuMonitoring()) {
			return {
				success: true,
				message: "All monitoring services are running",
				isMonitoring: true,
			};
		} else {
			return {
				success: true,
				message: "Some or all monitoring services are not running",
				isMonitoring: false,
			};
		}
	} catch (error) {
		throw new Error(`Failed to check monitoring status: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
};