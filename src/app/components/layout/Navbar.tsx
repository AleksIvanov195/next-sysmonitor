"use client";
import { useState } from "react";
import SettingsDrawer from "../entity/drawers/SettingsDrawer";

const NavBar = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<div className="flex items-center gap-4" >
			<button
				onClick={() => setIsSettingsOpen(true)}
				className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
			>
				<span>Settings</span>
			</button>
			<SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}/>

		</div>
	);
};

export default NavBar;