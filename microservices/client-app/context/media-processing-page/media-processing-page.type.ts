import { Dispatch, SetStateAction } from 'react';

type SuccessfulProcessingResult = {
	success: true;
	operationKey: string;
	itemIdx: number;
	performance: {
		fileSpecificProcessingMs: string;
		metadataRetrievingMs: string;
		uploadingFileMs: string;
	}
};

type UnsucessfulProcessingResult = {
	success: false;
	operationKey: string;
	error: string;
	itemIdx: number;
}

type ProcessingResult = SuccessfulProcessingResult | UnsucessfulProcessingResult;
type ProcessingOperationKeys = { fileUrl: string; operationKey: string, id: string; }[];

type MediaProcessingPageContextType = {
	supportedLanguages: { value: string; label: string }[];
	setProcessedFilesCount: Dispatch<SetStateAction<number | null>>;
	addProcessingResult: (processingResult: ProcessingResult) => void;
	processedFilesCount: number | null;
	processingResults: ProcessingResult[];
	resetProcessingResults: () => void;
	processingOperationKeys: ProcessingOperationKeys | null;
	setProcessingOperationKeys: Dispatch<SetStateAction<ProcessingOperationKeys | null>>;
}

export type { MediaProcessingPageContextType, ProcessingResult, ProcessingOperationKeys };
