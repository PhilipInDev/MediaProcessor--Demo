import { FC } from 'react';
import { IoClose } from 'react-icons/io5';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useMediaProcessingPage, ProcessingResult } from '../context';

type MediaProcessingStateUnitPropsType = {
	unit: {
		success: boolean;
		title?: string;
		performance?: {
			fileSpecificProcessingMs: string;
			metadataRetrievingMs: string;
			uploadingFileMs: string;
		};
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

	const { onClick, success, title, performance } = unit;

	return (
		<div className="flex gap-1">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
				style={{ height }}
				onClick={onClick}
				className={cn( "w-20 flex-shrink-0 flex justify-center items-center transition-all border-l-4 border-l-white",{
					"bg-red-500 cursor-pointer text-red-300 hover:border-l-red-200": !success,
					"bg-green-500 cursor-pointer hover:border-l-green-200": success,
				})}
				title={title}
			>
				{!success && <IoClose size={50} />}
			</motion.div>
			{success && performance
				&& <div className="flex gap-3 p-4">
					<div>
						<span className="whitespace-nowrap block">Uploading time, ms</span>
						<span className="text-sm italic">{performance.uploadingFileMs}</span>
					</div>

					<div>
						<span className="whitespace-nowrap block">Metadata retrieving, ms</span>
						<span className="text-sm italic">{performance.metadataRetrievingMs}</span>
					</div>

					<div>
						<span className="whitespace-nowrap block">Characters recognition, ms</span>
						<span className="text-sm italic">{performance.fileSpecificProcessingMs}</span>
					</div>
				</div>
			}
		</div>
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

	const unitOnClick = (operationKey: string, success: boolean) => {
		const el = document.querySelector<HTMLDivElement>(`[data-operation-key="${operationKey}"]`);

		if (el) {
			el.style.animation = '';
			el.offsetWidth;
			el.style.animation = success ? 'on-media-item-select--success 1s' : 'on-media-item-select--error 1s';
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	return (
		<div className="h-full w-20 flex flex-col gap-[1px]">
			{
				processedFilesCount && processingResultsWithCorrectOrder.map((unit, idx) => (
					<MediaProcessingStateUnit
						key={unit?.operationKey || `mpsu-${idx}`}
						unit={
							unit
								? {
										onClick: () => unitOnClick(unit.operationKey, unit?.success),
										success: unit.success,
										performance: unit.success ? unit.performance : undefined,
										title:  !unit.success ? unit?.error : undefined,
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
