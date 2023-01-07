import {
	SUPPORTED_AUDIO_EXTENSIONS,
	SUPPORTED_IMAGE_EXTENSIONS,
	SUPPORTED_VIDEO_EXTENSIONS
} from '../../config';

const supportedImageTypes = JSON.parse(SUPPORTED_IMAGE_EXTENSIONS) as string[];

const supportedVideoTypes = JSON.parse(SUPPORTED_VIDEO_EXTENSIONS) as string[];

const supportedAudioTypes = JSON.parse(SUPPORTED_AUDIO_EXTENSIONS) as string[];

const supportedMediaTypesConfig = supportedImageTypes
	.concat(supportedVideoTypes, supportedAudioTypes);

export { supportedMediaTypesConfig };
