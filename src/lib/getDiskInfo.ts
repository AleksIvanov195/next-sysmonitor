import { exec } from "child_process";
type ByteUnit = "B" | "K" | "M" | "G" | "T";

interface Disk {
  name: string;
  type: string;
  size: string;
  fsused?: string;
  "fsuse%"?: string;
  children?: Disk[];
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
exec("/bin/lsblk -J -o NAME,TYPE,SIZE,FSUSED,FSUSE%", (err, stdout, stderr) => {
	if (err) {
		console.error("Error running lsblk:", err);
		return;
	}
	if (stderr) {
		console.error("Command stderr:", stderr);
		return;
	}

	try {
		const parsedDisks = JSON.parse(stdout);
		const disks: Disk[] = [];
		console.log(parsedDisks);
		console.log(parsedDisks.blockdevices);
		console.log(parsedDisks.blockdevices.forEach((disk : Disk) => console.log(disk)));
		// The lsblk -J format outputs blockdevices array
		parsedDisks.blockdevices.forEach((disk : Disk) => {
			if (disk.type === "disk") {
				try {
					console.log("Processing disk:", disk);
					const usedSpace = getUsedSpace(disk);
					disk.fsused = String(usedSpace);
					disk["fsuse%"] = (usedSpace * 100 / convertToBytes(disk.size)).toFixed(2) + "%";
					disks.push(disk);
				} catch (err) {
					console.error("Error processing this disk:", disk);
					console.error(err);
				}
			}
		});
		console.log("Disk information:", disks);
		return disks;
	} catch (parseError) {
		console.error("Error parsing JSON output:", parseError);
	}
});