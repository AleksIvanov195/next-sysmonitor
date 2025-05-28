import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

// Ensure the data directory exists
const dataDir = path.resolve(process.cwd(), "data");
const dbPath = path.join(dataDir, "history.db");

if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

const createTable = `
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    historyType TEXT NOT NULL,
    data TEXT NOT NULL
)`;

try {
	db.exec(createTable);
} catch (err) {
	console.error("Failed to create 'history' table:", err);
}

export const readHistory = <T = unknown>(fileName : string): T[] => {
	const statement = db.prepare("SELECT data FROM history WHERE historyType = ?");
	const data = statement.all(fileName) as { data: string }[];
	if (data.length === 0) {
		return [];
	}else{
		return data.map(row => JSON.parse(row.data) as T);
	}
};

export const writeHistory = <T = unknown>(fileName: string, history: T, maxPoints: number): void => {
	const insertStmt = db.prepare("INSERT INTO history (historyType, data) VALUES (?, ?)");
	const truncateStmt = db.prepare(
		`DELETE FROM history
     WHERE historyType = ?
       AND id NOT IN (
         SELECT id FROM history
         WHERE historyType = ?
         ORDER BY id DESC
         LIMIT ?
       )`,
	);

	const transaction = db.transaction(() => {
		insertStmt.run(fileName, JSON.stringify(history));
		truncateStmt.run(fileName, fileName, maxPoints);
	});

	transaction();
};