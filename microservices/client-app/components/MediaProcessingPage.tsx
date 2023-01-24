import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useState } from 'react';
import PageWrapper from './shared/PageWrapper';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import FormWrapper from './shared/FormWrapper';
import AppendButton from './shared/AppendButton';
import MediaProcessingItem from './MediaProcessingItem';
import {
	useMediaProcessingPage,
	MediaProcessingPageProvider,
	MediaProcessingProvider
} from '../context';
import { apiURL } from '../config';
import ContainerWrapper from './shared/ContainerWrapper';
import MediaProcessingState from './MediaProcessingState';

const mediaFormSchema = Joi.object({
	files: Joi.array().items(Joi.object({
		fileUrl: Joi.string().uri().required().messages({ 'string.uri': 'Must be a valid URL', 'string.empty': 'Field is required' }),
		langForOCR: Joi.string().required().messages({ 'string.empty': 'Field is required' }),
		id: Joi.string().required(),
	}))
})

const MediaProcessingPage = () => {
	const {
		setProcessedFilesCount,
		processingOperationKeys,
		setProcessingOperationKeys,
		resetProcessingResults,
	} = useMediaProcessingPage();

	const [submissionError, setSubmissionError] = useState<string | null>(null);

	const form = useForm({ resolver: joiResolver(mediaFormSchema) });
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'files' });

	const appendButtonOnClick = () => append({ fileUrl: null, langForOCR: '' }, { shouldFocus: true,  });

	const getOperationKeyById = (id: string) => {
		if (processingOperationKeys) {
			const item = processingOperationKeys.find(({ id: fileId }) => fileId === id);
			return item?.operationKey || null;
		}

		return null;
	}

	const formOnSubmit = async (data: FieldValues) => {
		resetProcessingResults();
		setSubmissionError(null);

		const res = await fetch(`${apiURL}/media/process`,{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})

		const body = await res.json();

		if (body.statusCode !== 202) {
			setSubmissionError(body.message);
		} else if (body && Array.isArray(body?.data)) {
			setProcessingOperationKeys(body.data);
			setProcessedFilesCount(body.data.length);
		}
	};

	return (
		<PageWrapper classes="flex">
			<ContainerWrapper>
				<FormWrapper
					context={form}
					onSubmit={form.handleSubmit(formOnSubmit)}
					className="flex flex-col gap-4 h-full w-full"
				>
					{fields.map(({ id }, idx) => {
						const operationKey = getOperationKeyById(id);

						return (
							<MediaProcessingProvider
								operationKey={operationKey}
								key={id}
								itemIdx={idx}
							>
								<MediaProcessingItem
									namePrefix={`files.${idx}`}
									removeItem={() => remove(idx)}
									id={id}
								/>
							</MediaProcessingProvider>
						)
					})}
					<div className="sticky bottom-12">
						<AppendButton onClick={appendButtonOnClick}/>
					</div>

					<div className="sticky bottom-0 mt-auto">
						{submissionError && <span className="text-red-800 italic">{submissionError}</span>}
						<button
							type="submit"
							className="w-full border text-center p-3 bg-white hover:shadow transition"
						>
							SUBMIT
						</button>
					</div>
				</FormWrapper>
			</ContainerWrapper>

			<MediaProcessingState />

		</PageWrapper>
	)
}

const MediaProcessingPageContainer = () => (
	<MediaProcessingPageProvider>
		<MediaProcessingPage />
	</MediaProcessingPageProvider>
);

export default MediaProcessingPageContainer;
