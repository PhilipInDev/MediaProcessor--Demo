import {
	createContext,
	FC,
	PropsWithChildren,
	useContext, useEffect,
	useState
} from 'react';
import {
	MediaProcessingContextType,
	ProcessingResult
} from './media-processing.type';
import { useSocketEvent } from '../../hooks';
import { useMediaProcessingPage } from '../';

const MediaProcessingContext = createContext<MediaProcessingContextType>({} as MediaProcessingContextType)
const useMediaProcessing = () => useContext(MediaProcessingContext);

type PropsType = {
	operationKey: string | null;
	itemIdx: number;
}

const MediaProcessingProvider: FC<PropsWithChildren<PropsType>> = ({
	children,
	operationKey,
	itemIdx,
}) => {
	const { addProcessingResult } = useMediaProcessingPage();

	const { message: mediaProcessingResult } = useSocketEvent<ProcessingResult>(operationKey || '');

	const [processing, setProcessing] = useState<boolean>(false);
	const [processingError, setProcessingError] = useState<string | null>(null);
	const [processingSuccess, setProcessingSuccess] = useState<string | null>(null);
	const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);

	useEffect(() => {
		if (mediaProcessingResult && operationKey) {
			setProcessing(false);

			if (mediaProcessingResult.error) {
				const errorMessage = mediaProcessingResult.error.message;

				setProcessingError(errorMessage);
				addProcessingResult({
					success: false,
					error: errorMessage,
					operationKey,
					itemIdx
				});
			} else if (mediaProcessingResult.payload) {
				addProcessingResult({
					success: true,
					operationKey,
					itemIdx,
					performance: mediaProcessingResult.payload.performance,
				});
				setProcessingResult(mediaProcessingResult.payload);
				setProcessing(false);
				setProcessingSuccess('Media file processed successfully')
			}
		}
	}, [mediaProcessingResult]);

	useEffect(() => {
		if (operationKey) {
			setProcessing(true);
			setProcessingError(null);
			setProcessingResult(null);
			setProcessingSuccess(null);
		}
	}, [operationKey]);


	return (
		<MediaProcessingContext.Provider
			value={{
				operationKey,
				processing,
				setProcessing,
				processingError,
				setProcessingError,
				processingSuccess,
				setProcessingSuccess,
				processingResult,
				setProcessingResult,
			}}
		>
			{children}
		</MediaProcessingContext.Provider>
	)
}

export { useMediaProcessing, MediaProcessingProvider };
