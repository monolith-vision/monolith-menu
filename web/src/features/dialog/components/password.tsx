import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputWrapper from './wrapper';

export default function PasswordInput({
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
	const [visible, toggleVisiblity] = useState(false);

	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
		>
			<div className="flex items-center">
				<Input
					className="rounded-r-none"
					minLength={min}
					maxLength={max}
					type={visible ? 'text' : 'password'}
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
				<div className="flex flex-col h-10 w-9 rounded-r-md border border-input border-l-0 text-sm">
					<Button
						size="icon"
						variant="ghost"
						className="w-full max-h-full rounded-none rounded-r-sm active:bg-foreground/25"
						onClick={() => toggleVisiblity((b) => !b)}
					>
						{visible ? (
							<Eye color="#fff" className="w-4 h-4" />
						) : (
							<EyeOff color="#fff" className="w-4 h-4" />
						)}
					</Button>
				</div>
			</div>
		</InputWrapper>
	);
}
