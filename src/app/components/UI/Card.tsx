import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
}

const Card = ({ title, children, icon, isLoading = false }: CardProps) => {
	return (
		<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6">
			{icon && <div className="absolute top-3 left-3 text-white/80">{icon}</div>}

			{isLoading ? (
				<div className="animate-pulse">
					<div className="h-8 bg-white/20 rounded mb-4 mx-auto w-3/4"></div>
					<div className="space-y-3">
						<div className="h-4 bg-white/20 rounded w-full"></div>
						<div className="h-4 bg-white/20 rounded w-5/6"></div>
						<div className="h-4 bg-white/20 rounded w-4/6"></div>
					</div>
				</div>
			) : (
				<>
					<h3 className="text-2xl font-medium text-white/90 text-center whitespace-nowrap">{title}</h3>
					{children}
				</>
			)}
		</div>
	);
};

export default Card;