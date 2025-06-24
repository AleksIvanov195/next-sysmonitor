import { getProcessLogs } from "@/lib/pm2logs";
import { LogLayout } from "@/app/components/views/logs/LogLayout";
import { LogSection } from "@/app/components/views/logs/LogSection";
import { notFound } from "next/navigation";

const LogPageType = async ({ params }: { params: Promise<{ processName: string; logType: string }> }) => {

	const { processName, logType } = await params;
	if (logType !== "out" && logType !== "error") {
		notFound();
	}

	const logs : string = await getProcessLogs(processName, logType);


	return (
		<LogLayout processName={processName}>
			<LogSection
				title={logType === "error" ? "Error Logs" : "Standard Output"}
				logs={logs}
				isError={logType === "error"}
				className="mb-8 overflow-auto max-h-screen"
			/>
		</LogLayout>
	);
};

export default LogPageType;