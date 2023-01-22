import { FC, FormHTMLAttributes, PropsWithChildren } from 'react';
import { FieldValues, UseFormReturn, FormProvider } from 'react-hook-form';

const FormWrapper: FC<PropsWithChildren<FormHTMLAttributes<HTMLFormElement> & { context: UseFormReturn<FieldValues, any> }>> = ({ children, context, ...rest }) => {
	return (
		<FormProvider {...context}>
			<form {...rest}>
				{children}
			</form>
		</FormProvider>
	)
}

export default FormWrapper;
