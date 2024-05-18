import InputWrapper from './wrapper';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function SelectInput({
	label,
	description,
	required,
	placeholder,
	values,
	valid,
	setValue,
	setValidity,
}: DialogTextComponentProps) {
	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
		>
			<Select
				onValueChange={(newValue) => {
					if (!valid) setValidity(true);
					setValue(newValue);
				}}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{values.map((entry) => (
							<SelectItem key={entry.value} value={entry.value}>
								{entry.label ?? entry.value}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</InputWrapper>
	);
}
