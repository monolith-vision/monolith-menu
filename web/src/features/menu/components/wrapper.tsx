import { CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ComponentWrapper({
	label,
	selected,
	description,
	children,
	className,
	...props
}: {
	label: string;
	selected?: boolean;
	description?: string;
	children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'p-2 rounded-md transition-colors flex items-center justify-between',
				className,
				{ 'bg-white bg-opacity-10': selected },
			)}
			{...props}
		>
			<div>
				<h1>{label}</h1>
				<CardDescription>{description}</CardDescription>
			</div>
			{children}
		</div>
	);
}
