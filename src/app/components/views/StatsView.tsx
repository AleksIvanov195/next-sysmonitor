"use client";
import { useEffect, useState } from "react";
import { CpuInfo, MemoryInfo, SystemLoad, CpuTemp } from "@/lib/systemInfo";
import { DiskFormatted } from "@/lib/getDiskInfoLinux";
import DonutChart from "../UI/graphs/DonutChart";
import CpuGraph from "../entity/graphs/CpuGraph";
import MemoryGraph from "../entity/graphs/MemoryGraph";
import StatsCard from "../entity/cards/StatsCard";
import StatsTagCard from "../entity/cards/StatsTagsCard";

type SystemData = {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskFormatted[];
  currentLoad: SystemLoad;
	cpuTemp: CpuTemp
};

const StatsView = () => {

	// State ---------------------------------------------
	const [data, setData] = useState<SystemData | null>(null);
	const [selectedDisk, setSelectedDisk] = useState<DiskFormatted | null>(null);

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
				};
			});
		};
		fetchFullSystemInfo();
		const interval = setInterval(fetchDynamicSystemInfo, 10000);

		return () => clearInterval(interval);
	}, []);

	// Handlers ---------------------------------------------
	const handleDiskSelect = (disk: DiskFormatted) => {
		setSelectedDisk(disk);
	};

	const handleDiskTagClick = (tag: string) => {
		if (!data) return;
		const disk = data.disk.find((d) => d.name === tag);
		if (disk) handleDiskSelect(disk);
	};
	console.log(data);
	// View ---------------------------------------------
	if (!data) return <div>Loading...</div>;
	const hour = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	const date = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
	return (
		<div className="max-w-7xl m-auto p-6 ">
			<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex flex-col items-center justify-center gap-1 mb-6">
				<p className="text-5xl font-bold text-white/90">{hour}</p>
				<p className="text-xl font-medium text-white/70">
					<span className="capitalize">{date}</span>
				</p>
			</div>

			<div className="flex flex-col justify-center md:flex-row gap-3">
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
					chart={
						selectedDisk && (
							<DonutChart
								part1={{ value: selectedDisk.fsused, name: "Used" }}
								part2={{ value: selectedDisk.size - selectedDisk.fsused, name: "Free" }}
								height={256}
								width={256}
							/>
						)
					}
				/>
				<StatsCard title ={"Network Usage"}
					chart = {<DonutChart
						part1={{ value: 24, name: "Used" }}
						part2={{ value: 76, name: "Free" }}
						height={256}
						width={256}
					/>}
				/>
			</div>

		</div>
	);
};

export default StatsView;