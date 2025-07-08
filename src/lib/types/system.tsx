export interface CpuInfo {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
	socket?: string;
	virtualization?: boolean;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
	available: number;
}

export interface SystemLoad {
  currentLoad: number;
}

export interface CpuTemp {
  main: number;
}

export interface CpuMetric {
  load: SystemLoad;
  temp: CpuTemp;
	timestamp: number;
}

export interface MemoryMetric extends MemoryInfo{
	timestamp: number;
}
export interface Response {
  success: boolean;
  message: string;
}
