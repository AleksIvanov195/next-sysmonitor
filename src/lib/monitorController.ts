import { startNetworkMonitoring, stopNetworkMonitoring } from "./NetworkInfo";
import { startCpuMonitoring, stopCpuMonitoring } from "./CpuInfo";
import { Response } from "./types/system";


export const startMonitoring = async (interval = 20000) : Promise<Response> => {
	try {
		// Start both monitoring services
		startNetworkMonitoring(interval);
		startCpuMonitoring(interval);

		return {
			success: true,
			message: "Monitoring services started successfully",
		};
	} catch (error) {
		console.error("Failed to start monitoring:", error);
		return {
			success: false,
			message: `Failed to start monitoring: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
};

export const stopMonitoring = async () : Promise<Response> => {
	try {
		stopNetworkMonitoring();
		stopCpuMonitoring();
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