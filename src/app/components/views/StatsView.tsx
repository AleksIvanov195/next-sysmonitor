"use client";
import { useEffect, useState } from "react";
import { CpuInfo, MemoryInfo, DiskInfo, SystemLoad } from "@/lib/systemInfo";
import DonutChart from "../UI/graphs/DonutChart";
import CpuGraph from "../entity/graphs/CpuGraph";
import MemoryGraph from "../entity/graphs/MemoryGraph";
import StatsCard from "../entity/cards/StatsCard";

type SystemData = {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskInfo[];
  currentLoad: SystemLoad;
};

const StatsView = () => {
	const [data, setData] = useState<SystemData | null>(null);

	useEffect(() => {
		// Fetch full system info on first load
		const fetchFullSystemInfo = async () => {
			const res = await fetch("/api/system-info");
			const result = (await res.json()) as SystemData;
			setData(result);
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
				};
			});
		};
		fetchFullSystemInfo();
		const interval = setInterval(fetchDynamicSystemInfo, 10000);

		return () => clearInterval(interval);
	}, []);

	if (!data) return <div>Loading...</div>;
	return (
		<div className="max-w-7xl m-auto p-6 ">
			<div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-lg rounded-lg shadow p-6 flex flex-col items-center justify-center gap-1 mb-6">
				<p className="text-5xl font-bold text-white/90">12:46</p>
				<p className="text-xl font-medium text-white/70">
					<span className="capitalize">March 28th, 2025</span>
				</p>
			</div>

			<div className="flex flex-col justify-center md:flex-row gap-3">
				<StatsCard title ={"CPU Utilisation"}
					bottomText={"2W/35C"}
					chart = {
						<CpuGraph
							info = {data.cpu}
							load = {data.currentLoad}
						/>}
				/>
				<StatsCard title ={"Memory Utilisation"}
					bottomText={"2W/35C"}
					chart = {
						<MemoryGraph
							load = {data.memory}
						/>}
				/>
				<StatsCard title ={"Disk Usage"}
					
					chart = {<DonutChart
						part1={{ value: 24, name: "Used" }}
						part2={{ value: 76, name: "Free" }}
						height={256}
						width={256}
					/>}
				/>
				<StatsCard title ={"Network Usage"}
					bottomText={"2W/35C"}
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