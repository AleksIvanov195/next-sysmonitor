import { MemoryGraphProps } from "./Graphs.types";
import { bytesToGB } from "../../utils/bytesToGb";
import DonutChart from "../../UI/graphs/DonutChart";

const MemoryGraph = ({ load }: MemoryGraphProps) => {

	const part1 = {
		value: bytesToGB(load.total - load.available),
		name: "Used (GB)",
	};
	const part2 = {
		value: bytesToGB(load.available),
		name: "Available (GB)",
	};
	return (
		<DonutChart
			part1={part1}
			part2={part2}
			height={228}
			width={228}
		/>
	);
};

export default MemoryGraph;