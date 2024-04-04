import { cn } from '@/lib/utils';
import { CardDescription } from './ui/card';
import { ChevronRight } from 'lucide-react';

export default function Button({
	type,
	label,
	description,
	selected,
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
			{type === 'submenu' && <ChevronRight stroke="#fff" />}
		</div>
	);
}
