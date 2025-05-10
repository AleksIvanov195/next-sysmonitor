import { MemoryGraphProps } from "./Graphs.types";
import DonutChart from "../../UI/graphs/DonutChart";

const bytesToGB = (bytes: number) => (bytes / (1024 ** 3)).toFixed(2);

const MemoryGraph = ({ load }: MemoryGraphProps) => {

	const part1 = {
		value: parseFloat(bytesToGB(load.used)),
		name: "Used (GB)",
	};
	const part2 = {
		value: parseFloat(bytesToGB(load.free)),
		name: "Free (GB)",
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