import { FC, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useMediaProcessingPage, ProcessingResult } from '../context';
import { formatBytes } from '../helpers';

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

	const totalSizeRef = useRef<HTMLDivElement>(null)

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

	const getTotalFilesSizeBytes = (processingResults: ProcessingResult[]) => {
		return processingResults.reduce((prev, currentValue ) => {
			if (currentValue.success) {
				return prev + Number(currentValue.fileSizeBytes)
			}

			return prev;
		}, 0)
	}

	return (
		<div className="flex-grow-0 flex-shrink flex gap-2 w-20">
			<button
				type="button"
				onClick={
					() => totalSizeRef.current && totalSizeRef.current.scrollIntoView({ block: "start", behavior: "smooth" } )
				}
			>
				scroll
			</button>
			<div className="h-full flex flex-col gap-[1px] flex-grow-1">
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

			{!!processingResults.length
				&& <div className="m-auto p-2" ref={totalSizeRef}>
				<span
					className="whitespace-nowrap block">Total processed files size</span>
				<span className="italic text-sm">
					{formatBytes(getTotalFilesSizeBytes(processingResults))}
				</span>
			</div>}
		</div>
	)
}

export default MediaProcessingState;
