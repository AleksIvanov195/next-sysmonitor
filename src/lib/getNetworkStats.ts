import si from "systeminformation";

export interface BasicNetworkStats {
  downloadSpeed: number;
  uploadSpeed: number;
	timestamp: number;
}

// RxBytes show the number of bytes recived by the network interface
// TxBytes show the number of bytes sent by the network interface


// In-memory history
const networkHistory: BasicNetworkStats[] = [];

export const getNetworkSpeeds = async () => {
	try {
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

		networkHistory.push(dataPoint);
		return dataPoint;
	} catch (error) {
		console.error("Error getting network speeds:", error);
		return { downloadSpeed: 0, uploadSpeed: 0, timestamp: Date.now() };
	}
};
