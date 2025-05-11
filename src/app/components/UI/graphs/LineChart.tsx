import ReactECharts from "echarts-for-react";

interface DataPoint {
  timestamp: number;
  value: number;
}

interface SeriesData {
  name: string;
  data: DataPoint[];
  color?: string;
}

interface LineChartProps {
  title?: string;
  series: SeriesData[];
  height?: number | string;
  width?: number | string;
  yAxisName?: string;
}

const LineChart = ({ title = "", series, height = "100%", width = "100%", yAxisName = "" }: LineChartProps) => {
	const option = {
		title: {
			text: title,
			textStyle: {
				color: "white",
				fontSize: 20,
			},
			top: 0,
			left: "center",
		},
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.15)",
			borderColor: "transparent",
			textStyle: {
				color: "white",
			},
		},
		xAxis: {
			type: "time",
			axisLabel: {
				color: "white",
				fontSize: 12,
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: "rgba(255,255,255,0.1)",
				},
			},
		},
		yAxis: {
			type: "value",
			name: yAxisName,
			nameLocation: "middle",
			nameGap: 40,
			axisLabel: {
				color: "white",
				fontSize: 12,
			},
			nameTextStyle: {
				color: "white",
				fontSize: 14,
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: "rgba(255,255,255,0.1)",
				},
			},
		},
		series: series.map(item => ({
			name: item.name,
			type: "line",
			showSymbol: false,
			data: item.data.map(dt => [dt.timestamp, dt.value]),
			itemStyle: {
				color: item.color || "#60a5fa",
			},
			areaStyle: {
				opacity: 0.1,
			},
		})),
		legend: {
			show: true,
			top: 30,
			textStyle: {
				color: "white",
				fontSize: 12,
			},
		},
		dataZoom: [
			{
				type: "slider",
				show: true,
				start: 0,
				end: 100,
				height: 20,
      	bottom: 5,
				borderColor: "rgba(255,255,255,0.2)",
     	 	backgroundColor: "rgba(255,255,255,0.05)",
      	fillerColor: "rgba(255,255,255,0.1)",
				textStyle: {
					color: "white",
				},
				handleStyle: {
					color: "white",
					borderColor: "white",
				},
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{
				height: typeof height === "number" ? `${height}px` : height,
				width: typeof width === "number" ? `${width}px` : width,
			}}
			opts={{ renderer: "svg" }}
		/>
	);
};

export default LineChart;