import { ReactNode } from "react";
import Card from "../../UI/Card";

interface StatsTagCardProps {
	title: string;
	chart: ReactNode;
	tags?: string[];
	height?: number;
	width?: number;
	onTagClick?: (tag: string) => void;
}

const StatsTagCard = ({ title, chart, tags, height = 256, width = 256, onTagClick }: StatsTagCardProps) => {

	return (
		<Card title = {title}>
			<div className="flex flex-1 items-center justify-center p-2">
				<div className={`h-[${height}px] w-[${width}px]`}>
					{chart}
				</div>
			</div>
			<div className="w-full overflow-x-auto no-scrollbar">
				<div className="flex gap-2 justify-center">
					{tags && tags.map(tag => (
						<span
							key={tag}
							className="bg-gray-200 rounded-full p-3 py-1 text-sm font-semibold text-gray-700 cursor-pointer"
							onClick={() => onTagClick && onTagClick(tag)}
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</Card>
	);
};

export default StatsTagCard;