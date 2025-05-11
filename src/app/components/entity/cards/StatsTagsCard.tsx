import { ReactNode } from "react";
import Card from "../../UI/Card";
import TagSelector from "../../UI/TagSelector";

interface StatsTagCardProps {
	title: string;
	chart: ReactNode;
	tags?: string[];
	onTagClick?: (tag: string) => void;
	selectedTag?: string;
}

const StatsTagCard = ({ title, chart, tags, onTagClick, selectedTag }: StatsTagCardProps) => {
	return (
		<Card title={title}>
			<div className="flex flex-1 items-center justify-center p-2">
				{chart}
			</div>
			{tags && (
				<TagSelector
					tags={tags}
					selectedTag={selectedTag}
					onTagClick={onTagClick}
				/>
			)}
		</Card>
	);
};

export default StatsTagCard;