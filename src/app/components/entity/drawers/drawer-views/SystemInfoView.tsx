"use client";
import useLoad from "../../../apiutils/useLoad";
import { StaticSystemInfo } from "@/lib/systemStaticInfo";
import { bytesToGB } from "../../../utils/bytesToGb";
import API from "../../../apiutils/API";
import { useState } from "react";
import { DrawerViewProps } from "../DrawerEntities.types";
import Separator from "@/app/components/UI/Separator";
import LearnMore from "@/app/components/UI/LearnMore";

const SystemInfoView = ({ isOpen }: DrawerViewProps) => {
	// Initialisation ---------------------------------------------
	const [data,, loadingMessage, isLoading, reloadData] = useLoad<StaticSystemInfo>("/api/system-info", isOpen);
	// State ---------------------------------------------
	const [isUpdating, setIsUpdating] = useState(false);
	// Handlers ---------------------------------------------
	const refreshSystemInfo = async () : Promise<void> => {
		setIsUpdating(true);
		try {
			const response = await API.post("/api/refresh-system-info");
			if(response.isSuccess) {
				reloadData();
			}
		}finally {
			reloadData();
			setIsUpdating(false);
		}
	};
	const loading = () => {
		return <p className="text-center text-gray-400">Loading System Info....</p>;
	};
	const refreshing = () => {
		return <p className="text-center text-gray-400">Refreshing system info cache....</p>;
	};
	// View ---------------------------------------------
	const labelClass = "block text-gray-600 dark:text-gray-300 font-semibold mb-1";
	const valueClass = "text-gray-900 dark:text-gray-100 mb-2";
	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-2">
						<h3 className="text-xl font-semibold text-black dark:text-white">System Info</h3>
						<LearnMore href="https://github.com/AleksIvanov195/next-sysmonitor/blob/master/README.md#system-information" />
					</div>
					<button className="px-3 py-1 text-sm font-semibold rounded bg-white/10 text-white hover:bg-white/20" onClick={refreshSystemInfo}>Refresh</button>
				</div>
				{isLoading && loading()}
				{isUpdating && refreshing()}
				{loadingMessage && <p className="font-bold bg-red-600">{loadingMessage}</p>}
				{data && (
					<><div>
						<div className={labelClass}>CPU</div>
						<span className={labelClass}>Model:</span> <span className={valueClass}>{data.cpu.brand}</span>
						<span className={labelClass}>Manufacturer:</span> <span className={valueClass}>{data.cpu.manufacturer}</span>
						<span className={labelClass}>Cores:</span> <span className={valueClass}>{data.cpu.cores}</span>
						<span className={labelClass}>Speed:</span> <span className={valueClass}>{data.cpu.speed} GHz</span>
						<span className={labelClass}>Socket:</span> <span className={valueClass}>{data.cpu.socket}</span>
						<span className={labelClass}>Virtualization:</span> <span className={valueClass}>{data.cpu.virtualization ? "Yes" : "No"}</span>
					</div>
					<Separator />
					<div>
						<div className={labelClass}>Motherboard</div>
						<span className={labelClass}>Manufacturer:</span> <span className={valueClass}>{data.baseboard.manufacturer}</span>
						<span className={labelClass}>Model:</span> <span className={valueClass}>{data.baseboard.model}</span>
						<span className={labelClass}>Version:</span> <span className={valueClass}>{data.baseboard.version}</span>
					</div>
					<Separator />
					<div>
						<div className={labelClass}>BIOS</div>
						<span className={labelClass}>Vendor:</span> <span className={valueClass}>{data.bios.vendor}</span>
						<span className={labelClass}>Version:</span> <span className={valueClass}>{data.bios.version}</span>
						<span className={labelClass}>Release Date:</span> <span className={valueClass}>{data.bios.releaseDate}</span>
					</div>
					<Separator />
					<div>
						<div className={labelClass}>Memory Modules</div>
						{data.memoryModules.map((mod, i) => (
							<div key={i} className="mb-1">
								<span className={valueClass}>
									{bytesToGB(mod.size)} GB {mod.type} ({mod.bank})
								</span>
							</div>
						))}
					</div>
					<Separator />
					<div>
						<div className={labelClass}>Operating System</div>
						<span className={labelClass}>Distro:</span> <span className={valueClass}>{data.os.distro}</span>
						<span className={labelClass}>Release:</span> <span className={valueClass}>{data.os.release}</span>
						<span className={labelClass}>Arch:</span> <span className={valueClass}>{data.os.arch}</span>
						<span className={labelClass}>Hostname:</span> <span className={valueClass}>{data.os.hostname}</span>
					</div>
					<Separator />
					<div>
						<div className={labelClass}>Graphics</div>
						{data.graphics.controllers.map((gpu, i) => (
							<div key={i} className="mb-1">
								<span className={valueClass}>{gpu.model} ({gpu.vram} MB)</span>
							</div>
						))}
					</div>
					<Separator />
					<div>
						<div className={labelClass}>Disks</div>
						{data.disks.map((disk, i) => (
							<div key={i} className="mb-1">
								<span className={valueClass}>
									{disk.name}: {bytesToGB(disk.size)} GB ({disk.type})
								</span>
							</div>
						))}
					</div>
					<Separator />
					<div>
						<div className={labelClass}>Network Interfaces</div>
						{Array.isArray(data.network) && data.network.map((iface, i) => (
							<div key={i} className="mb-1">
								<span className={valueClass}>
									{iface.ifaceName || iface.iface} ({iface.ip4 || "No IP"})
								</span>
							</div>
						))}
					</div>
					<Separator />
					<div>
						<div className={labelClass}>System</div>
						<span className={labelClass}>Manufacturer:</span> <span className={valueClass}>{data.system.manufacturer}</span>
						<span className={labelClass}>Model:</span> <span className={valueClass}>{data.system.model}</span>
						<span className={labelClass}>Version:</span> <span className={valueClass}>{data.system.version}</span>
						<span className={labelClass}>Serial:</span> <span className={valueClass}>{data.system.serial}</span>
					</div>
					<Separator />
					</>
				)}
			</div>
		</>
	);
};

export default SystemInfoView;