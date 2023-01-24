import { FC } from 'react';

type PropsType = {
	contentType: string | null;
	contentUrl: string;
}

const MediaPreview: FC<PropsType> = ({ contentType, contentUrl }) => {

	if (!contentType) {
		return <p>File is not provided</p>
	}

	if (contentType.includes('image')) {
		return <img src={contentUrl} className="max-w-full max-h-full" alt="image from file url input"/>
	}
	if (contentType.includes('video')) {
		return (
			<video src={contentUrl} controls>
				<track kind="captions" />
			</video>
		)
	}
	if (contentType.includes('audio')) {
		return (
			<video src={contentUrl} controls>
				<track kind="captions" />
			</video>
		)
	}

	return <p>Preview is not enabled for this {contentType} file format </p>;
}

export default MediaPreview;
