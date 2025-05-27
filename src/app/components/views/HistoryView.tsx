"use client";
import StatsTagCard from "../entity/cards/StatsTagsCard";
import LineChart from "../UI/graphs/LineChart";
import { useState, useEffect } from "react";
import { BasicNetworkStats } from "@/lib/types/network";
import { CpuMetric } from "@/lib/types/system";

interface HistoricData {
	networkHistory: BasicNetworkStats[];
	cpuHistory: CpuMetric[];
}
type HistoryTag = "CPU" | "Memory" | "Network";

const HistoryView = ({}) => {
	// State ---------------------------------------------
	const [historicData, setHistoricData] = useState<HistoricData | null>(null);
	const [selectedTag, setSelectedTag] = useState<HistoryTag>("Network");
	useEffect(() => {
		// Fetch historic data on first load
		const fetchHistoricData = async () => {
			const res = await fetch("/api/historic-system-info");
			const result = (await res.json()) as HistoricData;
			setHistoricData(result);
		};
		fetchHistoricData();
	}, []);
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

		return null;
	};
	return (
		<StatsTagCard
			title=""
			tags={["Network", "CPU", "Memory"]}
			onTagClick={handleTagClick}
			selectedTag={selectedTag}
			chart={renderChart()}
		/>
	);
};

export default HistoryView;