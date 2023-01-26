import { FC, PropsWithChildren } from 'react';

const PageWrapper: FC<PropsWithChildren<{ classes?: string; }>> = ({ children, classes = '' }) => {
	return (
		<main className={`w-full h-full overflow-y-auto ${classes}`}>
			{children}
		</main>
	)
}

export default PageWrapper;
