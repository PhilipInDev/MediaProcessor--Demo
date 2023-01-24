import { FC } from 'react';
import ItemWrapper from './shared/ItemWrapper';
import Spinner from './shared/Spinner';

type PropsType = {
	recognitionType: 'OCR' | 'Audio Recognition';
	text: string | null;
	loading?: boolean;
};

const RecognitionResult: FC<PropsType> = ({ recognitionType, text, loading = false }) => {
	return (
		<ItemWrapper>
			<h3 className="font-bold text-xl">{recognitionType}</h3>
			{loading
				? <Spinner />
				: <p className="italic whitespace-pre-wrap">{text || '-'}</p>
			}
		</ItemWrapper>
	)
}

export default RecognitionResult;
