import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ReactSelect from 'react-select';

type PropsType = {
	name: string;
	options: { label: string; value: string }[];
	placeholder?: string;
	id?: string;
	error?: string | null;
}

const Select: FC<PropsType> = ({
	name,
	options,
	placeholder,
	id,
	error,
}) => {
	const { control } = useFormContext();

	return (
		<div className="w-full">
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => (
					<ReactSelect
						placeholder={placeholder}
						id={id}
						onChange={(data) => onChange(data?.value || null)}
						options={options}
						defaultValue={{ label: value?.toUpperCase(), value }}
					/>
				)}
			/>
			{error && <span className="text-[12px] text-red-500">{error}</span>}
		</div>
	)
}

export default Select;
