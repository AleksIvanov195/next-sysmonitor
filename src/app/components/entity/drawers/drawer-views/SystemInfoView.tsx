"use client";
import useLoad from "../../../apiutils/useLoad";
import { StaticSystemInfo } from "@/lib/systemStaticInfo";
import { bytesToGB } from "../../../utils/bytesToGb";
import API from "../../../apiutils/API";
import { useState } from "react";
import { DrawerViewProps } from "../DrawerEntities.types";

const SystemInfoView = ({ isOpen }: DrawerViewProps) => {
	// Initialisation ---------------------------------------------
	const [data,,, isLoading, reloadData] = useLoad<StaticSystemInfo>("/api/system-info", isOpen);
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
			setIsUpdating(false);
		}
	};
	if (isLoading || isUpdating) {
		return <p className="text-center text-gray-400">Loading system info....</p>;
	}
	// View ---------------------------------------------
	const labelClass = "block text-gray-600 dark:text-gray-300 font-semibold mb-1";
	const valueClass = "text-gray-900 dark:text-gray-100 mb-2";
	return (
		<>
			{data && (
				<div className="flex flex-col gap-4">
					<button className="px-3 py-1 text-sm font-semibold rounded bg-white/10 text-white hover:bg-white/20" onClick={refreshSystemInfo}>Refresh</button>
					<div>
						<div className={labelClass}>CPU</div>
						<div><span className={labelClass}>Model:</span> <span className={valueClass}>{data.cpu.brand}</span></div>
						<div><span className={labelClass}>Manufacturer:</span> <span className={valueClass}>{data.cpu.manufacturer}</span></div>
						<div><span className={labelClass}>Cores:</span> <span className={valueClass}>{data.cpu.cores}</span></div>
						<div><span className={labelClass}>Speed:</span> <span className={valueClass}>{data.cpu.speed} GHz</span></div>
						<div><span className={labelClass}>Socket:</span> <span className={valueClass}>{data.cpu.socket}</span></div>
						<div><span className={labelClass}>Virtualization:</span> <span className={valueClass}>{data.cpu.virtualization ? "Yes" : "No"}</span></div>
					</div>
					<hr className="border-t border-white" />

					<div>
						<div className={labelClass}>Motherboard</div>
						<div><span className={labelClass}>Manufacturer:</span> <span className={valueClass}>{data.baseboard.manufacturer}</span></div>
						<div><span className={labelClass}>Model:</span> <span className={valueClass}>{data.baseboard.model}</span></div>
						<div><span className={labelClass}>Version:</span> <span className={valueClass}>{data.baseboard.version}</span></div>
					</div>
					<hr className="border-t border-white" />

					<div>
						<div className={labelClass}>BIOS</div>
						<div><span className={labelClass}>Vendor:</span> <span className={valueClass}>{data.bios.vendor}</span></div>
						<div><span className={labelClass}>Version:</span> <span className={valueClass}>{data.bios.version}</span></div>
						<div><span className={labelClass}>Release Date:</span> <span className={valueClass}>{data.bios.releaseDate}</span></div>
					</div>
					<hr className="border-t border-white" />

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
					<hr className="border-t border-white" />

					<div>
						<div className={labelClass}>Operating System</div>
						<div><span className={labelClass}>Distro:</span> <span className={valueClass}>{data.os.distro}</span></div>
						<div><span className={labelClass}>Release:</span> <span className={valueClass}>{data.os.release}</span></div>
						<div><span className={labelClass}>Arch:</span> <span className={valueClass}>{data.os.arch}</span></div>
						<div><span className={labelClass}>Hostname:</span> <span className={valueClass}>{data.os.hostname}</span></div>
					</div>
					<hr className="border-t border-white" />

					<div>
						<div className={labelClass}>Graphics</div>
						{data.graphics.controllers.map((gpu, i) => (
							<div key={i} className="mb-1">
								<span className={valueClass}>{gpu.model} ({gpu.vram} MB)</span>
							</div>
						))}
					</div>
					<hr className="border-t border-white" />

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
					<hr className="border-t border-white" />
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
					<hr className="border-t border-white" />
					<div>
						<div className={labelClass}>System</div>
						<div><span className={labelClass}>Manufacturer:</span> <span className={valueClass}>{data.system.manufacturer}</span></div>
						<div><span className={labelClass}>Model:</span> <span className={valueClass}>{data.system.model}</span></div>
						<div><span className={labelClass}>Version:</span> <span className={valueClass}>{data.system.version}</span></div>
						<div><span className={labelClass}>Serial:</span> <span className={valueClass}>{data.system.serial}</span></div>
					</div>
					<hr className="border-t border-white" />
				</div>
			)}
		</>
	);
};

export default SystemInfoView;