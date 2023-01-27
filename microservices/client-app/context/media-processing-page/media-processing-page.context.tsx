import {
	createContext,
	FC,
	PropsWithChildren,
	useContext, useEffect,
	useState
} from 'react';
import { apiURL } from '../../config';
import {
	MediaProcessingPageContextType,
	ProcessingOperationKeys,
	ProcessingResult
} from './media-processing-page.type';

const MediaProcessingPageContext = createContext<MediaProcessingPageContextType>({} as MediaProcessingPageContextType)
const useMediaProcessingPage = () => useContext(MediaProcessingPageContext);

const MediaProcessingPageProvider: FC<PropsWithChildren> = ({ children }) => {
	const [supportedLanguages, setSupportedLanguages] = useState<{ value: string; label: string }[]>([]);
	const [processedFilesCount, setProcessedFilesCount] = useState<number | null>(null);
	const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);
	const [processingOperationKeys, setProcessingOperationKeys] = useState<ProcessingOperationKeys | null>(null);

	const addProcessingResult = (processingResult: ProcessingResult) => {
		setProcessingResults((prevState) => [...prevState, processingResult])
	}

	const resetProcessingResults = () => setProcessingResults([]);

	useEffect(() => {
		const fetchSupportedLanguages = async () => {
			const res = await fetch(`${apiURL}/media/process/supported-ocr-languages`,{
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
				}
			})

			const body = await res.json();

			if (body.data.supportedLanguages) {
				const formattedLanguages = body
					.data
					.supportedLanguages
					.map((lang: string) => ({ value: lang, label: lang.toUpperCase() }))

				setSupportedLanguages(formattedLanguages);
			}
		}

		fetchSupportedLanguages();
	}, []);


	return (
		<MediaProcessingPageContext.Provider
			value={{
				supportedLanguages,
				processedFilesCount,
				setProcessedFilesCount,
				processingInProgress: processedFilesCount ? processingResults.length !== processedFilesCount : false,
				processingResults,
				addProcessingResult,
				resetProcessingResults,
				processingOperationKeys,
				setProcessingOperationKeys,
			}}
		>
			{children}
		</MediaProcessingPageContext.Provider>
	)
}

export { useMediaProcessingPage, MediaProcessingPageProvider };
