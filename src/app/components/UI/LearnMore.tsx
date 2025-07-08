import Icons from "./Icons";

interface LearnMoreProps {
  href: string;
  title?: string;
  className?: string;
}

const LearnMore = ({ href, title = "Learn more", className = "text-black dark:text-white" }: LearnMoreProps) => (
	<a
		href={href}
		target="_blank"
		rel="noreferrer"
		title={title}
		className={`${className}`}
	>
		<Icons.CircleQuestionMark/>
	</a>
);

export default LearnMore;