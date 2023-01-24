import { FC, PropsWithChildren } from 'react';

const ItemWrapper: FC<PropsWithChildren<{ id?: string; classes?: string; dataOperationKey?: string; }>> = ({
	children,
	id,
	dataOperationKey,
	classes= '',
}) => {
	return (
		<section
			data-operation-key={dataOperationKey}
			className={`w-full shadow rounded-sm bg-white p-2 text-gray-700 ${classes}`}
			id={id}
		>
			{children}
		</section>
	)
}

export default ItemWrapper;
