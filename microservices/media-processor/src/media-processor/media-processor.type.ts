type MediaProcessorPayload = {
	operationKey?: string;
	file: {
		fileUrl: string;
		langForOCR?: string;
	}
}

export { MediaProcessorPayload }
