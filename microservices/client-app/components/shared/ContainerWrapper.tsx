import { FC, PropsWithChildren } from 'react';

const ContainerWrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="max-w-[1200px] w-full mx-auto overflow-y-auto px-5 pt-2 flex-shrink-0">
			{children}
		</div>
	)
}

export default ContainerWrapper;
