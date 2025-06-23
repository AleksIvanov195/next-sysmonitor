"use client";
import { useState } from "react";
import ControlDrawer from "../entity/drawers/ControlDrawer";

const NavBar = () => {
	const [isControlDrawerOpen, setIsControlDrawerOpen] = useState(false);

	return (
		<div className="flex items-center gap-4" >
			<button
				onClick={() => setIsControlDrawerOpen(true)}
				className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
			>
				<span>Control Panel</span>
			</button>
			<ControlDrawer isOpen={isControlDrawerOpen} onClose={() => setIsControlDrawerOpen(false)}/>

		</div>
	);
};

export default NavBar;