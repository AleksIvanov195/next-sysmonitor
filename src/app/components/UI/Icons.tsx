import { Cpu, ArrowDownUp, HardDrive, MemoryStick, CircleQuestionMark, Settings, LayoutList, PcCase, LogOut, Menu   } from "lucide-react";

const Icons = {
	Cpu: ({ size = 20, color = "currentColor" }) => <Cpu size={size} color={color} />,
	ArrowDownUp: ({ size = 20, color = "currentColor" }) => <ArrowDownUp size={size} color={color} />,
	HardDrive: ({ size = 20, color = "currentColor" }) => <HardDrive size={size} color={color} />,
	MemoryStick: ({ size = 20, color = "currentColor" }) => <MemoryStick size={size} color={color} />,
	CircleQuestionMark: ({ size = 20, color = "currentColor" }) => <CircleQuestionMark size={size} color={color} />,
	Settings: ({ size = 20, color = "currentColor" }) => <Settings size={size} color={color} />,
	LayoutList: ({ size = 20, color = "currentColor" }) => <LayoutList size={size} color={color} />,
	PcCase: ({ size = 20, color = "currentColor" }) => <PcCase size={size} color={color} />,
	LogOut: ({ size = 20, color = "currentColor" }) => <LogOut size={size} color={color} />,
	Menu: ({ size = 20, color = "currentColor" }) => <Menu size={size} color={color} />,
};

export default Icons;