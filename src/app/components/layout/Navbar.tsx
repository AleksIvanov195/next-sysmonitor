"use client";
import { useState } from "react";
import ControlDrawer from "../entity/drawers/ControlDrawer";

const NavBar = () => {
	const [isControlDrawerOpen, setIsControlDrawerOpen] = useState(false);

	return (
		<div className="flex items-center">
			<button
				onClick={() => setIsControlDrawerOpen(true)}
				className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
				aria-label="Open control panel"
			>
				<div className="flex flex-col justify-center items-center">
					<span className="block w-4 h-0.5 bg-current mb-1"></span>
					<span className="block w-4 h-0.5 bg-current mb-1"></span>
					<span className="block w-4 h-0.5 bg-current"></span>
				</div>

				<span className="hidden md:inline text-base whitespace-nowrap">Control Drawer</span>
			</button>

			<ControlDrawer isOpen={isControlDrawerOpen} onClose={() => setIsControlDrawerOpen(false)}/>
		</div>
	);
};

export default NavBar;