interface TagSelectorProps {
    tags: string[];
    selectedTag?: string;
    onTagClick?: (tag: string) => void;
}

const TagSelector = ({ tags, selectedTag, onTagClick }: TagSelectorProps) => {
	return (
		<div className="w-full text-center overflow-x-auto no-scrollbar">
			<div className="inline-flex gap-2 whitespace-nowrap">
				{tags.map(tag => (
					<span
						key={tag}
						className={`rounded-full p-3 py-1 text-sm font-semibold cursor-pointer
							${tag === selectedTag
						? "bg-blue-500 text-white"
						: "bg-gray-200 text-gray-700"
					}`}
						onClick={() => onTagClick && onTagClick(tag)}
					>
						{tag}
					</span>
				))}
			</div>
		</div>
	);
};

export default TagSelector;