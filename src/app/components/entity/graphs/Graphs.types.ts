import { CpuInfo, SystemLoad } from "@/lib/systemInfo";

export interface CPUGraphProps {
	info: CpuInfo;
	load: SystemLoad;
}