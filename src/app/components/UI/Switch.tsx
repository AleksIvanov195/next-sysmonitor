interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const Switcher = ({ checked, onChange, disabled, label } : SwitchProps)=> {
	return (
		<label className="flex cursor-pointer select-none items-center gap-2">
			{label && <span className="text-gray-600 dark:text-gray-300">{label}</span>}
			<div className="relative">
				<input
					type="checkbox"
					checked={checked}
					onChange={e => onChange(e.target.checked)}
					className="sr-only"
					disabled={disabled}
					role="switch"
					aria-checked={checked}
					aria-label={label}
				/>
				<div
					className={`box block h-8 w-14 rounded-full transition-colors duration-200 ${
						checked ? "bg-blue-600" : "bg-gray-400"
					} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
				></div>
				<div
					className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform duration-200 ${
						checked ? "translate-x-6" : ""
					}`}
				></div>
			</div>
		</label>
	);
};

export default Switcher;