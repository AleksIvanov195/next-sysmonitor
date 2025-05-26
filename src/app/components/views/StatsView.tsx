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
	const [data, setData] = useState<SystemData | null>(null);
	const [selectedDisk, setSelectedDisk] = useState<DiskFormatted | null>(null);
	const [selectedNetworkStat, setSelectedNetworkStat] = useState<string>("Download");
	const [isHistoryEnabled, setIsHistoryEnabled] = useState<boolean>(false);

	useEffect(() => {
		// Fetch full system info on first load
		const fetchFullSystemInfo = async () => {
			const res = await fetch("/api/system-info");
			const result = (await res.json()) as SystemData;
			setData(result);

			// Set the first disk as default
			if (result.disk?.length > 0) {
				setSelectedDisk(result.disk[0]);
			}
		};
		// Fetch dynamic system info periodically
		const fetchDynamicSystemInfo = async () => {
			const res = await fetch("/api/dynamic-system-info");
			const result = await res.json();
			setData((prevData) => {
				if (!prevData) return null;
				return {
					...prevData,
					memory: result.memory,
					currentLoad: result.currentLoad,
					cpuTemp: result.cpuTemp,
					network: result.network,
				};
			});
		};
		fetchFullSystemInfo();
		const interval = setInterval(fetchDynamicSystemInfo, 10000);

		return () => clearInterval(interval);
	}, []);

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
	if (!data) return <div>Loading...</div>;

	return (
		<>
			<div className="flex flex-col justify-center md:flex-row gap-3 mb-6">
				<StatsCard title ={"CPU Utilisation"}
					bottomText={`temp: ${data.cpuTemp.main}`}
					chart = {
						<CpuGraph
							info = {data.cpu}
							load = {data.currentLoad}
						/>}
				/>
				<StatsCard title ={"Memory Utilisation"}
					chart = {
						<MemoryGraph
							load = {data.memory}
						/>}
				/>
				<StatsTagCard
					title={"Disk Usage"}
					tags={data.disk.map((disk) => disk.name)}
					onTagClick={handleDiskTagClick}
					selectedTag={selectedDisk?.name}
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
					chart = {
						<Gauge
							name="Mbps"
							value={parseFloat((
								selectedNetworkStat === "Download"
									? (data.network?.downloadSpeed * 8) / 1000000
									: (data.network?.uploadSpeed * 8) / 1000000
							).toFixed(2))}
							height={228}
							width={228}
						/>}
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