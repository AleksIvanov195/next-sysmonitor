import * as os from "os";
import { DiskFormatted } from "./types/disk";
import { getDiskInfoLinux } from "./utils/getDiskInfoLinux";
import { getDiskInfoWindows } from "./utils/getDiskInfoWindows";


let cachedDisk: DiskFormatted[] | null = null;
const isWindows = os.platform() === "win32";

const getDiskInfoForPlatform = () => {
	return isWindows ? getDiskInfoWindows() : getDiskInfoLinux();
};

export const getDiskInfo = async () => {
	if (!cachedDisk) {
		cachedDisk = await getDiskInfoForPlatform();
	}
	return cachedDisk;
};

export const refreshDiskInfo = async () =>{
	cachedDisk = await getDiskInfoForPlatform();
	return cachedDisk;
};