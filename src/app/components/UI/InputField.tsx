const InputField = ({ ...props } : React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<input
			{...props}
		/>
	);
};

export default InputField;