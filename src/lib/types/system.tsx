export interface CpuInfo {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
	socket?: string;
	virtualization?: string;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
	available: number;
}

export interface SystemLoad {
  avgLoad: number;
  currentLoad: number;
	cpus?: unknown;
}

export interface CpuTemp {
  main: number;
}

export interface CpuMetric {
  load: SystemLoad;
  temp: CpuTemp;
	timestamp: number;
}

export interface Response {
  success: boolean;
  message: string;
}
