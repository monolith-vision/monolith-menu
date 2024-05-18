import { cn } from '@/lib/utils';

export default function Placeholder({ label }: MenuComponent) {
	return (
		<div>
			<h1
				className={cn(
					'p-2 rounded-md text-xl font-semibold text-center',
					{
						'bg-white bg-opacity-5': false,
					},
				)}
			>
				{label}
			</h1>
		</div>
	);
}
