import { DiskFormatted } from "@/lib/types/disk";
import DonutChart from "../../UI/graphs/DonutChart";
import { bytesToGB } from "../../utils/bytesToGb";

interface DiskGraphsProps {
  disk: DiskFormatted;
}

const DiskGraph = ({ disk }: DiskGraphsProps) => {
	const part1 = {
		value: parseFloat(bytesToGB(disk.fsused)),
		name: "Used (GB)",
	};
	const part2 = {
		value: parseFloat(bytesToGB(disk.size - disk.fsused)),
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

export default DiskGraph;