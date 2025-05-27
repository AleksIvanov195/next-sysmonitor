"use client";
import { useState } from "react";
import SettingsDrawer from "../entity/drawers/SettingsDrawer";
import SystemInfoDrawer from "../entity/drawers/SystemInfoDrawer";

const NavBar = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);

	return (
		<div className="flex items-center gap-4" >
			<button
				onClick={() => setIsSystemInfoOpen(true)}
				className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
			>
				<span>System Info</span>
			</button>
			<button
				onClick={() => setIsSettingsOpen(true)}
				className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
			>
				<span>Settings</span>
			</button>
			<SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}/>
			<SystemInfoDrawer isOpen={isSystemInfoOpen} onClose={() => setIsSystemInfoOpen(false)}/>

		</div>
	);
};

export default NavBar;