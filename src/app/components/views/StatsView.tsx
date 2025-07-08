"use client";
import { useEffect, useState } from "react";
import { CpuInfo, MemoryInfo, SystemLoad, CpuTemp } from "@/lib/types/system";
import { DiskFormatted } from "@/lib/types/disk";
import { BasicNetworkStats } from "@/lib/types/network";
import CpuGraph from "../entity/graphs/CpuGraph";
import MemoryGraph from "../entity/graphs/MemoryGraph";
import StatsCard from "../entity/cards/StatsCard";
import StatsTagCard from "../entity/cards/StatsTagsCard";
import Gauge from "../UI/graphs/Gauge";
import HistoryView from "./HistoryView";
import DiskGraph from "../entity/graphs/DiskGraphs";
import { useSettings } from "../SettingsProvider";
import useLoad from "../apiutils/useLoad";
import Icons from "../UI/Icons";

type SystemData = {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskFormatted[];
  currentLoad: SystemLoad;
	cpuTemp: CpuTemp;
	network: BasicNetworkStats;
};

const StatsView = () => {
	// Initialisation ---------------------------------------------
	const { settings } = useSettings();
	// State ---------------------------------------------
	const [selectedDisk, setSelectedDisk] = useState<DiskFormatted | null>(null);
	const [selectedNetworkStat, setSelectedNetworkStat] = useState<string>("Download");
	const [isHistoryEnabled, setIsHistoryEnabled] = useState<boolean>(false);
	const [data,,,, reload] = useLoad<SystemData>("/api/dynamic-system-info");

	useEffect(() => {
		if (!settings?.liveFetchingInterval) return;
		const interval = setInterval(reload, settings?.liveFetchingInterval);
		return () => clearInterval(interval);
	}, [settings?.liveFetchingInterval, reload]);

	useEffect(() => {
		if (data && !selectedDisk && data.disk.length > 0) {
			setSelectedDisk(data.disk[0]);
		}
	}, [data]);

	useEffect(() => {
		setIsHistoryEnabled(!!settings?.autoShowHistory);
	}, [settings?.autoShowHistory]);

	// Handlers ---------------------------------------------
	const handleDiskSelect = (disk: DiskFormatted) => {
		setSelectedDisk(disk);
	};

	const handleDiskTagClick = (tag: string) => {
		if (!data) return;
		const disk = data.disk.find((d) => d.name === tag);
		if (disk) handleDiskSelect(disk);
	};

	const handleNetworkTagClick = (tag: string) => {
		if (tag === "Download" || tag === "Upload") {
			setSelectedNetworkStat(tag);
		}
	};
	const handleEnableHistory = async () => {
		setIsHistoryEnabled(true);
	};

	// View ---------------------------------------------
	return (
		<>
			<div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<StatsCard title ={"CPU Utilisation"}
					bottomText={data ? `temp: ${data.cpuTemp.main}°C ` : ""}
					icon={<Icons.Cpu/>}
					isLoading={!data}
					chart={data && <CpuGraph load={data.currentLoad} />}
				/>
				<StatsCard
					title ={"Memory Utilisation"}
					icon={<Icons.MemoryStick/>}
					isLoading={!data}
					chart={data && <MemoryGraph load={data.memory} />}
				/>
				<StatsTagCard
					title={"Disk Usage"}
					tags={data?.disk.map((disk) => disk.name)}
					onTagClick={handleDiskTagClick}
					selectedTag={selectedDisk?.name}
					icon={<Icons.HardDrive/>}
					isLoading={!data}
					chart={
						selectedDisk && (
							<DiskGraph disk={selectedDisk} />
						)
					}
				/>
				<StatsTagCard title ={"Network"}
					tags={["Download", "Upload"]}
					onTagClick={handleNetworkTagClick}
					selectedTag={selectedNetworkStat}
					icon={<Icons.ArrowDownUp/>}
					isLoading={!data}
					chart={
						data && (
							<Gauge
								name="Mbps"
								value={parseFloat(
									(selectedNetworkStat === "Download"
										? (data.network?.downloadSpeed * 8) / 1000000
										: (data.network?.uploadSpeed * 8) / 1000000
									).toFixed(2),
								)}
								height={228}
								width={228}
							/>
						)
					}
				/>
			</div>
			{
				!isHistoryEnabled ? (
					<button
						className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-6"
						onClick={handleEnableHistory}
					>
						Fetch Network History
					</button>
				) :
					<HistoryView />

			}
		</>
	);
};

export default StatsView;