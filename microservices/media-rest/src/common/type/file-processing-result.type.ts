import { Metadata } from './file-metadata.type';

type FileProcessingResult = {
	operationKey: string;
	general: {
		name: string | null;
		typeReadable: string;
		extension: string;
		sizeBytes: number;
		hash: string;
	}
	metadata: Metadata[];
	ocrResult: string | null;
	audioRecognitionResult: string | null;
	performance: {
		fileSpecificProcessingMs: string;
		metadataRetrievingMs: string;
		uploadingFileMs: string;
	}
}

export { FileProcessingResult };
