"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ReactNode } from "react";

interface DrawerProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
	showCategory?: boolean;
}

const Drawer = ({ id, isOpen, onClose, title = "Info", children, showCategory = false }: DrawerProps) => {
	// State ---------------------------------------------
	const [isVisible, setIsVisible] = useState<boolean>(isOpen);
	const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

	// Setup portal target once component mounts
	useEffect(() => {
		setPortalRoot(document.getElementById("portal-container"));
	}, []);

	// Sync state with parent component
	useEffect(() => {
		setIsVisible(isOpen);
	}, [isOpen]);

	if (!portalRoot) return null;

	// Create drawer content
	const drawerContent = (
		<>
			{isVisible && (
				<div
					className="fixed inset-0 bg-black z-50 opacity-25"
					onClick={onClose}
				/>
			)}
			<div className={`fixed flex flex-row z-50 top-0 left-0 transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "-translate-x-full"}`}>
				{showCategory &&
				<div
					className="h-screen flex flex-col bg-white dark:bg-gray-900 overflow-y-auto border-r border-gray-300 dark:border-gray-700">
					{["Cat1", "Cat2", "Cat3"].map((tag) => (
						<button
							key={tag}
							className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-base"
						>
							{tag}
						</button>
					))}
				</div>
				}
				<div
					id={id}
					className={`
          h-screen p-4 overflow-y-auto 
          bg-white dark:bg-gray-800 w-80`}
					aria-labelledby={`${id}-label`}
				>
					<h5
						id={`${id}-label`}
						className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
					>
						<svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
						</svg>
						{title}
					</h5>

					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
					>
						<svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
							<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
						</svg>
						<span className="sr-only">Close menu</span>
					</button>

					{children}
				</div>
			</div>

		</>
	);

	return createPortal(drawerContent, portalRoot);
};

export default Drawer;