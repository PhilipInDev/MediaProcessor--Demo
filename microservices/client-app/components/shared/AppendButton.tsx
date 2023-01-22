import { ButtonHTMLAttributes, FC } from 'react';
import { VscDiffAdded } from 'react-icons/vsc';

const AppendButton: FC<ButtonHTMLAttributes<any>> = ({...attributes}) => {
	return (
		<button
			type="button"
			className="flex items-center justify-center w-full h-12 p-2 transition-all bg-gray-100 hover:shadow hover:bg-gray-200"
			{...attributes}
		>
			<VscDiffAdded size={25}/>
		</button>
	)
}

export default AppendButton;
