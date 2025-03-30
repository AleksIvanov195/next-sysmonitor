import { ReactNode } from "react";
interface StatsCardProps {
	title: string;
	chart: ReactNode;
	bottomText: string;
}

const StatsCard = ({ title, chart, bottomText } : StatsCardProps) => {
	return(
		<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex-1/4">
			<h3 className="text-lg font-medium text-white/90 text-center">{title}</h3>
			<div className="flex-1 flex items-center justify-center p-2">
				<div className="h-64 w-64">
					{chart}
				</div>
			</div>
			{
				bottomText &&
				<h3 className="text-lg font-medium text-white/90 text-center">{bottomText}</h3>
			}
		</div>
	);

};

export default StatsCard;