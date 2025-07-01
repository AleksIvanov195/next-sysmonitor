import InputField from "../../UI/InputField";
import { AppSettings } from "@/lib/settings/settingsManager";
import { useState, useEffect } from "react";
import formatDuration from "../../utils/formatDuration";

interface SettingsInputFieldProps {
	label: string;
	type: "number" | "text";
	settingName: keyof AppSettings;
	currentValue: number | string | undefined;
	isLoading: boolean;
	onUpdate: (settingUpdate: Partial<AppSettings>) => Promise<void>;
	calculateHelpText?: (currentValue: string) => string;
	warningThreshold?: number;
}


const SettingsInputField = ({ label, type, settingName, currentValue, isLoading, onUpdate, calculateHelpText, warningThreshold } : SettingsInputFieldProps) => {
	const [value, setValue] = useState(currentValue?.toString() || "");
	const [error, setError] = useState("");

	useEffect(() => {
		if (currentValue !== undefined) {
			setValue(currentValue.toString());
		}
	}, [currentValue]);

	const handleUpdate = () => {
		setError("");
		const newValue = type === "number" ? parseInt(value, 10) : value;
		if (newValue === "" || newValue === currentValue) {
			setError("Cannot be empty!");
			return;
		}
		if (type === "number" && isNaN(newValue as number) || newValue as number <= 0) {
			setError("Must be a number bigger than 0!");
			return;
		}
		const settingUpdate: Partial<AppSettings> = {
			[settingName]: newValue,
		};
		onUpdate(settingUpdate);
	};
	const isUnchanged = currentValue?.toString() === value;
	const showWarning = warningThreshold && value && parseInt(value, 10) < warningThreshold;
	const helpText = calculateHelpText ? calculateHelpText(value) : formatDuration(parseInt(value, 10));
	return(
		<div className="mb-2">
			<label className="block text-gray-600 dark:text-gray-300 mb-1">{label}</label>
			{
				error && (
					<p className="bg-red-500 text-white p-1 rounded-md text-sm mb-1"> {error} </p>
				)
			}
			{showWarning && (
				<p className="bg-yellow-500/20 text-yellow-300 p-1 rounded-md text-sm mb-1">
          Note: Values below {warningThreshold}ms may impact performance.
				</p>
			)}
			<div className="flex gap-2">
				<InputField
					type={type}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					disabled={isLoading}
					className="px-3 py-2 rounded w-full text-sm border disabled:cursor-not-allowed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
				/>
				<button
					onClick={handleUpdate}
					disabled={isLoading || isUnchanged}
					className="px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
				>
					Update
				</button>
			</div>
			{value && type === "number" && (
				<p className="mt-1 text-sm text-gray-500">
					<span className="font-mono">{helpText}</span>
				</p>
			)}
		</div>
	);
};

export default SettingsInputField;
