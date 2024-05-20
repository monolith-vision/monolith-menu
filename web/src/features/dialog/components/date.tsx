import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import InputWrapper from './wrapper';

export default function DateInput({
	label,
	description,
	placeholder,
	required,
	value,
	defaultValue,
	setValue,
}: DialogDateComponentProps) {
	return (
		<InputWrapper
			label={label}
			description={description}
			required={required}
		>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-full justify-start text-left font-normal pl-3',
							!value && !defaultValue && 'text-muted-foreground',
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value || defaultValue ? (
							format((value || defaultValue) as Date, 'PPP')
						) : (
							<span>{placeholder ?? 'Pick a date'}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={value}
						onSelect={setValue}
					/>
				</PopoverContent>
			</Popover>
		</InputWrapper>
	);
}
