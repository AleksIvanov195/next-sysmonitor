"use client";
import StatsTagCard from "../entity/cards/StatsTagsCard";
import LineChart from "../UI/graphs/LineChart";
import { useState } from "react";
import { BasicNetworkStats } from "@/lib/types/network";
import { CpuMetric } from "@/lib/types/system";
import { MemoryMetric } from "@/lib/types/system";
import useLoad from "../apiutils/useLoad";
import { bytesToGB } from "../utils/bytesToGb";

interface HistoricData {
	networkHistory: BasicNetworkStats[];
	cpuHistory: CpuMetric[];
	memoryHistory: MemoryMetric[];
}
type HistoryTag = "CPU" | "Memory" | "Network";

const HistoryView = ({}) => {
	// State ---------------------------------------------
	const [historicData,,,, reloadHistoricData] = useLoad<HistoricData>("/api/historic-system-info");
	const [selectedTag, setSelectedTag] = useState<HistoryTag>("Network");
	// Handlers ---------------------------------------------
	const handleTagClick = (tag: string) => {
		setSelectedTag(tag as HistoryTag);
	};
	// View ---------------------------------------------
	if (!historicData) {
		return <div>Loading...</div>;
	}
	const renderChart = () => {
		if (selectedTag === "Network") {
			return (
				<LineChart
					title="Network Usage History"
					series={[
						{
							name: "Download",
							data: historicData.networkHistory.map(point => ({
								timestamp: point.timestamp,
								value: parseFloat(((point.downloadSpeed * 8) / 1000000).toFixed(3)),
							})),
							color: "#60a5fa",
						},
						{
							name: "Upload",
							data: historicData.networkHistory.map(point => ({
								timestamp: point.timestamp,
								value: parseFloat(((point.uploadSpeed * 8) / 1000000).toFixed(3)),
							})),
							color: "#ff4560",
						},
					]}
					yAxisName="Speed (Mbps)"
					height={256}
				/>
			);
		}

		if (selectedTag === "CPU") {
			return (
				<LineChart
					title="CPU History"
					series={[
						{
							name: "Load",
							data: historicData.cpuHistory.map(point => ({
								timestamp: point.timestamp,
								value: parseFloat(point.load.currentLoad.toFixed(2)),
							})),
							color: "#60a5fa",
						},
						{
							name: "Temperature",
							data: historicData.cpuHistory.map(point => ({
								timestamp: point.timestamp,
								value: parseFloat((point.temp.main ?? 0).toFixed(2)),
							})),
							color: "#ff4560",
						},
					]}
					yAxisName="Load (%)"
					height={256}
				/>
			);
		}
		if (selectedTag === "Memory") {
			return (
				<LineChart
					key={selectedTag}
					title="Memory Usage History"
					series={[
						{
							name: "Used",
							data: historicData.memoryHistory.map(point => ({
								timestamp: point.timestamp,
								value: bytesToGB(point.total - point.available),
							})),
							color: "#60a5fa",
						},
						                {
							name: "Available",
							data: historicData.memoryHistory.map(point => ({
								timestamp: point.timestamp,
								value: bytesToGB(point.available),
							})),
							color: "#34d399",
						},
					]}
					yAxisName="Used (GB)"
					height={256}
				/>
			);
		}

		return null;
	};
	return (
		<>
			<button onClick={() => reloadHistoricData()} className="px-3 py-1 text-sm font-semibold rounded bg-white/10 text-white hover:bg-white/20"> RELOAD </button>
			<StatsTagCard
				title=""
				tags={["Network", "CPU", "Memory"]}
				onTagClick={handleTagClick}
				selectedTag={selectedTag}
				chart={renderChart()}
			/>
		</>
	);
};

export default HistoryView;