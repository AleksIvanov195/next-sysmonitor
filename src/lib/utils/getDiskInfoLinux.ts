import { exec } from "child_process";
import { promisify } from "util";
import { DiskFormatted } from "../types/disk";
import { convertToBytes } from "./convertToBytes";

// Convert exec to return a Promise
const execPromise = promisify(exec);

interface RawDisk {
  name: string;
  type: string;
  size: string;
  fsused?: string;
  "fsuse%"?: string;
  children?: RawDisk[];
}

const getUsedSpace = (disk: RawDisk) => {
	let usedSpace = 0;
	// Get disk used space in bytes
	if(disk.fsused != null) {
		usedSpace += convertToBytes(disk.fsused);
	}
	// If children then do a recursive call to getUsedSpace for each child
	if(disk.children) {
		disk.children.forEach((child : RawDisk)=> {
			usedSpace += getUsedSpace(child);
		});
	}
	return usedSpace;
};

// Helper function to convert RawDisk to DiskFormatted
const formatDisk = (disk: RawDisk): DiskFormatted => {
	const formattedDisk: DiskFormatted = {
		name: disk.name,
		type: disk.type,
		size: convertToBytes(disk.size),
		fsused: disk.fsused ? convertToBytes(disk.fsused) : 0,
		"fsuse%": disk["fsuse%"],
	};

	if (disk.fsused !== undefined) {
		formattedDisk.fsused = convertToBytes(disk.fsused);
	}

	if (disk.children) {
		formattedDisk.children = disk.children.map(child => formatDisk(child));
	}

	return formattedDisk;
};

export const getDiskInfoLinux = async (): Promise<DiskFormatted[]> => {
	try {
		const { stdout, stderr } = await execPromise("/bin/lsblk -J -o NAME,TYPE,SIZE,FSUSED,FSUSE%");

		if (stderr) {
			console.error("Command stderr:", stderr);
			return [];
		}

		const parsedDisks = JSON.parse(stdout);
		const disks: DiskFormatted[] = [];

		// The lsblk -J format outputs blockdevices array
		parsedDisks.blockdevices.forEach((disk : RawDisk) => {
			if (disk.type === "disk") {
				try {
					const usedSpace = getUsedSpace(disk);
					const formattedDisk = formatDisk(disk);
					formattedDisk.fsused = usedSpace;
					formattedDisk["fsuse%"] = (usedSpace * 100 / formattedDisk.size).toFixed(2) + "%";
					disks.push(formattedDisk);
				} catch (err) {
					console.error("Error processing this disk:", disk, err);
				}
			}
		});
		return disks;
	} catch (error) {
		console.error("Error getting disk information:", error);
		return [];
	}
};