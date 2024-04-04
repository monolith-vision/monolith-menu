import { cn } from '@/lib/utils';
import { CardDescription } from './ui/card';
import { Checkbox } from './ui/checkbox';

export default function MenuCheckbox({
	id,
	label,
	description,
	selected,
	checked,
}: MenuComponentProps) {
	return (
		<div
			className={cn(
				'p-2 rounded-md transition-colors flex items-center justify-between',
				{
					'bg-white bg-opacity-10': selected,
				},
			)}
		>
			<div>
				<h1>{label}</h1>
				<CardDescription>{description}</CardDescription>
			</div>
			<Checkbox
				id={id}
				checked={checked}
				className="w-[20px] h-[20px] transition-colors mr-2"
			/>
		</div>
	);
}
