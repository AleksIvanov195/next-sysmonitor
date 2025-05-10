import ReactECharts from "echarts-for-react";

interface GaugeProps {
  name?: string;
  value: number;
  width: number;
  height: number;
}

const Gauge = ({ name, value, width, height }: GaugeProps) => {
	const option = {
		series: [
			{
				type: "gauge",
				progress: {
					show: true,
					width: 20,
					itemStyle: {
						color: "#60a5fa",
					},
				},
				axisLine: {
					lineStyle: {
						width: 20,
						color: [[1, "rgba(255,255,255,0.15)"]],
					},
				},
				axisTick: {
					show: true,
					splitNumber: 5,
					distance: -22,
					length: 5,
					lineStyle: {
						color: "white",
						width: 1,
					},
				},
				splitLine: {
					show: true,
					distance: 0,
					length: 10,
					lineStyle: {
						color: "white",
						width: 2,
					},
				},
				axisLabel: {
					show: true,
					distance: -35,
					color: "white",
					fontSize: 12,
				},
				pointer: {
					show: true,
					length: "60%",
					width: 3,
					itemStyle: {
						color: "white",
					},
				},
				title: {
					show: true,
					fontSize: 14,
					color: "white",
					offsetCenter: [0, "50%"],
				},
				detail: {
					valueAnimation: true,
					fontSize: 20,
					offsetCenter: [0, "30%"],
					color: "white",
				},
				data: [
					{
						value: value,
						name: name,
					},
				],
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: `${height}px`, width: `${width}px` }}
			opts={{ renderer: "svg" }}
		/>
	);
};

export default Gauge;