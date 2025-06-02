import { MemoryMetric, CpuMetric } from "./types/system";
import { BasicNetworkStats } from "./types/network";
import { DiskFormatted } from "./types/disk";
import { getDiskInfo } from "./disk/diskInfo";
import { getNetworkHistory, getNetworkStats } from "./networkInfo";
import { getCpuHistory, getCpuMetrics } from "./cpuInfo";
import { getStaticSystemInfo, refreshStaticSystemInfo, StaticSystemInfo } from "./systemStaticInfo";
import { getMemoryStats, getMemoryHistory } from "./memoryInfo";

export async function getSystemInfo() : Promise<StaticSystemInfo> {
	const info = await getStaticSystemInfo();
	return info;
}
export async function getDynamicSystemInfo() {

	const [memory, cpuMetrics, network, disk]:
	[MemoryMetric, CpuMetric, BasicNetworkStats, DiskFormatted[]] = await Promise.all([
		getMemoryStats(),
		getCpuMetrics(),
		getNetworkStats(),
		getDiskInfo(),
	]);

	return {
		memory,
		disk,
		currentLoad: cpuMetrics.load,
		cpuTemp: cpuMetrics.temp,
		network,
	};
}

// Used to refresh any cached data to display up-to-date results
export async function refreshSystemInfo() {
	await refreshStaticSystemInfo();
}

export async function getHistoricData() {
	const [networkHistory, cpuHistory, memoryHistory]: [BasicNetworkStats[], CpuMetric[], MemoryMetric[]] = await Promise.all([
		getNetworkHistory(),
		getCpuHistory(),
		getMemoryHistory(),
	]);

	return { networkHistory, cpuHistory, memoryHistory };
}

