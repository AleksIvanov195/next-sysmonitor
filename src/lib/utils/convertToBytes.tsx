import { ByteUnit } from "../types/disk";

export const convertToBytes = (sizeString: string) : number => {
	const value: number = parseFloat(sizeString);
	if (isNaN(value)) return 0;

	const unit = sizeString.replace(/^[\d.]+/, "").trim().toUpperCase() as ByteUnit;
	const units = {
		B: 1,
		K: 1024,
		M: 1024 * 1024,
		G: 1024 * 1024 * 1024,
		T: 1024 * 1024 * 1024 * 1024,
	};

	return unit in units ? Math.round(value * units[unit]) : 0;
};