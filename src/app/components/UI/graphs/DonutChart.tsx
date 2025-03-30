import ReactECharts from "echarts-for-react";

type DonutPart = {
  value: number;
  name: string;
  color?: string;
};

interface DonutChartProps {
  part1: DonutPart;
  part2: DonutPart;
	height: number;
	width: number;
}

const DonutChart = ({ part1, part2, width, height }: DonutChartProps) => {
	const total = part1.value + part2.value;
	const percentage = Math.round((part1.value / total) * 100);
	const graphWidth = width ? `${width}px` : "128px";
	const graphHeight = height ? `${height}px` : "128px";

	const option = {
		tooltip: {
			trigger: "item",
			backgroundColor: "rgba(0,0,0,0.8)",
			borderColor: "rgba(255,255,255,0.2)",
			textStyle: {
				color: "rgba(255,255,255,0.9)",
				fontSize: 12,
			},
		},
		series: [{
			type: "pie",
			radius: ["65%", "85%"],
			label: {
				show: true,
				position: "center",
				formatter: `${percentage}%`,
				fontSize: 28,
				fontWeight: "bold",
				color: "rgba(255,255,255,0.9)",
			},
			emphasis: {
				label: {
					show: true,
					formatter: ({ percent }: { percent: number }) => `${Math.round(percent)}%`,
					fontSize: 28,
					fontWeight: "bold",
					color: "rgba(255,255,255,0.9)",
				},
			},
			data: [
				{
					value: part1.value,
					name: part1.name,
					itemStyle: {
						color: part1.color ? part1.color : "#60a5fa",
					},
				},
				{
					value: part2.value,
					name: part2.name,
					itemStyle: {
						color: part2.color ? part2.color : "rgba(255,255,255,0.15)",
					},
				},
			],
		}],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: graphWidth, width: graphHeight }}
			opts={{ renderer: "svg" }}
		/>
	);
};

export default DonutChart;