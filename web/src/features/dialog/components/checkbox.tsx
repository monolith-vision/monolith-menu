import { Checkbox } from '@/components/ui/checkbox';
import InputWrapper from './wrapper';

export default function CheckboxInput({
	id,
	label,
	description,
	defaultValue,
	value,
	required,
	setValue,
}: DialogCheckboxComponentProps) {
	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
			className="flex-row-reverse items-center justify-end"
		>
			<Checkbox
				id={id}
				checked={(value || defaultValue) === true}
				defaultChecked={defaultValue}
				className="w-[20px] h-[20px] transition-colors mr-2"
				onCheckedChange={setValue}
			/>
		</InputWrapper>
	);
}
