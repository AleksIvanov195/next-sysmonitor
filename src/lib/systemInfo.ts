import si from "systeminformation";
import { getDiskInfoLinux, DiskFormatted } from "./getDiskInfoLinux";
import { getDiskInfoWindows } from "./getDiskInfoWindows";
import * as os from "os";

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

export interface SystemLoad {
  avgLoad: number;
  currentLoad: number;
}

export interface CpuTemp {
  main: number;
}

// Determine the platform
const isWindows = os.platform() === "win32";

// Cached variables - these are expensive to compute
let cachedCpu: CpuInfo | null = null;
let cachedDisk: DiskFormatted[] | null = null;

const getDiskInfoForCurrentPlatform = async () =>{
	if (isWindows) {
		return await getDiskInfoWindows();
	} else {
		return await getDiskInfoLinux();
	}
};

export async function getSystemInfo() {

	if (!cachedCpu) {
		cachedCpu = await si.cpu();
	}

	if (!cachedDisk) {
		cachedDisk = await getDiskInfoForCurrentPlatform();
	}

	const [memory, currentLoad, cpuTemp]: [MemoryInfo, SystemLoad, CpuTemp] = await Promise.all([
		si.mem(),
		si.currentLoad(),
		si.cpuTemperature(),
	]);

	return { cpu: cachedCpu, memory, disk: cachedDisk, currentLoad, cpuTemp };
}

export async function getDynamicSystemInfo() {

	const [memory, currentLoad, cpuTemp]: [MemoryInfo, SystemLoad, CpuTemp] = await Promise.all([
		si.mem(),
		si.currentLoad(),
		si.cpuTemperature(),
	]);
	return { memory, currentLoad, cpuTemp };
}

export async function getFreshSystemInfo() {
	const [cpu, memory, disk, currentLoad]: [
    CpuInfo,
    MemoryInfo,
    DiskFormatted[],
    SystemLoad
  ] = await Promise.all([si.cpu(), si.mem(), getDiskInfoForCurrentPlatform(), si.currentLoad()]);
	cachedCpu = cpu;
	cachedDisk = disk;
	return { cpu, memory, disk, currentLoad };
}