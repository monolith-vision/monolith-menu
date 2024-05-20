import { Input } from '@/components/ui/input';
import InputWrapper from './wrapper';

export default function TextInput({
	label,
	description,
	placeholder,
	required,
	defaultValue,
	min,
	max,
	setValue,
	setValidity,
}: DialogTextComponentProps) {
	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
		>
			<Input
				minLength={min}
				maxLength={max}
				type="text"
				placeholder={placeholder}
				defaultValue={defaultValue}
				onChange={({
					currentTarget: {
						value,
						validity: { valid },
					},
				}) => {
					setValue(value);
					setValidity(valid);
				}}
			/>
		</InputWrapper>
	);
}
