import { CPUGraphProps } from "./Graphs.types";
import DonutChart from "../../UI/graphs/DonutChart";

const CpuGraph = ({ load }: CPUGraphProps) => {
	const part1 = {
		value: Math.round(load.currentLoad),
		name: "Used (%)",
	};
	const part2 = {
		value: 100 - Math.round(load.currentLoad),
		name: "Free (%)",
	};
	return(
		<DonutChart
			part1={part1}
			part2={part2}
			height={228}
			width={228}/>
	);
};

export default CpuGraph;