export const minIntervalWait = async (currentMonitoringInterval: number, lastRequestTime: number) : Promise<void> => {
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
};