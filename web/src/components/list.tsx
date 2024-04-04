import { cn } from '@/lib/utils';
import { CardDescription } from './ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function List({
	label,
	description,
	selected,
	values,
	value,
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
			<div className="flex items-center gap-3">
				<ChevronLeft strokeOpacity={0.5} />
				<h1>{values?.[value ?? 0] ?? ''}</h1>
				<ChevronRight strokeOpacity={0.5} />
			</div>
		</div>
	);
}
