import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function GET() {

	try {
		const { stdout } = await execPromise("npm run prod:logs:watcher --silent");
		return new Response(stdout, {
			headers: {
				"Content-Type": "text/plain",
			},
		});

	} catch (error) {
		console.error("API Error fetching watcher logs:", error);
		const errorMessage = "Failed to execute log command on the server.";
		return new Response(errorMessage, {
			status: 500,
			headers: {
				"Content-Type": "text/plain",
			},
		});
	}
}