import { ReactNode } from "react";

interface CardProps {
	title: string;
	children: ReactNode;
}

const Card = ({ title, children }: CardProps) => {
	return(
		<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex-1/4 min-w-0">
			<h3 className="text-2xl font-medium text-white/90 text-center">{title}</h3>
			{children}
		</div>
	);
};

export default Card;