import * as os from "os";
import { DiskFormatted } from "../types/disk";
import { getDiskInfoLinux } from "./getDiskInfoLinux";
import { getDiskInfoWindows } from "./getDiskInfoWindows";


let cachedDisk: DiskFormatted[] | null = null;
const isWindows : boolean = os.platform() === "win32";

const getDiskInfoForPlatform = async () : Promise<DiskFormatted[]> => {
	return isWindows ? getDiskInfoWindows() : getDiskInfoLinux();
};

export const getDiskInfo = async () : Promise<DiskFormatted[]> => {
	if (cachedDisk) return cachedDisk;
	return await refreshDiskInfo();
};

export const refreshDiskInfo = async () : Promise<DiskFormatted[]> =>{
	cachedDisk = await getDiskInfoForPlatform();
	return cachedDisk;
};