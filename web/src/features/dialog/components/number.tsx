import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import InputWrapper from './wrapper';

export default function NumberInput({
	label,
	description,
	placeholder,
	required,
	defaultValue,
	value,
	valid,
	min,
	max,
	setValue,
	setValidity,
}: DialogNumberComponentProps) {
	const setNumber = (newValue: string | number) => {
		const number = Number(newValue);

		if (min && number < min) return setValue(min);
		if (max && number > max) return setValue(max);

		setValue(number);
		if (!valid) setValidity(true);
	};

	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
		>
			<div className="flex items-center">
				<Input
					className="rounded-r-none"
					type="number"
					min={min}
					max={max}
					placeholder={placeholder}
					value={value ?? defaultValue}
					onChange={({ currentTarget: { value } }) =>
						setNumber(value)
					}
				/>
				<div className="flex flex-col h-10 w-9 rounded-r-md border border-input border-l-0 text-sm">
					<Button
						size="icon"
						variant="ghost"
						className="w-full max-h-[50%] rounded-none rounded-tr-sm active:bg-foreground/25 border-b"
						onClick={() => setNumber((value ?? 0) + 1)}
					>
						<ChevronUp size={15} />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="w-full max-h-[50%] rounded-none rounded-br-sm active:bg-foreground/25"
						onClick={() => setNumber((value ?? 0) - 1)}
					>
						<ChevronDown size={15} />
					</Button>
				</div>
			</div>
		</InputWrapper>
	);
}
