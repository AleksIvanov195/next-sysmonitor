import { CpuInfo, SystemLoad, MemoryInfo } from "@/lib/systemInfo";

export interface CPUGraphProps {
	info: CpuInfo;
	load: SystemLoad;
}

export interface MemoryGraphProps {
	load: MemoryInfo;
}