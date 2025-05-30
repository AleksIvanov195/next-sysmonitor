import si from "systeminformation";
import { MemoryMetric, SystemLoad, CpuTemp, CpuInfo, CpuMetric } from "./types/system";
import { BasicNetworkStats } from "./types/network";
import { DiskFormatted } from "./types/disk";
import { getDiskInfo, refreshDiskInfo } from "./disk/diskInfo";
import { getNetworkHistory, getNetworkStats } from "./networkInfo";
import { getCpuHistory, getCpuMetrics } from "./cpuInfo";
import { getStaticSystemInfo } from "./systemStaticInfo";
import { getMemoryStats, getMemoryHistory } from "./memoryInfo";

export async function getSystemInfo() {
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
export async function getFreshSystemInfo() {
	const [cpu, memory, currentLoad, cpuTemp, network]: [CpuInfo, MemoryMetric, SystemLoad, CpuTemp, BasicNetworkStats] = await Promise.all([
		si.cpu(),
		getMemoryStats(),
		si.currentLoad(),
		si.cpuTemperature(),
		getNetworkStats(),
	]);

	const disk = await refreshDiskInfo();

	return { cpu, memory, disk, currentLoad, cpuTemp, network };
}

export async function getHistoricData() {
	const [networkHistory, cpuHistory, memoryHistory]: [BasicNetworkStats[], CpuMetric[], MemoryMetric[]] = await Promise.all([
		getNetworkHistory(),
		getCpuHistory(),
		getMemoryHistory(),
	]);

	return { networkHistory, cpuHistory, memoryHistory };
}

