import { FC, InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

const Input: FC<InputHTMLAttributes<HTMLInputElement> & { error?: string | null; success?: string | null }> = ({ error, success, ...inputProps }) => {
	const { register } = useFormContext();

	return (
		<div className="flex flex-col gap-1">
			<input {...inputProps} {...register(inputProps.name || '')} className="p-1 border border-[#cccccc] rounded h-[38px] focus:outline focus:outline-[#2684FF] focus:outline-1 focus:border-[#2684FF]"/>
			<span className="text-[12px] text-red-500">{error}</span>
			<span className="text-[12px] text-green-500">{success}</span>
		</div>
	)
}

export default Input;
