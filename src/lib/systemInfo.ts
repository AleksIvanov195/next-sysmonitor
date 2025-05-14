import si from "systeminformation";
import { MemoryInfo, SystemLoad, CpuTemp, CpuInfo, CpuMetric } from "./types/system";
import { BasicNetworkStats } from "./types/network";
import { getDiskInfo, refreshDiskInfo } from "./DiskInfo";
import { getNetworkHistory, getNetworkStats } from "./NetworkInfo";
import { getCpuHistory, getCpuInfo, getCpuMetrics } from "./CpuInfo";

export async function getSystemInfo() {
	const [memory, cpu, cpuMetrics, cpuHistory, network, networkHistory]:
	[MemoryInfo, CpuInfo, CpuMetric, CpuMetric[], BasicNetworkStats, BasicNetworkStats[]] = await Promise.all([
		si.mem(),
		getCpuInfo(),
		getCpuMetrics(),
		getCpuHistory(),
		getNetworkStats(),
		getNetworkHistory(),
	]);

	const disk = await getDiskInfo();
	  return {
		cpu,
		memory,
		disk,
		currentLoad: cpuMetrics.load,
		cpuTemp: cpuMetrics.temp,
		cpuHistory,
		network,
		networkHistory,
	};
}

export async function getDynamicSystemInfo() {

	const [memory, cpuMetrics, cpuHistory, network, networkHistory]:
	[MemoryInfo, CpuMetric, CpuMetric[], BasicNetworkStats, BasicNetworkStats[]] = await Promise.all([
		si.mem(),
		getCpuMetrics(),
		getCpuHistory(),
		getNetworkStats(),
		getNetworkHistory(),
	]);
	return {
		memory,
		currentLoad: cpuMetrics.load,
		cpuTemp: cpuMetrics.temp,
		cpuHistory,
		network,
		networkHistory,
	};
}
export async function getFreshSystemInfo() {
	const [cpu, memory, currentLoad, cpuTemp, network, networkHistory]: [CpuInfo, MemoryInfo, SystemLoad, CpuTemp, BasicNetworkStats, BasicNetworkStats[]] = await Promise.all([
		si.cpu(),
		si.mem(),
		si.currentLoad(),
		si.cpuTemperature(),
		getNetworkStats(),
		getNetworkHistory(),
	]);

	const disk = await refreshDiskInfo();

	return { cpu, memory, disk, currentLoad, cpuTemp, network, networkHistory };
}

export async function getHistoricData() {
	const [networkHistory]: [BasicNetworkStats[], CpuMetric[]] = await Promise.all([
		getNetworkHistory(),
		getCpuHistory(),
	]);

	return { networkHistory };
}

