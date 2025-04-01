import { ReactNode } from "react";
import Card from "../../UI/Card";

interface StatsCardProps {
	title: string;
	chart: ReactNode;
	bottomText?: string;
	height?: number;
	width?: number;
}

const StatsCard = ({ title, chart, bottomText, height = 256, width = 256 }: StatsCardProps) => {

	return (
		<Card title = {title}>
			<div className="flex flex-1 items-center justify-center p-2">
				<div className={`h-[${height}px] w-[${width}px]`}>
					{chart}
				</div>
			</div>
			{bottomText && (
				<h3 className="text-lg font-medium text-white/90 text-center">{bottomText}</h3>
			)}
		</Card>
	);
};

export default StatsCard;