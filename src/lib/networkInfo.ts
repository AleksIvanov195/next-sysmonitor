import si from "systeminformation";
import { BasicNetworkStats } from "./types/network";
import { Response } from "./types/system";
import { readHistory, writeHistory } from "./history/historyManager";
import { waitForUnlock } from "./utils/waitForUnlock";
import { minIntervalWait } from "./utils/minIntervalWait";

/*
	RxBytes show the number of bytes recived by the network interface
	TxBytes show the number of bytes sent by the network interface
	rx_sec and tx_sec are calculated based on the time between calls to si.networkStats()
	When on-demand calls and interval calls happen too close together, they interfere with each other
*/

interface NetworkState {
	timer: NodeJS.Timeout | null,
	isFirstRun: boolean,
	lastRequestTime: number,
	isRequestInProgress: boolean,
	currentMonitoringInterval: number,
	maxHistoryPoints: number,
	isMonitoringActive: boolean,
	fileName: string,
}

const networkState : NetworkState = {
	timer: null as NodeJS.Timeout | null,
	isFirstRun: true,
	lastRequestTime: 0,
	isRequestInProgress: false,
	currentMonitoringInterval: 20000,
	maxHistoryPoints: 0,
	isMonitoringActive: false,
	fileName: "networkHistory",
};

export const fetchNetworkStats = async () : Promise<BasicNetworkStats> => {
	// If a request is already in progress, wait for it to complete
	// Network stats like rx_sec and tx_sec are calculated based on the time between calls.
	if (networkState.isRequestInProgress) {
		await waitForUnlock(() => networkState.isRequestInProgress);
	}
	networkState.isRequestInProgress = true;
	try {
		// For first run, initialise the measurements to get meaningful values
		if (networkState.isFirstRun) {
			await si.networkStats();
			networkState.isFirstRun = false;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		const networkStats = await si.networkStats();
		let totalDownloadSpeed = 0;
		let totalUploadSpeed = 0;

		for (const stat of networkStats) {
			totalDownloadSpeed += stat.rx_sec; // Total download speed (bytes per second)
			totalUploadSpeed += stat.tx_sec;   // Total upload speed (bytes per second)
		}
		const dataPoint = {
			downloadSpeed: totalDownloadSpeed,
			uploadSpeed: totalUploadSpeed,
			timestamp: Date.now(),
		};
		networkState.lastRequestTime = Date.now();
		return dataPoint;
	} catch (error) {
		console.error("Error getting network speeds:", error);
		return { downloadSpeed: 0, uploadSpeed: 0, timestamp: Date.now() };
	}finally {
		networkState.isRequestInProgress = false;
	}
};

export const getNetworkStats = async () : Promise<BasicNetworkStats> => {
	return fetchNetworkStats();
};

const logNetworkStats = async () : Promise<void>=> {
	try {
		await minIntervalWait(networkState.currentMonitoringInterval, networkState.lastRequestTime);
		const dataPoint = await fetchNetworkStats();

		writeHistory(networkState.fileName, dataPoint, networkState.maxHistoryPoints);
	} catch (error) {
		console.error("Error recording network speeds:", error);
	}
};

export const getNetworkHistory = async () => {
	const fileHistory = readHistory<BasicNetworkStats>(networkState.fileName);
	return fileHistory;
};

export const startNetworkMonitoring = async (interval = 20000) : Promise<Response> => {
	try {
		if (networkState.timer) {
			throw new Error("Network monitoring already running");
		}
		networkState.currentMonitoringInterval = interval;
		console.log("Starting network monitoring...");
		// Collect first data point immediately
		logNetworkStats();
		networkState.timer = setInterval(logNetworkStats, interval);
		networkState.isMonitoringActive = true;

		return {
			success: true,
			message: "Network monitoring started successfully",
		};
	  } catch (error) {
		console.error("Failed to start network monitoring:", error);
		throw error;
	}
};

export const stopNetworkMonitoring = async () : Promise<Response> => {
	try {
		if (!networkState.timer) {
			throw new Error("Network monitoring is not running");
		}
		clearInterval(networkState.timer);
		networkState.timer = null;
		networkState.isMonitoringActive = false;
		console.log("Stopped network monitoring.");
		return {
			success: true,
			message: "Network monitoring stopped successfully",
		};
	} catch (error) {
		console.error("Failed to stop network monitoring:", error);
		throw error;
	}
};

export const setMaxNetworkHistoryPoints = (points: number) : void => {
	networkState.maxHistoryPoints = points;
};

export const isNetworkMonitoring = (): boolean => networkState.isMonitoringActive;
