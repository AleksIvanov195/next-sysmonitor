import { exec } from "child_process";
import { promisify } from "util";

// Convert exec to return a Promise
const execPromise = promisify(exec);

type ByteUnit = "B" | "K" | "M" | "G" | "T";

interface Disk {
  name: string;
  type: string;
  size: string;
  fsused?: string;
  "fsuse%"?: string;
  children?: Disk[];
}

export interface DiskFormatted {
  name: string;
  type: string;
  size: number;
  fsused: number;
  "fsuse%"?: string;
  children?: DiskFormatted[];
}

const convertToBytes = (sizeString : string) => {
	// Get numeric value
	const value : number = parseFloat(sizeString);

	if (isNaN(value)) {
		return 0;
	}
	// Get the unit
	const unit = sizeString.replace(/^[\d.]+/, "").trim().toUpperCase() as ByteUnit;

	const units = {
		B: 1,
		K: 1024,
		M: 1024 * 1024,
		G: 1024 * 1024 * 1024,
		T: 1024 * 1024 * 1024 * 1024,
	};

	if (unit in units) {
		return Math.round(value * units[unit]);
	}

	return 0;
};

const getUsedSpace = (disk: Disk) => {
	let usedSpace = 0;
	// Get disk used space in bytes
	if(disk.fsused != null) {
		usedSpace += convertToBytes(disk.fsused);
	}
	// If children then do a recursive call to getUsedSpace for each child
	if(disk.children) {
		console.log("disk child:", disk.children);
		disk.children.forEach((child : Disk)=> {
			usedSpace += getUsedSpace(child);
		});
	}
	return usedSpace;
};

// Helper function to convert Disk to DiskFormatted
const formatDisk = (disk: Disk): DiskFormatted => {
	const formattedDisk: DiskFormatted = {
		name: disk.name,
		type: disk.type,
		size: convertToBytes(disk.size),
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
		console.log(parsedDisks);
		console.log(parsedDisks.blockdevices);
		console.log(parsedDisks.blockdevices.forEach((disk : Disk) => console.log(disk)));

		// The lsblk -J format outputs blockdevices array
		parsedDisks.blockdevices.forEach((disk : Disk) => {
			if (disk.type === "disk") {
				try {
					console.log("Processing disk:", disk);
					const usedSpace = getUsedSpace(disk);
					const formattedDisk = formatDisk(disk);
					formattedDisk.fsused = usedSpace;
					formattedDisk["fsuse%"] = (usedSpace * 100 / formattedDisk.size).toFixed(2) + "%";
					disks.push(formattedDisk);
				} catch (err) {
					console.error("Error processing this disk:", disk);
					console.error(err);
				}
			}
		});
		console.log("Disk information:", disks);
		return disks;
	} catch (error) {
		console.error("Error getting disk information:", error);
		return [];
	}
};