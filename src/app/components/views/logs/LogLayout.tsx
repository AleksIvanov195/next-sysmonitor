import Link from "next/link";

interface LogLayout {
	processName: string;
	children: React.ReactNode
};

export const LogLayout = ({ processName, children }: LogLayout) => (
	<main className="bg-gray-900 text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
		<div className="max-w-7xl mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">
          Logs: <span className="text-blue-400">{processName}</span>
				</h1>
				<Link href="/" className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700">
					{"<"} Back to Dashboard
				</Link>
			</div>
			{children}
		</div>
	</main>
);