import { FC, FormHTMLAttributes, PropsWithChildren } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';

type PropsType = PropsWithChildren<FormHTMLAttributes<HTMLFormElement> & { context: UseFormReturn<any> }>;

const FormWrapper: FC<PropsType> = ({ children, context, ...rest }) => {
	return (
		<FormProvider {...context}>
			<form {...rest}>
				{children}
			</form>
		</FormProvider>
	)
}

export default FormWrapper;
