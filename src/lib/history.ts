export const readHistory = async <T = unknown>(fileName : string): Promise<T[]> => {
	const fs = await import("fs");
	const path = await import("path");
	const filePath = path.resolve(process.cwd(), "data", `${fileName}.json`);
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, "[]");
		return [];
	}
	const raw = fs.readFileSync(filePath, "utf-8");
	try {
		return JSON.parse(raw) as T[];
	} catch {
		return [];
	}
};

export const writeHistory = async <T = unknown>(fileName: string, history: T[], maxPoints: number): Promise<void> => {
	const fs = await import("fs");
	const path = await import("path");
	const filePath = path.resolve(process.cwd(), "data", `${fileName}.json`);
	const trimmed = history.length > maxPoints ? history.slice(-maxPoints) : history;
	// Ensure the directory exists
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, JSON.stringify(trimmed, null, 2));
};