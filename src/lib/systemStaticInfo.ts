import si from "systeminformation";
import type { Systeminformation } from "systeminformation";
import type { CpuInfo } from "./types/system";
import type { DiskFormatted } from "./types/disk";
import { getCpuInfo } from "./cpuInfo";
import { refreshDiskInfo } from "./disk/diskInfo";

export interface StaticSystemInfo {
  cpu: CpuInfo;
  baseboard: Systeminformation.BaseboardData;
  bios: Systeminformation.BiosData;
  memoryModules: Systeminformation.MemLayoutData[];
  os: Systeminformation.OsData;
  graphics: Systeminformation.GraphicsData;
  disks: DiskFormatted[];
  network: Systeminformation.NetworkInterfacesData[];
  system: Systeminformation.SystemData;
  hostname: string;
}

let cachedStaticInfo: StaticSystemInfo | null = null;

export async function getStaticSystemInfo(): Promise<StaticSystemInfo> {
	if (cachedStaticInfo) return cachedStaticInfo;
	return await refreshStaticSystemInfo();
}

export async function refreshStaticSystemInfo(): Promise<StaticSystemInfo> {
	cachedStaticInfo = null;
	const [
		cpu,
		memoryModules,
		baseboard,
		bios,
		os,
		graphics,
		disks,
		network,
		system,
	] = await Promise.all([
		getCpuInfo(),
		si.memLayout(),
		si.baseboard(),
		si.bios(),
		si.osInfo(),
		si.graphics(),
		refreshDiskInfo(),
		si.networkInterfaces(),
		si.system(),
	]);

	const networkArray = Array.isArray(network) ? network : [network];

	cachedStaticInfo = {
		cpu,
		baseboard,
		bios,
		memoryModules,
		os,
		graphics,
		disks,
		network: networkArray,
		system,
		hostname: os.hostname,
	};

	return cachedStaticInfo;
}