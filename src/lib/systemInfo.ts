import si from "systeminformation";
import { MemoryInfo, SystemLoad, CpuTemp, CpuInfo, CpuMetric } from "./types/system";
import { BasicNetworkStats } from "./types/network";
import { getDiskInfo, refreshDiskInfo } from "./DiskInfo";
import { getNetworkHistory, getNetworkSpeeds, startNetworkMonitoring } from "./NetworkInfo";
import { getCpuHistory, getCpuInfo, getCpuMetrics, startCpuMonitoring } from "./CpuInfo";

startNetworkMonitoring();

export async function getSystemInfo() {
	const [memory, cpu, cpuMetrics, cpuHistory, network, networkHistory]:
	[MemoryInfo, CpuInfo, CpuMetric, CpuMetric[], BasicNetworkStats, BasicNetworkStats[]] = await Promise.all([
		si.mem(),
		getCpuInfo(),
		getCpuMetrics(),
		getCpuHistory(),
		getNetworkSpeeds(),
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
		getNetworkSpeeds(),
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
		getNetworkSpeeds(),
		getNetworkHistory(),
	]);

	const disk = await refreshDiskInfo();

	return { cpu, memory, disk, currentLoad, cpuTemp, network, networkHistory };
}

export async function getHistoricData() {
	const [networkHistory]: [BasicNetworkStats[]] = await Promise.all([
		getNetworkHistory(),
	]);

	return { networkHistory };
}

