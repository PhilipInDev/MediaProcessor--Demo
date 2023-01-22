import { FC } from 'react';
import ItemWrapper from './shared/ItemWrapper';
import Spinner from './shared/Spinner';
import Field from './shared/Field';

type FieldData = { [fieldName in string]: string | number | null };
type PropsType = {
	title: string;
	fields: FieldData | FieldData[];
	loading?: boolean;
}

const ResultFields: FC<PropsType> = ({ title, fields = {}, loading = false }) => {
	const getFieldSet = (objectFrom: FieldData) => Object
		.entries(objectFrom)
		.map(([fieldName, fieldValue], idx) => <Field key={`${idx}-${fieldValue}`} name={fieldName} value={fieldValue} />)

	const Fields = Array.isArray(fields)
		? fields.map((objectFrom, index) => <section key={`${index}-section`}>
			<span>{index + 1}.</span>
			{getFieldSet(objectFrom)}
			</section>
		)
		: getFieldSet(fields)

	return (
		<ItemWrapper>
			<h3 className="font-bold text-xl">{title}</h3>
			{loading
				? <Spinner />
				: Fields
			}
		</ItemWrapper>
	)
}

export default ResultFields;
