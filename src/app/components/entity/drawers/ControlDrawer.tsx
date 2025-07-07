import { useState } from "react";
import Drawer from "../../UI/Drawer";
import SettingsView from "./drawer-views/SettingsView";
import SystemInfoView from "./drawer-views/SystemInfoView";
import AppProcessesView from "./drawer-views/AppProcessesView";
import { ControlDrawerProps } from "./DrawerEntities.types";
import Icons from "../../UI/Icons";
const tabs = [
	{ key: "settings", label: "Settings", icon: <Icons.Settings size={25}/> },
	{ key: "processes", label: "App Processes", icon: <Icons.LayoutList size={25}/> },
	{ key: "system-info", label: "System Info", icon: <Icons.PcCase size={25}/> },
];

const ControlDrawer = ({ isOpen, onClose }: ControlDrawerProps) => {
	// Initialisation ---------------------------------------------
	const [activeTab, setActiveTab] = useState("settings");
	// State ---------------------------------------------
	// Handlers ---------------------------------------------
	// View ---------------------------------------------
	const renderContent = () => {
		switch (activeTab) {
			case "settings":
				return <SettingsView isOpen={isOpen}/>;
			case "processes":
				return <AppProcessesView isOpen={isOpen}/>;
			case "system-info":
				return <SystemInfoView isOpen={isOpen}/>;
			default:
				return null;
		}
	};
	return (
		<Drawer
			id="controlPanel"
			isOpen={isOpen}
			onClose={onClose}
			title="Control Panel"
			tabs={tabs}
			activeTab={activeTab}
			onTabClick={setActiveTab}
		>
			{renderContent()}
		</Drawer>
	);
};

export default ControlDrawer;