import ReactECharts from "echarts-for-react";

interface DataBar {
  name: string;
  value: number;
  color?: string;
}

interface BarRaceProps {
  title?: string;
  bars: DataBar[];
	categories: string[];
  height?: string;
  width?: string;
  textColor?: string;
}

const BarRace = ({ title = "", bars = [], categories = [],  height = "90%", width = "100%" }: BarRaceProps) => {
	const option = {
		title: {
			text: title,
			textStyle: {
				color: "white",
			},
		},
		xAxis: {
			max: "dataMax",
			type: "value",
			axisLabel: {
				color: "white",
			},
		},
		yAxis: {
			type: "category",
			data: categories,
			inverse: true,
			animationDuration: 300,
			animationDurationUpdate: 300,
			axisLabel: {
				color: "white",
			},
		},
		series: bars.map(bar => ({
			name: bar.name,
			type: "bar",
			data: [bar.value],
			itemStyle: {
				color: bar.color,
			},
			label: {
				show: true,
				position: "right",
				valueAnimation: true,
				color: "white",
				fontSize: 14,
			},
		})),
		legend: {
			show: true,
			textStyle: {
				color: "white",
			},
		},
	};

	return (
		<ReactECharts
			option={option}
			opts={{ renderer: "svg" }}
			style={{ width, height }}
		/>
	);
};

export default BarRace;
