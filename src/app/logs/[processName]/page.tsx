import { getProcessLogs } from "@/lib/pm2logs";
import { LogLayout } from "@/app/components/views/logs/LogLayout";
import { LogSection } from "@/app/components/views/logs/LogSection";
import { notFound } from "next/navigation";

const LogPage = async ({ params }: { params: Promise<{ processName: string }> }) => {
	const { processName } = await params;

	let outLogs: string;
	let errLogs: string;
	try{
		[outLogs, errLogs] = await Promise.all([
			getProcessLogs(processName, "out"),
			getProcessLogs(processName, "error"),
		]);
	}catch (error) {
		console.error(`Failed to fetch logs for "${processName}":`, error);
		notFound();
	}

	return (
		<LogLayout processName={processName}>
			<LogSection
				title="Standard Output"
				logs={outLogs}
				className="mb-8 overflow-auto max-h-100"
			/>
			<LogSection
				title="Error Logs"
				logs={errLogs}
				isError={true}
				className="overflow-auto max-h-100"
			/>
		</LogLayout>
	);
};

export default LogPage;