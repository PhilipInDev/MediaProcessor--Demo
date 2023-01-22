import {FC} from 'react';

type PropsType = {
	name: string;
	value: string | number | null;
}

const Field: FC<PropsType> = ({ name, value }) => {
	return (
		<div className="flex gap-2 text-gray-800">
			<span className="font-semibold">{name}:</span>
			<span>{value || 'N/A'}</span>
		</div>
	)
}

export default Field;
