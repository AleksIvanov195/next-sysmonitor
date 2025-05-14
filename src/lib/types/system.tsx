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

export interface CpuMetric {
  load: SystemLoad;
  temp: CpuTemp;
	timestamp: number;
}

export interface Response {
  success: boolean;
  message: string;
}
