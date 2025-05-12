import si from "systeminformation";
import { BasicNetworkStats } from "./types/network";

/*
	RxBytes show the number of bytes recived by the network interface
	TxBytes show the number of bytes sent by the network interface
	rx_sec and tx_sec are calculated based on the time between calls to si.networkStats()
	When on-demand calls and interval calls happen too close together, they interfere with each other
*/
let networkTimer: NodeJS.Timeout | null = null;

// In-memory history
const networkHistory: BasicNetworkStats[] = [];

let isFirstRun = true;

let lastRequestTime = 0;

let isRequestInProgress = false;

let currentMonitoringInterval = 20000;

export const fetchNetworkStats = async () => {
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

export const getNetworkSpeeds = async () => {
	return fetchNetworkStats();
};

const recordNetworkSpeeds = async () => {
	try {
		// Calculate minimum interval as 20% of the monitoring interval
		// with bounds of 1-5 seconds to ensure reasonable values
		const MIN_INTERVAL = Math.min(5000, Math.max(1000, Math.round(currentMonitoringInterval * 0.2)));

		// If an on-demand request was made very recently, wait a bit
		const timeSinceLastRequest = Date.now() - lastRequestTime;
		if (timeSinceLastRequest < MIN_INTERVAL) {
			await new Promise(resolve =>
				setTimeout(resolve, MIN_INTERVAL - timeSinceLastRequest),
			);
		}

		const dataPoint = await fetchNetworkStats();
		networkHistory.push(dataPoint);
	} catch (error) {
		console.error("Error recording network speeds:", error);
	}
};

export const getNetworkHistory = () => {
	return [...networkHistory];
};

export const startNetworkMonitoring = (interval = 20000) => {
	if (networkTimer) {
		console.warn("Network monitoring already running.");
		return;
	}
	currentMonitoringInterval = interval;
	console.log("Starting network monitoring...");
	// Collect first data point immediately
	recordNetworkSpeeds();

	networkTimer = setInterval(recordNetworkSpeeds, interval);
};

export const stopNetworkMonitoring = () => {
	if (networkTimer) {
		clearInterval(networkTimer);
		networkTimer = null;
		console.log("Stopped network monitoring.");
	}
};

export const isMonitoring = (): boolean => !!networkTimer;