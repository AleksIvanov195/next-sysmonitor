import * as os from "os";
import { DiskFormatted } from "../types/disk";
import { getDiskInfoLinux } from "./getDiskInfoLinux";
import { getDiskInfoWindows } from "./getDiskInfoWindows";


let cachedDisk: DiskFormatted[] | null = null;
const isWindows = os.platform() === "win32";

const getDiskInfoForPlatform = () => {
	return isWindows ? getDiskInfoWindows() : getDiskInfoLinux();
};

export const getDiskInfo = async () => {
	if (cachedDisk) return cachedDisk;
	return await refreshDiskInfo();
};

export const refreshDiskInfo = async () =>{
	cachedDisk = await getDiskInfoForPlatform();
	return cachedDisk;
};