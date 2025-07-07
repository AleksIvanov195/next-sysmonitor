import { ReactNode } from "react";
import Card from "../../UI/Card";

interface StatsCardProps {
	title: string;
	chart: ReactNode;
	bottomText?: string;
	icon?: ReactNode;
	isLoading?: boolean
}

const StatsCard = ({ title, chart, bottomText, icon, isLoading }: StatsCardProps) => {

	return (
		<Card title={title} icon={icon} isLoading={isLoading}>
			<div className="flex flex-1 items-center justify-center p-2">
				{chart}
			</div>
			{bottomText && (
				<h3 className="text-lg font-medium text-white/90 text-center">{bottomText}</h3>
			)}
		</Card>
	);
};

export default StatsCard;