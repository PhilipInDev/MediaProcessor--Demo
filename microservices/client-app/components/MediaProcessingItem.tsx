import { FC, useEffect, useState } from 'react';
import { useFormContext, get } from 'react-hook-form';
import { RxCrossCircled } from 'react-icons/rx';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { CiSquareRemove } from 'react-icons/ci';
import mime from 'mime-types';
import cn from 'classnames';
import ItemWrapper from './shared/ItemWrapper';
import Input from './shared/Input';
import ResultFields from './ResultFields';
import RecognitionResult from './RecognitionResult';
import { useMediaProcessing, useMediaProcessingPage } from '../context';
import Spinner from './shared/Spinner';
import MediaPreview from './shared/MediaPreview';
import Select from './shared/Select';

type PropsType = {
	id: string;
	namePrefix: string;
	removeItem: () => void;
}

const MediaProcessingItem: FC<PropsType> = ({
	namePrefix,
	id,
	removeItem,
}) => {
	const {
		operationKey,
		processing,
		processingResult,
		processingError,
		processingSuccess,
	} = useMediaProcessing();
	const { supportedLanguages } = useMediaProcessingPage();
	const { register, watch, formState: { errors } } = useFormContext();

	const [contentType, setContentType] = useState<string | null>(null);
	const [itemCollapsed, setItemCollapsed] = useState(true);

	const fileUrlName = `${namePrefix}.fileUrl`;
	const langSelectName = `${namePrefix}.langForOCR`;
	const idName = `${namePrefix}.id`;

	const fileUrlValue = watch(`${namePrefix}.fileUrl`);

	useEffect(() => {
		if (fileUrlValue) {
			const type = mime.lookup(fileUrlValue);

			if (type) setContentType(type);
		}
	}, [fileUrlValue]);


	useEffect(() => {
		register(idName, { value: id });
	}, []);

	return (
		<ItemWrapper
			dataOperationKey={operationKey || undefined}
			classes={cn(
			"flex flex-col gap-3 relative transition-all duration-300",
				{
					"!h-[600px]": !itemCollapsed,
				})
			}
		>
			{processing && <Spinner coverParent classes="bg-white/70 z-50" />}
			{!!removeItem &&
				<button
					type="button"
					className="absolute right-1 top-1 hover:text-red-800"
					onClick={removeItem}
				>
					<CiSquareRemove size={20}/>
				</button>
			}

			<div className="flex items-center">
				<div className="w-16 flex flex-shrink-0 items-center justify-center">
					{processingError && <RxCrossCircled size={38} className="text-red-800" />}
					{processingSuccess && <AiOutlineCheckCircle size={38} className="text-green-700" />}
				</div>

				<div className="flex items-center gap-2">

					<div
						className="flex flex-shrink-0 items-center justify-center bg-gray-100 rounded p-2 w-56 h-32"
					>
						<MediaPreview
							contentType={contentType}
							contentUrl={fileUrlValue}
						/>
					</div>

					<div className="flex gap-2">
						<Input
							type="text"
							error={get(errors, fileUrlName)?.message}
							name={fileUrlName}
						/>
						<div className="w-56 flex-shrink-0">

							<Select
								id="lang-for-ocr-select"
								name={langSelectName}
								options={supportedLanguages}
								placeholder="Language for OCR"
								error={get(errors, langSelectName)?.message}
							/>
						</div>

						<div className="overflow-y-auto max-h-16 flex-grow-0">
							{processingError
								&& <span className="text-red-800 italic text-sm">{processingError}</span>
							}
						</div>
					</div>

				</div>

				<button
					type="button"
					onClick={() => setItemCollapsed((prev) => !prev)}
					className="transition p-3 w-16 h-16 rounded-full ml-auto hover:bg-gray-100"
				>
					<IoIosArrowDown
						className={cn(
							"transition-all m-auto duration-300",
							{ "rotate-180": !itemCollapsed }
						)}
						size={40}
					/>
				</button>
			</div>

			<div className={cn(
					"px-16 pb-5 gap-5 flex-col transition-all overflow-y-auto",
					{ "h-0 opacity-0 !p-0": itemCollapsed }
				)}
			>
				<ResultFields
					title="General"
					fields={processingResult?.fileGeneral || {}}
				/>

				<ResultFields
					title="Codecs"
					fields={processingResult?.metadata as any[] || []}
				/>

				<RecognitionResult
					recognitionType="OCR"
					text={processingResult?.ocrResult || ''}
				/>
			</div>
		</ItemWrapper>
	)
}

export default MediaProcessingItem;
