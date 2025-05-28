import si from "systeminformation";
import { DiskFormatted } from "../types/disk";

interface WindowsDiskInfo {
  fs: string;
	type: string;
  size: number;
  used: number;
  mount: string;
}

export const getDiskInfoWindows = async () => {
	const disks = await si.fsSize();
	const formattedDisksInfo : DiskFormatted[] = [];

	disks.forEach((disk : WindowsDiskInfo) => {
		const formattedInfo : DiskFormatted = {
			name: disk.fs,
			type: disk.type,
			size: disk.size,
			fsused: disk.used,
			"fsuse%": (disk.used * 100 / disk.size).toFixed(2) + "%",
		};
		formattedDisksInfo.push(formattedInfo);
	});

	return formattedDisksInfo;

};
