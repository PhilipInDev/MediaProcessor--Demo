import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';
import { SUPPORTED_OCR_LANGUAGES } from '../../config';

@Injectable()
class OCRService {
	constructor() {}

	public readonly supportedLanguages: string[] = JSON.parse(SUPPORTED_OCR_LANGUAGES);

	public async recognizeTextFromImage (pathToFile: string, lang: string = 'ukr') {
		const worker = await createWorker();

		await worker.loadLanguage(lang);
		await worker.initialize(lang);

		const { data: { text } } = await worker.recognize(pathToFile);

		console.log('OCR text >>>', text);

		await worker.terminate();

		return text;
	}
}

export { OCRService };
