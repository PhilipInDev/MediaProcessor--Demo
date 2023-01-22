import { Dispatch, SetStateAction } from 'react';

type ProcessingResult = { success: boolean; operationKey: string; error?: string; itemIdx: number; };
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
