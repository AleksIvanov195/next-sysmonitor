import si from "systeminformation";

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

export async function getSystemInfo() {
  const [cpu, memory, disk, currentLoad]: [
    CpuInfo,
    MemoryInfo,
    DiskInfo[],
    SystemLoad
  ] = await Promise.all([si.cpu(), si.mem(), si.fsSize(), si.currentLoad()]);

  return { cpu, memory, disk, currentLoad };
}
