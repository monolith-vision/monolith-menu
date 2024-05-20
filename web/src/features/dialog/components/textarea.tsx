import { Textarea } from '@/components/ui/textarea';
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
}: DialogTextareaComponentProps) {
	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
		>
			<Textarea
				className="min-h-10 h-10"
				minLength={min}
				maxLength={max}
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
