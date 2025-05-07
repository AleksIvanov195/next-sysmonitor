import si from "systeminformation";
import "./getDiskInfo";

export interface CpuInfo {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
}

export interface DiskInfo {
  fs: string;
  size: number;
  used: number;
  mount: string;
}

export interface SystemLoad {
  avgLoad: number;
  currentLoad: number;
}

export interface CpuTemp {
  main: number;
}

// Cached variables
let cachedCpu: CpuInfo | null = null;
let cachedDisk: DiskInfo[] | null = null;

export async function getSystemInfo() {

	if (!cachedCpu) {
		cachedCpu = await si.cpu();
	}

	if (!cachedDisk) {
		cachedDisk = await si.fsSize();
	}

	const [memory, currentLoad, cpuTemp]: [MemoryInfo, SystemLoad, CpuTemp] = await Promise.all([
		si.mem(),
		si.currentLoad(),
		si.cpuTemperature(),
	]);

	return { cpu: cachedCpu, memory, disk: cachedDisk, currentLoad, cpuTemp };
}

export async function getDynamicSystemInfo() {

	const diskLayout = await si.diskLayout();
	const blockDevices = await si.blockDevices();
	const [memory, currentLoad, cpuTemp]: [MemoryInfo, SystemLoad, CpuTemp] = await Promise.all([
		si.mem(),
		si.currentLoad(),
		si.cpuTemperature(),
	]);
	return { memory, currentLoad, cpuTemp, diskLayout, blockDevices };
}

export async function getRefreshedSystemInfo() {
	const [cpu, memory, disk, currentLoad]: [
    CpuInfo,
    MemoryInfo,
    DiskInfo[],
    SystemLoad
  ] = await Promise.all([si.cpu(), si.mem(), si.fsSize(), si.currentLoad()]);

	return { cpu, memory, disk, currentLoad };
}