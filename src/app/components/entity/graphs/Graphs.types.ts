import { CpuInfo, SystemLoad, MemoryInfo } from "@/lib/types/system";

export interface CPUGraphProps {
	info: CpuInfo;
	load: SystemLoad;
}

export interface MemoryGraphProps {
	load: MemoryInfo;
}