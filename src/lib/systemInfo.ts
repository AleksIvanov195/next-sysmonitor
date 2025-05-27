import si from "systeminformation";
import { MemoryInfo, SystemLoad, CpuTemp, CpuInfo, CpuMetric } from "./types/system";
import { BasicNetworkStats } from "./types/network";
import { getDiskInfo, refreshDiskInfo } from "./DiskInfo";
import { getNetworkHistory, getNetworkStats } from "./NetworkInfo";
import { getCpuHistory, getCpuMetrics } from "./CpuInfo";
import { getStaticSystemInfo } from "./FullSystemStaticInfo";

export async function getSystemInfo() {
	const info = await getStaticSystemInfo();
	return info;
}

export async function getDynamicSystemInfo() {

	const [memory, cpuMetrics, network]:
	[MemoryInfo, CpuMetric, BasicNetworkStats] = await Promise.all([
		si.mem(),
		getCpuMetrics(),
		getNetworkStats(),
	]);

	const disk = await getDiskInfo();
	return {
		memory,
		disk,
		currentLoad: cpuMetrics.load,
		cpuTemp: cpuMetrics.temp,
		network,
	};
}
export async function getFreshSystemInfo() {
	const [cpu, memory, currentLoad, cpuTemp, network]: [CpuInfo, MemoryInfo, SystemLoad, CpuTemp, BasicNetworkStats] = await Promise.all([
		si.cpu(),
		si.mem(),
		si.currentLoad(),
		si.cpuTemperature(),
		getNetworkStats(),
	]);

	const disk = await refreshDiskInfo();

	return { cpu, memory, disk, currentLoad, cpuTemp, network };
}

export async function getHistoricData() {
	const [networkHistory, cpuHistory]: [BasicNetworkStats[], CpuMetric[]] = await Promise.all([
		getNetworkHistory(),
		getCpuHistory(),
	]);

	return { networkHistory, cpuHistory };
}

