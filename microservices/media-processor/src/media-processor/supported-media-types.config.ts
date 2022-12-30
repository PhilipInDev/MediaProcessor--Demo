const supportedImageTypes = [
	'image/gif',
	'image/jpeg',
	'image/png',
	'image/webp',
]

const supportedVideoTypes = [
	'video/mpeg',
	'video/mp4',
	'video/webm',
]

const supportedAudioTypes = [
	'audio/mpeg',
	'audio/mp4',
	'audio/webm',
]

const supportedMediaTypesConfig = supportedImageTypes
	.concat(supportedVideoTypes, supportedAudioTypes);

export { supportedMediaTypesConfig };
