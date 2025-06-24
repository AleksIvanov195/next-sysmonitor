interface LogSection {
	title: string;
	logs: string;
	isError?: boolean;
	className?: string;
}

export const LogSection = ({ title, logs, isError = false, className = "" }: LogSection) => (
	<div className={className}>
		<h2 className={`text-xl font-semibold mb-2 border-b border-gray-700 pb-1 ${isError ? "text-red-400" : ""}`}>
			{title}
		</h2>
		<pre className={`bg-black rounded-md p-4 overflow-x-auto text-sm whitespace-pre-wrap ${isError ? "text-red-300" : ""}`}>
			{logs}
		</pre>
	</div>
);