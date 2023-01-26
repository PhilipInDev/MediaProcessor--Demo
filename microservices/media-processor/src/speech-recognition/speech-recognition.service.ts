import { Injectable } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { readFile } from 'fs/promises';
import {
	GCP_SPEECH_TO_TEXT_CREDENTIALS,
	SUPPORTED_SPEECH_RECOGNITION_LANGUAGES
} from '../../config';

@Injectable()
class SpeechRecognitionService {
	client: SpeechClient;

	constructor() {
		this.client = new SpeechClient({
			credentials: JSON.parse(GCP_SPEECH_TO_TEXT_CREDENTIALS),
		});
	}

	public readonly supportedLanguages: string[] = JSON.parse(SUPPORTED_SPEECH_RECOGNITION_LANGUAGES);

	public async recognize (pathToFile: string, lang: string = 'en-US') {
		const file = await readFile(pathToFile);

		const audio = {
			content: new Uint8Array(file.buffer),
		}

		const config = {
			encoding: 'LINEAR16' as 'LINEAR16',
			sampleRateHertz: 16000,
			languageCode: lang,
		};
		const request = {
			audio: audio,
			config: config,
		};

		const [response] = await this.client.recognize(request);
		const transcription = response.results
			.map(result => result.alternatives[0].transcript)
			.join('\n');
		console.log(`Transcription: ${transcription}`);

		return transcription;
	}
}

export { SpeechRecognitionService };
