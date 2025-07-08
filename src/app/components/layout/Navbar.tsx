"use client";
import { useState } from "react";
import ControlDrawer from "../entity/drawers/ControlDrawer";
import Icons from "../UI/Icons";

const NavBar = () => {
	const [isControlDrawerOpen, setIsControlDrawerOpen] = useState(false);

	return (
		<div className="flex items-center">
			<button
				onClick={() => setIsControlDrawerOpen(true)}
				className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
				aria-label="Open control panel"
			>
				<div className="text-black dark:text-white">
					<Icons.Menu/>
				</div>
				<span className="hidden md:inline text-base whitespace-nowrap">Control Drawer</span>
			</button>

			<ControlDrawer isOpen={isControlDrawerOpen} onClose={() => setIsControlDrawerOpen(false)}/>
		</div>
	);
};

export default NavBar;