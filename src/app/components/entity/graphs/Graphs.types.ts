import { SystemLoad, MemoryInfo } from "@/lib/types/system";

export interface CPUGraphProps {
	load: SystemLoad;
}

export interface MemoryGraphProps {
	load: MemoryInfo;
}