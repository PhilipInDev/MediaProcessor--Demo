import { FC } from 'react';
import { IoClose } from 'react-icons/io5';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useMediaProcessingPage, ProcessingResult } from '../context';

type MediaProcessingStateUnitPropsType = {
	unit: {
		success: boolean;
		title?: string;
		onClick?: () => void;
	} | null;
	height: string;
}

const MediaProcessingStateUnit: FC<MediaProcessingStateUnitPropsType> = ({
	unit,
	height,
}) => {
	if (!unit) {
		return <div style={{ height }} />
	}

	const { onClick, success, title } = unit;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.2 }}
			style={{ height }}
			onClick={onClick}
			className={cn( "flex justify-center items-center transition-all border-l-4 border-l-white",{
				"bg-red-500 cursor-pointer text-red-300 hover:border-l-red-200": !success,
				"bg-green-500": success,
			})}
			title={title}
		>
			{!success && <IoClose size={50} />}
		</motion.div>
	)
}


const MediaProcessingState = () => {
	const {
		processingResults,
		processedFilesCount,
	} = useMediaProcessingPage();

	const processingResultsWithCorrectOrder = Array
		.apply(null, Array(processedFilesCount))
		.map((item, idx) => {
			const correspondingResult = processingResults
				.find((item) => item.itemIdx === idx);

			if (correspondingResult) {
				return correspondingResult;
			}

			return item;
		}) as (ProcessingResult | null)[]

	const unitOnClick = (operationKey: string) => {
		const el = document.querySelector<HTMLDivElement>(`[data-operation-key="${operationKey}"]`);

		if (el) {
			el.style.animation = '';
			el.offsetWidth;
			el.style.animation = 'on-media-item-select 1s';
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	return (
		<div className="h-full w-20">
			{
				processedFilesCount && processingResultsWithCorrectOrder.map((unit) => (
					<MediaProcessingStateUnit
						unit={
							unit
								? {
										onClick: () => unitOnClick(unit.operationKey),
										success: unit.success,
										title:  unit.error,
									}
								: null
						}
						height={`${window.innerHeight / processedFilesCount}px`}
					/>
				))
			}
		</div>
	)
}

export default MediaProcessingState;
