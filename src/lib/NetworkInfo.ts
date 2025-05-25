import si from "systeminformation";
import { BasicNetworkStats } from "./types/network";
import { Response } from "./types/system";
import { readHistory, writeHistory } from "./history";

/*
	RxBytes show the number of bytes recived by the network interface
	TxBytes show the number of bytes sent by the network interface
	rx_sec and tx_sec are calculated based on the time between calls to si.networkStats()
	When on-demand calls and interval calls happen too close together, they interfere with each other
*/
let networkTimer: NodeJS.Timeout | null = null;

let isFirstRun = true;
let lastRequestTime = 0;
let isRequestInProgress = false;
let currentMonitoringInterval = 20000;
let maxNetworkHistoryPoints = 0;
let isMonitoringActive = false;
const fileName = "networkHistory";

export const fetchNetworkStats = async () : Promise<BasicNetworkStats> => {
	// If a request is already in progress, wait for it to complete
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
		// For first run, initialise the measurements to get meaningful values
		if (isFirstRun) {
			await si.networkStats();
			isFirstRun = false;
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
		lastRequestTime = Date.now();
		return dataPoint;
	} catch (error) {
		console.error("Error getting network speeds:", error);
		return { downloadSpeed: 0, uploadSpeed: 0, timestamp: Date.now() };
	}finally {
		isRequestInProgress = false;
	}
};

export const getNetworkStats = async () : Promise<BasicNetworkStats> => {
	return fetchNetworkStats();
};

const logNetworkStats = async () : Promise<void>=> {
	console.log("NETWORK POINTS", maxNetworkHistoryPoints);
	try {
		// Calculate minimum interval as 20% of the monitoring interval
		// with bounds of 1-5 seconds to ensure reasonable values
		const minInterval = Math.min(5000, Math.max(1000, Math.round(currentMonitoringInterval * 0.2)));

		// If an on-demand request was made very recently, wait a bit
		const timeSinceLastRequest = Date.now() - lastRequestTime;
		if (timeSinceLastRequest < minInterval) {
			await new Promise(resolve =>
				setTimeout(resolve, minInterval - timeSinceLastRequest),
			);
		}
		const dataPoint = await fetchNetworkStats();

		writeHistory(fileName, dataPoint, maxNetworkHistoryPoints);
	} catch (error) {
		console.error("Error recording network speeds:", error);
	}
};

export const getNetworkHistory = async () => {
	const fileHistory = readHistory<BasicNetworkStats>(fileName);
	return fileHistory;
};

export const startNetworkMonitoring = async (interval = 20000) : Promise<Response> => {
	try {
		if (networkTimer) {
			throw new Error("Network monitoring already running");
		}
		currentMonitoringInterval = interval;
		console.log("Starting network monitoring...");
		// Collect first data point immediately
		logNetworkStats();
		networkTimer = setInterval(logNetworkStats, interval);
		isMonitoringActive = true;

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
		if (!networkTimer) {
			throw new Error("Network monitoring is not running");
		}
		clearInterval(networkTimer);
		networkTimer = null;
		isMonitoringActive = true;
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
	maxNetworkHistoryPoints = points;
};

export const isNetworkMonitoring = (): boolean => isMonitoringActive;